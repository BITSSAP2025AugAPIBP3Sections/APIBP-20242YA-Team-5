import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
} from '@mui/material';
import { 
  AccountCircleOutlined, 
  ArticleOutlined, 
  DashboardOutlined 
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    handleClose();
    navigate('/login');
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e5e7eb',
        color: '#1f2937'
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        <Typography 
          variant="h5" 
          component="div" 
          className="academic-heading"
          sx={{ 
            flexGrow: 1,
            fontSize: '1.5rem',
            letterSpacing: '-0.01em'
          }}
        >
          Student Portal
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<DashboardOutlined />}
            component={Link}
            to="/"
            sx={{
              fontWeight: 500,
              color: '#374151',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                color: '#2563eb'
              },
              borderRadius: 2,
              px: 2
            }}
          >
            Dashboard
          </Button>
          
          <Button
            color="inherit"
            startIcon={<ArticleOutlined />}
            component={Link}
            to="/certificates"
            sx={{
              fontWeight: 500,
              color: '#374151',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)',
                color: '#2563eb'
              },
              borderRadius: 2,
              px: 2
            }}
          >
            Certificates
          </Button>

          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            sx={{
              ml: 1,
              color: '#374151',
              '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.08)'
              }
            }}
          >
            <AccountCircleOutlined />
          </IconButton>
          
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                mt: 1,
                borderRadius: 2,
                boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                border: '1px solid #e5e7eb'
              }
            }}
          >
            <MenuItem 
              onClick={handleClose} 
              component={Link} 
              to="/profile"
              sx={{ fontWeight: 500, color: '#374151' }}
            >
              Profile
            </MenuItem>
            <MenuItem 
              onClick={handleLogout}
              sx={{ fontWeight: 500, color: '#374151' }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;