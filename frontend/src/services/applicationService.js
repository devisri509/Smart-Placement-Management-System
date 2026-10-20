import api from './api';

export const applicationService = {
  applyForJob: async (jobId) => {
    const response = await api.post('/applications/apply', null, {
      params: { jobId },
    });
    return response.data;
  },

  getMyApplications: async (page = 0, size = 10) => {
    const response = await api.get('/applications/my-applications', {
      params: { page, size },
    });
    return response.data;
  },

  getApplicationById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  getApplicationHistory: async (id) => {
    const response = await api.get(`/applications/${id}/history`);
    return response.data;
  },

  getJobApplicants: async (jobId) => {
    const response = await api.get(`/applications/job/${jobId}`);
    return response.data;
  },

  updateApplicationStatus: async (id, status, remarks) => {
    const response = await api.patch(`/applications/${id}/status`, { status, remarks });
    return response.data;
  },

  getCandidateProfile: async (applicationId) => {
    const response = await api.get(`/applications/${applicationId}/candidate-profile`);
    return response.data;
  },
};
