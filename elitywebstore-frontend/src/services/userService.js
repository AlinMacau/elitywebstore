import api from './api';

const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  getUserById: async (id) => {
    const response = await api.get(`/users/details/${id}`);
    return response.data;
  },

  updateUser: async (userData) => {
    const response = await api.put('/users', userData);
    return response.data;
  },

  deleteUser: async (id) => {
    await api.delete(`/users/details/${id}`);
  },
};

export default userService;