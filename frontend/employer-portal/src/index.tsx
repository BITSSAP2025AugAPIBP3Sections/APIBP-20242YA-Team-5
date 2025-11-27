import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './index.css';
import App from './App';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // Modern royal blue - matches student portal
      dark: '#1d4ed8',
      light: '#3b82f6',
    },
    secondary: {
      main: '#0d9488', // Sophisticated teal - matches student portal
      dark: '#0f766e',
      light: '#14b8a6',
    },
    success: {
      main: '#10b981',
    },
    error: {
      main: '#ef4444',
    },
    background: {
      default: '#fafaf9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1c1917',
      secondary: '#57534e',
    },
  },
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
  },
  shape: {
    borderRadius: 8,
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

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
