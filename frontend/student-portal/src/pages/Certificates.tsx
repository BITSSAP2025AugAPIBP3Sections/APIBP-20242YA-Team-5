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
  SchoolOutlined, 
  WorkspacePremiumOutlined,
  VerifiedOutlined,
  Refresh,
  Cancel
} from '@mui/icons-material';
import { useCertificates } from '../hooks/useCertificates';

const Certificates: React.FC = () => {
  const { certificates, loading, error, fetchCertificates, downloadCertificate, refreshCertificates } = useCertificates();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Ensure certificates is always an array to prevent runtime errors
  const safeCertificates = Array.isArray(certificates) ? certificates : [];

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
      setSnackbarMessage('Failed to download the certificate. Please try again.');
      setSnackbarOpen(true);
    }
  };

  const handleView = (certificate: any) => {
    // TODO: Open modal or navigate to detailed certificate view
    setSnackbarMessage(`Viewing certificate: ${certificate.certificateNumber}`);
    setSnackbarOpen(true);
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

      {!loading && !error && safeCertificates.length === 0 && (
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

      {!loading && !error && safeCertificates.length > 0 && (
        <Grid container spacing={3}>
          {safeCertificates.map((certificate) => (
            <Grid item xs={12} key={certificate.certificateId}>
              <Card 
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  position: 'relative',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
                  border: '8px solid',
                  borderImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%) 1',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease-in-out',
                  minHeight: '300px',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    right: '20px',
                    bottom: '20px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '4px',
                    pointerEvents: 'none',
                  }
                }}
              >
                {/* Left Section - Logo and Certificate Number */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 4,
                  minWidth: 250,
                  borderRight: '2px solid #e0e0e0',
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <Avatar 
                    sx={{ 
                      width: 100,
                      height: 100,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      mb: 2,
                    }}
                  >
                    <WorkspacePremiumOutlined sx={{ fontSize: 56 }} />
                  </Avatar>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 700,
                      color: '#1c1917',
                      fontFamily: '"Playfair Display", Georgia, serif',
                      textAlign: 'center',
                      mb: 1,
                    }}
                  >
                    Certificate
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#6b7280',
                      fontWeight: 600,
                      textAlign: 'center',
                      mb: 2,
                    }}
                  >
                    of Achievement
                  </Typography>
                  <Divider sx={{ width: '80%', mb: 2 }} />
                  <Typography variant="caption" sx={{ color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1 }}>
                    No. {certificate.certificateNumber}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Chip 
                      size="small"
                      label={certificate.status}
                      color={getStatusColor(certificate.status) as any}
                      icon={certificate.status === 'ACTIVE' ? <VerifiedOutlined /> : <Cancel />}
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </Box>

                {/* Middle Section - Certificate Content */}
                <CardContent sx={{ flexGrow: 1, p: 4, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 1, fontStyle: 'italic' }}>
                      This is to certify that
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#1c1917',
                        mb: 2,
                        fontFamily: '"Playfair Display", Georgia, serif',
                      }}
                    >
                      {certificate.studentName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', mb: 1, fontStyle: 'italic' }}>
                      has successfully completed
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600,
                        color: '#059669',
                        mb: 1,
                      }}
                    >
                      {certificate.courseName}
                    </Typography>
                    {certificate.specialization && (
                      <Typography variant="body1" sx={{ color: '#6b7280', fontStyle: 'italic', mt: 1 }}>
                        Specialization: {certificate.specialization}
                      </Typography>
                    )}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Details in Row */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                        Grade
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#059669', fontWeight: 700 }}>
                        {certificate.grade}
                        {certificate.cgpa && ` (${certificate.cgpa})`}
                      </Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
                        Issue Date
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#1c1917', fontWeight: 600 }}>
                        {formatDate(certificate.issueDate)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                {/* Right Section - Actions */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  minWidth: 150,
                  borderLeft: '2px solid #e0e0e0',
                  gap: 2,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<Visibility />}
                    onClick={() => handleView(certificate)}
                    sx={{ 
                      color: '#6366f1',
                      borderColor: '#6366f1',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderColor: '#6366f1',
                      }
                    }}
                  >
                    View
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Download />}
                    onClick={() => handleDownload(certificate.certificateId)}
                    sx={{ 
                      backgroundColor: '#059669',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#047857',
                      }
                    }}
                    disabled={certificate.status !== 'ACTIVE'}
                  >
                    Download
                  </Button>
                </Box>
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
