import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Divider,
} from '@mui/material';
import {
  VerifiedUser,
  Cancel,
  ContentCopy,
  Share,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { VerificationService } from '../services';
import { VerificationResponse } from '../types';

const VerifyCertificate: React.FC = () => {
  const { certificateNumber: urlCertificateNumber } = useParams<{ certificateNumber: string }>();
  const navigate = useNavigate();

  const [certificateNumber, setCertificateNumber] = useState(urlCertificateNumber || '');
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null);
  const [error, setError] = useState<string>('');
  const [linkCopied, setLinkCopied] = useState(false);

  const handleVerify = React.useCallback(async (certNumber?: string) => {
    const numberToVerify = certNumber || certificateNumber;
    
    if (!numberToVerify.trim()) {
      setError('Please enter a certificate number');
      return;
    }

    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      const result = await VerificationService.verifyCertificate(numberToVerify);
      setVerificationResult(result);
      
      // Update URL if not already there
      if (!urlCertificateNumber) {
        navigate(`/verify/${numberToVerify}`, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify certificate');
    } finally {
      setLoading(false);
    }
  }, [certificateNumber, urlCertificateNumber, navigate]);

  React.useEffect(() => {
    if (urlCertificateNumber) {
      handleVerify(urlCertificateNumber);
    }
  }, [urlCertificateNumber, handleVerify]);

  const handleCopyLink = () => {
    const link = VerificationService.getVerificationUrl(certificateNumber);
    navigator.clipboard.writeText(link);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShare = async () => {
    const link = VerificationService.getVerificationUrl(certificateNumber);
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Certificate Verification',
          text: `Verify certificate ${certificateNumber}`,
          url: link,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  const handleReset = () => {
    setCertificateNumber('');
    setVerificationResult(null);
    setError('');
    navigate('/verify', { replace: true });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <VerifiedUser sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" fontWeight="bold">
            Certificate Verification
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Verify the authenticity of academic certificates instantly
        </Typography>
      </Box>

      {/* Main Card */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: '1px solid #e5e7eb',
          borderRadius: 3,
        }}
      >
          {/* Input Section */}
          {!verificationResult && (
            <Box>
              <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                Enter Certificate Number
              </Typography>
              
              <TextField
                fullWidth
                label="Certificate Number"
                placeholder="e.g., CERT-2024-001"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value.toUpperCase())}
                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                disabled={loading}
                sx={{ mb: 3 }}
                variant="outlined"
              />

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => handleVerify()}
                disabled={loading || !certificateNumber.trim()}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Certificate'}
              </Button>
            </Box>
          )}

          {/* Result Section */}
          {verificationResult && (
            <Box>
              {/* Status Header */}
              <Box
                sx={{
                  textAlign: 'center',
                  mb: 4,
                }}
              >
                {verificationResult.valid ? (
                  <>
                    <CheckCircle
                      sx={{
                        fontSize: 80,
                        color: 'success.main',
                        mb: 2,
                      }}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                      Certificate Verified ✓
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      This certificate is authentic and valid
                    </Typography>
                  </>
                ) : (
                  <>
                    <ErrorIcon
                      sx={{
                        fontSize: 80,
                        color: 'error.main',
                        mb: 2,
                      }}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main', mb: 1 }}>
                      Verification Failed
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {verificationResult.message}
                    </Typography>
                  </>
                )}
              </Box>

              {/* Certificate Details */}
              {verificationResult.valid && verificationResult.certificate && (
                <Card
                  elevation={0}
                  sx={{
                    border: '1px solid',
                    borderColor: verificationResult.certificate.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                    borderRadius: 3,
                    mb: 3,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: verificationResult.certificate.status === 'ACTIVE' ? '#ecfdf5' : '#fef2f2',
                      color: verificationResult.certificate.status === 'ACTIVE' ? '#10b981' : '#ef4444',
                      p: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Certificate Details
                    </Typography>
                    <Chip
                      icon={verificationResult.certificate.status === 'ACTIVE' ? <CheckCircle /> : <Cancel />}
                      label={verificationResult.certificate.status}
                      color={verificationResult.certificate.status === 'ACTIVE' ? 'success' : 'error'}
                      sx={{
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'grid', gap: 2 }}>
                      <DetailRow
                        label="Certificate Number"
                        value={verificationResult.certificate.certificateNumber}
                      />
                      <Divider />
                      <DetailRow
                        label="Student Name"
                        value={verificationResult.certificate.studentName}
                      />
                      <Divider />
                      <DetailRow
                        label="Course Name"
                        value={verificationResult.certificate.courseName}
                      />
                      <Divider />
                      <DetailRow
                        label="University"
                        value={verificationResult.certificate.universityName}
                      />
                      <Divider />
                      <DetailRow
                        label="Issue Date"
                        value={new Date(verificationResult.certificate.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      />
                      <Divider />
                      <DetailRow
                        label="Grade"
                        value={verificationResult.certificate.grade}
                      />
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Verification Meta */}
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Verified At:</strong>{' '}
                  {new Date().toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Typography>
              </Alert>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<ContentCopy />}
                  onClick={handleCopyLink}
                  sx={{ flex: 1, minWidth: 'fit-content', borderRadius: 2 }}
                >
                  {linkCopied ? 'Link Copied!' : 'Copy Link'}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Share />}
                  onClick={handleShare}
                  sx={{ flex: 1, minWidth: 'fit-content', borderRadius: 2 }}
                >
                  Share
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleReset}
                  sx={{ borderRadius: 2 }}
                >
                  Verify Another Certificate
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
  );
};

// Helper component for detail rows
const DetailRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
      {label}
    </Typography>
    <Typography variant="body1" sx={{ fontWeight: 500 }}>
      {value}
    </Typography>
  </Box>
);

export default VerifyCertificate;
