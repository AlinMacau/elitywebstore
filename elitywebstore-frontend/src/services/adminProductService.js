import api from './api';

const adminProductService = {
  getAllProducts: async () => {
    const response = await api.get('/admin/products');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },

  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },

  updateProduct: async (productData) => {
    const response = await api.put('/admin/products', productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    await api.delete(`/admin/products/${id}`);
  },

  reactivateProduct: async (id) => {
    const response = await api.put(`/admin/products/${id}/reactivate`);
    return response.data;
  },
};

export default adminProductService;
