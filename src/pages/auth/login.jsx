import React, { useState, useEffect } from 'react';
import api from '@/services/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from "@/configs/routes";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("expired") === "1") {
      setError("Tu sesión ha expirado o fue cerrada en otro dispositivo.");
    }

    const token = localStorage.getItem('token');
    if (token) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [navigate, location]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await api.post('login/', { username, password });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      if (user) {
        localStorage.setItem('employeeId', user.employee_id ?? '');
        localStorage.setItem('userId', user.id ?? '');
        localStorage.setItem('username', user.username ?? '');
        localStorage.setItem('email', user.email ?? '');
        localStorage.setItem('role', user.role ?? '');
        localStorage.setItem('isStaff', String(user.is_staff ?? false));
        localStorage.setItem('isSuperuser', String(user.is_superuser ?? false));
      }

      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        setError('Credenciales incorrectas');
      } else {
        setError('Error de conexión al servidor');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Iniciar Sesión
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 transition duration-300"
          >
            Entrar
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default Login;
