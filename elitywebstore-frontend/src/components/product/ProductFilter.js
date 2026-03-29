import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Button,
  CircularProgress,
} from '@mui/material';
import categoryService from '../../services/categoryService';

const ProductFilter = ({ onFilter }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAllCategories();
      console.log('Categories fetched:', data); // Debug log
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleApplyFilters = () => {
    onFilter({
      categoryId: selectedCategory || null,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, 500]);
    onFilter({});
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Filters
      </Typography>

      {/* Category Filter */}
      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
          Category
        </FormLabel>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : (
          <RadioGroup value={selectedCategory} onChange={handleCategoryChange}>
            <FormControlLabel value="" control={<Radio />} label="All Categories" />
            {categories.length > 0 ? (
              categories.map((category) => (
                <FormControlLabel
                  key={category.id}
                  value={category.id.toString()}
                  control={<Radio />}
                  label={category.name}
                />
              ))
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
                No categories available
              </Typography>
            )}
          </RadioGroup>
        )}
      </FormControl>

      {/* Price Range Filter */}
      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend" sx={{ mb: 2, fontWeight: 'bold' }}>
          Price Range
        </FormLabel>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={500}
          sx={{ mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          ${priceRange[0]} - ${priceRange[1]}
        </Typography>
      </FormControl>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button variant="contained" onClick={handleApplyFilters} fullWidth>
          Apply Filters
        </Button>
        <Button variant="outlined" onClick={handleClearFilters} fullWidth>
          Clear Filters
        </Button>
      </Box>
    </Box>
  );
};

export default ProductFilter;