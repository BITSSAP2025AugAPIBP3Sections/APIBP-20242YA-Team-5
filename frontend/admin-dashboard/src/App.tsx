import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Dashboard, UserManagement, Login, UniversityManagement } from './pages';
import { authService } from './services';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 8,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 6,
        },
      },
    },
  },
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={<Login />} 
          />
          
          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout title="Admin Dashboard">
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Layout title="User Management">
                  <UserManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Placeholder routes for future pages */}
          <Route
            path="/universities"
            element={
              <ProtectedRoute>
                <Layout title="University Management">
                  <UniversityManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/certificates"
            element={
              <ProtectedRoute>
                <Layout title="Certificate Management">
                  <div style={{ padding: 32, textAlign: 'center' }}>
                    <h2>Certificate Management</h2>
                    <p>Coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/verifications"
            element={
              <ProtectedRoute>
                <Layout title="Verification Management">
                  <div style={{ padding: 32, textAlign: 'center' }}>
                    <h2>Verification Management</h2>
                    <p>Coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/health"
            element={
              <ProtectedRoute>
                <Layout title="System Health">
                  <div style={{ padding: 32, textAlign: 'center' }}>
                    <h2>System Health</h2>
                    <p>Coming soon...</p>
                  </div>
                </Layout>
              </ProtectedRoute>
            }
          />
          
          {/* Default redirect */}
          <Route 
            path="/" 
            element={
              authService.isAuthenticated() 
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/login" replace />
            } 
          />
          
          {/* Catch all route */}
          <Route 
            path="*" 
            element={
              authService.isAuthenticated() 
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;