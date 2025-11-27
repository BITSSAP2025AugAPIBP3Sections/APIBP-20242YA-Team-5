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
  Tooltip,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  MoreVert,
  ArrowBack,
  VerifiedUser,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CertificateService } from '../services/certificateService';
import { VerificationService, VerificationResult } from '../services/verificationService';
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
  const [editDialog, setEditDialog] = useState(false);
  const [revokeDialog, setRevokeDialog] = useState(false);
  const [verifyDialog, setVerifyDialog] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  
  // Menu state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  
  // Edit form state
  const [editForm, setEditForm] = useState<CertificateUpdateRequest>({});
  
  // Revoke form state
  const [revokeReason, setRevokeReason] = useState('');

  // Verification state
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [verifying, setVerifying] = useState(false);

  // Helper function to format timestamp from backend
  const formatVerificationTimestamp = (timestamp: string | number[]): string => {
    try {
      // Handle array format [year, month, day, hour, minute, second, nano]
      if (Array.isArray(timestamp)) {
        const [year, month, day, hour, minute, second] = timestamp;
        const date = new Date(year, month - 1, day, hour, minute, second);
        return date.toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      }
      // Handle ISO string format
      return new Date(timestamp).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (e) {
      return new Date().toLocaleString();
    }
  };

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
    // Don't clear selectedCertificate immediately - dialogs might need it
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

  const handleUpdateCertificate = async () => {
    if (!selectedCertificate) return;
    
    try {
      await CertificateService.updateCertificate(selectedCertificate.certificateId, editForm);
      setSuccess('Certificate updated successfully');
      setEditDialog(false);
      setEditForm({});
      setSelectedCertificate(null);
      fetchCertificates();
    } catch (err: any) {
      setError(err.message || 'Failed to update certificate');
    }
  };

  const handleRevoke = async () => {
    console.log('handleRevoke called');
    console.log('selectedCertificate:', selectedCertificate);
    console.log('revokeReason:', revokeReason);
    
    if (!selectedCertificate) {
      setError('No certificate selected');
      return;
    }
    
    if (!revokeReason.trim()) {
      setError('Please provide a reason for revocation');
      return;
    }
    
    if (revokeReason.trim().length < 10) {
      setError('Revocation reason must be at least 10 characters long');
      return;
    }
    
    try {
      const request: CertificateRevocationRequest = {
        certificateNumber: selectedCertificate.certificateNumber,
        reason: revokeReason.trim(),
      };
      
      console.log('Sending revocation request:', request);
      
      const result = await CertificateService.revokeCertificate(request);
      
      console.log('Revocation successful:', result);
      
      setSuccess('Certificate revoked successfully');
      setRevokeDialog(false);
      setRevokeReason('');
      setSelectedCertificate(null);
      await fetchCertificates();
    } catch (err: any) {
      console.error('Error revoking certificate:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || err.response?.data || err.message || 'Failed to revoke certificate';
      setError(errorMessage);
    }
  };

  const handleVerifyCertificate = async (certificate?: Certificate) => {
    // Use passed certificate or selectedCertificate
    const certToVerify = certificate || selectedCertificate;
    if (!certToVerify) return;
    
    // Set selected certificate for dialog display
    if (certificate) {
      setSelectedCertificate(certificate);
    }
    
    try {
      setVerifying(true);
      const result = await VerificationService.verifyCertificate(certToVerify.certificateNumber);
      setVerificationResult(result);
      setVerifyDialog(true);
    } catch (err: any) {
      setError(err.message || 'Failed to verify certificate');
    } finally {
      setVerifying(false);
    }
    // Close menu if it's open
    if (anchorEl) {
      handleMenuClose();
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
          <MenuItem value="REVOKED">Revoked</MenuItem>
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
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', alignItems: 'center' }}>
                          <Tooltip title="Verify certificate authenticity" arrow>
                            <Button
                              variant="contained"
                              size="small"
                              color="primary"
                              startIcon={<VerifiedUser />}
                              onClick={() => handleVerifyCertificate(certificate)}
                              sx={{ 
                                minWidth: 100,
                                textTransform: 'none',
                                fontWeight: 600
                              }}
                            >
                              Verify
                            </Button>
                          </Tooltip>
                          <Tooltip title="More actions" arrow>
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, certificate)}
                              size="small"
                            >
                              <MoreVert />
                            </IconButton>
                          </Tooltip>
                        </Box>
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
        <MenuItem onClick={handleEditCertificate}>
          <Edit sx={{ mr: 1 }} fontSize="small" />
          Edit
        </MenuItem>
        {selectedCertificate?.status === 'ACTIVE' && (
          <MenuItem onClick={handleRevokeCertificate}>
            <Delete sx={{ mr: 1 }} fontSize="small" />
            Revoke
          </MenuItem>
        )}
      </Menu>

      {/* Edit Certificate Dialog */}
      <Dialog open={editDialog} onClose={() => {
        setEditDialog(false);
        setEditForm({});
        setSelectedCertificate(null);
      }} maxWidth="md" fullWidth>
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
      <Dialog open={revokeDialog} onClose={() => {
        setRevokeDialog(false);
        setRevokeReason('');
        setSelectedCertificate(null);
      }} maxWidth="sm" fullWidth>
        <DialogTitle>Revoke Certificate</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to revoke this certificate? This action cannot be undone.
          </Typography>
          {selectedCertificate && (
            <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Certificate:</strong> {selectedCertificate.certificateNumber}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Student:</strong> {selectedCertificate.studentName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Course:</strong> {selectedCertificate.courseName}
              </Typography>
            </Box>
          )}
          <TextField
            fullWidth
            label="Reason for Revocation"
            value={revokeReason}
            onChange={(e) => setRevokeReason(e.target.value)}
            multiline
            rows={3}
            sx={{ mt: 2 }}
            required
            helperText={`${revokeReason.length}/10 characters minimum`}
            error={revokeReason.length > 0 && revokeReason.length < 10}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setRevokeDialog(false);
            setRevokeReason('');
          }}>
            Cancel
          </Button>
          <Button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRevoke();
            }}
            color="error" 
            variant="contained"
            disabled={revokeReason.trim().length < 10}
          >
            Revoke
          </Button>
        </DialogActions>
      </Dialog>

      {/* Verification Result Dialog */}
      <Dialog open={verifyDialog} onClose={() => {
        setVerifyDialog(false);
        setVerificationResult(null);
        setSelectedCertificate(null);
      }} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {verificationResult?.valid ? (
              <>
                <CheckCircle color="success" />
                <Typography variant="h6">Certificate Verified</Typography>
              </>
            ) : (
              <>
                <Cancel color="error" />
                <Typography variant="h6">Verification Failed</Typography>
              </>
            )}
          </Box>
        </DialogTitle>
        <DialogContent>
          {verifying ? (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography>Verifying certificate...</Typography>
            </Box>
          ) : verificationResult ? (
            <Box sx={{ py: 2 }}>
              <Alert severity={verificationResult.valid ? 'success' : 'error'} sx={{ mb: 2 }}>
                {verificationResult.reason}
              </Alert>
              
              {verificationResult.certificate && (
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Certificate Number
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {verificationResult.certificate.certificateNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Student Name
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {verificationResult.certificate.studentName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Course
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {verificationResult.certificate.courseName}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Grade
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {verificationResult.certificate.grade}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip
                      label={verificationResult.certificate.status}
                      color={verificationResult.valid ? 'success' : 'error'}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      Verification Time
                    </Typography>
                    <Typography variant="body1">
                      {verificationResult.timestamp 
                        ? formatVerificationTimestamp(verificationResult.timestamp)
                        : new Date().toLocaleString()}
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Box>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setVerifyDialog(false)}>Close</Button>
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