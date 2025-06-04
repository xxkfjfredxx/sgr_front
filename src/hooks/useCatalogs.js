import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useCatalogs() {
  const [positions, setPositions] = useState([]);
  const [workAreas, setWorkAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [posRes, areaRes] = await Promise.all([
          api.get('/positions/'),
          api.get('/work-areas/'),
        ]);
        setPositions(posRes.data);
        setWorkAreas(areaRes.data);
      } catch (err) {
        const msg = err.response?.data?.detail || err.response?.data?.message || err.message;
        setError(msg);
        console.error('Catalog fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogs();
  }, []);

  return { positions, workAreas, loading, error };
}
