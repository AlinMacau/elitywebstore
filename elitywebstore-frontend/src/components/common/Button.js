import React from 'react';
import { Button as MuiButton, CircularProgress } from '@mui/material';

const Button = React.memo(({ 
  children, 
  loading = false, 
  variant = 'contained',
  fullWidth = true,
  ...props 
}) => {
  return (
    <MuiButton
      variant={variant}
      fullWidth={fullWidth}
      disabled={loading}
      {...props}
      sx={{
        backgroundColor: variant === 'contained' ? '#ff6b35' : 'transparent',
        color: variant === 'contained' ? '#fff' : '#ff6b35',
        padding: '12px 24px',
        fontSize: '16px',
        fontWeight: 600,
        textTransform: 'none',
        borderRadius: '8px',
        border: variant === 'outlined' ? '2px solid #ff6b35' : 'none',
        '&:hover': {
          backgroundColor: variant === 'contained' ? '#e55a2b' : 'rgba(255, 107, 53, 0.08)',
          border: variant === 'outlined' ? '2px solid #e55a2b' : 'none',
        },
        '&:disabled': {
          backgroundColor: '#ccc',
          color: '#666',
        },
        ...props.sx,
      }}
    >
      {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : children}
    </MuiButton>
  );
});

Button.displayName = 'Button';

export default Button;