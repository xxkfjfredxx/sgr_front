// src/hooks/useEmployees.js
import { useState, useEffect } from "react";
import api from "@/services/api";

export function useEmployees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
       api.get('/employees/')
         .then((res) => {
           // si viene paginado, usar .results; si ya viene plano, usarlo directamente
           const payload = res.data;
           const list =
             Array.isArray(payload) ?
               payload :
               // en tu API DRF seguro está en payload.results
               payload.results || [];
           setEmployees(list);
         })
      .catch((err) => {
        setError(err.response?.data?.detail || err.message);
        setEmployees([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { employees, loading, error };
}
