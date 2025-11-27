import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Snackbar,
  InputAdornment,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Download,
  Edit,
  Delete,
  Visibility,
  MoreVert,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CertificateService } from '../services/certificateService';
import { Certificate, CertificateUpdateRequest, CertificateRevocationRequest } from '../types';

const CertificateManagement: React.FC = () => {
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Dialog states
  const [viewDialog, setViewDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [revokeDialog, setRevokeDialog] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState<CertificateUpdateRequest>({});
  
  // Revoke form state
  const [revokeReason, setRevokeReason] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setLoading(true);
      
      // Get current university's UID
      const storedUser = localStorage.getItem('university_user');
      if (!storedUser) {
        setError('Authentication error. Please log out and log in again.');
        setLoading(false);
        return;
      }
      
      const currentUser = JSON.parse(storedUser);
      const currentUniversityUid = currentUser.uid;
      
      if (!currentUniversityUid) {
        setError('University UID not found. Please contact support.');
        setLoading(false);
        return;
      }
      
      const allCertificates = await CertificateService.getCertificates();
      
      // Filter certificates issued by this university
      const filteredCertificates = allCertificates.filter(
        (cert: Certificate) => cert.universityId === currentUniversityUid
      );
      
      setCertificates(filteredCertificates);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch certificates');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, certificate: Certificate) => {
    setAnchorEl(event.currentTarget);
    setSelectedCertificate(certificate);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCertificate(null);
  };

  const handleViewCertificate = () => {
    setViewDialog(true);
    handleMenuClose();
  };

  const handleEditCertificate = () => {
    if (selectedCertificate) {
      setEditForm({
        studentName: selectedCertificate.studentName,
        courseName: selectedCertificate.courseName,
        specialization: selectedCertificate.specialization,
        grade: selectedCertificate.grade,
        cgpa: selectedCertificate.cgpa,
        issueDate: selectedCertificate.issueDate,
        completionDate: selectedCertificate.completionDate,
      });
    }
    setEditDialog(true);
    handleMenuClose();
  };

  const handleRevokeCertificate = () => {
    setRevokeDialog(true);
    handleMenuClose();
  };

  const handleDownloadPdf = async (certificateId: string) => {
    try {
      const blob = await CertificateService.downloadCertificatePdf(certificateId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      setSuccess('Certificate PDF downloaded successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to download certificate PDF');
    }
    handleMenuClose();
  };

  const handleUpdateCertificate = async () => {
    if (!selectedCertificate) return;
    
    try {
      await CertificateService.updateCertificate(selectedCertificate.certificateId, editForm);
      setSuccess('Certificate updated successfully');
      setEditDialog(false);
      setEditForm({});
      fetchCertificates();
    } catch (err: any) {
      setError(err.message || 'Failed to update certificate');
    }
  };

  const handleRevoke = async () => {
    if (!selectedCertificate || !revokeReason.trim()) return;
    
    try {
      const request: CertificateRevocationRequest = {
        certificateId: selectedCertificate.certificateId,
        reason: revokeReason.trim(),
      };
      await CertificateService.revokeCertificate(request);
      setSuccess('Certificate revoked successfully');
      setRevokeDialog(false);
      setRevokeReason('');
      fetchCertificates();
    } catch (err: any) {
      setError(err.message || 'Failed to revoke certificate');
    }
  };

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || cert.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'success';
      case 'REVOKED': return 'error';
      case 'PENDING': return 'warning';
      case 'EXPIRED': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/dashboard')} color="primary">
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Certificate Management
        </Typography>
      </Box>

      {/* Header Actions */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/issue-certificate')}
        >
          Issue New Certificate
        </Button>
        
        <TextField
          placeholder="Search certificates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <TextField
          select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ minWidth: 120 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FilterList />
              </InputAdornment>
            ),
          }}
        >
          <MenuItem value="ALL">All Status</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="REVOKED">Revoked</MenuItem>
          <MenuItem value="EXPIRED">Expired</MenuItem>
        </TextField>
      </Box>

      {/* Certificates Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography>Loading certificates...</Typography>
            </Box>
          ) : filteredCertificates.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {searchTerm || statusFilter !== 'ALL' 
                  ? 'No certificates match your filters' 
                  : 'No certificates found'}
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Certificate #</TableCell>
                    <TableCell>Student</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Issue Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCertificates.map((certificate) => (
                    <TableRow key={certificate.certificateId} hover>
                      <TableCell sx={{ fontWeight: 500 }}>
                        {certificate.certificateNumber}
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {certificate.studentName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {certificate.studentId}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {certificate.courseName}
                          </Typography>
                          {certificate.specialization && (
                            <Typography variant="caption" color="text.secondary">
                              {certificate.specialization}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {certificate.grade}
                          </Typography>
                          {certificate.cgpa && (
                            <Typography variant="caption" color="text.secondary">
                              CGPA: {certificate.cgpa}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        {new Date(certificate.issueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={certificate.status}
                          color={getStatusColor(certificate.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, certificate)}
                          size="small"
                        >
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleViewCertificate}>
          <Visibility sx={{ mr: 1 }} fontSize="small" />
          View Details
        </MenuItem>
        <MenuItem onClick={handleEditCertificate}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedCertificate && handleDownloadPdf(selectedCertificate.certificateId)}>
          <Download sx={{ mr: 1 }} fontSize="small" />
          Download PDF
        </MenuItem>
        {selectedCertificate?.status === 'ACTIVE' && (
          <MenuItem onClick={handleRevokeCertificate}>
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Revoke
          </MenuItem>
        )}
      </Menu>

      {/* View Certificate Dialog */}
      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Certificate Details</DialogTitle>
        <DialogContent>
          {selectedCertificate && (
            <Grid container spacing={2} sx={{ pt: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Certificate Number</Typography>
                <Typography variant="body1">{selectedCertificate.certificateNumber}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Student Name</Typography>
                <Typography variant="body1">{selectedCertificate.studentName}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Student ID</Typography>
                <Typography variant="body1">{selectedCertificate.studentId}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Course</Typography>
                <Typography variant="body1">{selectedCertificate.courseName}</Typography>
              </Grid>
              {selectedCertificate.specialization && (
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Specialization</Typography>
                  <Typography variant="body1">{selectedCertificate.specialization}</Typography>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Grade</Typography>
                <Typography variant="body1">{selectedCertificate.grade}</Typography>
              </Grid>
              {selectedCertificate.cgpa && (
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">CGPA</Typography>
                  <Typography variant="body1">{selectedCertificate.cgpa}</Typography>
                </Grid>
              )}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Issue Date</Typography>
                <Typography variant="body1">
                  {new Date(selectedCertificate.issueDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2">Completion Date</Typography>
                <Typography variant="body1">
                  {new Date(selectedCertificate.completionDate).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Status</Typography>
                <Chip
                  label={selectedCertificate.status}
                  color={getStatusColor(selectedCertificate.status) as any}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Certificate Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Certificate</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 2 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Student Name"
                value={editForm.studentName || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, studentName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Course Name"
                value={editForm.courseName || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, courseName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Specialization"
                value={editForm.specialization || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, specialization: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Grade"
                value={editForm.grade || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, grade: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="CGPA"
                type="number"
                value={editForm.cgpa || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, cgpa: e.target.value ? parseFloat(e.target.value) : undefined }))}
                inputProps={{ min: 0, max: 10, step: 0.01 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdateCertificate} variant="contained">
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Revoke Certificate Dialog */}
      <Dialog open={revokeDialog} onClose={() => setRevokeDialog(false)}>
        <DialogTitle>Revoke Certificate</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to revoke this certificate? This action cannot be undone.
          </Typography>
          <TextField
            fullWidth
            label="Reason for Revocation"
            value={revokeReason}
            onChange={(e) => setRevokeReason(e.target.value)}
            multiline
            rows={3}
            sx={{ mt: 2 }}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRevokeDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleRevoke} 
            color="error" 
            variant="contained"
            disabled={!revokeReason.trim()}
          >
            Revoke
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CertificateManagement;