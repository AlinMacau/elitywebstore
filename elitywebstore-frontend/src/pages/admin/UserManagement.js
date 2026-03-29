import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Edit as EditIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import adminUserService from '../../services/adminUserService';

const ROLES = ['CUSTOMER', 'ADMIN'];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View dialog state
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Role update dialog state
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userToUpdate, setUserToUpdate] = useState(null);
  const [newRole, setNewRole] = useState('');

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminUserService.getAllUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = (user) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleViewClose = () => {
    setViewDialogOpen(false);
    setSelectedUser(null);
  };

  const handleRoleClick = (user) => {
    setUserToUpdate(user);
    setNewRole(user.role);
    setRoleDialogOpen(true);
  };

  const handleRoleClose = () => {
    setRoleDialogOpen(false);
    setUserToUpdate(null);
    setNewRole('');
  };

  const handleRoleUpdate = async () => {
    if (!userToUpdate || !newRole) return;

    try {
      await adminUserService.updateUserRole(userToUpdate.id, newRole);
      setSnackbar({
        open: true,
        message: 'User role updated successfully!',
        severity: 'success',
      });
      handleRoleClose();
      fetchUsers();
    } catch (err) {
      console.error('Error updating user role:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to update user role.',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getRoleColor = (role) => {
    return role === 'ADMIN' ? 'error' : 'primary';
  };

  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Navbar />

      <Container maxWidth="lg" sx={{ my: 4, flexGrow: 1 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          User Management
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : users.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No users found.
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell align="center"><strong>Orders</strong></TableCell>
                  <TableCell align="center"><strong>Role</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.firstName || user.lastName
                        ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{user.phoneNumber || 'N/A'}</TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.orderCount || 0}
                        size="small"
                        color={user.orderCount > 0 ? 'primary' : 'default'}
                        variant={user.orderCount > 0 ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={user.role}
                        size="small"
                        color={getRoleColor(user.role)}
                        variant={user.role === 'ADMIN' ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleViewClick(user)}
                        size="small"
                        title="View Details"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        color="secondary"
                        onClick={() => handleRoleClick(user)}
                        size="small"
                        title="Change Role"
                      >
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>

      {/* View User Dialog */}
      <Dialog open={viewDialogOpen} onClose={handleViewClose} maxWidth="sm" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box>
              <List>
                <ListItem>
                  <ListItemText primary="User ID" secondary={selectedUser.id} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Email" secondary={selectedUser.email} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Name"
                    secondary={
                      selectedUser.firstName || selectedUser.lastName
                        ? `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim()
                        : 'N/A'
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Phone" secondary={selectedUser.phoneNumber || 'N/A'} />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText
                    primary="Role"
                    secondary={
                      <Chip
                        label={selectedUser.role}
                        size="small"
                        color={getRoleColor(selectedUser.role)}
                        sx={{ mt: 0.5 }}
                      />
                    }
                  />
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemText primary="Total Orders" secondary={selectedUser.orderCount || 0} />
                </ListItem>
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Update Role Dialog */}
      <Dialog open={roleDialogOpen} onClose={handleRoleClose}>
        <DialogTitle>Update User Role</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            User: {userToUpdate?.email}
          </Typography>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={newRole}
              label="Role"
              onChange={(e) => setNewRole(e.target.value)}
            >
              {ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {newRole === 'ADMIN' && userToUpdate?.role !== 'ADMIN' && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Warning: This will grant admin privileges to this user.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRoleClose}>Cancel</Button>
          <Button
            onClick={handleRoleUpdate}
            variant="contained"
            sx={{
              backgroundColor: '#ff6b35',
              '&:hover': { backgroundColor: '#e55a2b' },
            }}
          >
            Update Role
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />
    </Box>
  );
};

export default UserManagement;