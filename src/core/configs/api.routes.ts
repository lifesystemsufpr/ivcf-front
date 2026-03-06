export const API_URL_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const apiRoutes = {
  AUTH: {
    LOGIN: `${API_URL_BASE}/auth/login`,
    REFRESH: `${API_URL_BASE}/auth/refresh`,
  },
};
