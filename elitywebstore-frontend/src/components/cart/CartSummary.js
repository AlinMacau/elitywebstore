import React from 'react';
import { Paper, Typography, Box, Divider, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CartSummary = ({ cart }) => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Divider sx={{ my: 2 }} />
      
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Subtotal:</Typography>
        <Typography>${cart?.productsPrice?.toFixed(2) || '0.00'}</Typography>
      </Box>
      
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography>Shipping:</Typography>
        <Typography>Free</Typography>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6" color="primary">
          ${cart?.productsPrice?.toFixed(2) || '0.00'}
        </Typography>
      </Box>
      
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={() => navigate('/checkout')}
        disabled={!cart?.products?.length}
        sx={{
          backgroundColor: '#ff6b35',
          '&:hover': { backgroundColor: '#e55a2b' },
        }}
      >
        Proceed to Checkout
      </Button>
    </Paper>
  );
};

export default CartSummary;