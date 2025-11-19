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
  AccountCircleOutlined,
  SchoolOutlined,
  AssignmentOutlined, 
  DashboardOutlined,
  PeopleOutlined,
  Logout,
  Settings,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface HeaderProps {
  title: string;
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

  const handleLogout = () => {
    // TODO: Implement logout logic
    handleClose();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <DashboardOutlined /> },
    { path: '/issue-certificate', label: 'Issue Certificate', icon: <AssignmentOutlined /> },
    { path: '/certificates', label: 'Certificates', icon: <SchoolOutlined /> },
    { path: '/students', label: 'Students', icon: <PeopleOutlined /> },
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
          <SchoolOutlined sx={{ mr: 2, fontSize: 32, color: 'primary.main' }} />
          <Box>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                color: 'primary.main'
              }}
            >
              University Portal
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: { xs: 'none', sm: 'block' } }}>
              Certificate Management System
            </Typography>
          </Box>
        </Box>

        {/* Desktop Navigation */}
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
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.04)',
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
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
              U
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
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                university@example.edu
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleClose}>
              <AccountCircleOutlined sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;