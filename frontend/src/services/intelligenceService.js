import api from './api';

export const intelligenceService = {
  getEligibility: async (studentId, jobId) => {
    const response = await api.get('/intelligence/eligibility', {
      params: { studentId, jobId },
    });
    return response.data;
  },

  getSkillMatch: async (studentId, jobId) => {
    const response = await api.get('/intelligence/skill-match', {
      params: { studentId, jobId },
    });
    return response.data;
  },

  getSkillGap: async (studentId, jobId) => {
    const response = await api.get('/intelligence/skill-gap', {
      params: { studentId, jobId },
    });
    return response.data;
  },

  getRecommendations: async (studentId, weights = {}) => {
    const defaultWeights = {
      skillMatchWeight: 0.60,
      cgpaWeight: 0.20,
      backlogWeight: 0.10,
      graduationYearWeight: 0.10,
      ...weights,
    };
    const response = await api.post('/intelligence/recommendations', defaultWeights, {
      params: { studentId },
    });
    return response.data;
  },
};
