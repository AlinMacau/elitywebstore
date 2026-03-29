import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Alert,
  Paper,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AdminTest = () => {
  const { user } = useAuth();
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAdminEndpoint = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      const response = await api.get('/admin/test');
      setTestResult({
        success: true,
        message: response.data.message,
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: error.response?.data?.error || 'Access denied',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Admin Authorization Test
        </Typography>

        <Box sx={{ my: 3 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Logged in as:</strong> {user?.email}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Role:</strong> {user?.role}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>User ID:</strong> {user?.userId}
          </Typography>
        </Box>

        <Button
          variant="contained"
          onClick={testAdminEndpoint}
          disabled={loading}
          sx={{
            backgroundColor: '#ff6b35',
            '&:hover': { backgroundColor: '#e55a2b' },
          }}
        >
          {loading ? 'Testing...' : 'Test Admin Endpoint'}
        </Button>

        {testResult && (
          <Box sx={{ mt: 3 }}>
            <Alert severity={testResult.success ? 'success' : 'error'}>
              {testResult.message}
            </Alert>
          </Box>
        )}

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Expected Results:
          </Typography>
          <Typography variant="body2" component="div">
            <ul>
              <li>✅ Admin users should see "Admin access granted"</li>
              <li>❌ Regular users should see "Admin access required"</li>
              <li>❌ Unauthenticated users should be redirected to login</li>
            </ul>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminTest;