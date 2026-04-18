import api from './api';

const addressService = {
  getAllByUserId: async (userId) => {
    console.log('Getting all addresses for userId:', userId);
    const response = await api.get(`/addresses/user/${userId}`);
    return response.data;
  },

  getByUserIdAndType: async (userId, addressType) => {
    console.log('Getting addresses for userId:', userId, 'type:', addressType);
    const response = await api.get(`/addresses/user/${userId}/type/${addressType}`);
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/addresses/${id}`);
    return response.data;
  },

  create: async (addressData) => {
    console.log('addressService.create called with data:', addressData);
    const response = await api.post('/addresses', addressData);
    return response.data;
  },

  update: async (addressData) => {
    console.log('addressService.update called with data:', addressData);
    const response = await api.put('/addresses', addressData);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/addresses/${id}`);
  },
};

export default addressService;