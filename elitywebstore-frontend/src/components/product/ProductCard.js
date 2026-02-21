import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3,
        },
      }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <CardMedia
        component="img"
        height="200"
        image={`https://via.placeholder.com/300x200?text=${product.name}`}
        alt={product.name}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap>
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.description?.substring(0, 100)}...
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color="primary" fontWeight="bold">
            ${product.price?.toFixed(2)}
          </Typography>
          {product.stock > 0 ? (
            <Chip label="In Stock" color="success" size="small" />
          ) : (
            <Chip label="Out of Stock" color="error" size="small" />
          )}
        </Box>
      </CardContent>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          sx={{
            backgroundColor: '#ff6b35',
            '&:hover': { backgroundColor: '#e55a2b' },
          }}
        >
          Add to Cart
        </Button>
      </Box>
    </Card>
  );
};

export default ProductCard;