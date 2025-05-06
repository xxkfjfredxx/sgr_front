// src/hooks/useEmployeeDocumentList.js
import { useEffect, useState } from 'react';
import api from '@/services/api';

export function useEmployeeDocumentList(employeeId) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0); // fuerza recarga manual

  const fetchDocuments = async () => {
    if (!employeeId) {
      setDocuments([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.get('/documents/', { params: { employee: employeeId } });
      const list = Array.isArray(res.data.results) ? res.data.results : [];
      setDocuments(list);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  // Se ejecuta al cambiar el empleado o cuando se pide refetch
  useEffect(() => {
    console.log("📥 useEffect ejecutado con employeeId:", employeeId, "reload:", reload);
    fetchDocuments();
  }, [employeeId, reload]);

  const refetch = () => setReload((prev) => prev + 1);

  return {
    documents,
    loading,
    error,
    refetch,
  };
}
