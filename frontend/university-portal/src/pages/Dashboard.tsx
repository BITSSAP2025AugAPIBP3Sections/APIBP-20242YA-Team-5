import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  AssignmentOutlined,
  PeopleOutlined,
  SchoolOutlined,
  VerifiedUserOutlined,
  Refresh,
  TrendingUp,
} from '@mui/icons-material';

// Temporary mock data - will be replaced with real API calls
const mockStats = {
  totalCertificatesIssued: 1247,
  totalStudents: 3521,
  activeCertificates: 1198,
  revokedCertificates: 49,
  pendingCertificates: 15,
};

const mockRecentCertificates = [
  { 
    id: '1', 
    studentName: 'John Doe', 
    courseName: 'Computer Science', 
    grade: 'A+', 
    issueDate: '2024-11-15' 
  },
  { 
    id: '2', 
    studentName: 'Jane Smith', 
    courseName: 'Mathematics', 
    grade: 'A', 
    issueDate: '2024-11-14' 
  },
  { 
    id: '3', 
    studentName: 'Mike Johnson', 
    courseName: 'Physics', 
    grade: 'B+', 
    issueDate: '2024-11-13' 
  },
];

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactElement;
  color: string;
  subtitle?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color, subtitle }) => {
  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: color,
              mr: 2,
              width: 56,
              height: 56,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h4"
              component="div"
              fontWeight="bold"
              color="text.primary"
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="xl">
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
            University Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome back! Here's an overview of your certificate management activities.
          </Typography>
        </Box>
        <IconButton color="primary" size="large">
          <Refresh />
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Certificates"
            value={mockStats.totalCertificatesIssued}
            icon={<AssignmentOutlined />}
            color="primary.main"
            subtitle="All time issued"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Students"
            value={mockStats.totalStudents}
            icon={<PeopleOutlined />}
            color="secondary.main"
            subtitle="Enrolled students"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Certificates"
            value={mockStats.activeCertificates}
            icon={<SchoolOutlined />}
            color="success.main"
            subtitle="Currently valid"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Verification Rate"
            value="96%"
            icon={<VerifiedUserOutlined />}
            color="info.main"
            subtitle="Successful verifications"
          />
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h2">
                  Recently Issued Certificates
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockRecentCertificates.map((cert) => (
                  <Box
                    key={cert.id}
                    sx={{
                      p: 2,
                      border: '1px solid #e5e7eb',
                      borderRadius: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                      },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {cert.studentName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {cert.courseName}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle2" color="success.main">
                        Grade: {cert.grade}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" component="h2" gutterBottom>
                Quick Actions
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="medium">
                    Issue New Certificate
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Create and issue a new certificate
                  </Typography>
                </Box>
                
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="medium">
                    Manage Students
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    View and manage student records
                  </Typography>
                </Box>
                
                <Box
                  sx={{
                    p: 2,
                    border: '1px solid #e5e7eb',
                    borderRadius: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.04)',
                    },
                  }}
                >
                  <Typography variant="subtitle2" fontWeight="medium">
                    View All Certificates
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Browse issued certificates
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;