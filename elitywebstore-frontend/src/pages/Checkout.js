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
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AddressCard from '../components/address/AddressCard';
import AddressForm from '../components/address/AddressForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
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
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await addressService.getAllByUserId(user.sub);
      setAddresses(data);
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
    try {
      setLoading(true);
      await orderService.createOrder(user.sub, selectedAddress.id);
      setActiveStep(2);
    } catch (error) {
      console.error('Error placing order:', error);
      setError('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (addressData) => {
    try {
      await addressService.create(addressData);
      await fetchAddresses();
      setShowAddressForm(false);
    } catch (error) {
      console.error('Error adding address:', error);
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
              <LoadingSpinner />
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
              userId={user.sub}
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
                onClick={() => navigate('/account/orders')}
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
              sx={{ backgroundColor: '#ff6b35' }}
            >
              {activeStep === 1 ? 'Place Order' : 'Next'}
            </Button>
          </Box>
        )}
      </Container>

      <Footer />
    </Box>
  );
};

export default Checkout;