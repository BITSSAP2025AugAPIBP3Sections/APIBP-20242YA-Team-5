import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Modern royal blue
      dark: '#1d4ed8',
      light: '#3b82f6',
    },
    secondary: {
      main: '#0d9488', // Sophisticated teal
      dark: '#0f766e',
      light: '#14b8a6',
    },
    background: {
      default: '#fafaf9', // Warm off-white
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1917', // Rich charcoal
      secondary: '#57534e', // Warm gray
    },
    grey: {
      50: '#fafaf9', // Warm off-white
      100: '#f5f5f4', // Light warm gray
      200: '#e7e5e4', // Medium warm gray
      300: '#d6d3d1', // Soft warm gray
      400: '#a8a29e', // Neutral warm gray
      500: '#78716c', // Rich warm gray
      600: '#57534e', // Deep warm gray
      700: '#44403c', // Dark warm gray
      800: '#292524', // Very dark warm gray
      900: '#1c1917', // Rich charcoal
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '3.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
      color: '#1c1917', // Updated to new charcoal
    },
    h2: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '2.75rem',
      lineHeight: 1.3,
      letterSpacing: '-0.01em',
      color: '#1c1917', // Updated to new charcoal
    },
    h3: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.4,
      letterSpacing: '-0.01em',
      color: '#292524', // Updated to new dark gray
    },
    h4: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      letterSpacing: '-0.005em',
      color: '#292524', // Updated to new dark gray
    },
    h5: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      color: '#334155',
    },
    h6: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.6,
      color: '#334155',
    },
    body1: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#475569',
      fontWeight: 400,
    },
    body2: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.875rem',
      lineHeight: 1.6,
      color: '#64748b',
      fontWeight: 400,
    },
    button: {
      fontFamily: '"Inter", sans-serif',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: 0,
    },
    caption: {
      fontFamily: '"Inter", sans-serif',
      fontSize: '0.75rem',
      lineHeight: 1.5,
      color: '#94a3b8',
      fontWeight: 400,
    },
  },
  components: {
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.academic-heading': {
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 600,
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);