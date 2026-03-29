import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AddressForm from '../components/address/AddressForm';
import addressService from '../services/addressService';
import { useAuth } from '../contexts/AuthContext';

const Addresses = () => {
  const { user, loading: authLoading } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user?.userId) {
      fetchAddresses();
    }
  }, [user, authLoading]);

  const fetchAddresses = async () => {
    if (!user?.userId) {
      return;
    }

    try {
      setLoading(true);
      const data = await addressService.getAllByUserId(user.userId);
      setAddresses(data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = () => {
    setSelectedAddress(null);
    setOpenForm(true);
  };

  const handleEditAddress = (address) => {
    setSelectedAddress(address);
    setOpenForm(true);
  };

  const handleDeleteAddress = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressService.delete(id);
        fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        alert('Failed to delete address');
      }
    }
  };

  const handleSubmitAddress = async (formData) => {
    if (!user?.userId) {
      alert('User not authenticated. Please log in again.');
      return;
    }

    try {
      const addressData = {
        addressType: formData.addressType,
        street: formData.street,
        city: formData.city,
        county: formData.county,
        postalCode: formData.postalCode,
        userId: user.userId,
      };

      if (selectedAddress?.id) {
        await addressService.update({ ...addressData, id: selectedAddress.id });
      } else {
        await addressService.create(addressData);
      }
      
      setOpenForm(false);
      fetchAddresses();
    } catch (error) {
      console.error('Error saving address:', error);
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).join(', ')
        : error.response?.data?.message || error.message;
      alert('Failed to save address: ' + errorMessage);
    }
  };

  if (authLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
          <Typography variant="h6" color="text.secondary">
            Please log in to view your addresses
          </Typography>
        </Container>
        <Footer />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold">
            My Addresses
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddAddress}
          >
            Add New Address
          </Button>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : addresses.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No addresses found
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Add your first address to get started
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {addresses.map((address) => (
              <Grid item xs={12} md={6} key={address.id}>
                <Paper sx={{ p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="start">
                    <Box>
                      <Chip
                        label={address.addressType}
                        color={address.addressType === 'BILLING' ? 'primary' : 'success'}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="body1">{address.street}</Typography>
                      <Typography variant="body1">
                        {address.city}, {address.county}
                      </Typography>
                      <Typography variant="body1">{address.postalCode}</Typography>
                    </Box>
                    <Box>
                      <IconButton
                        size="small"
                        onClick={() => handleEditAddress(address)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteAddress(address.id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        <AddressForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSubmit={handleSubmitAddress}
          address={selectedAddress}
        />
      </Container>

      <Footer />
    </Box>
  );
};

export default Addresses;