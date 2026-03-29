import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    const userData = {
      email: response.email,
      userId: response.userId,
      role: response.role, // NEW - Include role
    };
    setUser(userData);
    return response;
  };

  const signup = async (userData) => {
    await authService.signup(userData);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // NEW METHOD - Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'ADMIN';
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: authService.isAuthenticated,
    isAdmin, // NEW - Expose isAdmin method
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};