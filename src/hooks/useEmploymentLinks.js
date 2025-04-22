import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useEmploymentLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get('/employment-links/')
      .then((res) => setLinks(res.data))
      .catch((err) => {
        const msg = err.response?.data?.detail || err.message;
        setError(msg);
        console.error('Error fetching employment links:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return { links, loading, error };
}
