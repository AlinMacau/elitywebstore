import api from './api';
import { jwtDecode } from 'jwt-decode';

const authService = {
  signup: async (userData) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    const token = response.data;
    
    if (token) {
      localStorage.setItem('authToken', token);
      const decoded = jwtDecode(token);
      localStorage.setItem('user', JSON.stringify(decoded));
    }
    
    return token;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};

export default authService;