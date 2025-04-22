import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/employees/')
      .then((res) => {
        setEmployees(res.data);
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
