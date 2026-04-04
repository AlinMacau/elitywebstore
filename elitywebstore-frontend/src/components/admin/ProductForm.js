import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
  CircularProgress,
  Grid,
  Typography,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import categoryService from '../../services/categoryService';

const DEFAULT_IMAGE = '/placeholder-product.png';

const ProductForm = ({ open, onClose, onSubmit, product, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
    imageUrl: '',
  });
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(DEFAULT_IMAGE);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price?.toString() || '',
        stock: product.stock?.toString() || '',
        categoryId: product.categoryId?.toString() || '',
        imageUrl: product.imageUrl || '',
      });
      setImagePreview(product.imageUrl || DEFAULT_IMAGE);
      setImageError(false);
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        imageUrl: '',
      });
      setImagePreview(DEFAULT_IMAGE);
      setImageError(false);
    }
    setError(null);
  }, [product, open]);

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);

    // Update image preview when imageUrl changes
    if (name === 'imageUrl') {
      if (value.trim()) {
        setImagePreview(value.trim());
        setImageError(false);
      } else {
        setImagePreview(DEFAULT_IMAGE);
        setImageError(false);
      }
    }
  };

  const handleImageLoadError = () => {
    setImageError(true);
    setImagePreview(DEFAULT_IMAGE);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError('Stock cannot be negative');
      return false;
    }
    if (!formData.categoryId) {
      setError('Please select a category');
      return false;
    }
    // Validate image URL format if provided
    if (formData.imageUrl.trim()) {
      try {
        new URL(formData.imageUrl.trim());
      } catch {
        setError('Please enter a valid image URL');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      categoryId: parseInt(formData.categoryId),
      imageUrl: formData.imageUrl.trim() || null,
    };

    if (product) {
      submitData.id = product.id;
    }

    onSubmit(submitData);
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
      imageUrl: '',
    });
    setError(null);
    setImagePreview(DEFAULT_IMAGE);
    setImageError(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {product ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Image Preview Section */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  width: '100%',
                  height: 200,
                  border: '2px dashed #ddd',
                  borderRadius: 2,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#fafafa',
                  position: 'relative',
                }}
              >
                {imagePreview === DEFAULT_IMAGE && !formData.imageUrl ? (
                  <Box sx={{ textAlign: 'center', color: '#999' }}>
                    <ImageIcon sx={{ fontSize: 48, mb: 1 }} />
                    <Typography variant="body2">
                      Image Preview
                    </Typography>
                  </Box>
                ) : (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    onError={handleImageLoadError}
                    onLoad={handleImageLoad}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                )}
              </Box>
              {imageError && formData.imageUrl && (
                <Alert severity="warning" sx={{ mt: 1 }}>
                  Could not load image. Please check the URL.
                </Alert>
              )}
            </Grid>

            {/* Form Fields Section */}
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                margin="normal"
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                autoFocus
              />

              <TextField
                fullWidth
                margin="normal"
                label="Image URL"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                helperText="Enter a direct link to the product image (optional)"
              />

              <TextField
                fullWidth
                margin="normal"
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            {/* Price, Stock, Category Row */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 0.01, step: 0.01 }}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  inputProps={{ min: 0 }}
                />

                <TextField
                  select
                  fullWidth
                  margin="normal"
                  label="Category"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  disabled={categoriesLoading}
                >
                  {categoriesLoading ? (
                    <MenuItem disabled>Loading categories...</MenuItem>
                  ) : categories.length === 0 ? (
                    <MenuItem disabled>No categories available</MenuItem>
                  ) : (
                    categories.map((category) => (
                      <MenuItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || categoriesLoading}
            sx={{
              backgroundColor: '#ff6b35',
              '&:hover': { backgroundColor: '#e55a2b' },
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: '#fff' }} />
            ) : product ? (
              'Update Product'
            ) : (
              'Create Product'
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProductForm;