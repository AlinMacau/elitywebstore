import React, { useEffect, useState, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
  Paper,
} from '@mui/material';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import ProductList from '../components/product/ProductList';
import ProductFilter from '../components/product/ProductFilter';
import LoadingSpinner from '../components/common/LoadingSpinner';
import productService from '../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchQuery) => {
    setFilters({ ...filters, search: searchQuery });
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ backgroundColor: '#FAFAFA' }}>
      <Navbar onSearch={handleSearch} />
      
      {/* Page Header - Blue accent */}
      <Paper
        sx={{
          backgroundColor: '#FFFFFF',
          py: 4,
          mb: 3,
          borderBottom: '3px solid #35A9F6',
          borderRadius: 0,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box 
              sx={{ 
                width: 5, 
                height: 35, 
                backgroundColor: '#DD438A', 
                borderRadius: 2,
                mr: 2,
              }} 
            />
            <Typography 
              variant="h4" 
              fontWeight="bold"
              sx={{ color: '#2D2D2D' }}
            >
              All Products
            </Typography>
          </Box>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Grid container spacing={3}>
          {/* Filter Sidebar */}
          <Grid item xs={12} md={3}>
            <Paper 
              sx={{ 
                p: 2, 
                backgroundColor: '#FFFFFF',
                border: '1px solid #f0f0f0',
              }}
            >
              <ProductFilter onFilter={handleFilter} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            {loading ? (
              <LoadingSpinner />
            ) : products.length > 0 ? (
              <ProductList products={products} />
            ) : (
              <Alert severity="info">No products found</Alert>
            )}
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default Products;