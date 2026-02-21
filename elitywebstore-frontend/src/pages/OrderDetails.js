import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import orderService from '../services/orderService';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(id);
      setOrder(data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container sx={{ my: 4 }}>
          <Typography>Order not found</Typography>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      <Container maxWidth="md" sx={{ my: 4, flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            Order #{order.id}
          </Typography>
          <Chip
            label={order.status}
            color={getStatusColor(order.status)}
          />
        </Box>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Information
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Order Date
              </Typography>
              <Typography variant="body1">
                {new Date(order.date).toLocaleDateString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Total Amount
              </Typography>
              <Typography variant="body1" fontWeight="bold" color="primary">
                ${order.price?.toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {order.deliveryAddress && (
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Delivery Address
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1">{order.deliveryAddress.street}</Typography>
            <Typography variant="body1">
              {order.deliveryAddress.city}, {order.deliveryAddress.county}
            </Typography>
            <Typography variant="body1">{order.deliveryAddress.postalCode}</Typography>
          </Paper>
        )}

        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Items
          </Typography>
          <Divider sx={{ my: 2 }} />
          {order.products?.map((product) => (
            <Box
              key={product.id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={2}
              borderBottom="1px solid #f0f0f0"
            >
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description?.substring(0, 50)}...
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight="bold">
                ${product.price?.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default OrderDetails;