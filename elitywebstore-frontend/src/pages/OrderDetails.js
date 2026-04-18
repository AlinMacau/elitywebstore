import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import BankTransferDetails from '../components/order/BankTransferDetails';
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

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.userId && id) {
      fetchOrder();
    }
  }, [user, id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderByIdForUser(id, user.userId);
      setOrder(data);
      setError('');
    } catch (err) {
      console.error('Error fetching order:', err);
      if (err.response?.status === 403) {
        setError('You do not have permission to view this order.');
      } else if (err.response?.status === 404) {
        setError('Order not found.');
      } else {
        setError('Failed to load order details.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
          <Alert severity="warning">Please log in to view order details.</Alert>
          <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
            Go to Login
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')}>
            Back to Orders
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (!order) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
          <Alert severity="info">Order not found.</Alert>
          <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} sx={{ mt: 2 }}>
            Back to Orders
          </Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  const orderItems = order.orderItems || [];

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} sx={{ mb: 3 }}>
          Back to Orders
        </Button>

        {/* Order Header */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Order #{order.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Placed on{' '}
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : order.date
                  ? new Date(order.date).toLocaleDateString()
                  : 'N/A'}
              </Typography>
            </Box>
            <Box display="flex" gap={2} alignItems="center">
              <Box textAlign="right">
                <Typography variant="caption" color="text.secondary">
                  Order Status
                </Typography>
                <Box>
                  <Chip label={order.status} color={getStatusColor(order.status)} />
                </Box>
              </Box>
              <Box textAlign="right">
                <Typography variant="caption" color="text.secondary">
                  Payment Status
                </Typography>
                <Box>
                  <PaymentStatusChip status={order.paymentStatus} size="medium" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Bank Transfer Details - Show if payment method is BANK_TRANSFER and not yet paid */}
        {order.paymentMethod === 'BANK_TRANSFER' && order.paymentStatus !== 'PAID' && (
          <BankTransferDetails order={order} />
        )}

        {/* Cash on Delivery Notice */}
        {order.paymentMethod === 'CASH_ON_DELIVERY' && order.paymentStatus !== 'PAID' && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <strong>Cash/Card on Delivery:</strong> You will pay{' '}
            <strong>${order.price?.toFixed(2)}</strong> when your order arrives.
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Order Items */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Order Items ({orderItems.length})
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell><strong>Product</strong></TableCell>
                      <TableCell align="center"><strong>Quantity</strong></TableCell>
                      <TableCell align="right"><strong>Unit Price</strong></TableCell>
                      <TableCell align="right"><strong>Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            {item.productImageUrl && (
                              <img
                                src={item.productImageUrl}
                                alt={item.productName}
                                style={{
                                  width: 50,
                                  height: 50,
                                  objectFit: 'cover',
                                  borderRadius: 4,
                                }}
                              />
                            )}
                            <Typography variant="body2">{item.productName}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">${item.unitPrice?.toFixed(2)}</TableCell>
                        <TableCell align="right">
                          <Typography fontWeight="bold">${item.lineTotal?.toFixed(2)}</Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            {/* Addresses */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">
                    📦 Shipping Address
                  </Typography>
                  {order.shippingAddress ? (
                    <Box>
                      <Typography variant="body2">{order.shippingAddress.street}</Typography>
                      <Typography variant="body2">
                        {order.shippingAddress.city}, {order.shippingAddress.county}
                      </Typography>
                      <Typography variant="body2">{order.shippingAddress.postalCode}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No shipping address
                    </Typography>
                  )}
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" gutterBottom fontWeight="bold" color="secondary">
                    💳 Billing Address
                  </Typography>
                  {order.billingAddress ? (
                    <Box>
                      <Typography variant="body2">{order.billingAddress.street}</Typography>
                      <Typography variant="body2">
                        {order.billingAddress.city}, {order.billingAddress.county}
                      </Typography>
                      <Typography variant="body2">{order.billingAddress.postalCode}</Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Same as shipping address
                    </Typography>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column - Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Order Summary
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Payment Method */}
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary">
                  Payment Method
                </Typography>
                <Box mt={0.5}>
                  <PaymentMethodDisplay
                    paymentMethod={order.paymentMethod}
                    displayName={order.paymentMethodDisplayName}
                    showIcon
                  />
                </Box>
              </Box>

              {/* Delivery Method */}
              <Box mb={2}>
                <Typography variant="caption" color="text.secondary">
                  Delivery Method
                </Typography>
                <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                  <LocalShippingIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {order.deliveryMethodDisplayName || order.deliveryMethod || 'Standard'}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Price Breakdown */}
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">${order.productsTotal?.toFixed(2) || '0.00'}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Delivery:</Typography>
                <Typography
                  variant="body2"
                  color={order.deliveryCost === 0 ? 'success.main' : 'text.primary'}
                >
                  {order.deliveryCost === 0 ? 'Free' : `${order.deliveryCost?.toFixed(2)}`}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box display="flex" justifyContent="space-between">
                <Typography variant="h6" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ${order.price?.toFixed(2) || '0.00'}
                </Typography>
              </Box>

              {/* Timeline */}
              {(order.createdAt || order.updatedAt) && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="caption" color="text.secondary" display="block">
                    Created: {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
                  </Typography>
                  {order.updatedAt && order.updatedAt !== order.createdAt && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Updated: {new Date(order.updatedAt).toLocaleString()}
                    </Typography>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default OrderDetails;