import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CartItemCard from '../components/cart/CartItemCard';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, loading, error, clearCart, getTotalItemCount } = useCart();

  const formatPrice = (price) => {
    return `${(price || 0).toFixed(2)}`;
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (err) {
        console.error('Error clearing cart:', err);
      }
    }
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  // Not logged in
  if (!user) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container maxWidth="md" sx={{ my: 4, flexGrow: 1 }}>
          <Alert severity="warning">
            Please log in to view your cart.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
            Go to Login
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  // Loading state
  if (loading && !cart) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container maxWidth="md" sx={{ my: 4, flexGrow: 1 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
            <CircularProgress />
          </Box>
        </Container>
        <Footer />
      </Box>
    );
  }

  // Empty cart
  const isEmpty = !cart?.items || cart.items.length === 0;

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <ShoppingCartIcon fontSize="large" color="primary" />
          <Typography variant="h4" fontWeight="bold">
            Shopping Cart
          </Typography>
          {!isEmpty && (
            <Typography variant="body1" color="text.secondary">
              ({getTotalItemCount()} items)
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {isEmpty ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <ShoppingCartIcon sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Looks like you haven't added any items to your cart yet.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
              sx={{ backgroundColor: '#ff6b35' }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">
                    Cart Items ({cart.uniqueProductCount} products)
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={handleClearCart}
                  >
                    Clear Cart
                  </Button>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {cart.items.map((item) => (
                  <CartItemCard key={item.id} item={item} />
                ))}
              </Paper>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
                <Typography variant="h6" gutterBottom>
                  Order Summary
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color="text.secondary">
                    Subtotal ({getTotalItemCount()} items)
                  </Typography>
                  <Typography fontWeight="medium">
                    {formatPrice(cart.productsPrice)}
                  </Typography>
                </Box>

                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography color="text.secondary">
                    Shipping
                  </Typography>
                  <Typography color="text.secondary">
                    Calculated at checkout
                  </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="space-between" mb={3}>
                  <Typography variant="h6">
                    Estimated Total
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    {formatPrice(cart.productsPrice)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleCheckout}
                  sx={{ 
                    backgroundColor: '#ff6b35',
                    '&:hover': { backgroundColor: '#e55a2b' },
                    py: 1.5,
                  }}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="text"
                  fullWidth
                  onClick={() => navigate('/products')}
                  sx={{ mt: 1 }}
                >
                  Continue Shopping
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default Cart;