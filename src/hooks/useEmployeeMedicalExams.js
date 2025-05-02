// src/hooks/useEmployeeMedicalExams.js
import { useState, useEffect } from "react";
import api from "@/services/api";

export function useEmployeeMedicalExams(employeeId) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExams = async () => {
    if (!employeeId) {
      setExams([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/medical-exams/", { params: { employee: employeeId } });
      setExams(Array.isArray(res.data.results) ? res.data.results : []);
    } catch (err) {
      setError(err);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const uploadExam = async (formData) => {
    try {
      await api.post("/medical-exams/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      await fetchExams();  // refrescar lista al subir
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchExams();
  }, [employeeId]);

  return { exams, loading, error, uploadExam };
}
