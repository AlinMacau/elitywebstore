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
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    try {
      await addToCart(product.id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF',
        transition: 'all 0.3s ease',
        border: '1px solid #f0f0f0',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 16px 40px rgba(53, 169, 246, 0.15)',
          borderColor: '#35A9F6',
        },
      }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      {/* Image */}
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.imageUrl || '/placeholder-product.png'}
          alt={product.name}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
          }}
        />
        {/* Stock Badge - Pink */}
        {product.stock <= 5 && product.stock > 0 && (
          <Chip
            label={`Only ${product.stock} left!`}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: '#DD438A',
              color: '#FFFFFF',
              fontWeight: 'bold',
            }}
          />
        )}
        {/* New Badge - Blue */}
        {product.isNew && (
          <Chip
            label="NEW"
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              backgroundColor: '#35A9F6',
              color: '#FFFFFF',
              fontWeight: 'bold',
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2" 
          noWrap
          sx={{ fontWeight: 600, color: '#2D2D2D' }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            mb: 2,
            minHeight: 40,
          }}
        >
          {product.description}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          {/* Price - Bright Blue */}
          <Typography
            variant="h5"
            sx={{
              color: '#35A9F6',
              fontWeight: 'bold',
              mb: 1.5,
            }}
          >
            ${product.price?.toFixed(2)}
          </Typography>

          {/* Add to Cart Button - Pink */}
          {product.stock > 0 ? (
            <Button
              variant="contained"
              fullWidth
              startIcon={<ShoppingCartIcon />}
              onClick={handleAddToCart}
              sx={{
                backgroundColor: '#DD438A',
                color: '#FFFFFF',
                fontWeight: 600,
                py: 1,
                '&:hover': {
                  backgroundColor: '#B8306E',
                  boxShadow: '0 4px 15px rgba(221, 67, 138, 0.4)',
                },
              }}
            >
              Add to Cart
            </Button>
          ) : (
            <Chip
              label="Out of Stock"
              sx={{ 
                width: '100%', 
                backgroundColor: '#f5f5f5',
                color: '#999',
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;