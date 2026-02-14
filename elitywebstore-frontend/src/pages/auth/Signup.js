import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Alert, Container, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await signup({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="lg" sx={{ my: 'auto', py: 4 }}>
        <Grid container spacing={0} sx={{ minHeight: '600px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          {/* Left Side - Promotional */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              background: 'linear-gradient(135deg, #20bf55 0%, #01baef 100%)',
              padding: { xs: 4, md: 6 },
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              borderRadius: '16px 0 0 16px',
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: 120, mb: 3, opacity: 0.9 }} />
            <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
              Join Elity Store Today
            </Typography>
            <Typography variant="body1" align="center" sx={{ maxWidth: '300px', opacity: 0.95 }}>
              Create your account and unlock exclusive deals, personalized recommendations, and seamless shopping.
            </Typography>
          </Grid>

          {/* Right Side - Form */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              backgroundColor: '#fff',
              padding: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              borderRadius: { xs: '16px', md: '0 16px 16px 0' },
              maxHeight: { md: '90vh' },
              overflowY: 'auto',
            }}
          >
            <Box sx={{ maxWidth: '400px', mx: 'auto', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ShoppingBagIcon sx={{ fontSize: 40, color: '#20bf55', mr: 1 }} />
                <Typography variant="h4" fontWeight={700} color="#333">
                  Elity Store
                </Typography>
              </Box>

              <Typography variant="h5" fontWeight={600} color="#333" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body1" color="#666" sx={{ mb: 2 }}>
                Start your shopping journey
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  Account created successfully! Redirecting to login...
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="First Name"
                  type="text"
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  })}
                  error={!!errors.firstName}
                  helperText={errors.firstName?.message}
                />

                <Input
                  label="Last Name"
                  type="text"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  })}
                  error={!!errors.lastName}
                  helperText={errors.lastName?.message}
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  {...register('phoneNumber', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: 'Invalid phone number',
                    },
                    minLength: {
                      value: 10,
                      message: 'Phone number must be at least 10 digits',
                    },
                  })}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />

                <Input
                  label="Email Address"
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />

                <Input
                  label="Password"
                  type="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match',
                  })}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />

                <Button type="submit" loading={loading} sx={{ mt: 3, mb: 2 }}>
                  Create Account
                </Button>

                <Typography variant="body2" align="center" color="#666">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    style={{
                      color: '#20bf55',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign In
                  </Link>
                </Typography>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Signup;