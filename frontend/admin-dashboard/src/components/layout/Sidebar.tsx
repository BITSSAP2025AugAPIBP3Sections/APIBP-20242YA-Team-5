import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  Assignment,
  VerifiedUser,
  Analytics,
  Settings,
  MonitorHeart,
  Download,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 280;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

interface NavigationItem {
  title: string;
  path: string;
  icon: React.ReactElement;
  badge?: string;
  divider?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <Dashboard />,
    },
    {
      title: 'Users',
      path: '/users',
      icon: <People />,
      divider: true,
    },
    {
      title: 'Universities',
      path: '/universities',
      icon: <School />,
    },
    {
      title: 'Certificates',
      path: '/certificates',
      icon: <Assignment />,
    },
    {
      title: 'Verifications',
      path: '/verifications',
      icon: <VerifiedUser />,
      divider: true,
    },
    {
      title: 'Analytics',
      path: '/analytics',
      icon: <Analytics />,
    },
    {
      title: 'System Health',
      path: '/health',
      icon: <MonitorHeart />,
      divider: true,
    },
    {
      title: 'Export Data',
      path: '/export',
      icon: <Download />,
    },
    {
      title: 'Settings',
      path: '/settings',
      icon: <Settings />,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const isSelected = (path: string) => {
    return location.pathname === path || 
           (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth }} role="presentation">
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h5" component="div" fontWeight="bold">
          Admin Portal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Certificate System
        </Typography>
      </Box>
      
      <Divider />
      
      <List>
        {navigationItems.map((item) => (
          <React.Fragment key={item.path}>
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                selected={isSelected(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    '& .MuiListItemIcon-root': {
                      color: 'primary.contrastText',
                    },
                    '&:hover': {
                      bgcolor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.title}
                  primaryTypographyProps={{
                    fontWeight: isSelected(item.path) ? 600 : 400,
                  }}
                />
                {item.badge && (
                  <Chip 
                    label={item.badge} 
                    size="small" 
                    color="secondary"
                  />
                )}
              </ListItemButton>
            </ListItem>
            {item.divider && <Divider sx={{ my: 1 }} />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Desktop permanent drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            position: 'fixed',
            height: '100vh',
            top: 64, // Below header
            left: 0,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};