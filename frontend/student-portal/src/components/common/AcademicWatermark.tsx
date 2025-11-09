import React from 'react';
import { Box } from '@mui/material';
import { SchoolOutlined, BookOutlined, WorkspacePremiumOutlined } from '@mui/icons-material';

const AcademicWatermark: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {/* Large central academic icon */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-15deg)',
          opacity: 0.03,
          fontSize: '500px',
          color: '#2563eb', // Updated to new royal blue
          display: { xs: 'none', md: 'block' }
        }}
      >
        <SchoolOutlined sx={{ fontSize: 'inherit' }} />
      </Box>

      {/* Scattered academic elements */}
      <Box
        sx={{
          position: 'absolute',
          top: '10%',
          right: '5%',
          transform: 'rotate(25deg)',
          opacity: 0.02,
          fontSize: '120px',
          color: '#0d9488', // Updated to sophisticated teal
        }}
      >
        <BookOutlined sx={{ fontSize: 'inherit' }} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '5%',
          transform: 'rotate(-20deg)',
          opacity: 0.02,
          fontSize: '100px',
          color: '#dc2626', // Updated to elegant red
        }}
      >
        <WorkspacePremiumOutlined sx={{ fontSize: 'inherit' }} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          transform: 'rotate(45deg)',
          opacity: 0.05,
          fontSize: '80px',
          color: '#7c3aed', // Updated to modern purple
        }}
      >
        <SchoolOutlined sx={{ fontSize: 'inherit' }} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '10%',
          right: '15%',
          transform: 'rotate(-35deg)',
          opacity: 0.08,
          fontSize: '90px',
          color: '#0f766e', // Updated to dark teal
        }}
      >
        <BookOutlined sx={{ fontSize: 'inherit' }} />
      </Box>
    </Box>
  );
};

export default AcademicWatermark;