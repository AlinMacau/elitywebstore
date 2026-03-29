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
import CategoryForm from '../../components/admin/CategoryForm';
import adminCategoryService from '../../services/adminCategoryService';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form dialog state
  const [formOpen, setFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await adminCategoryService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedCategory(null);
    setFormOpen(true);
  };

  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setFormOpen(true);
  };

  const handleDeleteClick = (category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedCategory(null);
  };

  const handleFormSubmit = async (categoryData) => {
    try {
      setFormLoading(true);

      if (selectedCategory) {
        await adminCategoryService.updateCategory(categoryData);
        setSnackbar({
          open: true,
          message: 'Category updated successfully!',
          severity: 'success',
        });
      } else {
        await adminCategoryService.createCategory(categoryData);
        setSnackbar({
          open: true,
          message: 'Category created successfully!',
          severity: 'success',
        });
      }

      handleFormClose();
      fetchCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.response?.data?.error || 'Failed to save category. Please try again.',
        severity: 'error',
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await adminCategoryService.deleteCategory(categoryToDelete.id);
      setSnackbar({
        open: true,
        message: 'Category deleted successfully!',
        severity: 'success',
      });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to delete category. Please try again.',
        severity: 'error',
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  const handleReactivate = async (category) => {
    try {
      await adminCategoryService.reactivateCategory(category.id);
      setSnackbar({
        open: true,
        message: 'Category reactivated successfully!',
        severity: 'success',
      });
      fetchCategories();
    } catch (err) {
      console.error('Error reactivating category:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to reactivate category.',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
            Category Management
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
            Add Category
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : categories.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No categories found. Click "Add Category" to create one.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Description</strong></TableCell>
                  <TableCell align="center"><strong>Products</strong></TableCell>
                  <TableCell align="center"><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category) => (
                  <TableRow
                    key={category.id}
                    hover
                    sx={{
                      opacity: category.active === false ? 0.6 : 1,
                      backgroundColor: category.active === false ? '#fafafa' : 'inherit',
                    }}
                  >
                    <TableCell>{category.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight="medium">
                        {category.name}
                        {category.active === false && (
                          <Typography
                            component="span"
                            variant="caption"
                            sx={{ ml: 1, color: 'error.main' }}
                          >
                            (Deleted)
                          </Typography>
                        )}
                      </Typography>
                    </TableCell>
                    <TableCell>
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
                        {category.description || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={category.productCount || 0}
                        size="small"
                        color={category.productCount > 0 ? 'primary' : 'default'}
                        variant={category.productCount > 0 ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={getStatusLabel(category.active)}
                        size="small"
                        color={getStatusColor(category.active)}
                        variant={category.active === false ? 'outlined' : 'filled'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      {category.active === false ? (
                        <IconButton
                          color="success"
                          onClick={() => handleReactivate(category)}
                          size="small"
                          title="Reactivate Category"
                        >
                          <RestoreIcon />
                        </IconButton>
                      ) : (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(category)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(category)}
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

      {/* Category Form Dialog */}
      <CategoryForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        category={selectedCategory}
        loading={formLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{categoryToDelete?.name}"?
          </DialogContentText>
          {categoryToDelete?.productCount > 0 && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              This category has {categoryToDelete.productCount} product(s). It will be deactivated instead of permanently deleted.
            </Alert>
          )}
          {(!categoryToDelete?.productCount || categoryToDelete?.productCount === 0) && (
            <Alert severity="info" sx={{ mt: 2 }}>
              This category has no products and will be permanently deleted.
            </Alert>
          )}
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

export default CategoryManagement;