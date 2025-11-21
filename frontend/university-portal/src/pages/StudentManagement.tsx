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
} from '@mui/material';
import {
  Search,
  Email,
  Phone,
  CheckCircle,
  Cancel,
  Refresh,
  School,
  CalendarToday,
  Person,
} from '@mui/icons-material';
import { authApi } from '../services/api';
import { format } from 'date-fns';

interface Student {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  isVerified: boolean;
  isActive?: boolean;
  studentId?: string;
  createdAt: string;
  lastLoginAt?: string;
}

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.get('/users', {
        params: {
          page: 0,
          size: 1000,
          role: 'STUDENT'
        }
      });
      
      if (response.data && response.data.content) {
        setStudents(response.data.content);
      } else if (response.data && Array.isArray(response.data)) {
        setStudents(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch students:', err);
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadStudents();
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
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
            Student Management
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            View all registered students
          </Typography>
        </Box>
        <IconButton onClick={handleRefresh} disabled={refreshing}>
          <Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </IconButton>
      </Box>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            fullWidth
            placeholder="Search students by name, email, or student ID..."
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
          label={`Total Students: ${students.length}`}
          color="primary"
          icon={<School />}
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label={`Verified: ${students.filter(s => s.isVerified).length}`}
          color="success"
          icon={<CheckCircle />}
          sx={{ fontWeight: 600 }}
        />
        <Chip
          label={`Unverified: ${students.filter(s => !s.isVerified).length}`}
          color="warning"
          icon={<Cancel />}
          sx={{ fontWeight: 600 }}
        />
      </Box>

      {/* Student Cards */}
      {filteredStudents.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Person sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'No students found matching your search' : 'No students registered yet'}
            </Typography>
            {!searchTerm && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Students will appear here once they register in the system
              </Typography>
            )}
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredStudents.map((student) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={student.id}>
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
                        bgcolor: student.isVerified ? 'primary.main' : 'grey.400',
                        mr: 2,
                      }}
                    >
                      {student.fullName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography 
                        variant="h6" 
                        component="div" 
                        sx={{ 
                          mb: 0.5, 
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {student.fullName}
                      </Typography>
                      <Chip
                        label={student.isVerified ? 'Verified' : 'Unverified'}
                        color={student.isVerified ? 'success' : 'default'}
                        size="small"
                        icon={student.isVerified ? <CheckCircle /> : <Cancel />}
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Contact Information */}
                  <Box sx={{ mb: 2 }}>
                    {student.studentId && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <School sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                        <Typography 
                          variant="body2" 
                          color="text.secondary"
                          sx={{ 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          ID: {student.studentId}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                      <Email sx={{ fontSize: 18, color: 'text.secondary', mr: 1, mt: 0.2 }} />
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          wordBreak: 'break-word',
                          fontSize: '0.85rem'
                        }}
                      >
                        {student.email}
                      </Typography>
                    </Box>
                    {student.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Phone sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {student.phone}
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarToday sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Joined: {format(new Date(student.createdAt), 'MMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Additional Info */}
                  {student.lastLoginAt && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Last login: {format(new Date(student.lastLoginAt), 'MMM dd, yyyy')}
                    </Typography>
                  )}
                </CardContent>
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

export default StudentManagement;
