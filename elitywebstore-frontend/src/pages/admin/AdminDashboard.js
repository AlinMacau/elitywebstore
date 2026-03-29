import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as OrdersIcon,
  AttachMoney as RevenueIcon,
  Warning as WarningIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import adminDashboardService from '../../services/adminDashboardService';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await adminDashboardService.getDashboardStats();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'ACCEPTED':
        return 'info';
      case 'PAID':
        return 'primary';
      case 'SENT':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" fontWeight="bold" color={color || 'text.primary'}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              backgroundColor: 'grey.100',
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Admin Dashboard
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : stats ? (
          <>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={<PeopleIcon sx={{ color: '#ff6b35', fontSize: 32 }} />}
                  color="#ff6b35"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Products"
                  value={stats.totalProducts}
                  icon={<InventoryIcon sx={{ color: '#2c3e50', fontSize: 32 }} />}
                  color="#2c3e50"
                  subtitle={`${stats.activeProducts} active`}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Orders"
                  value={stats.totalOrders}
                  icon={<OrdersIcon sx={{ color: '#3498db', fontSize: 32 }} />}
                  color="#3498db"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Revenue"
                  value={formatPrice(stats.totalRevenue)}
                  icon={<RevenueIcon sx={{ color: '#27ae60', fontSize: 32 }} />}
                  color="#27ae60"
                />
              </Grid>
            </Grid>

            {/* Alert Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <Card sx={{ backgroundColor: '#fff3e0', border: '1px solid #ffb74d' }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <PendingIcon sx={{ color: '#f57c00', fontSize: 40 }} />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h5" fontWeight="bold" color="#e65100">
                          {stats.pendingOrders} Pending Orders
                        </Typography>
                        <Typography variant="body2" color="#e65100">
                          Orders waiting to be processed
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        sx={{ backgroundColor: '#f57c00', '&:hover': { backgroundColor: '#e65100' } }}
                        onClick={() => navigate('/admin/orders')}
                      >
                        View Orders
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card
                  sx={{
                    backgroundColor: stats.outOfStockProducts > 0 ? '#ffebee' : '#e8f5e9',
                    border: `1px solid ${stats.outOfStockProducts > 0 ? '#ef5350' : '#66bb6a'}`,
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <WarningIcon
                        sx={{
                          color: stats.outOfStockProducts > 0 ? '#c62828' : '#2e7d32',
                          fontSize: 40,
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h5"
                          fontWeight="bold"
                          color={stats.outOfStockProducts > 0 ? '#c62828' : '#2e7d32'}
                        >
                          {stats.outOfStockProducts} Out of Stock
                        </Typography>
                        <Typography
                          variant="body2"
                          color={stats.outOfStockProducts > 0 ? '#c62828' : '#2e7d32'}
                        >
                          {stats.outOfStockProducts > 0
                            ? 'Products need restocking'
                            : 'All products in stock'}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: stats.outOfStockProducts > 0 ? '#c62828' : '#2e7d32',
                          '&:hover': {
                            backgroundColor: stats.outOfStockProducts > 0 ? '#b71c1c' : '#1b5e20',
                          },
                        }}
                        onClick={() => navigate('/admin/products')}
                      >
                        View Products
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Orders */}
            <Paper sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Orders
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/admin/orders')}
                  sx={{ borderColor: '#ff6b35', color: '#ff6b35' }}
                >
                  View All Orders
                </Button>
              </Box>

              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        <TableCell><strong>Order ID</strong></TableCell>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Customer</strong></TableCell>
                        <TableCell align="right"><strong>Total</strong></TableCell>
                        <TableCell align="center"><strong>Status</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recentOrders.map((order) => (
                        <TableRow key={order.id} hover>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{formatDate(order.date)}</TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {order.userName || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.userEmail}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">{formatPrice(order.price)}</TableCell>
                          <TableCell align="center">
                            <Chip
                              label={order.status}
                              size="small"
                              color={getStatusColor(order.status)}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={3}>
                  No recent orders
                </Typography>
              )}
            </Paper>

            {/* Quick Links */}
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/admin/products')}
                  sx={{
                    py: 2,
                    borderColor: '#ff6b35',
                    color: '#ff6b35',
                    '&:hover': { borderColor: '#e55a2b', backgroundColor: 'rgba(255, 107, 53, 0.04)' },
                  }}
                >
                  Manage Products
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/admin/categories')}
                  sx={{
                    py: 2,
                    borderColor: '#ff6b35',
                    color: '#ff6b35',
                    '&:hover': { borderColor: '#e55a2b', backgroundColor: 'rgba(255, 107, 53, 0.04)' },
                  }}
                >
                  Manage Categories
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/admin/orders')}
                  sx={{
                    py: 2,
                    borderColor: '#ff6b35',
                    color: '#ff6b35',
                    '&:hover': { borderColor: '#e55a2b', backgroundColor: 'rgba(255, 107, 53, 0.04)' },
                  }}
                >
                  Manage Orders
                </Button>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/admin/users')}
                  sx={{
                    py: 2,
                    borderColor: '#ff6b35',
                    color: '#ff6b35',
                    '&:hover': { borderColor: '#e55a2b', backgroundColor: 'rgba(255, 107, 53, 0.04)' },
                  }}
                >
                  Manage Users
                </Button>
              </Grid>
            </Grid>
          </>
        ) : null}
      </Container>

      <Footer />
    </Box>
  );
};

export default AdminDashboard;