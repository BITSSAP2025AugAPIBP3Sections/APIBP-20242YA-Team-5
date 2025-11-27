import React, { useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import { 
  Download, 
  SchoolOutlined, 
  WorkspacePremiumOutlined,
  VerifiedOutlined,
  Refresh,
  Cancel,
  VerifiedUser,
  Share,
  ContentCopy,
  CheckCircle,
} from '@mui/icons-material';
import { useCertificates } from '../hooks/useCertificates';
import { VerificationService, VerificationResult } from '../services/verificationService';

const Certificates: React.FC = () => {
  const { certificates, loading, error, fetchCertificates, downloadCertificate, refreshCertificates } = useCertificates();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Verification state
  const [verifyDialog, setVerifyDialog] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [verifying, setVerifying] = useState(false);

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

  const handleVerifyCertificate = async (certificate: any) => {
    setSelectedCertificate(certificate);
    try {
      setVerifying(true);
      const result = await VerificationService.verifyCertificate(certificate.certificateNumber);
      setVerificationResult(result);
      setVerifyDialog(true);
    } catch (error: any) {
      setSnackbarMessage(error.message || 'Failed to verify certificate');
      setSnackbarOpen(true);
    } finally {
      setVerifying(false);
    }
  };

  const handleCopyVerificationLink = (certificateNumber: string) => {
    const link = VerificationService.generateVerificationLink(certificateNumber);
    navigator.clipboard.writeText(link);
    setSnackbarMessage('Verification link copied to clipboard!');
    setSnackbarOpen(true);
  };

  const handleShareCertificate = (certificateNumber: string) => {
    const link = VerificationService.generateVerificationLink(certificateNumber);
    if (navigator.share) {
      navigator.share({
        title: 'Certificate Verification',
        text: 'Verify my certificate',
        url: link,
      }).catch(() => {
        handleCopyVerificationLink(certificateNumber);
      });
    } else {
      handleCopyVerificationLink(certificateNumber);
    }
  };

  // Helper function to format timestamp from backend
  const formatVerificationTimestamp = (timestamp: string | number[]): string => {
    try {
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

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return 'success';
      case 'REVOKED':
        return 'error';
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
              <MenuItem value="REVOKED">Revoked</MenuItem>
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
        <Grid container spacing={4}>
          {safeCertificates.map((certificate) => (
            <Grid item xs={12} key={certificate.certificateId}>
              <Card 
                sx={{
                  position: 'relative',
                  background: '#ffffff',
                  border: 'none',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: certificate.status === 'ACTIVE' 
                      ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                  }
                }}
              >
                {/* Status Badge - Top Right */}
                <Box sx={{ 
                  position: 'absolute',
                  top: 24,
                  right: 24,
                  zIndex: 2,
                }}>
                  <Chip 
                    size="small"
                    label={certificate.status}
                    color={getStatusColor(certificate.status) as any}
                    icon={certificate.status === 'ACTIVE' ? <VerifiedOutlined /> : <Cancel />}
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      height: '28px',
                      borderRadius: '14px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    }}
                  />
                </Box>

                {/* Main Content Container */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, width: '100%' }}>
                  
                  {/* Left Section - Decorative Icon & Certificate Number */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 4,
                    minWidth: { xs: '100%', md: 200 },
                    background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                    borderRight: { xs: 'none', md: '1px solid #e5e7eb' },
                    borderBottom: { xs: '1px solid #e5e7eb', md: 'none' },
                  }}>
                    <Box sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2,
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    }}>
                      <WorkspacePremiumOutlined sx={{ fontSize: 40, color: '#ffffff' }} />
                    </Box>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: 1.5,
                        fontWeight: 600,
                        fontSize: '0.65rem',
                      }}
                    >
                      Certificate No.
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#1f2937',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        mt: 0.5,
                      }}
                    >
                      {certificate.certificateNumber}
                    </Typography>
                  </Box>

                  {/* Middle Section - Certificate Details */}
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    p: { xs: 3, md: 4 },
                    display: 'flex', 
                    flexDirection: 'column',
                  }}>
                    {/* Student Name */}
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        letterSpacing: 1.2,
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        mb: 0.5,
                      }}
                    >
                      Awarded To
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 700,
                        color: '#111827',
                        mb: 3,
                        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {certificate.studentName}
                    </Typography>

                    {/* Course Information */}
                    <Box sx={{ mb: 3 }}>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#9ca3af',
                          textTransform: 'uppercase',
                          letterSpacing: 1.2,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          mb: 0.5,
                          display: 'block',
                        }}
                      >
                        Course Completed
                      </Typography>
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontWeight: 600,
                          color: '#059669',
                          mb: 0.5,
                          lineHeight: 1.3,
                        }}
                      >
                        {certificate.courseName}
                      </Typography>
                      {certificate.specialization && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#6b7280',
                            fontWeight: 500,
                            mt: 0.5,
                          }}
                        >
                          {certificate.specialization}
                        </Typography>
                      )}
                    </Box>

                    {/* Metrics Row */}
                    <Box sx={{ 
                      display: 'flex', 
                      gap: 4, 
                      pt: 2,
                      borderTop: '1px solid #e5e7eb',
                    }}>
                      <Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: 1.2,
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          Grade
                        </Typography>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: '#111827', 
                            fontWeight: 700,
                            fontSize: '1.1rem',
                          }}
                        >
                          {certificate.grade}
                          {certificate.cgpa && (
                            <Typography 
                              component="span" 
                              sx={{ 
                                color: '#6b7280',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                ml: 0.5,
                              }}
                            >
                              ({certificate.cgpa})
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#9ca3af',
                            textTransform: 'uppercase',
                            letterSpacing: 1.2,
                            fontWeight: 600,
                            fontSize: '0.65rem',
                            display: 'block',
                            mb: 0.5,
                          }}
                        >
                          Issued
                        </Typography>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: '#111827', 
                            fontWeight: 600,
                            fontSize: '0.95rem',
                          }}
                        >
                          {formatDate(certificate.issueDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>

                  {/* Right Section - Actions */}
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: { xs: 'row', md: 'column' },
                    alignItems: 'stretch',
                    justifyContent: 'center',
                    p: { xs: 2, md: 3 },
                    gap: 1.5,
                    minWidth: { xs: '100%', md: 180 },
                    borderLeft: { xs: 'none', md: '1px solid #e5e7eb' },
                    borderTop: { xs: '1px solid #e5e7eb', md: 'none' },
                    background: { xs: '#fafafa', md: 'transparent' },
                  }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<Download />}
                      onClick={() => handleDownload(certificate.certificateId)}
                      disabled={certificate.status !== 'ACTIVE'}
                      sx={{ 
                        backgroundColor: '#10b981',
                        color: '#ffffff',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        py: 1.2,
                        borderRadius: '10px',
                        textTransform: 'none',
                        boxShadow: 'none',
                        '&:hover': {
                          backgroundColor: '#059669',
                          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        },
                        '&:disabled': {
                          backgroundColor: '#d1d5db',
                          color: '#9ca3af',
                        }
                      }}
                    >
                      Download
                    </Button>
                    
                    <Tooltip title="Verify certificate authenticity" arrow>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<VerifiedUser />}
                        onClick={() => handleVerifyCertificate(certificate)}
                        sx={{ 
                          color: '#3b82f6',
                          borderColor: '#3b82f6',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          py: 1.2,
                          borderRadius: '10px',
                          textTransform: 'none',
                          borderWidth: '1.5px',
                          '&:hover': {
                            backgroundColor: 'rgba(59, 130, 246, 0.08)',
                            borderColor: '#2563eb',
                            borderWidth: '1.5px',
                          }
                        }}
                      >
                        Verify
                      </Button>
                    </Tooltip>
                    
                    <Tooltip title="Share verification link" arrow>
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Share />}
                        onClick={() => handleShareCertificate(certificate.certificateNumber)}
                        sx={{ 
                          color: '#8b5cf6',
                          borderColor: '#8b5cf6',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          py: 1.2,
                          borderRadius: '10px',
                          textTransform: 'none',
                          borderWidth: '1.5px',
                          '&:hover': {
                            backgroundColor: 'rgba(139, 92, 246, 0.08)',
                            borderColor: '#7c3aed',
                            borderWidth: '1.5px',
                          }
                        }}
                      >
                        Share
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Verification Result Dialog */}
      <Dialog open={verifyDialog} onClose={() => setVerifyDialog(false)} maxWidth="sm" fullWidth>
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
              <CircularProgress />
              <Typography sx={{ mt: 2 }}>Verifying certificate...</Typography>
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
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<ContentCopy />}
                      onClick={() => selectedCertificate && handleCopyVerificationLink(selectedCertificate.certificateNumber)}
                      sx={{ mt: 1 }}
                    >
                      Copy Verification Link
                    </Button>
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
