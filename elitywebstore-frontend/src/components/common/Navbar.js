import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  InputBase,
  alpha,
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Search as SearchIcon,
  Store,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = ({ onSearch }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: '#fff', color: '#333' }}>
      <Toolbar>
        <Store sx={{ mr: 2, color: '#ff6b35' }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ cursor: 'pointer', fontWeight: 700, color: '#ff6b35' }}
          onClick={() => navigate('/')}
        >
          ElityStore
        </Typography>

        <Box sx={{ flexGrow: 1, mx: 4, display: { xs: 'none', md: 'block' } }}>
          <form onSubmit={handleSearch}>
            <Box
              sx={{
                position: 'relative',
                borderRadius: 1,
                backgroundColor: alpha('#000', 0.05),
                '&:hover': {
                  backgroundColor: alpha('#000', 0.08),
                },
                width: '100%',
                maxWidth: 600,
              }}
            >
              <Box
                sx={{
                  padding: '0 16px',
                  height: '100%',
                  position: 'absolute',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SearchIcon />
              </Box>
              <InputBase
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  color: 'inherit',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: '8px 8px 8px 0',
                    paddingLeft: `calc(1em + 32px)`,
                  },
                }}
              />
            </Box>
          </form>
        </Box>

        <Button color="inherit" onClick={() => navigate('/products')}>
          Shop
        </Button>

        {user ? (
          <>
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              sx={{ mx: 1 }}
            >
              <Badge badgeContent={cartItemCount} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={() => { navigate('/account'); handleClose(); }}>
                My Account
              </MenuItem>
              <MenuItem onClick={() => { navigate('/account/orders'); handleClose(); }}>
                My Orders
              </MenuItem>
              <MenuItem onClick={() => { navigate('/account/addresses'); handleClose(); }}>
                My Addresses
              </MenuItem>
              <MenuItem onClick={() => { navigate('/account/profile'); handleClose(); }}>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button
              variant="contained"
              sx={{ ml: 1, backgroundColor: '#ff6b35' }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;