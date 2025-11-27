import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Container, Box, CircularProgress } from '@mui/material';
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Function to check authentication
  const checkAuth = async () => {
    try {
      const hasToken = !!localStorage.getItem('student_token');
      const hasUser = !!localStorage.getItem('student_user');
      
      if (!hasToken || !hasUser) {
        setIsAuthenticated(false);
        return;
      }

      // Verify token is still valid by checking with backend
      const user = await authService.getCurrentUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      localStorage.removeItem('student_token');
      localStorage.removeItem('student_user');
      setIsAuthenticated(false);
    }
  };

  // Initial auth check
  useEffect(() => {
    const validateAuth = async () => {
      setLoading(true);
      await checkAuth();
      setLoading(false);
    };
    validateAuth();
  }, []);

  // Re-check authentication when location changes
  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="100vh"
        sx={{
          background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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