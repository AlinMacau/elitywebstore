import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const OrderCard = ({ order }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'PROCESSING':
        return 'info';
      case 'SHIPPED':
        return 'primary';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
          <Box>
            <Typography variant="h6">Order #{order.id}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(order.date).toLocaleDateString()}
            </Typography>
          </Box>
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
            size="small"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {order.products?.length} item(s)
        </Typography>

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
          <Typography variant="h6" color="primary">
            ${order.price?.toFixed(2)}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/account/orders/${order.id}`)}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrderCard;