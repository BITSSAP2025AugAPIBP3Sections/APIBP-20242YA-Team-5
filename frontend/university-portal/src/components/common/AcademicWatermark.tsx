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
          color: '#2563eb',
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
          color: '#2563eb'
        }}
      >
        <WorkspacePremiumOutlined sx={{ fontSize: 'inherit' }} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '15%',
          left: '8%',
          transform: 'rotate(-20deg)',
          opacity: 0.02,
          fontSize: '100px',
          color: '#2563eb'
        }}
      >
        <BookOutlined sx={{ fontSize: 'inherit' }} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '25%',
          left: '15%',
          transform: 'rotate(10deg)',
          opacity: 0.015,
          fontSize: '80px',
          color: '#2563eb'
        }}
      >
        <SchoolOutlined sx={{ fontSize: 'inherit' }} />
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '30%',
          right: '12%',
          transform: 'rotate(-35deg)',
          opacity: 0.015,
          fontSize: '90px',
          color: '#2563eb'
        }}
      >
        <WorkspacePremiumOutlined sx={{ fontSize: 'inherit' }} />
      </Box>

      {/* University-specific text watermarks */}
      <Box
        sx={{
          position: 'absolute',
          top: '70%',
          right: '20%',
          transform: 'rotate(-45deg)',
          opacity: 0.01,
          fontSize: '32px',
          color: '#2563eb',
          fontWeight: 300,
          fontFamily: 'serif'
        }}
      >
        University Portal
      </Box>

      <Box
        sx={{
          position: 'absolute',
          top: '20%',
          left: '70%',
          transform: 'rotate(30deg)',
          opacity: 0.01,
          fontSize: '24px',
          color: '#2563eb',
          fontWeight: 300,
          fontFamily: 'serif'
        }}
      >
        Certificate Management
      </Box>
    </Box>
  );
};

export default AcademicWatermark;