import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import cartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    if (!user?.userId) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const cartData = await cartService.getCart(user.userId);
      setCart(cartData);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  // Fetch cart on mount and when user changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add product to cart
  const addToCart = async (productId, quantity = 1) => {
    if (!user?.userId) {
      setError('Please log in to add items to cart');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.addToCart(user.userId, productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error adding to cart:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add item to cart';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update quantity to specific value
  const updateQuantity = async (productId, quantity) => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.updateQuantity(user.userId, productId, quantity);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error updating quantity:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update quantity';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Increase quantity by 1
  const increaseQuantity = async (productId) => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.increaseQuantity(user.userId, productId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error increasing quantity:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to increase quantity';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Decrease quantity by 1
  const decreaseQuantity = async (productId) => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.decreaseQuantity(user.userId, productId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error decreasing quantity:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to decrease quantity';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Remove product from cart entirely
  const removeFromCart = async (productId) => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      setError(null);
      const updatedCart = await cartService.removeFromCart(user.userId, productId);
      setCart(updatedCart);
      return updatedCart;
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      setError(null);
      await cartService.clearCart(user.userId);
      setCart({
        id: cart?.id,
        items: [],
        productsPrice: 0,
        totalItemCount: 0,
        uniqueProductCount: 0,
      });
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper: Get total item count (sum of quantities)
  const getTotalItemCount = () => {
    return cart?.totalItemCount || 0;
  };

  // Helper: Get unique product count
  const getUniqueProductCount = () => {
    return cart?.uniqueProductCount || cart?.items?.length || 0;
  };

  // Helper: Check if product is in cart
  const isInCart = (productId) => {
    return cart?.items?.some(item => item.productId === productId) || false;
  };

  // Helper: Get quantity of specific product in cart
  const getProductQuantity = (productId) => {
    const item = cart?.items?.find(item => item.productId === productId);
    return item?.quantity || 0;
  };

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    getTotalItemCount,
    getUniqueProductCount,
    isInCart,
    getProductQuantity,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;