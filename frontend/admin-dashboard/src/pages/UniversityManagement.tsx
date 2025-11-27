import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  TextField,
  InputAdornment,
  IconButton,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from '@mui/material';
import {
  Search,
  Email,
  Phone,
  CheckCircle,
  Cancel,
  Refresh,
  AccountBalance,
  CalendarToday,
  Edit,
  Delete,
} from '@mui/icons-material';
import { universityService, adminService } from '../services';
import { format } from 'date-fns';
import type { University } from '../services/universityService';
import { User } from '../types';

export const UniversityManagement: React.FC = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [editUniversity, setEditUniversity] = useState<University | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadUniversities = async () => {
    try {
      setLoading(true);
      setError(null);
      // Fetch universities from university service
      const universities = await universityService.getAllUniversities();
      setUniversities(universities);
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

  const handleEditUniversity = (university: University) => {
    setEditUniversity(university);
  };

  const handleCloseEdit = () => {
    setEditUniversity(null);
  };

  const handleUpdateUniversity = async () => {
    if (!editUniversity) return;

    try {
      setUpdating(true);
      // Update in university service - only send name and email
      await universityService.updateUniversity(editUniversity.universityId, {
        universityName: editUniversity.universityName,
        email: editUniversity.email,
      });
      
      // Also update in auth service - find user by UID and update name
      try {
        const usersResponse = await adminService.getUsers(1, 100, '', 'UNIVERSITY');
        const user = usersResponse.content.find((u: User) => u.uid === editUniversity.universityId);
        if (user) {
          await adminService.updateUser(user.id, {
            fullName: editUniversity.universityName,
          });
        }
      } catch (err) {
        console.error('Failed to sync update to auth service:', err);
      }
      
      await loadUniversities();
      setEditUniversity(null);
      setSuccessMessage('University updated successfully');
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update university');
      setSuccessMessage(null);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUniversity = async (universityId: string) => {
    if (!window.confirm('Are you sure you want to delete this university? This action cannot be undone.')) {
      return;
    }

    try {
      // Delete from university service
      await universityService.deleteUniversity(universityId);
      
      // Also delete from auth service
      try {
        const usersResponse = await adminService.getUsers(1, 100, '', 'UNIVERSITY');
        const user = usersResponse.content.find((u: User) => u.uid === universityId);
        if (user) {
          await adminService.deleteUser(user.id);
        }
      } catch (err) {
        console.error('Failed to sync delete to auth service:', err);
      }
      
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
    uni.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
          label={`Verified: ${universities.filter(u => u.verified).length}`}
          color="success"
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label={`Unverified: ${universities.filter(u => !u.verified).length}`}
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
            <Grid item xs={12} sm={6} md={4} key={university.universityId}>
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
                        bgcolor: university.verified ? 'primary.main' : 'grey.400',
                        mr: 2,
                      }}
                    >
                      <AccountBalance />
                    </Avatar>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" component="div" sx={{ mb: 0.5, fontWeight: 600 }}>
                        {university.universityName}
                      </Typography>
                      <Chip
                        label={university.verified ? 'Verified' : 'Unverified'}
                        color={university.verified ? 'success' : 'default'}
                        size="small"
                        icon={university.verified ? <CheckCircle /> : <Cancel />}
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
                  {university.updatedAt && university.updatedAt !== university.createdAt && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Last updated: {format(new Date(university.updatedAt), 'MMM dd, yyyy HH:mm')}
                    </Typography>
                  )}
                </CardContent>

                <Divider />

                {/* Action buttons */}
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <Tooltip title="Edit university">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEditUniversity(university)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete university">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteUniversity(university.universityId)}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit University Dialog */}
      <Dialog open={!!editUniversity} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit University</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="University Name"
              fullWidth
              value={editUniversity?.universityName || ''}
              onChange={(e) => setEditUniversity(prev => prev ? { ...prev, universityName: e.target.value } : null)}
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={editUniversity?.email || ''}
              onChange={(e) => setEditUniversity(prev => prev ? { ...prev, email: e.target.value } : null)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={updating}>
            Cancel
          </Button>
          <Button onClick={handleUpdateUniversity} variant="contained" disabled={updating}>
            {updating ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

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
