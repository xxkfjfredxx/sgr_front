import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useEmployeeDocumentList(employeeId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/documents/?employee=${employeeId}`);
      setDocuments(res.data);
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!employeeId) return; // ✅ prevenir llamada inválida
  
    setLoading(true);
    api.get(`/documents/?employee=${employeeId}`)
      .then((res) => setDocuments(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [employeeId]);
  
  return { documents, loading, error, refetch: fetchDocuments };
}

