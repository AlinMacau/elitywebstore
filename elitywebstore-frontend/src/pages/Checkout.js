import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AddressCard from '../components/address/AddressCard';
import AddressForm from '../components/address/AddressForm';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import addressService from '../services/addressService';
import orderService from '../services/orderService';

const steps = ['Select Address', 'Review Order', 'Confirmation'];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    if (!user?.userId) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await addressService.getAllByUserId(user.userId);
      setAddresses(data);
      setError('');
    } catch (error) {
      console.error('Error fetching addresses:', error);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !selectedAddress) {
      setError('Please select a delivery address');
      return;
    }
    setError('');
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePlaceOrder = async () => {
    console.log('=== CHECKPOINT 1: handlePlaceOrder called ===');
    
    if (!user?.userId || !selectedAddress?.id) {
      setError('Missing user or address information');
      return;
    }

    if (!cart || cart.products?.length === 0) {
      setError('Your cart is empty');
      return;
    }

    console.log('=== CHECKPOINT 2: Validations passed ===');
    console.log('user.userId:', user.userId, 'type:', typeof user.userId);
    console.log('selectedAddress.id:', selectedAddress.id, 'type:', typeof selectedAddress.id);

    try {
      setLoading(true);
      setError('');

      // ✅ Create proper order data object
      const orderData = {
        userId: Number(user.userId),
        addressId: Number(selectedAddress.id),
      };

      console.log('=== CHECKPOINT 3: orderData created ===');
      console.log('orderData:', orderData);
      console.log('typeof orderData:', typeof orderData);
      console.log('JSON.stringify(orderData):', JSON.stringify(orderData));

      console.log('=== CHECKPOINT 4: About to call orderService.createOrder ===');
      const order = await orderService.createOrder(orderData);
      
      console.log('=== CHECKPOINT 5: Order created successfully ===');
      console.log('Order:', order);

      await clearCart();
      setActiveStep(2);
      setError('');
    } catch (error) {
      console.error('=== CHECKPOINT 6: Error occurred ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      setError(error.response?.data?.message || error.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (addressData) => {
    if (!user?.userId) {
      setError('User not authenticated');
      return;
    }

    try {
      const dataWithUserId = {
        ...addressData,
        userId: user.userId,
      };
      await addressService.create(dataWithUserId);
      await fetchAddresses();
      setShowAddressForm(false);
      setError('');
    } catch (error) {
      console.error('Error adding address:', error);
      setError('Failed to add address');
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6">Select Delivery Address</Typography>
              <Button
                variant="outlined"
                onClick={() => setShowAddressForm(true)}
              >
                Add New Address
              </Button>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : addresses.length > 0 ? (
              <Grid container spacing={2}>
                {addresses.map((address) => (
                  <Grid item xs={12} md={6} key={address.id}>
                    <AddressCard
                      address={address}
                      selectable
                      selected={selectedAddress?.id === address.id}
                      onSelect={setSelectedAddress}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Alert severity="info">
                No addresses found. Please add a delivery address.
              </Alert>
            )}

            <AddressForm
              open={showAddressForm}
              onClose={() => setShowAddressForm(false)}
              onSubmit={handleAddAddress}
            />
          </Box>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Review Your Order
            </Typography>

            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Delivery Address
              </Typography>
              {selectedAddress && (
                <Box>
                  <Typography variant="body2">{selectedAddress.street}</Typography>
                  <Typography variant="body2">
                    {selectedAddress.city}, {selectedAddress.county}
                  </Typography>
                  <Typography variant="body2">{selectedAddress.postalCode}</Typography>
                </Box>
              )}
            </Paper>

            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Order Items ({cart?.products?.length || 0})
              </Typography>
              {cart?.products?.map((product) => (
                <Box
                  key={product.id}
                  display="flex"
                  justifyContent="space-between"
                  py={1}
                >
                  <Typography>{product.name}</Typography>
                  <Typography fontWeight="bold">${product.price?.toFixed(2)}</Typography>
                </Box>
              ))}
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Subtotal:</Typography>
                <Typography>${cart?.productsPrice?.toFixed(2) || '0.00'}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography>Shipping:</Typography>
                <Typography>Free</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={2}>
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6" color="primary">
                  ${cart?.productsPrice?.toFixed(2) || '0.00'}
                </Typography>
              </Box>
            </Paper>
          </Box>
        );

      case 2:
        return (
          <Box textAlign="center" py={4}>
            <Typography variant="h5" color="success.main" gutterBottom>
              Order Placed Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Thank you for your order. You will receive a confirmation email shortly.
            </Typography>
            <Box mt={4}>
              <Button
                variant="contained"
                onClick={() => navigate('/orders')}
                sx={{ mr: 2, backgroundColor: '#ff6b35' }}
              >
                View Orders
              </Button>
              <Button variant="outlined" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  if (!user) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container maxWidth="md" sx={{ my: 4, flexGrow: 1 }}>
          <Alert severity="warning">
            Please log in to proceed with checkout.
          </Alert>
          <Button
            variant="contained"
            onClick={() => navigate('/login')}
            sx={{ mt: 2 }}
          >
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

      <Container maxWidth="md" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3, mb: 3 }}>
          {renderStepContent(activeStep)}
        </Paper>

        {activeStep < 2 && (
          <Box display="flex" justifyContent="space-between">
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={activeStep === 1 ? handlePlaceOrder : handleNext}
              disabled={loading}
              sx={{ backgroundColor: '#ff6b35' }}
            >
              {loading ? <CircularProgress size={24} /> : activeStep === 1 ? 'Place Order' : 'Next'}
            </Button>
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default Checkout;