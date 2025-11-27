import React from 'react';
import { Box, Typography } from '@mui/material';
import { School } from '@mui/icons-material';

const AcademicWatermark: React.FC = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        opacity: 0.15,
        pointerEvents: 'none',
        zIndex: 0,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <School sx={{ fontSize: 40, color: 'primary.main' }} />
      <Typography variant="h6" fontWeight="bold" color="primary">
        Certificate Verification
      </Typography>
    </Box>
  );
};

export default AcademicWatermark;
