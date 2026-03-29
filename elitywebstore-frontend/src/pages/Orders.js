import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import OrderCard from '../components/order/OrderCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/orderService';

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.userId) {
      setError('Please log in to view your orders');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching orders for userId:', user.userId);
      const data = await orderService.getOrdersByUserId(user.userId);
      console.log('Orders fetched:', data);
      setOrders(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      <Container maxWidth="md" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
          My Orders
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : orders.length > 0 ? (
          orders.map((order) => <OrderCard key={order.id} order={order} />)
        ) : (
          <Alert severity="info">You haven't placed any orders yet.</Alert>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default Orders;