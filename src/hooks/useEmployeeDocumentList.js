import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useEmployeeDocumentList(employeeId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    setError(null);
    setDocuments([]);
    if (!employeeId) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.get(`/documents/`, { params: { employee: employeeId } });
      // DRF devuelve paginación: results
      const list = Array.isArray(res.data.results) ? res.data.results : [];
      setDocuments(list);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [employeeId]);

  return { documents, loading, error, refetch: fetchDocuments };
}
