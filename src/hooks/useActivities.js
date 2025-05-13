// src/hooks/useActivities.js
import { useState, useEffect, useContext } from "react";
import api from "@/services/api";
import { EmpresaContext } from "@/context/EmpresaContext";

export function useActivities({ month, year }) {
  const { empresaId } = useContext(EmpresaContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  useEffect(() => {
    if (!empresaId || !month || !year) {
      setActivities([]);
      return;
    }
    setLoading(true);
    setError(null);
    api
      .get("/activities/", {
        params: { company: empresaId, month, year },
      })
      .then((res) => {
        const data = Array.isArray(res.data.results) ? res.data.results : res.data;
        setActivities(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [empresaId, month, year]);

  const create = async ({ title, description = "", start_date, end_date, status = "pending" }) => {
    const payload = { company: empresaId, title, description, start_date, end_date, status };
    const res = await api.post("/activities/", payload);
    setActivities((prev) => [...prev, res.data]);
    return res;
  };

  const update = async (id, data) => {
    const res = await api.put(`/activities/${id}/`, { ...data, company: empresaId });
    setActivities((prev) => prev.map((act) => (act.id === id ? res.data : act)));
    return res;
  };

  return { activities, loading, error, create, update };
}
