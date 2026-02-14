import React from 'react';
import { Box, Typography, Button as MuiButton, Container } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
          color: '#fff',
          py: 3,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ShoppingBagIcon sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h5" fontWeight={700}>
                Elity Store
              </Typography>
            </Box>
            <MuiButton
              variant="outlined"
              onClick={handleLogout}
              sx={{
                color: '#fff',
                borderColor: '#fff',
                '&:hover': {
                  borderColor: '#fff',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Logout
            </MuiButton>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Welcome, {user?.email || 'User'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You are now logged in to Elity Store. More features coming soon!
        </Typography>
      </Container>
    </Box>
  );
};

export default Home;