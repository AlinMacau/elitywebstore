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
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ backgroundColor: '#FFFFFF' }}>
      <Navbar />
      
      {/* Hero Section - Bright Blue Background */}
      <Paper
        sx={{
          backgroundColor: '#35A9F6', // Bright Blue
          color: '#FFFFFF',
          py: 10,
          mb: 4,
          borderRadius: 0,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(53, 169, 246, 0.3)',
        }}
      >
        {/* Decorative Pink Circle */}
        <Box
          sx={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: '50%',
            backgroundColor: '#DD438A',
            opacity: 0.2,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -80,
            left: -80,
            width: 250,
            height: 250,
            borderRadius: '50%',
            backgroundColor: '#DD438A',
            opacity: 0.15,
          }}
        />
        {/* White decorative element */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: '10%',
            width: 100,
            height: 100,
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            opacity: 0.1,
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{ textShadow: '2px 2px 8px rgba(0,0,0,0.1)' }}
          >
            Welcome to ElityStore
          </Typography>
          <Typography variant="h5" paragraph sx={{ opacity: 0.95, mb: 3 }}>
            Discover amazing products at unbeatable prices
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              backgroundColor: '#DD438A', // Pink CTA button
              color: '#FFFFFF',
              fontWeight: 'bold',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              '&:hover': { 
                backgroundColor: '#B8306E',
                transform: 'translateY(-3px)',
                boxShadow: '0 8px 25px rgba(221, 67, 138, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Shop Now
          </Button>
        </Container>
      </Paper>

      {/* Featured Products Section - White Background */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        {/* Section Title - Blue */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Box 
            sx={{ 
              width: 5, 
              height: 40, 
              backgroundColor: '#35A9F6', 
              borderRadius: 2,
              mr: 2,
            }} 
          />
          <Typography 
            variant="h4" 
            fontWeight="bold"
            sx={{ color: '#35A9F6' }}
          >
            Featured Products
          </Typography>
          {/* Pink accent dot */}
          <Box 
            sx={{ 
              width: 12, 
              height: 12, 
              backgroundColor: '#DD438A', 
              borderRadius: '50%',
              ml: 2,
            }} 
          />
        </Box>
        
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

        <Box textAlign="center" mt={5}>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/products')}
            sx={{
              borderColor: '#DD438A', // Pink outline
              color: '#DD438A',
              borderWidth: 2,
              px: 4,
              py: 1,
              '&:hover': {
                borderWidth: 2,
                backgroundColor: '#DD438A',
                borderColor: '#DD438A',
                color: '#FFFFFF',
              },
            }}
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