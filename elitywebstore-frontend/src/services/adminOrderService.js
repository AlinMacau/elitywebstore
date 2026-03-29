import api from './api';

const adminOrderService = {
  getAllOrders: async (status = null) => {
    const params = status ? `?status=${status}` : '';
    const response = await api.get(`/admin/orders${params}`);
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/admin/orders/${id}/status?status=${status}`);
    return response.data;
  },

  getOrderStats: async () => {
    const response = await api.get('/admin/orders/stats');
    return response.data;
  },
};

export default adminOrderService;