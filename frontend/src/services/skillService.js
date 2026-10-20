import api from './api';

export const skillService = {
  getAllSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  getAllCategories: async () => {
    const response = await api.get('/skills/categories');
    return response.data;
  },
};
