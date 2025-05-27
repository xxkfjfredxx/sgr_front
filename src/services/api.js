import axios from 'axios';

const api = axios.create({
  baseURL: "http://localhost:8000/api/", // o usa import.meta.env.VITE_API_BASE
});

// Interceptor para agregar token a cada request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  const empresaId = localStorage.getItem("empresaActivaId");
  if (empresaId) {
    config.headers["X-Active-Company"] = empresaId;
  }

  return config;
});

// ⛔ Interceptor para detectar errores 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Elimina sesión
      localStorage.removeItem("token");
      localStorage.removeItem("empresaActivaId");
      localStorage.removeItem("user");

      // Redirige al login con mensaje de expiración
      window.location.href = '/?expired=1';
    }
    return Promise.reject(error);
  }
);

export default api;
