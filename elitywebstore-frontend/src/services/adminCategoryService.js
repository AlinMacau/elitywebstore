import api from './api';

const adminCategoryService = {
  getAllCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },

  getCategoryById: async (id) => {
    const response = await api.get(`/admin/categories/${id}`);
    return response.data;
  },

  createCategory: async (categoryData) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },

  updateCategory: async (categoryData) => {
    const response = await api.put('/admin/categories', categoryData);
    return response.data;
  },

  deleteCategory: async (id) => {
    await api.delete(`/admin/categories/${id}`);
  },

  reactivateCategory: async (id) => {
    const response = await api.put(`/admin/categories/${id}/reactivate`);
    return response.data;
  },
};

export default adminCategoryService;