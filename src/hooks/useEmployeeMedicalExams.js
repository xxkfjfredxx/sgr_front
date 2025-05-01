// src/hooks/useEmployeeMedicalExams.js
import { useState, useEffect } from "react";
import api from "@/services/api";

// Cambiado el nombre de la función para que coincida con la importación
export function useEmployeeMedicalExams(employeeId) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchExams();
  }, [employeeId]);

  return { exams, loading, error };
}
