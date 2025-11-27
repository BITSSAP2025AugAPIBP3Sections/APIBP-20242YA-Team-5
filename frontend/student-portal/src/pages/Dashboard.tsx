import React from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import { 
  ArticleOutlined, 
  VerifiedOutlined, 
  DownloadOutlined,
  TrendingUpOutlined,
  ViewList,
} from '@mui/icons-material';
import { useCertificates } from '../hooks/useCertificates';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { certificates, loading } = useCertificates();
  const navigate = useNavigate();

  // Ensure certificates is always an array to prevent filter errors
  const safeCertificates = Array.isArray(certificates) ? certificates : [];

  // Calculate certificate statistics
  const totalCertificates = safeCertificates.length;
  const activeCertificates = safeCertificates.filter(cert => cert.status === 'ACTIVE').length;
  const revokedCertificates = safeCertificates.filter(cert => cert.status === 'REVOKED').length;
  const recentCertificates = safeCertificates
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const handleViewAllCertificates = () => {
    navigate('/certificates');
  };
  return (
    <Box sx={{ pt: 4 }}>
      {/* Hero Section */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h2" 
          className="academic-heading"
          sx={{ 
            mb: 3,
            background: 'linear-gradient(135deg, #1e40af 0%, #059669 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontSize: { xs: '2.25rem', md: '3.5rem' },
            lineHeight: { xs: 1.2, md: 1.1 }
          }}
        >
          Welcome back
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            maxWidth: 700,
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            fontWeight: 400,
            lineHeight: 1.7
          }}
        >
          Your academic achievements at a glance. Manage and access your verified certificates with ease.
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={4} sx={{ mb: 8 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #fefdfb 0%, #faf8f4 100%)', // Warm cream for all cards
            border: '1px solid #f5f3ef',
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(120, 113, 108, 0.1), 0 2px 4px -1px rgba(120, 113, 108, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 20px 25px -5px rgba(120, 113, 108, 0.15), 0 10px 10px -5px rgba(120, 113, 108, 0.1)',
              transform: 'translateY(-4px)',
              background: 'linear-gradient(135deg, #faf8f4 0%, #f5f3ef 100%)',
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Avatar sx={{ 
                  width: 56, 
                  height: 56, 
                  backgroundColor: '#2563eb', // Royal blue for first card
                  mb: 3,
                  boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.25)'
                }}>
                  <ArticleOutlined sx={{ color: 'white', fontSize: 28 }} />
                </Avatar>
              </Box>
              <Typography 
                variant="h3" 
                className="academic-numbers"
                sx={{ 
                  mb: 1,
                  fontSize: '2.5rem'
                }}
              >
                {totalCertificates}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Total Certificates
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.875rem'
                }}
              >
                Certificates in your portfolio
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #fefdfb 0%, #faf8f4 100%)', // Warm cream for all cards
            border: '1px solid #f5f3ef',
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(120, 113, 108, 0.1), 0 2px 4px -1px rgba(120, 113, 108, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 20px 25px -5px rgba(120, 113, 108, 0.15), 0 10px 10px -5px rgba(120, 113, 108, 0.1)',
              transform: 'translateY(-4px)',
              background: 'linear-gradient(135deg, #faf8f4 0%, #f5f3ef 100%)',
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Avatar sx={{ 
                  width: 56, 
                  height: 56, 
                  backgroundColor: '#0d9488', // Teal for second card
                  mb: 3,
                  boxShadow: '0 4px 14px 0 rgba(13, 148, 136, 0.25)'
                }}>
                  <VerifiedOutlined sx={{ color: 'white', fontSize: 28 }} />
                </Avatar>
              </Box>
              <Typography 
                variant="h3" 
                className="academic-numbers"
                sx={{ 
                  mb: 1,
                  fontSize: '2.5rem'
                }}
              >
                {activeCertificates}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Active Certificates
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.875rem'
                }}
              >
                Authenticity confirmed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ 
            height: '100%',
            background: 'linear-gradient(135deg, #fefdfb 0%, #faf8f4 100%)', // Warm cream for all cards
            border: '1px solid #f5f3ef',
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(120, 113, 108, 0.1), 0 2px 4px -1px rgba(120, 113, 108, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 20px 25px -5px rgba(120, 113, 108, 0.15), 0 10px 10px -5px rgba(120, 113, 108, 0.1)',
              transform: 'translateY(-4px)',
              background: 'linear-gradient(135deg, #faf8f4 0%, #f5f3ef 100%)',
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ mb: 3 }}>
                <Avatar sx={{ 
                  width: 56, 
                  height: 56, 
                  backgroundColor: '#dc2626', // Coral for third card
                  mb: 3,
                  boxShadow: '0 4px 14px 0 rgba(220, 38, 38, 0.25)'
                }}>
                  <DownloadOutlined sx={{ color: 'white', fontSize: 28 }} />
                </Avatar>
              </Box>
              <Typography 
                variant="h3" 
                className="academic-numbers"
                sx={{ 
                  mb: 1,
                  fontSize: '2.5rem'
                }}
              >
                {revokedCertificates}
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 1
                }}
              >
                Revoked
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: '0.875rem'
                }}
              >
                Certificates revoked
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Certificates Section */}
      <Card sx={{ 
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      }}>
        <CardContent sx={{ p: 6 }}>
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              className="academic-heading"
              sx={{ 
                mb: 2,
                fontSize: '1.875rem'
              }}
            >
              Recent Certificates
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '1rem'
              }}
            >
              Your latest academic achievements and certifications
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 4 }} />
          
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Chip 
              label="Computer Science Degree - 2023" 
              sx={{
                backgroundColor: '#dbeafe',
                color: '#2563eb',
                fontWeight: 500,
                fontSize: '0.875rem',
                height: 40,
                border: '1px solid #bfdbfe',
                '& .MuiChip-label': {
                  px: 3
                },
                '&:hover': {
                  backgroundColor: '#bfdbfe',
                  transform: 'scale(1.02)',
                }
              }}
            />
            <Chip 
              label="Project Management Certificate - 2023" 
              sx={{
                backgroundColor: '#ccfbf1',
                color: '#0d9488',
                fontWeight: 500,
                fontSize: '0.875rem',
                height: 40,
                border: '1px solid #99f6e4',
                '& .MuiChip-label': {
                  px: 3
                },
                '&:hover': {
                  backgroundColor: '#99f6e4',
                  transform: 'scale(1.02)',
                }
              }}
            />
            <Chip 
              label="Data Analysis Course - 2022" 
              sx={{
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                fontWeight: 500,
                fontSize: '0.875rem',
                height: 40,
                border: '1px solid #fecaca',
                '& .MuiChip-label': {
                  px: 3
                },
                '&:hover': {
                  backgroundColor: '#fecaca',
                  transform: 'scale(1.02)',
                }
              }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Recent Certificates Section */}
      {recentCertificates.length > 0 && (
        <Card sx={{ 
          mt: 6, 
          borderRadius: 3,
          border: '1px solid #f5f3ef',
          boxShadow: '0 4px 6px -1px rgba(120, 113, 108, 0.1)',
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  color: '#1c1917'
                }}
              >
                Recent Certificates
              </Typography>
              <ViewList 
                sx={{ 
                  color: '#6b7280', 
                  cursor: 'pointer',
                  '&:hover': { color: '#059669' } 
                }}
                onClick={handleViewAllCertificates}
              />
            </Box>
            
            <Grid container spacing={3}>
              {recentCertificates.map((certificate, index) => (
                <Grid item xs={12} md={4} key={certificate.certificateId}>
                  <Card sx={{ 
                    p: 3, 
                    height: '100%',
                    borderRadius: 2,
                    border: '1px solid #f3f4f6',
                    '&:hover': {
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      <Avatar sx={{ 
                        bgcolor: index === 0 ? '#dbeafe' : index === 1 ? '#dcfce7' : '#fef3c7',
                        color: index === 0 ? '#1d4ed8' : index === 1 ? '#16a34a' : '#d97706',
                        width: 40,
                        height: 40,
                      }}>
                        <VerifiedOutlined sx={{ fontSize: 20 }} />
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                          {certificate.courseName}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
                          {certificate.studentName} • {certificate.grade}
                        </Typography>
                        <Chip 
                          size="small"
                          label={certificate.status}
                          color={certificate.status === 'ACTIVE' ? 'success' : 'error'}
                          sx={{ fontWeight: 500 }}
                        />
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="outlined" 
                onClick={handleViewAllCertificates}
                sx={{ 
                  borderColor: '#059669',
                  color: '#059669',
                  '&:hover': {
                    backgroundColor: '#059669',
                    color: 'white',
                  }
                }}
              >
                View All Certificates
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default Dashboard;