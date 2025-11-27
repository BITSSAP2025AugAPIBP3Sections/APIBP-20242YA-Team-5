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
  Divider,
} from '@mui/material';
import { 
  VerifiedUserOutlined,
  DashboardOutlined,
  BusinessOutlined,
  Logout,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      handleClose();
      navigate('/login');
    } catch (error) {
      // Even if logout API fails, clear local data and redirect
      console.error('Logout error:', error);
      handleClose();
      navigate('/login');
    }
  };

  // Get current user info
  const currentUser = authService.getStoredUser();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
    { path: '/verify', label: 'Verify Certificate', icon: <VerifiedUserOutlined /> },
  ];

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e5e7eb',
        color: '#1f2937',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ py: 1 }}>
        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onMenuClick}
          sx={{ 
            mr: 2,
            display: { md: 'none' }
          }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <BusinessOutlined sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #1e40af 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em',
              }}
            >
              Employer Portal
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Certificate Verification System
            </Typography>
          </Box>
        </Box>

        {/* Navigation Links - Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 2 }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              startIcon={item.icon}
              sx={{
                color: location.pathname === item.path ? 'primary.main' : 'text.primary',
                fontWeight: location.pathname === item.path ? 600 : 400,
                borderBottom: location.pathname === item.path ? '2px solid' : 'none',
                borderRadius: 0,
                px: 2,
                '&:hover': {
                  backgroundColor: 'rgba(30, 64, 175, 0.04)',
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        {/* User Menu */}
        <Box>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
            sx={{
              p: 0.5,
              border: '2px solid',
              borderColor: 'primary.main',
            }}
          >
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'primary.main',
                fontSize: '1rem',
              }}
            >
              {currentUser?.name?.charAt(0).toUpperCase() || 'E'}
            </Avatar>
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
              mt: 1,
              '& .MuiPaper-root': {
                minWidth: 220,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #e5e7eb' }}>
              <Typography variant="subtitle2" fontWeight={600}>
                {currentUser?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {currentUser?.email || ''}
              </Typography>
              {currentUser?.companyName && (
                <Typography variant="caption" display="block" color="text.secondary">
                  {currentUser.companyName}
                </Typography>
              )}
            </Box>
            
            <Divider />
            
            <MenuItem 
              onClick={handleLogout}
              sx={{ 
                py: 1.5, 
                color: 'error.main',
              }}
            >
              <Logout sx={{ mr: 1.5, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
