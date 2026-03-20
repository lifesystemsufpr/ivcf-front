export const API_URL_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiRoutes = {
  AUTH: {
    LOGIN: `${API_URL_BASE}/auth/login`,
    REFRESH: `${API_URL_BASE}/auth/refresh`,
    REGISTER: `${API_URL_BASE}/health-professional`,
  },

  PARTICIPANTS: {
    LIST: `${API_URL_BASE}/participant`,
    INDICATORS: ({ id }: { id: string }) =>
      `/questionnaires/participant/${id}/evolution`,
  },

  ASSESSMENTS: {
    LIST: `${API_URL_BASE}/questionnaires`,
    BY_PARTICIPANT: (participantId: string) =>
      `${API_URL_BASE}/questionnaires/participant/${participantId}`,
    RESPONSE: (assessmentId: string) =>
      `${API_URL_BASE}/questionnaires/response/${assessmentId}`,
    IVCF_RESPONSE: () => `${API_URL_BASE}/questionnaires/response`,
    IVCF_STRUCTURE: `${API_URL_BASE}/questionnaires/ivcf-20`,
    DASHBOARD: `${API_URL_BASE}/questionnaires/dashboard`,
  },
};
