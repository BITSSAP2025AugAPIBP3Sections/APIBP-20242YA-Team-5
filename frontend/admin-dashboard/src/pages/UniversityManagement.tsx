import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Email,
  Phone,
  CheckCircle,
  Cancel,
  Edit,
  Delete,
  Refresh,
  AccountBalance,
  CalendarToday,
} from '@mui/icons-material';
import { adminService } from '../services';
import { User } from '../types';
import { format } from 'date-fns';

export const UniversityManagement: React.FC = () => {
  const [universities, setUniversities] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch users with UNIVERSITY role
      const response = await adminService.getUsers(1, 100, '', 'UNIVERSITY');
      setUniversities(response.content);
    } catch (err: any) {
      setError(err.message || 'Failed to load universities');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUniversities();
  };

  const handleVerifyUniversity = async (userId: string, currentlyVerified: boolean) => {
    const action = currentlyVerified ? 'unverify' : 'verify';
    if (!window.confirm(`Are you sure you want to ${action} this university?`)) return;

    try {
      if (currentlyVerified) {
        await adminService.updateUser(userId, { isVerified: false });
      } else {
        await adminService.verifyUser(userId);
      }
      await loadUniversities();
      setSuccessMessage(`University ${action}ed successfully`);
      setError(null);
    } catch (err: any) {
      setError(err.message || `Failed to ${action} university`);
      setSuccessMessage(null);
    }
  };

  const handleDeleteUniversity = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this university? This action cannot be undone.')) return;

    try {
      await adminService.deleteUser(userId);
      await loadUniversities();
      setSuccessMessage('University deleted successfully');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete university');
      setSuccessMessage(null);
    }
  };

  // Filter universities based on search term
  const filteredUniversities = universities.filter(uni =>
    uni.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    uni.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold">
            University Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Manage and verify registered universities
          </Typography>
        </Box>
        <IconButton onClick={handleRefresh} disabled={refreshing}>
          <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </IconButton>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage(null)}>
          {successMessage}
        </Alert>
      )}

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search universities by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Statistics */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Chip
          label={`Total: ${universities.length}`}
          color="primary"
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label={`Verified: ${universities.filter(u => u.isVerified).length}`}
          color="success"
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label={`Unverified: ${universities.filter(u => !u.isVerified).length}`}
          color="warning"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* University Cards */}
      {filteredUniversities.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <AccountBalance sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'No universities found matching your search' : 'No universities registered yet'}
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredUniversities.map((university) => (
            <Grid item xs={12} sm={6} md={4} key={university.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Header with Avatar and Status */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: university.isVerified ? 'primary.main' : 'grey.400',
                        mr: 2,
                      }}
                    >
                      <AccountBalance />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" sx={{ mb: 0.5, fontWeight: 600 }}>
                        {university.fullName}
                      </Typography>
                      <Chip
                        label={university.isVerified ? 'Verified' : 'Unverified'}
                        color={university.isVerified ? 'success' : 'default'}
                        size="small"
                        icon={university.isVerified ? <CheckCircle /> : <Cancel />}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Contact Information */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Email sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
                        {university.email}
                      </Typography>
                    </Box>
                    {university.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {university.phone}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Registered: {format(new Date(university.createdAt), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Additional Info */}
                  {university.lastLoginAt && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Last login: {format(new Date(university.lastLoginAt), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  )}
                </CardContent>

                <Divider />

                {/* Actions */}
                <CardActions sx={{ justifyContent: 'space-between', px: 2, py: 1.5 }}>
                  <Box>
                    <Tooltip title={university.isVerified ? 'Mark as unverified' : 'Mark as verified'}>
                      <IconButton
                        size="small"
                        onClick={() => handleVerifyUniversity(university.id, university.isVerified)}
                        color={university.isVerified ? 'warning' : 'success'}
                      >
                        {university.isVerified ? <Cancel /> : <CheckCircle />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit university">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          // TODO: Implement edit functionality
                          alert('Edit functionality coming soon!');
                        }}
                      >
                        <Edit />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Tooltip title="Delete university">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUniversity(university.id)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* CSS for refresh animation */}
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
