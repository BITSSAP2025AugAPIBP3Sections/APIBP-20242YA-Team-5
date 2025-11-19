import React, { useState } from 'react';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';
import AcademicWatermark from '../common/AcademicWatermark';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #f8fafc 100%)',
      position: 'relative',
    }}>
      <AcademicWatermark />
      <Header title={title} onMenuClick={handleSidebarToggle} />
      
      <Sidebar 
        open={sidebarOpen}
        onClose={handleSidebarClose}
      />

      <Box
        component="main"
        sx={{
          pt: { xs: 9, md: 10 }, // Account for fixed header height
          pb: 4,
          px: { xs: 2, sm: 3, md: 4 },
          minHeight: '100vh',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};