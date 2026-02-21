import api from './api';

const addressService = {
  getAllByUserId: async (userId) => {
    const response = await api.get(`/addresses/user/${userId}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  create: async (addressData) => {
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  update: async (addressData) => {
    const response = await api.put('/addresses', addressData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/addresses/${id}`);
  },
};

export default addressService;