import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductCard from '../components/product/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import productService from '../services/productService';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const products = await productService.getFeaturedProducts();
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      
      {/* Hero Section */}
      <Paper
        sx={{
          backgroundColor: '#ff6b35',
          color: '#fff',
          py: 8,
          mb: 4,
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Welcome to ElityStore
          </Typography>
          <Typography variant="h5" paragraph>
            Discover amazing products at unbeatable prices
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              backgroundColor: '#fff',
              color: '#ff6b35',
              '&:hover': { backgroundColor: '#f5f5f5' },
              mt: 2,
            }}
          >
            Shop Now
          </Button>
        </Container>
      </Paper>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
          Featured Products
        </Typography>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={3}>
            {featuredProducts.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}

        <Box textAlign="center" mt={4}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/products')}
          >
            View All Products
          </Button>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default Home;