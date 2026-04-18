import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';

const AddressForm = ({ open, onClose, onSubmit, address, defaultType = 'SHIPPING' }) => {
  const [formData, setFormData] = useState({
    addressType: defaultType,
    street: '',
    city: '',
    county: '',
    postalCode: '',
  });

  useEffect(() => {
    if (address) {
      // Editing existing address
      setFormData({
        addressType: address.addressType || defaultType,
        street: address.street || '',
        city: address.city || '',
        county: address.county || '',
        postalCode: address.postalCode || '',
      });
    } else {
      // Creating new address - use defaultType
      setFormData({
        addressType: defaultType,
        street: '',
        city: '',
        county: '',
        postalCode: '',
      });
    }
  }, [address, open, defaultType]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getTitle = () => {
    if (address) {
      return `Edit ${address.addressType === 'SHIPPING' ? 'Shipping' : 'Billing'} Address`;
    }
    return `Add New ${defaultType === 'SHIPPING' ? 'Shipping' : 'Billing'} Address`;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{getTitle()}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Address Type"
            name="addressType"
            value={formData.addressType}
            onChange={handleChange}
            required
            disabled={!!address}
          >
            <MenuItem value="SHIPPING">Shipping</MenuItem>
            <MenuItem value="BILLING">Billing</MenuItem>
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Street Address"
            name="street"
            value={formData.street}
            onChange={handleChange}
            required
            placeholder="123 Main Street, Apt 4B"
          />

          <TextField
            fullWidth
            margin="normal"
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
            placeholder="New York"
          />

          <TextField
            fullWidth
            margin="normal"
            label="County/State"
            name="county"
            value={formData.county}
            onChange={handleChange}
            required
            placeholder="NY"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
            inputProps={{ pattern: '[0-9]+', minLength: 2 }}
            placeholder="10001"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color={formData.addressType === 'SHIPPING' ? 'primary' : 'secondary'}
          >
            {address ? 'Update' : 'Add'} Address
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddressForm;