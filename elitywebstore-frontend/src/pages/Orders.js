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

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrdersByUserId(user.sub);
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
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