import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Alert,
} from '@mui/material';
import { Add } from '@mui/icons-material';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import AddressCard from '../components/address/AddressCard';
import AddressForm from '../components/address/AddressForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import addressService from '../services/addressService';

const Addresses = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

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
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (addressData) => {
    try {
      await addressService.create(addressData);
      await fetchAddresses();
      setShowForm(false);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setShowForm(true);
  };

  const handleUpdate = async (addressData) => {
    try {
      await addressService.update(addressData);
      await fetchAddresses();
      setShowForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.error('Error updating address:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressService.delete(id);
        await fetchAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAddress(null);
  };

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
            onClick={() => setShowForm(true)}
            sx={{ backgroundColor: '#ff6b35' }}
          >
            Add Address
          </Button>
        </Box>

        {loading ? (
          <LoadingSpinner />
        ) : addresses.length > 0 ? (
          <Grid container spacing={3}>
            {addresses.map((address) => (
              <Grid item xs={12} md={6} key={address.id}>
                <AddressCard
                  address={address}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Alert severity="info">
            You haven't added any addresses yet. Click "Add Address" to get started.
          </Alert>
        )}

        <AddressForm
          open={showForm}
          onClose={handleCloseForm}
          onSubmit={editingAddress ? handleUpdate : handleAdd}
          address={editingAddress}
          userId={user.sub}
        />
      </Container>

      <Footer />
    </Box>
  );
};

export default Addresses;