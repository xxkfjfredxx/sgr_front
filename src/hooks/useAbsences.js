import { useEffect, useState, useCallback } from "react";
import api from "@/services/api";

/**
 * Hook para listar y CRUD de ausencias.
 * @param {object} params – { empresaId, year }
 */
export function useAbsences({ empresaId, year }) {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchData = useCallback(() => {
    if (!empresaId) return;
    setLoading(true);
    api.get("/absences/", { params: { company: empresaId, year } })
    .then((r) => {const list = Array.isArray(r.data) ? r.data : (r.data.results || []);
      setData(list);
    })
      .catch((e) => setError(e.response?.data || "Error cargando ausencias"))
      .finally(() => setLoading(false));
  }, [empresaId, year]);

  useEffect(fetchData, [fetchData]);

  const createAbsence = (payload) =>
    api.post("/absences/", payload)
       .then((r) => { fetchData(); return r; });
  
  const updateAbsence = (id, payload) =>
    api.put(`/absences/${id}/`, payload)
       .then((r) => { fetchData(); return r; });

  const deleteAbsence = (id) =>
    api.delete(`/absences/${id}/`).then(fetchData);

  return { data, loading, error, createAbsence, updateAbsence, deleteAbsence };
}
