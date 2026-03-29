import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  Chip,
} from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import productService from '../services/productService';
import { useCart } from '../contexts/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product.id);
      navigate('/cart');
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container sx={{ my: 4 }}>
          <Typography>Product not found</Typography>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      
      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <img
                src={`https://via.placeholder.com/500?text=${product.name}`}
                alt={product.name}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              {product.name}
            </Typography>

            {product.categoryName && (
              <Chip label={product.categoryName} sx={{ mb: 2 }} />
            )}

            <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
              ${product.price?.toFixed(2)}
            </Typography>

            <Box my={3}>
              {product.stock > 0 ? (
                <Chip label={`${product.stock} in stock`} color="success" />
              ) : (
                <Chip label="Out of Stock" color="error" />
              )}
            </Box>

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              sx={{
                backgroundColor: '#ff6b35',
                '&:hover': { backgroundColor: '#e55a2b' },
                mt: 2,
              }}
            >
              Add to Cart
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default ProductDetails;