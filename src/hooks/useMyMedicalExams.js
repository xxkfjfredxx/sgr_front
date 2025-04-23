import { useState, useEffect } from 'react';
import api from '@/services/api';

export function useMyMedicalExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api.get('/occupational-health/medical-exams/?mine=true')
      .then(res => setExams(res.data))
      .catch(err => setError(err.response?.data?.detail || 'Error loading exams'))
      .finally(() => setLoading(false));
  }, []);

  return { exams, loading, error, setExams };
}
