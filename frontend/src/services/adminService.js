import api from './api';

export const adminService = {
  // Student Management
  getAllStudents: async () => {
    const response = await api.get('/students');
    return response.data;
  },

  deleteStudent: async (studentId) => {
    const response = await api.delete(`/students/${studentId}`);
    return response.data;
  },

  // Recruiter Management
  getAllRecruiters: async () => {
    const response = await api.get('/recruiters');
    return response.data;
  },

  approveRecruiter: async (recruiterId) => {
    const response = await api.patch(`/recruiters/${recruiterId}/approve`);
    return response.data;
  },

  deleteRecruiter: async (recruiterId) => {
    const response = await api.delete(`/recruiters/${recruiterId}`);
    return response.data;
  },

  // Job Management
  getAllJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  deactivateJob: async (jobId) => {
    const response = await api.patch(`/jobs/${jobId}/deactivate`);
    return response.data;
  },

  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },

  // Skill Management
  getAllSkills: async () => {
    const response = await api.get('/skills');
    return response.data;
  },

  getSkillCategories: async () => {
    const response = await api.get('/skills/categories');
    return response.data;
  },

  createSkill: async (skillData) => {
    const response = await api.post('/skills', skillData);
    return response.data;
  },

  deleteSkill: async (skillId) => {
    const response = await api.delete(`/skills/${skillId}`);
    return response.data;
  },

  // Application Monitoring & Analytics
  getAllApplications: async (params = {}) => {
    const response = await api.get('/applications', { params });
    return response.data;
  },
};
