import api from './api';

const authService = {
  signup: async (userData) => {
    await api.post('/users/signup', userData);
  },
  
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    const { token, userId, email: userEmail, role } = response.data;
    
    console.log('Login response:', { token, userId, userEmail, role });
    
    localStorage.setItem('token', token);
    
    const user = {
      email: userEmail,
      userId: userId,
      role: role,
    };
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token, userId, email: userEmail, role };
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === 'ADMIN';
  },
};

export default authService;