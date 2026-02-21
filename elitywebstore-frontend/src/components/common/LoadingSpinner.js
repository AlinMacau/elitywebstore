import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="400px"
    >
      <CircularProgress sx={{ color: '#ff6b35' }} />
    </Box>
  );
};

export default LoadingSpinner;