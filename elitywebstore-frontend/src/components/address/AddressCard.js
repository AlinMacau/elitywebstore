import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const AddressCard = ({ address, onEdit, onDelete, selectable, selected, onSelect }) => {
  return (
    <Card
      sx={{
        cursor: selectable ? 'pointer' : 'default',
        border: selected ? '2px solid #ff6b35' : '1px solid #e0e0e0',
        '&:hover': selectable ? { boxShadow: 2 } : {},
      }}
      onClick={() => selectable && onSelect && onSelect(address)}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box>
            <Chip
              label={address.addressType}
              size="small"
              color="primary"
              sx={{ mb: 1 }}
            />
            <Typography variant="body1" fontWeight="bold">
              {address.street}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {address.city}, {address.county}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {address.postalCode}
            </Typography>
          </Box>
          {!selectable && (
            <Box>
              <IconButton size="small" onClick={() => onEdit(address)}>
                <Edit fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(address.id)} color="error">
                <Delete fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default AddressCard;