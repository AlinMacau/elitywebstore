import api from './api';

const orderService = {
  createOrder: async (userId, addressId) => {
    const response = await api.post('/orders', { userId, addressId });
    return response.data;
  },

  getOrdersByUserId: async (userId) => {
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

export default orderService;