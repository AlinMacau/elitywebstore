import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Restore as RestoreIcon,
} from '@mui/icons-material';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProductForm from '../../components/admin/ProductForm';
import adminProductService from '../../services/adminProductService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminProductService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedProduct(null);
    setFormOpen(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedProduct(null);
  };

  const handleFormSubmit = async (productData) => {
    try {
      setFormLoading(true);
      
      if (selectedProduct) {
        await adminProductService.updateProduct(productData);
        setSnackbar({
          open: true,
          message: 'Product updated successfully!',
          severity: 'success',
        });
      } else {
        await adminProductService.createProduct(productData);
        setSnackbar({
          open: true,
          message: 'Product created successfully!',
          severity: 'success',
        });
      }
      
      handleFormClose();
      fetchProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to save product. Please try again.',
        severity: 'error',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    
    try {
      await adminProductService.deleteProduct(productToDelete.id);
      setSnackbar({
        open: true,
        message: 'Product deleted successfully!',
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to delete product. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleReactivate = async (product) => {
    try {
      await adminProductService.reactivateProduct(product.id);
      setSnackbar({
        open: true,
        message: 'Product reactivated successfully!',
        severity: 'success',
      });
      fetchProducts();
    } catch (err) {
      console.error('Error reactivating product:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to reactivate product.',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStockColor = (stock) => {
    if (stock === 0) return 'error';
    if (stock < 10) return 'warning';
    return 'success';
  };

  const getStatusColor = (active) => {
    return active === false ? 'error' : 'success';
  };

  const getStatusLabel = (active) => {
    return active === false ? 'Inactive' : 'Active';
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      
      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Product Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
            sx={{
              backgroundColor: '#ff6b35',
              '&:hover': { backgroundColor: '#e55a2b' },
            }}
          >
            Add Product
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No products found. Click "Add Product" to create one.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Category</strong></TableCell>
                  <TableCell align="right"><strong>Price</strong></TableCell>
                  <TableCell align="center"><strong>Stock</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product) => (
                  <TableRow 
                    key={product.id} 
                    hover
                    sx={{
                      opacity: product.active === false ? 0.6 : 1,
                      backgroundColor: product.active === false ? '#fafafa' : 'inherit',
                    }}
                  >
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {product.name}
                        {product.active === false && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ ml: 1, color: 'error.main' }}
                          >
                            (Deleted)
                          </Typography>
                        )}
                      </Typography>
                      {product.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            maxWidth: 300,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.description}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.categoryName || 'Uncategorized'}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatPrice(product.price)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={product.stock}
                        size="small"
                        color={getStockColor(product.stock)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusLabel(product.active)}
                        size="small"
                        color={getStatusColor(product.active)}
                        variant={product.active === false ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {product.active === false ? (
                        <IconButton
                          color="success"
                          onClick={() => handleReactivate(product)}
                          size="small"
                          title="Reactivate Product"
                        >
                          <RestoreIcon />
                        </IconButton>
                      ) : (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(product)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(product)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* Product Form Dialog */}
      <ProductForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        product={selectedProduct}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{productToDelete?.name}"?
          </DialogContentText>
          <Alert severity="info" sx={{ mt: 2 }}>
            If this product has been ordered, it will be deactivated instead of permanently deleted.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default ProductManagement;