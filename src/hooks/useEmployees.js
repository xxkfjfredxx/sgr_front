// src/hooks/useEmployees.js
import { useState, useEffect } from "react";
import api from "@/services/api";

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/employees/")
      .then((res) => {
        setEmployees(Array.isArray(res.data.results) ? res.data.results : []);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || err.message);
        setEmployees([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { employees, loading, error };
}
