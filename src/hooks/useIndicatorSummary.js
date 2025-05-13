// src/hooks/useIndicatorSummary.js
import { useState, useEffect, useContext } from "react";
import api from "@/services/api";
import { EmpresaContext } from "@/context/EmpresaContext";

export function useIndicatorSummary() {
  const { empresaId } = useContext(EmpresaContext);
  const [data, setData]     = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!empresaId) return;

    // obtenemos mes actual en YYYY-MM
    const now   = new Date();
    const year  = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const from  = `${year}-${month}`;
    const to    = from; // mismo mes

    setLoading(true);
    setError(null);

    api
      .get("/api/indicator-summary/", {
        params: { company: empresaId, from, to },
      })
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [empresaId]);

  return { data, loading, error };
}
