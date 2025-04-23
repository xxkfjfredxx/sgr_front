import { useState, useEffect } from 'react';
import api from '@/services/api';

export function useEmployeeMedicalExams(employeeId) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!employeeId) return;
    setLoading(true);
    api.get(`/occupational-health/medical-exams/?employee=${employeeId}`)
      .then(res => setExams(res.data))
      .catch(err => setError(err.response?.data?.detail || 'Error loading exams'))
      .finally(() => setLoading(false));
  }, [employeeId]);

  const uploadExam = async (formData) => {
    setError(null);
    try {
      const res = await api.post('/occupational-health/medical-exams/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setExams(prev => [res.data, ...prev]);
      return res;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error uploading exam');
      throw err;
    }
  };

  return { exams, loading, error, uploadExam, setExams };
}
