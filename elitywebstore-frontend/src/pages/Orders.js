import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import PaymentStatusChip from '../components/order/PaymentStatusChip';
import PaymentMethodDisplay from '../components/order/PaymentMethodDisplay';
import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/orderService';
  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'PROCESSING':
        return 'info';
      case 'SENT':
        return 'primary';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.userId) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrdersByUserId(user.userId);
      setOrders(data);
      setError('');
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  if (!user) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
          <Alert severity="warning">Please log in to view your orders.</Alert>
          <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
            Go to Login
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          My Orders
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : orders.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No orders yet
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Start shopping to see your orders here.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
              sx={{ backgroundColor: '#ff6b35' }}
            >
              Browse Products
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>Order #</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Items</strong></TableCell>
                  <TableCell><strong>Total</strong></TableCell>
                  <TableCell><strong>Payment</strong></TableCell>
                  <TableCell><strong>Payment Status</strong></TableCell>
                  <TableCell><strong>Order Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => handleViewOrder(order.id)}
                  >
                    <TableCell>
                      <Typography fontWeight="bold">#{order.id}</Typography>
                    </TableCell>
                    <TableCell>
                      {order.date
                        ? new Date(order.date).toLocaleDateString()
                        : order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {order.orderItems?.length || order.products?.length || 0} item(s)
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight="bold" color="primary">
                        ${order.price?.toFixed(2) || '0.00'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <PaymentMethodDisplay
                        paymentMethod={order.paymentMethod}
                        displayName={order.paymentMethodDisplayName}
                        variant="chip"
                      />
                    </TableCell>
                    <TableCell>
                      <PaymentStatusChip status={order.paymentStatus} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOrder(order.id);
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default Orders;