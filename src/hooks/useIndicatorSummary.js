import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useIndicatorSummary(from = '2024-01', to = '2024-12') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get(`/indicators/summary/?from=${from}&to=${to}`)
      .then((res) => {
        setData(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || 'Error loading indicators');
      })
      .finally(() => setLoading(false));
  }, [from, to]);

  return { data, loading, error };
}
