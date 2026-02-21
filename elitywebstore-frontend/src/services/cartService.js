import api from './api';

const cartService = {
  getCart: async (userId) => {
    const response = await api.get(`/carts/user/${userId}`);
    return response.data;
  },

  addToCart: async (userId, productId) => {
    const response = await api.post('/carts/add', { userId, productId });
    return response.data;
  },

  removeFromCart: async (userId, productId) => {
    const response = await api.delete(`/carts/remove/${userId}/${productId}`);
    return response.data;
  },

  clearCart: async (userId) => {
    await api.delete(`/carts/clear/${userId}`);
  },
};

export default cartService;