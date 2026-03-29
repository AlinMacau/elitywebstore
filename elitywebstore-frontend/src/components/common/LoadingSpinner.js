import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const LoadingSpinner = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '200px',
      }}
    >
      <CircularProgress 
        size={50} 
        sx={{ 
          color: '#7B2D8E',
        }} 
      />
    </Box>
  );
};

export default LoadingSpinner;