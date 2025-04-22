import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useCatalogs() {
  const [positions, setPositions] = useState([]);
  const [workAreas, setWorkAreas] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [posRes, areaRes, compRes] = await Promise.all([
          api.get('/positions/'),
          api.get('/work-areas/'),
          api.get('/companies/'),
        ]);
        setPositions(posRes.data);
        setWorkAreas(areaRes.data);
        setCompanies(compRes.data);
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

  return { positions, workAreas, companies, loading, error };
}

