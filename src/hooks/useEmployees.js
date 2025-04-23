import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useEmployees() {
  const [employees, setEmployees] = useState([]); // ✅ array por defecto
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/employees/')
      .then((res) => {
        console.log('[DEBUG] /employees/ response:', res.data);

        // ✅ Validar que sea un array antes de usar
        if (Array.isArray(res.data)) {
          setEmployees(res.data);
        } else {
          console.error('Respuesta inválida del backend (no es array):', res.data);
          setEmployees([]); // Para evitar crash
          setError('⚠️ Error: el backend no devolvió una lista de empleados.');
        }
      })
      .catch((err) => {
        const status = err.response?.status;
        const msg = err.response?.data?.detail || err.message;
        setError(`(${status}) ${msg}`);
        console.error('Error loading employees:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { employees, loading, error };
}
