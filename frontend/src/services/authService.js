import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  registerStudent: async (studentData) => {
    const response = await api.post('/auth/register/student', studentData);
    return response.data;
  },

  registerRecruiter: async (recruiterData) => {
    const response = await api.post('/auth/register/recruiter', recruiterData);
    return response.data;
  },
};
