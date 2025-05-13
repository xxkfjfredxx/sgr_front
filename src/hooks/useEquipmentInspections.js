import { useState, useEffect } from "react";
import api from "@/services/api";

export function useEquipmentInspections(equipmentId) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!equipmentId) return;
    setLoading(true);
    api.get("/equipment-inspections/", { params: { equipment: equipmentId } })
      .then((res) => {
        const data = Array.isArray(res.data.results)
          ? res.data.results
          : res.data;
        setItems(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [equipmentId]);

  const create = (payload) => {
    const form = new FormData();
    form.append("equipment", equipmentId);
    form.append("fecha", payload.fecha);
    form.append("resultado", payload.resultado);
    form.append("tecnico", payload.tecnico);
    if (payload.evidencia) form.append("evidencia", payload.evidencia);

    return api.post("/equipment-inspections/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const remove = (id) => api.delete(`/equipment-inspections/${id}/`);

  return { items, loading, error, create, remove };
}
