import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Category as CategoryIcon,
  ShoppingCart as OrdersIcon,
  People as UsersIcon,
} from '@mui/icons-material';

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: <DashboardIcon /> },
    { label: 'Products', path: '/admin/products', icon: <ProductsIcon /> },
    { label: 'Categories', path: '/admin/categories', icon: <CategoryIcon /> },
    { label: 'Orders', path: '/admin/orders', icon: <OrdersIcon /> },
    { label: 'Users', path: '/admin/users', icon: <UsersIcon /> },
  ];

  return (
    <Paper elevation={2} sx={{ p: 2, minWidth: 220 }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, px: 1 }}>
        Admin Panel
      </Typography>
      <Divider sx={{ mb: 1 }} />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 107, 53, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 53, 0.2)',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: location.pathname === item.path ? '#ff6b35' : 'inherit',
                minWidth: 40,
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{
                '& .MuiTypography-root': {
                  fontWeight: location.pathname === item.path ? 600 : 400,
                  color: location.pathname === item.path ? '#ff6b35' : 'inherit',
                },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default AdminNav;