import api from './api';

const productService = {
  getAllProducts: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.categoryId) params.append('categoryId', filters.categoryId);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    
    const response = await api.get(`/products?${params.toString()}`);
    return response.data;
  },

  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  getFeaturedProducts: async () => {
    const response = await api.get('/products/featured');
    return response.data;
  },
};

export default productService;