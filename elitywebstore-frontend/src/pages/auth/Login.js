import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Typography, Alert, Container, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
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
      <Container maxWidth="lg" sx={{ my: 'auto' }}>
        <Grid container spacing={0} sx={{ minHeight: '600px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          {/* Left Side - Form */}
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
              borderRadius: { xs: '16px 16px 0 0', md: '16px 0 0 16px' },
            }}
          >
            <Box sx={{ maxWidth: '400px', mx: 'auto', width: '100%' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <ShoppingBagIcon sx={{ fontSize: 40, color: '#ff6b35', mr: 1 }} />
                <Typography variant="h4" fontWeight={700} color="#333">
                  Elity Store
                </Typography>
              </Box>

              <Typography variant="h5" fontWeight={600} color="#333" gutterBottom>
                Welcome Back!
              </Typography>
              <Typography variant="body1" color="#666" sx={{ mb: 3 }}>
                Sign in to continue shopping
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
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

                <Button type="submit" loading={loading} sx={{ mt: 3, mb: 2 }}>
                  Sign In
                </Button>

                <Typography variant="body2" align="center" color="#666">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    style={{
                      color: '#ff6b35',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Sign Up
                  </Link>
                </Typography>
              </form>
            </Box>
          </Grid>

          {/* Right Side - Promotional */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
              padding: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#fff',
              borderRadius: { xs: '0 0 16px 16px', md: '0 16px 16px 0' },
            }}
          >
            <ShoppingBagIcon sx={{ fontSize: 120, mb: 3, opacity: 0.9 }} />
            <Typography variant="h4" fontWeight={700} align="center" gutterBottom>
              Shop Smart, Live Better
            </Typography>
            <Typography variant="body1" align="center" sx={{ maxWidth: '300px', opacity: 0.95 }}>
              Discover amazing products at unbeatable prices. Your one-stop shop for everything you need.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;