import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Alert,
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

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAllProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSearch = (searchQuery) => {
    setFilters({ ...filters, search: searchQuery });
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar onSearch={handleSearch} />
      
      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
          All Products
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <ProductFilter onFilter={handleFilter} />
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