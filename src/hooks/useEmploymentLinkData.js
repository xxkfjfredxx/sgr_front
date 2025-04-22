import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useEmploymentLinkData() {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [workAreas, setWorkAreas] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [empRes, posRes, areaRes, compRes] = await Promise.all([
          api.get('/employees/'),
          api.get('/positions/'),
          api.get('/work-areas/'),
          api.get('/companies/')
        ]);

        setEmployees(empRes.data);
        setPositions(posRes.data);
        setWorkAreas(areaRes.data);
        setCompanies(compRes.data);
      } catch (err) {
        const msg = err.response?.data?.detail || err.message;
        setError(msg);
        console.error('Error fetching employment link data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  return { employees, positions, workAreas, companies, loading, error };
}
