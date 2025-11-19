import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import Header from './components/layout/Header';
import AcademicWatermark from './components/common/AcademicWatermark';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Certificates from './pages/Certificates';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { authService } from './services';

const App: React.FC = () => {
  const isAuthenticated = authService.isAuthenticated();

  return (
    <Box sx={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)',
      position: 'relative'
    }}>
      <AcademicWatermark />
      {isAuthenticated && <Header />}
      <Container maxWidth="lg" sx={{ 
        pt: isAuthenticated ? 12 : 0, 
        pb: 8,
        px: { xs: 2, sm: 3, md: 4 }
      }}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          <Route path="/signup" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Signup />
          } />
          
          {/* Protected routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/certificates" element={
            <ProtectedRoute>
              <Certificates />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          {/* Default redirect */}
          <Route path="/" element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } />
        </Routes>
      </Container>
    </Box>
  );
};

export default App;