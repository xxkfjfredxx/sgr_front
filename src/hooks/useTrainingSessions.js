import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";

/**
 * Hook para CRUD de capacitaciones.
 * @param {object} params – { empresaId, year }
 */
export function useTrainingSessions({ empresaId, year }) {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(() => {
    if (!empresaId) return;
    setLoading(true);
    api.get("/training-sessions/", {
      params: { company: empresaId, year },
    })
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : r.data.results || [];
        setData(list);
      })
      .catch((e) => setError(e.response?.data || "Error cargando sesiones"))
      .finally(() => setLoading(false));
  }, [empresaId, year]);

  useEffect(fetchData, [fetchData]);

  const createSession = (payload) =>
    api.post("/training-sessions/", payload).then((r) => {
      fetchData();
      return r;
    });

  const updateSession = (id, payload) =>
    api.put(`/training-sessions/${id}/`, payload).then((r) => {
      fetchData();
      return r;
    });

  const deleteSession = (id) =>
    api.delete(`/training-sessions/${id}/`).then(fetchData);

  return { data, loading, error, createSession, updateSession, deleteSession };
}
