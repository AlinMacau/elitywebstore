import api from './api';

const orderService = {
  createOrder: async (orderData) => {
    console.log('orderService.createOrder called');
    console.log('Received orderData:', orderData);
    
    const response = await api.post('/orders', orderData);
    console.log('orderService.createOrder - Response:', response.data);
    return response.data;
  },

  getOrdersByUserId: async (userId) => {
    console.log('Fetching orders for userId:', userId);
    if (!userId || userId === 'undefined') {
      throw new Error('Invalid userId');
    }
    const response = await api.get(`/orders/user/${userId}`);
    return response.data;
  },

  getOrderById: async (orderId) => {
    console.log('Fetching order by id:', orderId);
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  /**
   * Get order by ID with user ownership validation.
   * This ensures users can only view their own orders.
   */
  getOrderByIdForUser: async (orderId, userId) => {
    console.log('Fetching order', orderId, 'for user', userId);
    if (!orderId || !userId) {
      throw new Error('Invalid orderId or userId');
    }
    const response = await api.get(`/orders/${orderId}/user/${userId}`);
    return response.data;
  },
};

export default orderService;