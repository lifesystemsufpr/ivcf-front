export const API_URL_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiRoutes = {
  AUTH: {
    LOGIN: `${API_URL_BASE}/auth/login`,
    REFRESH: `${API_URL_BASE}/auth/refresh`,
    FORGOT_PASSWORD: `${API_URL_BASE}/auth/forgot-password`,
    RESET_PASSWORD: `${API_URL_BASE}/auth/reset-password`,
    REGISTER: `${API_URL_BASE}/health-professional`,
  },

  PARTICIPANTS: {
    LIST: `${API_URL_BASE}/participant`,
    INDICATORS: ({ id }: { id: string }) =>
      `/questionnaires/participant/${id}/evolution/daily`,
    CHECK_EMAIL: ({ email }: { email: string }) =>
      `${API_URL_BASE}/participant/check-email/${email}`,
  },

  HISTORICO_BASES: {
    LIST: ({ id }: { id: string }) =>
      `${API_URL_BASE}/participants/${id}/historico-bases`,
    CREATE: ({ id }: { id: string }) =>
      `${API_URL_BASE}/participants/${id}/historico-bases`,
  },

  SHARE_REQUESTS: {
    LIST: `${API_URL_BASE}/share-requests`,
    REQUEST_BASES: `${API_URL_BASE}/share-requests`,
    APPROVE: ({ id }: { id: string }) =>
      `${API_URL_BASE}/share-requests/${id}/approve`,
    REJECT: ({ id }: { id: string }) =>
      `${API_URL_BASE}/share-requests/${id}/reject`,
    CANCEL: ({ id }: { id: string }) =>
      `${API_URL_BASE}/share-requests/${id}/cancel`,
  },

  PROFESSIONALS: {
    LINK_PARTICIPANT: `${API_URL_BASE}/health-professional/link-participant`,
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
    EXPORT: `${API_URL_BASE}/questionnaires/dashboard/export`,
    DETAIL_CHART: `${API_URL_BASE}/questionnaires/classified-participants`,
  },
};
