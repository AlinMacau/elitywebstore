import React from 'react';
import { TextField } from '@mui/material';

const Input = React.memo(({ 
  label, 
  type = 'text', 
  error, 
  helperText, 
  ...props 
}) => {
  return (
    <TextField
      fullWidth
      label={label}
      type={type}
      error={error}
      helperText={helperText}
      variant="outlined"
      margin="normal"
      {...props}
      sx={{
        '& .MuiOutlinedInput-root': {
          '&:hover fieldset': {
            borderColor: '#ff6b35',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#ff6b35',
          },
        },
        '& .MuiInputLabel-root.Mui-focused': {
          color: '#ff6b35',
        },
      }}
    />
  );
});

Input.displayName = 'Input';

export default Input;