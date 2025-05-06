import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useEmploymentLinks(companyId) {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!companyId) return;

    const fetchLinks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get('/employment-links/', {
          params: { company: companyId }
        });
        const list = Array.isArray(res.data.results) ? res.data.results : [];
        setLinks(list);
      } catch (err) {
        setError(err.response?.data?.detail || err.message);
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [companyId]);

  return { links, loading, error };
}
