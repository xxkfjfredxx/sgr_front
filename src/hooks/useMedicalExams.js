import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useMedicalExams(employeeId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!employeeId) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    api.get(`/medical-exams/?employee=${employeeId}`)
      .then((res) => {
        setData(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || 'Error loading medical exams');
        setData([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [employeeId]);

  return { data, loading, error };
}
