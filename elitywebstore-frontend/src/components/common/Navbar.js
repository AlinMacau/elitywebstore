import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Box,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [adminAnchorEl, setAdminAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAdminMenuOpen = (event) => {
    setAdminAnchorEl(event.currentTarget);
  };

  const handleAdminMenuClose = () => {
    setAdminAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const cartItemCount = cart?.products?.length || 0;

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: '#35A9F6', // Bright Blue
        boxShadow: '0 4px 20px rgba(53, 169, 246, 0.4)',
      }}
    >
      <Toolbar>
        {/* Logo */}
        <Typography
          variant="h5"
          sx={{
            flexGrow: 0,
            cursor: 'pointer',
            fontWeight: 'bold',
            mr: 4,
            letterSpacing: '0.5px',
            color: '#FFFFFF',
          }}
          onClick={() => navigate('/')}
        >
          ElityWebStore
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
          <Button 
            color="inherit" 
            onClick={() => navigate('/')}
            sx={{ 
              color: '#FFFFFF',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
            }}
          >
            Home
          </Button>
          <Button 
            color="inherit" 
            onClick={() => navigate('/products')}
            sx={{ 
              color: '#FFFFFF',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
            }}
          >
            Products
          </Button>
        </Box>

        {/* Right Side Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user ? (
            <>
              {/* Admin Menu - Pink accent */}
              {isAdmin() && (
                <>
                  <IconButton
                    onClick={handleAdminMenuOpen}
                    sx={{
                      backgroundColor: '#DD438A', // Pink accent
                      color: '#FFFFFF',
                      '&:hover': { backgroundColor: '#B8306E' },
                    }}
                  >
                    <AdminIcon />
                  </IconButton>
                  <Menu
                    anchorEl={adminAnchorEl}
                    open={Boolean(adminAnchorEl)}
                    onClose={handleAdminMenuClose}
                    PaperProps={{
                      sx: {
                        border: '2px solid #DD438A',
                        borderRadius: 2,
                      }
                    }}
                  >
                    <MenuItem
                      onClick={() => { navigate('/admin/dashboard'); handleAdminMenuClose(); }}
                      sx={{ '&:hover': { backgroundColor: 'rgba(221, 67, 138, 0.1)' } }}
                    >
                      Dashboard
                    </MenuItem>
                    <Divider />
                    <MenuItem
                      onClick={() => { navigate('/admin/products'); handleAdminMenuClose(); }}
                      sx={{ '&:hover': { backgroundColor: 'rgba(221, 67, 138, 0.1)' } }}
                    >
                      Manage Products
                    </MenuItem>
                    <MenuItem
                      onClick={() => { navigate('/admin/categories'); handleAdminMenuClose(); }}
                      sx={{ '&:hover': { backgroundColor: 'rgba(221, 67, 138, 0.1)' } }}
                    >
                      Manage Categories
                    </MenuItem>
                    <MenuItem
                      onClick={() => { navigate('/admin/orders'); handleAdminMenuClose(); }}
                      sx={{ '&:hover': { backgroundColor: 'rgba(221, 67, 138, 0.1)' } }}
                    >
                      Manage Orders
                    </MenuItem>
                    <MenuItem
                      onClick={() => { navigate('/admin/users'); handleAdminMenuClose(); }}
                      sx={{ '&:hover': { backgroundColor: 'rgba(221, 67, 138, 0.1)' } }}
                    >
                      Manage Users
                    </MenuItem>
                  </Menu>
                </>
              )}

              {/* Cart - Pink badge */}
              <IconButton 
                onClick={() => navigate('/cart')}
                sx={{ 
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
                }}
              >
                <Badge 
                  badgeContent={cartItemCount} 
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#DD438A',
                      color: '#FFFFFF',
                    }
                  }}
                >
                  <CartIcon />
                </Badge>
              </IconButton>

              {/* User Menu */}
              <IconButton 
                onClick={handleMenuOpen}
                sx={{ 
                  color: '#FFFFFF',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
                }}
              >
                <PersonIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    border: '2px solid #35A9F6',
                    borderRadius: 2,
                  }
                }}
              >
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem
                  onClick={() => { navigate('/profile'); handleMenuClose(); }}
                  sx={{ '&:hover': { backgroundColor: 'rgba(53, 169, 246, 0.1)' } }}
                >
                  My Profile
                </MenuItem>
                <MenuItem
                  onClick={() => { navigate('/orders'); handleMenuClose(); }}
                  sx={{ '&:hover': { backgroundColor: 'rgba(53, 169, 246, 0.1)' } }}
                >
                  My Orders
                </MenuItem>
                <Divider />
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    color: '#DD438A',
                    '&:hover': { backgroundColor: 'rgba(221, 67, 138, 0.1)' },
                  }}
                >
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                onClick={() => navigate('/login')}
                sx={{ 
                  color: '#FFFFFF',
                  borderRadius: 2,
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate('/signup')}
                sx={{
                  backgroundColor: '#DD438A', // Pink button
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#B8306E' },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;