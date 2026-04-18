import api from './api';

const adminOrderService = {
  /**
   * Get all orders (admin)
   */
  getAllOrders: async (status = null) => {
    const params = status ? { status } : {};
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },

  /**
   * Get order by ID (admin)
   */
  getOrderById: async (orderId) => {
    const response = await api.get(`/admin/orders/${orderId}`);
    return response.data;
  },

  /**
   * Update order (admin)
   */
  updateOrder: async (orderId, updateData, adminEmail = null) => {
    const headers = adminEmail ? { 'X-Admin-Email': adminEmail } : {};
    const response = await api.put(`/admin/orders/${orderId}`, updateData, { headers });
    return response.data;
  },

  /**
   * Update order status (admin)
   */
  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/admin/orders/${orderId}/status`, null, {
      params: { status },
    });
    return response.data;
  },

  /**
   * Update payment status (admin)
   * Used primarily to mark bank transfer orders as paid
   */
  updatePaymentStatus: async (orderId, paymentStatus, adminEmail = null) => {
    const headers = adminEmail ? { 'X-Admin-Email': adminEmail } : {};
    const response = await api.put(`/admin/orders/${orderId}/payment-status`, null, {
      params: { paymentStatus },
      headers,
    });
    return response.data;
  },

  /**
   * Get order statistics (admin)
   */
  getOrderStats: async () => {
    const response = await api.get('/admin/orders/stats');
    return response.data;
  },
};

export default adminOrderService;