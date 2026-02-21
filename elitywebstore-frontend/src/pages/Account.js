import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import {
  ShoppingBag,
  LocationOn,
  Person,
  Receipt,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { useAuth } from '../contexts/AuthContext';

const Account = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'My Orders',
      description: 'Track, return, or buy things again',
      icon: <ShoppingBag sx={{ fontSize: 40 }} />,
      path: '/account/orders',
    },
    {
      title: 'My Addresses',
      description: 'Edit addresses for orders',
      icon: <LocationOn sx={{ fontSize: 40 }} />,
      path: '/account/addresses',
    },
    {
      title: 'Profile',
      description: 'Edit your profile information',
      icon: <Person sx={{ fontSize: 40 }} />,
      path: '/account/profile',
    },
  ];

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
          My Account
        </Typography>

        <Grid container spacing={3}>
          {menuItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.title}>
              <Paper
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
                onClick={() => navigate(item.path)}
              >
                <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                  <Box color="primary.main" mb={2}>
                    {item.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default Account;