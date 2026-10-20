import api from './api';

export const recruiterService = {
  getProfile: async () => {
    const response = await api.get('/recruiters/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/recruiters/profile', profileData);
    return response.data;
  },
};
