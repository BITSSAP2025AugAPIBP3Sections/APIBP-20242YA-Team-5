import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from './components/layout/Header';
import AcademicWatermark from './components/common/AcademicWatermark';
import Dashboard from './pages/Dashboard';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import Login from './pages/Login';

const App: React.FC = () => {
  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)',
      position: 'relative'
    }}>
      <AcademicWatermark />
      <Header />
      <Container maxWidth="lg" sx={{ 
        pt: 4, 
        pb: 8,
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;