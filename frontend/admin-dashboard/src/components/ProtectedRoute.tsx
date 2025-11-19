import React from 'react';
// import { Navigate, useLocation } from 'react-router-dom';
// import { authService } from '../services';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Development mode: always allow access
  return <>{children}</>;
};