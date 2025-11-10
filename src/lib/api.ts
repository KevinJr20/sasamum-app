import axios from "axios";

const API_BASE = process.env.NODE_ENV === 'test' 
  ? "http://localhost:4000/api" 
  : ((import.meta as any).env?.VITE_API_BASE_URL ?? (import.meta as any).env?.VITE_API_URL ?? "http://localhost:4000/api");

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAuthToken(token?: string | null) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete (api.defaults.headers.common as any)["Authorization"];
  }
}

// Request interceptor: always attach token from localStorage if present
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("sasa_token");
    if (token && config.headers) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    // ignore (e.g., SSR or no localStorage)
  }
  return config;
});

// Response interceptor: handle 401 by attempting refresh once
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    // Only try refresh once per request
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("sasa_refresh");
        if (!refreshToken) throw new Error("No refresh token");

        // Call refresh endpoint directly with axios to avoid interceptor loop
        const resp = await axios.post(`${API_BASE.replace(/\/$/, "")}/auth/refresh`, { token: refreshToken }, { withCredentials: true });
        const newToken = resp.data?.token;
        if (!newToken) throw new Error("Invalid refresh response");

        // Persist and apply
        localStorage.setItem("sasa_token", newToken);
        setAuthToken(newToken);

        // Update original request and retry
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshErr) {
        // Give up: clear storage and redirect to login
        try {
          localStorage.removeItem("sasa_token");
          localStorage.removeItem("sasa_refresh");
        } catch (e) {}
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;