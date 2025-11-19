import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  Snackbar,
  Divider,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  AddCircleOutline,
  ArrowBack,
  Save,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { CertificateService } from '../services/certificateService';
import { CertificateIssueRequest } from '../types';

const IssueCertificate: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<CertificateIssueRequest>({
    studentName: '',
    studentEmail: '',
    courseName: '',
    specialization: '',
    grade: '',
    cgpa: undefined,
    issueDate: new Date().toISOString().split('T')[0], // Today's date
    completionDate: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cgpa' ? (value ? parseFloat(value) : undefined) : value,
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.studentName.trim()) {
      setError('Student Name is required');
      return false;
    }
    if (!formData.studentEmail.trim()) {
      setError('Student Email is required');
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.studentEmail.trim())) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.courseName.trim()) {
      setError('Course Name is required');
      return false;
    }
    if (!formData.grade.trim()) {
      setError('Grade is required');
      return false;
    }
    if (!formData.issueDate) {
      setError('Issue Date is required');
      return false;
    }
    if (formData.completionDate && new Date(formData.completionDate) > new Date(formData.issueDate)) {
      setError('Issue Date cannot be before Completion Date');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await CertificateService.issueCertificate(formData);
      setSuccess('Certificate issued successfully!');
      
      // Reset form
      setFormData({
        studentName: '',
        studentEmail: '',
        courseName: '',
        specialization: '',
        grade: '',
        cgpa: undefined,
        issueDate: new Date().toISOString().split('T')[0],
        completionDate: '',
      });
      
    } catch (err: any) {
      setError(err.message || 'Failed to issue certificate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/dashboard')} color="primary">
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Issue New Certificate
        </Typography>
      </Box>

      <Card elevation={2}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <AddCircleOutline sx={{ color: 'primary.main', fontSize: 32 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Certificate Details
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Fill in the required information to issue a new certificate
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Student Email"
                  name="studentEmail"
                  type="email"
                  value={formData.studentEmail}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., student@university.edu"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Student Name"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., John Doe"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Course Name"
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Bachelor of Computer Science"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Specialization (Optional)"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Artificial Intelligence"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., A+, B, First Class"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="CGPA (Optional)"
                  name="cgpa"
                  type="number"
                  value={formData.cgpa || ''}
                  onChange={handleInputChange}
                  inputProps={{
                    min: 0,
                    max: 10,
                    step: 0.01,
                  }}
                  placeholder="e.g., 8.5"
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Completion Date"
                  name="completionDate"
                  type="date"
                  value={formData.completionDate}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Issue Date"
                  name="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/certificates')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={<Save />}
                sx={{ minWidth: 140 }}
              >
                {loading ? 'Issuing...' : 'Issue Certificate'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>

      {/* Success Snackbar */}
      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSuccess(null)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError(null)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default IssueCertificate;