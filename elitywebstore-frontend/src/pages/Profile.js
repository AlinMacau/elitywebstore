import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import userService from '../services/userService';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await userService.getUserById(user.sub);
      setFormData({
        id: data.id,
        email: data.email,
        firstName: data.firstName || '',
        lastName: data.lastname || '',
        phoneNumber: data.phoneNumber || '',
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError('');
      setSuccess(false);
      await userService.updateUser(formData);
      setSuccess(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Navbar />
        <LoadingSpinner />
        <Footer />
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      <Container maxWidth="md" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold" mb={3}>
          My Profile
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Profile updated successfully!
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              value={formData.email}
              disabled
            />

            <TextField
              fullWidth
              margin="normal"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />

            <TextField
              fullWidth
              margin="normal"
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />

            <Box mt={3}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={saving}
                sx={{ backgroundColor: '#ff6b35' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>

      <Footer />
    </Box>
  );
};

export default Profile;