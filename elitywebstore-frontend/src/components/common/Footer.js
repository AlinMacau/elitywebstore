import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#DD438A', // Pink background
        color: '#FFFFFF',
        py: 5,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              gutterBottom
              sx={{ color: '#FFFFFF' }}
            >
              ElityStore
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Your one-stop shop for quality products at great prices.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Links
            </Typography>
            <Link 
              href="/products" 
              sx={{ 
                color: '#FFFFFF', 
                display: 'block', 
                mb: 1,
                opacity: 0.9,
                textDecoration: 'none',
                '&:hover': { opacity: 1, color: '#35A9F6' },
              }}
            >
              Shop
            </Link>
            <Link 
              href="/orders" 
              sx={{ 
                color: '#FFFFFF', 
                display: 'block', 
                mb: 1,
                opacity: 0.9,
                textDecoration: 'none',
                '&:hover': { opacity: 1, color: '#35A9F6' },
              }}
            >
              Orders
            </Link>
            <Link 
              href="/profile" 
              sx={{ 
                color: '#FFFFFF', 
                display: 'block',
                opacity: 0.9,
                textDecoration: 'none',
                '&:hover': { opacity: 1, color: '#35A9F6' },
              }}
            >
              My Account
            </Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mb: 0.5 }}>
              Email: support@elitystore.com
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Phone: +1 234 567 890
            </Typography>
          </Grid>
        </Grid>

        {/* Bottom bar - Blue accent */}
        <Box 
          sx={{ 
            borderTop: '1px solid rgba(255,255,255,0.3)', 
            mt: 4, 
            pt: 3, 
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#35A9F6', // Blue dot accent
            }}
          />
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            © {new Date().getFullYear()} ElityStore. All rights reserved.
          </Typography>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#35A9F6', // Blue dot accent
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;