import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Header, Sidebar } from '../components';

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
    <Box sx={{ minHeight: '100vh' }}>
      <Header title={title} onMenuClick={handleSidebarToggle} />
      
      <Sidebar 
        open={sidebarOpen}
        onClose={handleSidebarClose}
      />

      <Box
        component="main"
        sx={{
          bgcolor: 'grey.50',
          minHeight: '100vh',
          pt: '64px', // Header height
          pl: { xs: 0, md: '280px' }, // Sidebar width on desktop
        }}
      >
        {children}
      </Box>
    </Box>
  );
};