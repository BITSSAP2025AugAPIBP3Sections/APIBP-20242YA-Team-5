import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Avatar,
  Grid,
  Divider,
  Alert,
} from '@mui/material';
import {
  Person,
  Email,
  Business,
  Edit,
  Save,
} from '@mui/icons-material';
import { authService } from '../services';
import { AuthUser } from '../types';

const Profile: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    companyName: '',
  });

  useEffect(() => {
    const currentUser = authService.getStoredUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        name: currentUser.name,
        companyName: currentUser.companyName || '',
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Update local storage
    if (user) {
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('employer_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        companyName: user.companyName || '',
      });
    }
    setEditing(false);
  };

  if (!user) return null;

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Profile Settings
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your account information
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Profile updated successfully!
        </Alert>
      )}

      <Card elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Employer Account
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!editing}
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'action.disabled' }} />,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email Address"
                value={user.email}
                disabled
                InputProps={{
                  startAdornment: <Email sx={{ mr: 1, color: 'action.disabled' }} />,
                }}
                helperText="Email cannot be changed"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                disabled={!editing}
                InputProps={{
                  startAdornment: <Business sx={{ mr: 1, color: 'action.disabled' }} />,
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            {!editing ? (
              <Button
                variant="contained"
                startIcon={<Edit />}
                onClick={() => setEditing(true)}
                sx={{ borderRadius: 2 }}
              >
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant="contained"
                  startIcon={<Save />}
                  onClick={handleSave}
                  sx={{ borderRadius: 2 }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ borderRadius: 2 }}
                >
                  Cancel
                </Button>
              </>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Profile;
