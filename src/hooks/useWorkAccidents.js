// src/hooks/useWorkAccidents.js
import { useState, useEffect, useContext } from "react";
import api from "@/services/api";
import { EmpresaContext } from "@/context/EmpresaContext";

export function useWorkAccidents() {
  const { empresaId } = useContext(EmpresaContext);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!empresaId) {
      setItems([]); setLoading(false);
      return;
    }
    setLoading(true);
    api.get("/work-accidents/", { params: { company: empresaId } })
      .then(res => {
        const data = Array.isArray(res.data.results) ? res.data.results : res.data;
        setItems(data);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [empresaId]);

  const create = (formData) =>
    api.post("/work-accidents/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  const update = (id, formData) =>
    api.put(`/work-accidents/${id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

  const remove = (id) => api.delete(`/work-accidents/${id}/`);

  return { items, loading, error, create, update, remove };
}
