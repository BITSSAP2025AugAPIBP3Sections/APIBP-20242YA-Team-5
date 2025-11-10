import React from 'react';
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
} from '@mui/material';
import { 
  Download, 
  Visibility, 
  Share, 
  SchoolOutlined, 
  WorkspacePremiumOutlined,
  CalendarTodayOutlined,
  VerifiedOutlined 
} from '@mui/icons-material';

const Certificates: React.FC = () => {
  // Mock data for certificates
  const certificates = [
    {
      id: 1,
      title: 'Bachelor of Science in Computer Science',
      university: 'Tech University',
      issueDate: '2023-05-15',
      status: 'verified',
      grade: 'First Class Honours',
    },
    {
      id: 2,
      title: 'Project Management Certificate',
      university: 'Business School',
      issueDate: '2023-03-10',
      status: 'verified',
      grade: 'Distinction',
    },
    {
      id: 3,
      title: 'Data Analysis Course',
      university: 'Online Academy',
      issueDate: '2022-12-05',
      status: 'verified',
      grade: 'Pass',
    },
  ];

  return (
    <Box sx={{ position: 'relative', zIndex: 1 }}>
      {/* Header Section */}
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 600,
            mb: 2,
            color: '#1c1917', // Changed to black
          }}
        >
          My Certificates
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 400,
            maxWidth: '600px'
          }}
        >
          View, download, and share your verified academic certificates and credentials
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {certificates.map((certificate, index) => (
          <Grid item xs={12} md={6} lg={4} key={certificate.id}>
            <Card sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: 'linear-gradient(135deg, #fefdfb 0%, #faf8f4 100%)', // Warm light cream for all cards
              border: '1px solid #f5f3ef',
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(120, 113, 108, 0.1), 0 2px 4px -1px rgba(120, 113, 108, 0.06)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 20px 25px -5px rgba(120, 113, 108, 0.15), 0 10px 10px -5px rgba(120, 113, 108, 0.1)',
                transform: 'translateY(-6px)',
                background: 'linear-gradient(135deg, #faf8f4 0%, #f5f3ef 100%)',
              }
            }}>
              <CardContent sx={{ flexGrow: 1, p: 4 }}>
                {/* Certificate Icon */}
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ 
                    width: 48, 
                    height: 48,
                    backgroundColor: index === 0 ? '#2563eb' : index === 1 ? '#0d9488' : '#dc2626', // Different color for each card
                    boxShadow: index === 0
                      ? '0 4px 14px 0 rgba(37, 99, 235, 0.25)'
                      : index === 1
                      ? '0 4px 14px 0 rgba(13, 148, 136, 0.25)'
                      : '0 4px 14px 0 rgba(220, 38, 38, 0.25)'
                  }}>
                    <WorkspacePremiumOutlined sx={{ color: 'white', fontSize: 24 }} />
                  </Avatar>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <VerifiedOutlined 
                      sx={{ 
                        color: index === 0 ? '#2563eb' : index === 1 ? '#0d9488' : '#dc2626', // Different color for each card
                        fontSize: 20 
                      }} 
                    />
                    <Typography variant="caption" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Verified
                    </Typography>
                  </Box>
                </Box>

                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 2,
                    lineHeight: 1.3,
                    fontSize: '1.25rem'
                  }}
                >
                  {certificate.title}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SchoolOutlined sx={{ 
                    color: index === 0 ? '#2563eb' : index === 1 ? '#0d9488' : '#dc2626', // Different color for each card
                    fontSize: 18 
                  }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                    {certificate.university}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <CalendarTodayOutlined sx={{ 
                    color: index === 0 ? '#2563eb' : index === 1 ? '#0d9488' : '#dc2626', // Different color for each card
                    fontSize: 18 
                  }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Issued: {new Date(certificate.issueDate).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Typography>
                </Box>

                <Divider sx={{ mb: 3, opacity: 0.6 }} />
                
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={certificate.grade} 
                    sx={{
                      backgroundColor: index === 0 
                        ? 'rgba(37, 99, 235, 0.1)' 
                        : index === 1 
                        ? 'rgba(13, 148, 136, 0.1)' 
                        : 'rgba(220, 38, 38, 0.1)', // Different color for each card
                      color: index === 0 ? '#2563eb' : index === 1 ? '#0d9488' : '#dc2626', // Different color for each card
                      fontWeight: 600,
                      fontSize: '0.75rem',
                    }}
                    size="small" 
                  />
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 4, pt: 0 }}>
                <Button 
                  size="small" 
                  startIcon={<Visibility />}
                  sx={{ 
                    fontWeight: 600,
                    textTransform: 'none',
                    color: index === 0 ? '#2563eb' : index === 1 ? '#0d9488' : '#dc2626', // Different color for each card
                    '&:hover': {
                      backgroundColor: index === 0 
                        ? 'rgba(37, 99, 235, 0.1)' 
                        : index === 1 
                        ? 'rgba(13, 148, 136, 0.1)' 
                        : 'rgba(220, 38, 38, 0.1)', // Different hover color for each card
                    }
                  }}
                >
                  View
                </Button>
                <Button 
                  size="small" 
                  startIcon={<Download />}
                  sx={{ 
                    fontWeight: 600,
                    textTransform: 'none',
                    color: index === 0 ? '#2563eb' : index === 1 ? '#0d9488' : '#dc2626', // Different color for each card
                    '&:hover': {
                      backgroundColor: index === 0 
                        ? 'rgba(37, 99, 235, 0.1)' 
                        : index === 1 
                        ? 'rgba(13, 148, 136, 0.1)' 
                        : 'rgba(220, 38, 38, 0.1)', // Different hover color for each card
                    }
                  }}
                >
                  Download
                </Button>
                <Button 
                  size="small" 
                  startIcon={<Share />}
                  sx={{ 
                    fontWeight: 600,
                    textTransform: 'none',
                    color: index === 0 ? '#2563eb' : index === 1 ? '#0d9488' : '#dc2626', // Different color for each card
                    '&:hover': {
                      backgroundColor: index === 0 
                        ? 'rgba(37, 99, 235, 0.1)' 
                        : index === 1 
                        ? 'rgba(13, 148, 136, 0.1)' 
                        : 'rgba(220, 38, 38, 0.1)', // Different hover color for each card
                    }
                  }}
                >
                  Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Certificates;