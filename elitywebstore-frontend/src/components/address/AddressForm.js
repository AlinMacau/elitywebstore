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

const AddressForm = ({ open, onClose, onSubmit, address, userId }) => {
  const [formData, setFormData] = useState({
    userId: userId,
    addressType: 'DELIVERY',
    street: '',
    city: '',
    county: '',
    postalCode: '',
  });

  useEffect(() => {
    if (address) {
      setFormData(address);
    } else {
      setFormData({
        userId: userId,
        addressType: 'DELIVERY',
        street: '',
        city: '',
        county: '',
        postalCode: '',
      });
    }
  }, [address, userId]);

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{address ? 'Edit Address' : 'Add New Address'}</DialogTitle>
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
          >
            <MenuItem value="DELIVERY">Delivery</MenuItem>
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
          />

          <TextField
            fullWidth
            margin="normal"
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="County/State"
            name="county"
            value={formData.county}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            margin="normal"
            label="Postal Code"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" sx={{ backgroundColor: '#ff6b35' }}>
            {address ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddressForm;