import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Button,
} from '@mui/material';
import {
  VerifiedUser,
  CheckCircle,
  TrendingUp,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getStoredUser());

  useEffect(() => {
    setUser(authService.getStoredUser());
  }, []);

  const stats = [
    {
      title: 'Verifications Today',
      value: '0',
      icon: <CheckCircle sx={{ fontSize: 40 }} />,
      color: '#10b981',
      bgColor: '#ecfdf5',
    },
    {
      title: 'Total Verifications',
      value: '0',
      icon: <VerifiedUser sx={{ fontSize: 40 }} />,
      color: '#3b82f6',
      bgColor: '#eff6ff',
    },
    {
      title: 'Active Sessions',
      value: '1',
      icon: <TrendingUp sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
      bgColor: '#fffbeb',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Welcome back, {user?.name || 'Employer'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {user?.companyName && `${user.companyName} • `}
          Manage your certificate verification activities
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              elevation={0}
              sx={{
                border: '1px solid #e5e7eb',
                borderRadius: 3,
                height: '100%',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: stat.bgColor,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '1px solid #e5e7eb',
              borderRadius: 3,
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <VerifiedUser sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
              <Typography variant="h6" fontWeight="bold">
                Quick Verification
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Verify certificate authenticity in seconds. Enter a certificate number to get started.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/verify')}
              fullWidth
              sx={{ borderRadius: 2 }}
            >
              Start Verification
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
