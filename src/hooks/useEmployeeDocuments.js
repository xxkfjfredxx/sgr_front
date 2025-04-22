import { useState } from 'react';
import api from '@/services/api';

export function useEmployeeDocuments(employeeId) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const uploadDocument = async (formData) => {
    setUploading(true);
    setError(null);
    try {
      await api.post('/documents/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      setError(msg);
    } finally {
      setUploading(false);
    }
  };

  return { uploadDocument, uploading, error };
}
