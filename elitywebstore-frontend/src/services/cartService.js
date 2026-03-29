import api from './api';

const cartService = {
  getCart: async (userId) => {
    console.log('Getting cart for userId:', userId);
    const response = await api.get(`/carts/user/${userId}`);
    console.log('Cart response:', response.data);
    return response.data;
  },

  addToCart: async (userId, productId) => {
    console.log('Adding to cart - userId:', userId, 'productId:', productId);
    const response = await api.post('/carts/add', { userId, productId });
    console.log('Add to cart response:', response.data);
    return response.data;
  },

  removeFromCart: async (userId, productId) => {
    console.log('Removing from cart - userId:', userId, 'productId:', productId);
    const response = await api.delete(`/carts/remove/${userId}/${productId}`);
    console.log('Remove from cart response:', response.data);
    return response.data;
  },

  clearCart: async (userId) => {
    console.log('Clearing cart for userId:', userId);
    await api.delete(`/carts/clear/${userId}`);
    console.log('Cart cleared');
  },
};

export default cartService;