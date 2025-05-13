import { useState, useEffect } from "react";
import api from "@/services/api";

export function useVaccinations() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    api.get("/vaccinations/")
      .then(res => {
        // Ajusta si tu API usa paginación:
        const data = Array.isArray(res.data.results) ? res.data.results : res.data;
        setItems(data);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const create = (data) => {
    const form = new FormData();
    form.append("employee", String(data.employee));              // entero convertido a string
    form.append("vacuna", data.vacuna);
    form.append("fecha", data.fecha);                           // "YYYY-MM-DD"
    form.append("fecha_vencimiento", data.fecha_vencimiento);   // "YYYY-MM-DD"
    if (data.soporte) form.append("soporte", data.soporte);

    return api.post("/vaccinations/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const remove = (id) => api.delete(`/vaccinations/${id}/`);

  return { items, loading, error, create, remove };
}
