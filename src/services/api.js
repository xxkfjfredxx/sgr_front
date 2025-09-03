// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000/api/",
});

api.interceptors.request.use((config) => {
  // No agregues token/empresa al login
  if (!config.url.includes('login')) {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Token ${token}`;
    const empresaId = localStorage.getItem("empresaActivaId");
    if (empresaId) config.headers['x-active-company'] = empresaId;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("empresaActivaId");
      localStorage.removeItem("user");
      window.location.href = '/?expired=1';
    }
    return Promise.reject(error);
  }
);

export default api;
