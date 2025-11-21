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
} from '@mui/material';
import {
  DashboardOutlined,
  AssignmentOutlined,
  SchoolOutlined,
  PeopleOutlined,
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
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: <DashboardOutlined />,
    },
    {
      title: 'Issue Certificate',
      path: '/issue-certificate',
      icon: <AssignmentOutlined />,
    },
    {
      title: 'Certificate Management',
      path: '/certificates',
      icon: <SchoolOutlined />,
    },
    {
      title: 'Student Management',
      path: '/students',
      icon: <PeopleOutlined />,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const isSelected = (path: string) => {
    return location.pathname === path;
  };

  const drawerContent = (
    <Box sx={{ width: drawerWidth, pt: 8 }} role="presentation">
      <Box sx={{ p: 3, textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
        <Typography variant="h6" component="div" fontWeight="bold" color="primary.main">
          University Portal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Certificate Management
        </Typography>
      </Box>
      
      <List sx={{ pt: 2 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ px: 2 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={isSelected(item.path)}
              sx={{
                borderRadius: 2,
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
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.04)',
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
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
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
  );
};

export default Sidebar;