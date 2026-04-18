import api from './api';

const BASE_URL = '/carts';

export const cartService = {
  // Get cart by user ID
  getCart: async (userId) => {
    const response = await api.get(`${BASE_URL}/user/${userId}`);
    return response.data;
  },

  // Add product to cart (with optional quantity)
  addToCart: async (userId, productId, quantity = 1) => {
    const response = await api.post(`${BASE_URL}/add`, {
      userId,
      productId,
      quantity,
    });
    return response.data;
  },

  // Update quantity to specific value
  updateQuantity: async (userId, productId, quantity) => {
    const response = await api.put(`${BASE_URL}/update-quantity`, {
      userId,
      productId,
      quantity,
    });
    return response.data;
  },

  // Increase quantity by 1
  increaseQuantity: async (userId, productId) => {
    const response = await api.put(`${BASE_URL}/increase/${userId}/${productId}`);
    return response.data;
  },

  // Decrease quantity by 1 (removes if quantity becomes 0)
  decreaseQuantity: async (userId, productId) => {
    const response = await api.put(`${BASE_URL}/decrease/${userId}/${productId}`);
    return response.data;
  },

  // Remove product from cart entirely
  removeFromCart: async (userId, productId) => {
    const response = await api.delete(`${BASE_URL}/remove/${userId}/${productId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async (userId) => {
    await api.delete(`${BASE_URL}/clear/${userId}`);
  },
};

export default cartService;