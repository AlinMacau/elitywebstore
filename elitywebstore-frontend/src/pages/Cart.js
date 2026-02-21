import React, { useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  Button,
} from '@mui/material';
import { ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useCart } from '../contexts/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, loading, removeFromCart, refreshCart } = useCart();

  useEffect(() => {
    refreshCart();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      
      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
          Shopping Cart
        </Typography>

        {loading ? (
          <LoadingSpinner />
        ) : cart?.products?.length > 0 ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              {cart.products.map((product) => (
                <CartItem
                  key={product.id}
                  product={product}
                  onRemove={handleRemove}
                />
              ))}
            </Grid>

            <Grid item xs={12} md={4}>
              <CartSummary cart={cart} />
            </Grid>
          </Grid>
        ) : (
          <Box textAlign="center" py={8}>
            <ShoppingCartIcon sx={{ fontSize: 100, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
              sx={{ mt: 2, backgroundColor: '#ff6b35' }}
            >
              Continue Shopping
            </Button>
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default Cart;