import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const CartItem = ({ product, onRemove }) => {
  return (
    <Card sx={{ display: 'flex', mb: 2 }}>
      <CardMedia
        component="img"
        sx={{ width: 120 }}
        image={`https://via.placeholder.com/120?text=${product.name}`}
        alt={product.name}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h6">
            {product.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            {product.description?.substring(0, 50)}...
          </Typography>
          <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
            ${product.price?.toFixed(2)}
          </Typography>
        </CardContent>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', pr: 2 }}>
        <IconButton onClick={() => onRemove(product.id)} color="error">
          <Delete />
        </IconButton>
      </Box>
    </Card>
  );
};

export default CartItem;