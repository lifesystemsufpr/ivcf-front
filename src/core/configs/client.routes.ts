export const clientRoutes = {
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },

  DASHBOARD: {
    HOME: "/dashboard",
  },

  PARTICIPANTS: {
    LIST: "/participants",
    DETAILS: ({ id }: { id: string }) => `/participants/${id}`,
  },

  IVCF: {
    LIST: "/ivcf",
    INSTRUCTIONS: "/ivcf/new/instructions",
    TEST: "/ivcf/new/assessment",
    RESULT: ({ id }: { id: string }) => `/ivcf/result/${id}`,
    EXPORT: ({ id }: { id: string }) => `/ivcf/result/${id}/pdf`,
  },

  ADMIN: {
    REPORTS: "/admin/reports",
  },

  PROFILE: "/profile",
};
