import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useEmploymentLinks() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/employment-links/');
        // Extraemos el array de resultados de DRF
        const list = Array.isArray(res.data.results) ? res.data.results : [];
        setLinks(list);
      } catch (err) {
        const msg = err.response?.data?.detail || err.message;
        setError(msg);
        console.error('Error fetching employment links:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return { links, loading, error };
}
