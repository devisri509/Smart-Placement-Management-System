import api from './api';

export const studentService = {
  getProfile: async () => {
    const response = await api.get('/students/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put('/students/profile', profileData);
    return response.data;
  },

  getStudentSkills: async (studentId) => {
    const response = await api.get(`/students/${studentId}/skills`);
    return response.data;
  },

  addStudentSkill: async (studentId, skillData) => {
    const response = await api.post(`/students/${studentId}/skills`, skillData);
    return response.data;
  },

  deleteStudentSkill: async (studentId, skillId) => {
    const response = await api.delete(`/students/${studentId}/skills/${skillId}`);
    return response.data;
  },

  getEducation: async (studentId) => {
    const response = await api.get(`/education/student/${studentId}`);
    return response.data;
  },

  addEducation: async (educationData) => {
    const response = await api.post('/education', educationData);
    return response.data;
  },

  deleteEducation: async (id) => {
    const response = await api.delete(`/education/${id}`);
    return response.data;
  },
};
