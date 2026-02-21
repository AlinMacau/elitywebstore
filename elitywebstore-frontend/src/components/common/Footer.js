import React from 'react';
import { Box, Container, Typography, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f5f5f5',
        py: 6,
        mt: 'auto',
        borderTop: '1px solid #e0e0e0',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              ElityStore
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your one-stop shop for quality products at great prices.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="/products" color="inherit" display="block">
              Shop
            </Link>
            <Link href="/account/orders" color="inherit" display="block">
              Orders
            </Link>
            <Link href="/account" color="inherit" display="block">
              My Account
            </Link>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: support@elitystore.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Phone: +1 234 567 890
            </Typography>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {'© '}
            {new Date().getFullYear()}
            {' ElityStore. All rights reserved.'}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;