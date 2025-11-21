import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
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
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  People,
  School,
  Assignment,
  VerifiedUser,
  Refresh,
  TrendingUp,
} from '@mui/icons-material';
import { StatsCard, SystemHealthCard, ChartCard } from '../components';
import { adminService } from '../services';
import { DashboardStats } from '../types';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Box sx={{ textAlign: 'center' }}>
          <IconButton onClick={handleRefresh} disabled={refreshing}>
            <Refresh />
          </IconButton>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <IconButton onClick={handleRefresh} disabled={refreshing}>
          <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </IconButton>
      </Box>

      {stats && (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Total Users"
                value={stats.totalUsers}
                icon={<People />}
                color="primary.main"
                subtitle="All registered users"
                trend={{ value: 12.5, isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Universities"
                value={stats.totalUniversities}
                icon={<School />}
                color="secondary.main"
                subtitle="Verified institutions"
                trend={{ value: 8.3, isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Certificates"
                value={stats.totalCertificates}
                icon={<Assignment />}
                color="success.main"
                subtitle="Total issued"
                trend={{ value: 15.2, isPositive: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatsCard
                title="Verifications Today"
                value={stats.verificationsToday}
                icon={<VerifiedUser />}
                color="info.main"
                subtitle="Today's activity"
                trend={{ value: 5.7, isPositive: false }}
              />
            </Grid>
          </Grid>

          {/* Charts and System Health */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <ChartCard
                title="Certificates & Verifications (Monthly)"
                type="bar"
                data={stats.certificatesByMonth}
                height={350}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartCard
                title="User Distribution by Role"
                type="pie"
                data={stats.usersByRole}
                height={350}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            {/* Recent Verifications */}
            <Grid item xs={12} md={8}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6" component="h2">
                      Recent Verifications
                    </Typography>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Student</TableCell>
                          <TableCell>University</TableCell>
                          <TableCell>Verified By</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {stats.recentVerifications.map((verification) => (
                          <TableRow key={verification.id}>
                            <TableCell>{verification.studentName}</TableCell>
                            <TableCell>{verification.universityName}</TableCell>
                            <TableCell>
                              <Chip
                                label={verification.verifierType}
                                size="small"
                                color={verification.verifierType === 'employer' ? 'primary' : 'secondary'}
                                sx={{ textTransform: 'capitalize' }}
                              />
                            </TableCell>
                            <TableCell>
                              {format(new Date(verification.verifiedAt), 'MMM dd, HH:mm')}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {stats.recentVerifications.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 3 }}>
                      <Typography color="text.secondary">
                        No recent verifications
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* System Health */}
            <Grid item xs={12} md={4}>
              <SystemHealthCard health={stats.systemHealth} />
            </Grid>
          </Grid>
        </>
      )}

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Container>
  );
};