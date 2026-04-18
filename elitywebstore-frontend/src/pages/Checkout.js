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
  FormControlLabel,
  Checkbox,
  Divider,
  Radio,
  RadioGroup,
  FormControl,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AddressCard from '../components/address/AddressCard';
import AddressForm from '../components/address/AddressForm';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import addressService from '../services/addressService';
import orderService from '../services/orderService';
import { PAYMENT_METHODS } from '../constants/paymentMethods';

const steps = ['Address & Delivery', 'Payment Method', 'Review Order', 'Confirmation'];

const DELIVERY_METHODS = [
  {
    id: 'SAMEDAY_EASYBOX',
    name: 'Sameday Easybox',
    description: 'Easybox location selected by us',
    cost: 0,
    icon: <Inventory2Icon />,
    isFree: true,
  },
  {
    id: 'FAN_COURIER',
    name: 'Fan Courier',
    description: 'Delivery to your address',
    cost: 20,
    icon: <LocalShippingIcon />,
    isFree: false,
  },
  {
    id: 'SAMEDAY_COURIER',
    name: 'Sameday Courier',
    description: 'Delivery to your address',
    cost: 20,
    icon: <LocalShippingIcon />,
    isFree: false,
  },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [activeStep, setActiveStep] = useState(1);

  const [shippingAddresses, setShippingAddresses] = useState([]);
  const [billingAddresses, setBillingAddresses] = useState([]);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState(null);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [selectedDeliveryMethod, setSelectedDeliveryMethod] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [createdOrder, setCreatedOrder] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressFormType, setAddressFormType] = useState('SHIPPING');
  const [editingAddress, setEditingAddress] = useState(null);

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
      const allAddresses = await addressService.getAllByUserId(user.userId);
      setShippingAddresses(allAddresses.filter((addr) => addr.addressType === 'SHIPPING'));
      setBillingAddresses(allAddresses.filter((addr) => addr.addressType === 'BILLING'));
      setError('');
    } catch (err) {
      console.error('Error fetching addresses:', err);
      setError('Failed to load addresses');
    } finally {
      setLoading(false);
    }
  };

  const productsTotal = cart?.productsPrice || 0;
  const deliveryCost = selectedDeliveryMethod
    ? DELIVERY_METHODS.find((m) => m.id === selectedDeliveryMethod)?.cost || 0
    : 0;
  const grandTotal = productsTotal + deliveryCost;

  const handleNext = () => {
    if (activeStep === 1) {
      if (!selectedShippingAddress) {
        setError('Please select a shipping address');
        return;
      }
      if (!billingSameAsShipping && !selectedBillingAddress) {
        setError('Please select a billing address or check "Billing same as shipping"');
        return;
      }
      if (!selectedDeliveryMethod) {
        setError('Please select a delivery method');
        return;
      }
    }
    if (activeStep === 2) {
      if (!selectedPaymentMethod) {
        setError('Please select a payment method');
        return;
      }
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    if (!user?.userId || !selectedShippingAddress?.id) {
      setError('Missing user or shipping address information');
      return;
    }
    if (!billingSameAsShipping && !selectedBillingAddress?.id) {
      setError('Please select a billing address');
      return;
    }
    if (!selectedDeliveryMethod) {
      setError('Please select a delivery method');
      return;
    }
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }
    if (!cart || (cart.items?.length === 0 && cart.products?.length === 0)) {
      setError('Your cart is empty');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const orderData = {
        userId: Number(user.userId),
        shippingAddressId: Number(selectedShippingAddress.id),
        billingAddressId: billingSameAsShipping
          ? Number(selectedShippingAddress.id)
          : Number(selectedBillingAddress.id),
        billingSameAsShipping,
        deliveryMethod: selectedDeliveryMethod,
        paymentMethod: selectedPaymentMethod,
      };

      const order = await orderService.createOrder(orderData);
      setCreatedOrder(order);
      await clearCart();
      setActiveStep(4);
    } catch (err) {
      console.error('Error placing order:', err);
      setError(err.response?.data?.message || err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddressForm = (type) => {
    setAddressFormType(type);
    setShowAddressForm(true);
  };

  const handleAddAddress = async (addressData) => {
    if (!user?.userId) {
      setError('User not authenticated');
      return;
    }
    try {
      await addressService.create({ ...addressData, addressType: addressFormType, userId: user.userId });
      await fetchAddresses();
      setShowAddressForm(false);
      setError('');
    } catch (err) {
      console.error('Error adding address:', err);
      setError('Failed to add address');
    }
  };

  const handleEditAddress = async (addressData) => {
    try {
      await addressService.update({ ...addressData, id: editingAddress.id });
      await fetchAddresses();
      setEditingAddress(null);
      setError('');
    } catch (err) {
      console.error('Error updating address:', err);
      setError('Failed to update address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      await addressService.delete(addressId);
      await fetchAddresses();
      if (selectedShippingAddress?.id === addressId) setSelectedShippingAddress(null);
      if (selectedBillingAddress?.id === addressId) setSelectedBillingAddress(null);
      setError('');
    } catch (err) {
      console.error('Error deleting address:', err);
      setError('Failed to delete address');
    }
  };

  const handleBillingSameAsShippingChange = (e) => {
    setBillingSameAsShipping(e.target.checked);
    if (e.target.checked) setSelectedBillingAddress(null);
  };

  const getSelectedPaymentMethodDetails = () => PAYMENT_METHODS.find((m) => m.id === selectedPaymentMethod);

  // ==================== STEP 1: Address & Delivery ====================
  const renderStep1 = () => (
    <Box>
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" color="primary">📦 Shipping Address</Typography>
          <Button variant="outlined" size="small" onClick={() => handleOpenAddressForm('SHIPPING')}>
            Add Shipping Address
          </Button>
        </Box>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
        ) : shippingAddresses.length > 0 ? (
          <Grid container spacing={2}>
            {shippingAddresses.map((address) => (
              <Grid item xs={12} md={6} key={address.id}>
                <AddressCard
                  address={address}
                  selectable
                  selected={selectedShippingAddress?.id === address.id}
                  onSelect={setSelectedShippingAddress}
                  onEdit={(addr) => setEditingAddress(addr)}
                  onDelete={handleDeleteAddress}
                  showActions
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">No shipping addresses found. Please add a shipping address.</Alert>
        )}
      </Box>

      <Divider sx={{ my: 3 }} />

      <FormControlLabel
        control={<Checkbox checked={billingSameAsShipping} onChange={handleBillingSameAsShippingChange} color="primary" />}
        label={<Typography variant="body1" fontWeight="medium">Billing address is the same as shipping address</Typography>}
        sx={{ mb: 2 }}
      />

      {!billingSameAsShipping && (
        <Box mt={3}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" color="secondary">💳 Billing Address</Typography>
            <Button variant="outlined" size="small" color="secondary" onClick={() => handleOpenAddressForm('BILLING')}>
              Add Billing Address
            </Button>
          </Box>
          {billingAddresses.length > 0 ? (
            <Grid container spacing={2}>
              {billingAddresses.map((address) => (
                <Grid item xs={12} md={6} key={address.id}>
                  <AddressCard
                    address={address}
                    selectable
                    selected={selectedBillingAddress?.id === address.id}
                    onSelect={setSelectedBillingAddress}
                    onEdit={(addr) => setEditingAddress(addr)}
                    onDelete={handleDeleteAddress}
                    showActions
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Alert severity="info">No billing addresses found. Please add a billing address.</Alert>
          )}
        </Box>
      )}

      <Divider sx={{ my: 3 }} />

      <Box mt={4}>
        <Typography variant="h6" color="primary" gutterBottom>🚚 Delivery Method</Typography>
        <FormControl component="fieldset" fullWidth>
          <RadioGroup value={selectedDeliveryMethod || ''} onChange={(e) => setSelectedDeliveryMethod(e.target.value)}>
            <Grid container spacing={2}>
              {DELIVERY_METHODS.map((method) => (
                <Grid item xs={12} md={6} key={method.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedDeliveryMethod === method.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      backgroundColor: selectedDeliveryMethod === method.id ? '#f0f7ff' : 'white',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: '#1976d2', boxShadow: 2 },
                    }}
                    onClick={() => setSelectedDeliveryMethod(method.id)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={2}>
                          <Radio value={method.id} checked={selectedDeliveryMethod === method.id} />
                          <Box sx={{ color: '#1976d2' }}>{method.icon}</Box>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">{method.name}</Typography>
                            <Typography variant="body2" color="text.secondary">{method.description}</Typography>
                          </Box>
                        </Box>
                        <Box textAlign="right">
                          {method.isFree ? (
                            <Chip label="FREE" color="success" size="small" />
                          ) : (
                            <Typography variant="h6" color="primary" fontWeight="bold">${method.cost.toFixed(2)}</Typography>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        </FormControl>
      </Box>

      <AddressForm open={showAddressForm} onClose={() => setShowAddressForm(false)} onSubmit={handleAddAddress} defaultType={addressFormType} />
      <AddressForm open={!!editingAddress} onClose={() => setEditingAddress(null)} onSubmit={handleEditAddress} address={editingAddress} />
    </Box>
  );

  // ==================== STEP 2: Payment Method ====================
  const renderStep2 = () => (
    <Box>
      <Typography variant="h6" color="primary" gutterBottom>💳 Select Payment Method</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Choose how you would like to pay for your order
      </Typography>

      <FormControl component="fieldset" fullWidth>
        <RadioGroup value={selectedPaymentMethod || ''} onChange={(e) => setSelectedPaymentMethod(e.target.value)}>
          <Grid container spacing={2}>
            {PAYMENT_METHODS.map((method) => {
              const IconComponent = method.icon;
              return (
                <Grid item xs={12} key={method.id}>
                  <Card
                    sx={{
                      cursor: 'pointer',
                      border: selectedPaymentMethod === method.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
                      backgroundColor: selectedPaymentMethod === method.id ? '#f0f7ff' : 'white',
                      transition: 'all 0.2s',
                      '&:hover': { borderColor: '#1976d2', boxShadow: 2 },
                    }}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Radio value={method.id} checked={selectedPaymentMethod === method.id} />
                        <Box sx={{ color: '#1976d2' }}><IconComponent fontSize="large" /></Box>
                        <Box flex={1}>
                          <Typography variant="subtitle1" fontWeight="bold">{method.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{method.description}</Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </RadioGroup>
      </FormControl>

      {selectedPaymentMethod === 'BANK_TRANSFER' && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <strong>Note:</strong> After placing your order, you will receive bank account details to complete the transfer.
          Your order will be shipped once payment is confirmed.
        </Alert>
      )}

      {selectedPaymentMethod === 'CASH_ON_DELIVERY' && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <strong>Note:</strong> You can pay with cash or card when the courier delivers your order.
        </Alert>
      )}
    </Box>
  );

  // ==================== STEP 3: Review Order ====================
  const renderStep3 = () => {
    const billingAddr = billingSameAsShipping ? selectedShippingAddress : selectedBillingAddress;
    const cartItems = cart?.items || cart?.products || [];

    return (
      <Box>
        <Typography variant="h6" gutterBottom>Review Your Order</Typography>

        <Paper sx={{ p: 2, mb: 3, borderLeft: '4px solid #1976d2' }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">📦 Shipping Address</Typography>
          {selectedShippingAddress && (
            <Box>
              <Typography variant="body2">{selectedShippingAddress.street}</Typography>
              <Typography variant="body2">{selectedShippingAddress.city}, {selectedShippingAddress.county}</Typography>
              <Typography variant="body2">{selectedShippingAddress.postalCode}</Typography>
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 2, mb: 3, borderLeft: '4px solid #9c27b0' }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="secondary">
            💳 Billing Address
            {billingSameAsShipping && <Typography component="span" variant="body2" sx={{ ml: 1, fontWeight: 'normal' }}>(Same as shipping)</Typography>}
          </Typography>
          {billingAddr && (
            <Box>
              <Typography variant="body2">{billingAddr.street}</Typography>
              <Typography variant="body2">{billingAddr.city}, {billingAddr.county}</Typography>
              <Typography variant="body2">{billingAddr.postalCode}</Typography>
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 2, mb: 3, borderLeft: '4px solid #ff6b35' }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>🚚 Delivery Method</Typography>
          {selectedDeliveryMethod && (
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {DELIVERY_METHODS.find((m) => m.id === selectedDeliveryMethod)?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {DELIVERY_METHODS.find((m) => m.id === selectedDeliveryMethod)?.description}
              </Typography>
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 2, mb: 3, borderLeft: '4px solid #4caf50' }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#4caf50' }}>💰 Payment Method</Typography>
          {getSelectedPaymentMethodDetails() && (
            <Box>
              <Typography variant="body2" fontWeight="medium">{getSelectedPaymentMethodDetails().name}</Typography>
              <Typography variant="body2" color="text.secondary">{getSelectedPaymentMethodDetails().description}</Typography>
            </Box>
          )}
        </Paper>

        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>🛒 Order Items ({cartItems.length})</Typography>
          {cartItems.map((item) => (
            <Box key={item.id || item.productId} display="flex" justifyContent="space-between" alignItems="center" py={1} borderBottom="1px solid #eee">
              <Box>
                <Typography variant="body2">{item.productName || item.name}</Typography>
                {(item.quantity || 1) > 1 && <Typography variant="caption" color="text.secondary">Qty: {item.quantity}</Typography>}
              </Box>
              <Typography fontWeight="bold">${((item.unitPrice || item.price) * (item.quantity || 1)).toFixed(2)}</Typography>
            </Box>
          ))}
        </Paper>

        <Paper sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Subtotal:</Typography>
            <Typography>${productsTotal.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography>Delivery:</Typography>
            <Typography color={deliveryCost === 0 ? 'success.main' : 'text.primary'}>
              {deliveryCost === 0 ? 'Free' : `${deliveryCost.toFixed(2)}`}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary" fontWeight="bold">${grandTotal.toFixed(2)}</Typography>
          </Box>
        </Paper>

        {selectedPaymentMethod === 'BANK_TRANSFER' && (
          <Alert severity="warning" sx={{ mt: 3 }}>
            <strong>Important:</strong> After placing your order, you will see bank account details.
            Please complete the transfer within 3 business days to avoid order cancellation.
          </Alert>
        )}
      </Box>
    );
  };

  // ==================== STEP 4: Confirmation ====================
  const renderStep4 = () => (
    <Box textAlign="center" py={4}>
      <Typography variant="h5" color="success.main" gutterBottom>✅ Order Placed Successfully!</Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Thank you for your order. Your order number is <strong>#{createdOrder?.id || 'N/A'}</strong>
      </Typography>

      {selectedPaymentMethod === 'BANK_TRANSFER' && createdOrder && (
        <Paper sx={{ p: 3, mt: 3, mb: 3, textAlign: 'left', backgroundColor: '#e3f2fd' }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>🏦 Bank Transfer Details</Typography>
          <Typography variant="body2" paragraph>Please transfer the total amount to complete your order:</Typography>

          <Box sx={{ backgroundColor: 'white', p: 2, borderRadius: 1, mb: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Bank Name</Typography>
                <Typography variant="body1" fontWeight="bold">{createdOrder.bankName || 'ING Bank'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Account Holder</Typography>
                <Typography variant="body1" fontWeight="bold">{createdOrder.bankAccountHolder || 'Elity Web Store SRL'}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" color="text.secondary">IBAN</Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: 'monospace', backgroundColor: '#f5f5f5', p: 1, borderRadius: 1 }}>
                  {createdOrder.bankIban || 'RO49AAAA1B31007593840000'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Amount to Transfer</Typography>
                <Typography variant="h5" color="primary" fontWeight="bold">
                  ${createdOrder.price?.toFixed(2) || grandTotal.toFixed(2)}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary">Payment Reference</Typography>
                <Typography variant="body1" fontWeight="bold" sx={{ fontFamily: 'monospace' }}>
                  ORDER-{createdOrder.id}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Alert severity="warning" sx={{ mt: 2 }}>
            <strong>Important:</strong> Please include the payment reference <strong>ORDER-{createdOrder.id}</strong> in your transfer description.
            Your order will be processed once payment is confirmed (usually within 1-2 business days).
          </Alert>
        </Paper>
      )}

      {selectedPaymentMethod === 'CASH_ON_DELIVERY' && (
        <Alert severity="success" sx={{ mt: 3, mb: 3 }}>
          <strong>Cash/Card on Delivery:</strong> You will pay <strong>${createdOrder?.price?.toFixed(2) || grandTotal.toFixed(2)}</strong> when your order arrives.
        </Alert>
      )}

      <Box mt={4}>
        <Button variant="contained" onClick={() => navigate('/orders')} sx={{ mr: 2, backgroundColor: '#ff6b35' }}>
          View Orders
        </Button>
        <Button variant="outlined" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Box>
    </Box>
  );

  const renderStepContent = (step) => {
    switch (step) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  if (!user) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container maxWidth="md" sx={{ my: 4, flexGrow: 1 }}>
          <Alert severity="warning">Please log in to proceed with checkout.</Alert>
          <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>Go to Login</Button>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />
      <Container maxWidth="md" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>Checkout</Typography>

        <Stepper activeStep={activeStep - 1} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper sx={{ p: 3, mb: 3 }}>{renderStepContent(activeStep)}</Paper>

        {activeStep < 4 && (
          <Box display="flex" justifyContent="space-between">
            <Button disabled={activeStep === 1} onClick={handleBack}>Back</Button>
            <Button
              variant="contained"
              onClick={activeStep === 3 ? handlePlaceOrder : handleNext}
              disabled={loading}
              sx={{ backgroundColor: '#ff6b35' }}
            >
              {loading ? <CircularProgress size={24} /> : activeStep === 3 ? 'Place Order' : 'Next'}
            </Button>
          </Box>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default Checkout;