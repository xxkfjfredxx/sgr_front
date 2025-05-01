import { useState, useEffect, useContext } from "react";
import api from "@/services/api";
import { EmpresaContext } from "../context/EmpresaContext";

export function useActivities(month) {
  const { empresaId } = useContext(EmpresaContext);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!month || !empresaId) {
      setLoading(false);
      setActivities([]);
      return;
    }
    const fetchActivities = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get("/activities/", {
          params: { month, company: empresaId },
        });
        if (Array.isArray(res.data.results)) {
          setActivities(res.data.results);
        } else {
          setActivities([]);
          setError("La respuesta no contiene actividades");
        }
      } catch (err) {
        setError(err.message);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [month, empresaId]);

  return { activities, loading, error };
}
