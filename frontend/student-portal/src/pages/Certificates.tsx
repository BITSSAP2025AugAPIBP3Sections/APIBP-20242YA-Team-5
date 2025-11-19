import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Chip,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  IconButton,
} from '@mui/material';
import { 
  Download, 
  Visibility, 
  Share, 
  SchoolOutlined, 
  WorkspacePremiumOutlined,
  CalendarTodayOutlined,
  VerifiedOutlined,
  Refresh
} from '@mui/icons-material';
import { useCertificates } from '../hooks/useCertificates';

const Certificates: React.FC = () => {
  const { certificates, loading, error, fetchCertificates, downloadCertificate, refreshCertificates } = useCertificates();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleStatusFilterChange = (event: any) => {
    const status = event.target.value;
    setStatusFilter(status);
    fetchCertificates(status || undefined);
  };

  const handleDownload = async (certificateId: string) => {
    try {
      await downloadCertificate(certificateId);
      setSnackbarMessage('Certificate downloaded successfully!');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Failed to download certificate. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleShare = (certificate: any) => {
    const shareUrl = `${window.location.origin}/verify/${certificate.verificationCode}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setSnackbarMessage('Verification link copied to clipboard!');
      setSnackbarOpen(true);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'success';
      case 'REVOKED':
        return 'error';
      case 'PENDING':
        return 'warning';
      case 'EXPIRED':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontFamily: '"Playfair Display", Georgia, serif',
              fontWeight: 600,
              color: '#1c1917',
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            My Certificates
          </Typography>
          <IconButton 
            onClick={refreshCertificates}
            disabled={loading}
            sx={{ color: '#059669' }}
          >
            <Refresh />
          </IconButton>
        </Box>
        
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 4,
            color: '#6b7280',
            fontWeight: 400,
          }}
        >
          View, download, and share your verified academic credentials
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Filter by Status</InputLabel>
            <Select
              value={statusFilter}
              label="Filter by Status"
              onChange={handleStatusFilterChange}
            >
              <MenuItem value="">All Certificates</MenuItem>
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="REVOKED">Revoked</MenuItem>
              <MenuItem value="EXPIRED">Expired</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={refreshCertificates}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {!loading && !error && certificates.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 8 }}>
          <CardContent>
            <SchoolOutlined sx={{ fontSize: 64, color: '#9ca3af', mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 2, color: '#6b7280' }}>
              No Certificates Found
            </Typography>
            <Typography variant="body1" sx={{ color: '#9ca3af' }}>
              {statusFilter ? `No certificates found with status "${statusFilter}".` : 'You don\'t have any certificates yet.'}
            </Typography>
          </CardContent>
        </Card>
      )}

      {!loading && !error && certificates.length > 0 && (
        <Grid container spacing={3}>
          {certificates.map((certificate) => (
            <Grid item xs={12} md={6} lg={4} key={certificate.certificateId}>
              <Card 
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: '#e0f2fe',
                        color: '#0369a1',
                        width: 48,
                        height: 48,
                      }}
                    >
                      <WorkspacePremiumOutlined />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          lineHeight: 1.3,
                          mb: 1,
                          color: '#1c1917',
                        }}
                      >
                        {certificate.courseName}
                      </Typography>
                      <Chip 
                        size="small"
                        label={certificate.status}
                        color={getStatusColor(certificate.status) as any}
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ space: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <SchoolOutlined sx={{ color: '#6b7280', fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Student: {certificate.studentName}
                      </Typography>
                    </Box>
                    
                    {certificate.specialization && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <VerifiedOutlined sx={{ color: '#6b7280', fontSize: 18 }} />
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          Specialization: {certificate.specialization}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <CalendarTodayOutlined sx={{ color: '#6b7280', fontSize: 18 }} />
                      <Typography variant="body2" sx={{ color: '#6b7280' }}>
                        Issued: {formatDate(certificate.issueDate)}
                      </Typography>
                    </Box>
                    
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#059669',
                        mt: 2,
                      }}
                    >
                      Grade: {certificate.grade}
                      {certificate.cgpa && ` (CGPA: ${certificate.cgpa})`}
                    </Typography>
                  </Box>
                </CardContent>

                <Divider />

                <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    startIcon={<Visibility />}
                    sx={{ color: '#6366f1' }}
                  >
                    View Details
                  </Button>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      startIcon={<Download />}
                      onClick={() => handleDownload(certificate.certificateId)}
                      sx={{ color: '#059669' }}
                      disabled={certificate.status !== 'ACTIVE'}
                    >
                      Download
                    </Button>
                    <Button
                      size="small"
                      startIcon={<Share />}
                      onClick={() => handleShare(certificate)}
                      sx={{ color: '#dc2626' }}
                      disabled={certificate.status !== 'ACTIVE'}
                    >
                      Share
                    </Button>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default Certificates;