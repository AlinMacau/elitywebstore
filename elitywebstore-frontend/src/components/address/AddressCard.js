import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import { Edit, Delete, CheckCircle } from '@mui/icons-material';

const AddressCard = ({ 
  address, 
  onEdit, 
  onDelete, 
  selectable, 
  selected, 
  onSelect,
  showActions = false 
}) => {
  const handleCardClick = () => {
    if (selectable && onSelect) {
      onSelect(address);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation(); // Prevent card selection when clicking edit
    if (onEdit) {
      onEdit(address);
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation(); // Prevent card selection when clicking delete
    if (onDelete) {
      onDelete(address.id);
    }
  };

  return (
    <Card
      sx={{
        cursor: selectable ? 'pointer' : 'default',
        border: selected ? '2px solid #ff6b35' : '1px solid #e0e0e0',
        backgroundColor: selected ? '#fff8f5' : 'white',
        '&:hover': selectable ? { boxShadow: 3 } : {},
        position: 'relative',
      }}
      onClick={handleCardClick}
    >
      {selected && (
        <CheckCircle 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            color: '#ff6b35' 
          }} 
        />
      )}
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="start">
          <Box flex={1}>
            <Chip
              label={address.addressType}
              size="small"
              color={address.addressType === 'SHIPPING' ? 'primary' : 'secondary'}
              sx={{ mb: 1 }}
            />
            {address.isDefault && (
              <Chip
                label="Default"
                size="small"
                color="success"
                sx={{ mb: 1, ml: 1 }}
              />
            )}
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
          
          {/* Show actions if not in selectable-only mode OR if showActions is true */}
          {(showActions || !selectable) && (
            <Box>
              <IconButton 
                size="small" 
                onClick={handleEditClick}
                sx={{ '&:hover': { color: '#ff6b35' } }}
              >
                <Edit fontSize="small" />
              </IconButton>
              <IconButton 
                size="small" 
                onClick={handleDeleteClick} 
                color="error"
              >
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