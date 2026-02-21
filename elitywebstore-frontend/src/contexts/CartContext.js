import React, { createContext, useState, useContext, useEffect } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = async () => {
    if (!user?.sub) {
      setCart(null);
      return;
    }
    
    try {
      setLoading(true);
      const cartData = await cartService.getCart(user.sub);
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    if (!user?.sub) {
      throw new Error('User must be logged in to add items to cart');
    }
    
    try {
      setLoading(true);
      const updatedCart = await cartService.addToCart(user.sub, productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?.sub) {
      throw new Error('User must be logged in');
    }
    
    try {
      setLoading(true);
      const updatedCart = await cartService.removeFromCart(user.sub, productId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?.sub) {
      throw new Error('User must be logged in');
    }
    
    try {
      setLoading(true);
      await cartService.clearCart(user.sub);
      setCart({ ...cart, products: [], productsPrice: 0 });
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  const value = {
    cart,
    loading,
    addToCart,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
    cartItemCount: cart?.products?.length || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};