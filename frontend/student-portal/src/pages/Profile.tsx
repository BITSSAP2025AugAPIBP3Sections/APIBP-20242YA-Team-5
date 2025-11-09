import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Grid,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import { 
  Save, 
  AccountCircle, 
  EditOutlined,
  PersonOutlined,
  EmailOutlined,
  SchoolOutlined,
  BadgeOutlined,
  BookOutlined 
} from '@mui/icons-material';

const Profile: React.FC = () => {
  const [profile, setProfile] = React.useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@student.university.edu',
    studentId: 'ST12345',
    university: 'Tech University',
    course: 'Computer Science',
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfile(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Implement profile update logic
    console.log('Profile updated:', profile);
  };

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
            color: '#1c1917', // Black heading
          }}
        >
          My Profile
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            fontWeight: 400,
            maxWidth: '600px'
          }}
        >
          Manage your personal information and academic details
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Profile Summary Card */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ 
            height: 'fit-content',
            background: 'linear-gradient(135deg, #fefdfb 0%, #faf8f4 100%)',
            border: '1px solid #f5f3ef',
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(120, 113, 108, 0.1), 0 2px 4px -1px rgba(120, 113, 108, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 20px 25px -5px rgba(120, 113, 108, 0.15), 0 10px 10px -5px rgba(120, 113, 108, 0.1)',
              transform: 'translateY(-2px)',
            }
          }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Box sx={{ mb: 3 }}>
                <Avatar sx={{ 
                  width: 100, 
                  height: 100, 
                  mx: 'auto',
                  mb: 2,
                  backgroundColor: '#2563eb',
                  boxShadow: '0 8px 24px 0 rgba(37, 99, 235, 0.2)'
                }}>
                  <AccountCircle sx={{ width: 70, height: 70, color: 'white' }} />
                </Avatar>
                <IconButton
                  sx={{ 
                    position: 'relative',
                    mt: -3,
                    ml: 3,
                    backgroundColor: '#0d9488',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#0f766e',
                    },
                    boxShadow: '0 4px 12px 0 rgba(13, 148, 136, 0.3)'
                  }}
                  size="small"
                >
                  <EditOutlined sx={{ fontSize: 16 }} />
                </IconButton>
              </Box>

              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  mb: 1,
                  color: '#1c1917'
                }}
              >
                {profile.firstName} {profile.lastName}
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  mb: 1,
                  fontWeight: 500
                }}
              >
                {profile.studentId}
              </Typography>
              
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#2563eb',
                  fontWeight: 600
                }}
              >
                {profile.university}
              </Typography>

              <Divider sx={{ my: 3, opacity: 0.6 }} />

              <Box sx={{ textAlign: 'left' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <EmailOutlined sx={{ color: '#0d9488', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {profile.email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <BookOutlined sx={{ color: '#dc2626', fontSize: 20 }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {profile.course}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Form Card */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #fefdfb 0%, #faf8f4 100%)',
            border: '1px solid #f5f3ef',
            borderRadius: 3,
            boxShadow: '0 4px 6px -1px rgba(120, 113, 108, 0.1), 0 2px 4px -1px rgba(120, 113, 108, 0.06)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 20px 25px -5px rgba(120, 113, 108, 0.15), 0 10px 10px -5px rgba(120, 113, 108, 0.1)',
            }
          }}>
            <CardContent sx={{ p: 4 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 600,
                  mb: 4,
                  color: '#1c1917'
                }}
              >
                Edit Information
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <PersonOutlined sx={{ color: '#2563eb', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#ffffff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2563eb',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2563eb',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#2563eb',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <PersonOutlined sx={{ color: '#2563eb', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#ffffff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2563eb',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#2563eb',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#2563eb',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <EmailOutlined sx={{ color: '#0d9488', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#ffffff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#0d9488',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#0d9488',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#0d9488',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Student ID"
                      name="studentId"
                      value={profile.studentId}
                      onChange={handleChange}
                      variant="outlined"
                      disabled
                      InputProps={{
                        startAdornment: (
                          <BadgeOutlined sx={{ color: '#78716c', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f5f3ef',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="University"
                      name="university"
                      value={profile.university}
                      onChange={handleChange}
                      variant="outlined"
                      disabled
                      InputProps={{
                        startAdornment: (
                          <SchoolOutlined sx={{ color: '#78716c', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#f5f3ef',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Course"
                      name="course"
                      value={profile.course}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{
                        startAdornment: (
                          <BookOutlined sx={{ color: '#dc2626', mr: 1 }} />
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#ffffff',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#dc2626',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#dc2626',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#dc2626',
                        },
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        startIcon={<Save />}
                        size="large"
                        sx={{
                          backgroundColor: '#2563eb',
                          fontWeight: 600,
                          textTransform: 'none',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          boxShadow: '0 4px 12px 0 rgba(37, 99, 235, 0.3)',
                          '&:hover': {
                            backgroundColor: '#1d4ed8',
                            boxShadow: '0 8px 24px 0 rgba(37, 99, 235, 0.4)',
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Save Changes
                      </Button>
                      
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{
                          borderColor: '#78716c',
                          color: '#78716c',
                          fontWeight: 600,
                          textTransform: 'none',
                          px: 4,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            borderColor: '#57534e',
                            color: '#57534e',
                            backgroundColor: 'rgba(120, 113, 108, 0.1)',
                          },
                          transition: 'all 0.3s ease',
                        }}
                      >
                        Cancel
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;