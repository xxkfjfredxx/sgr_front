import { useState, useEffect } from "react";
import api from "@/services/api";

export function useActivity(id) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      // Asegúrate de incluir la barra final y no usar ':id'
      const res = await api.get(`/activities/${id}/`);
      setActivity(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchActivity();
    }
  }, [id]);

  return { activity, loading, error, refetch: fetchActivity };
}
