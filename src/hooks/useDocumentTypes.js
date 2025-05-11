import { useState, useEffect } from "react";
import api from "@/services/api";

export function useDocumentTypes(categoryCode) {
  const [types, setTypes]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    const params = categoryCode ? { category: categoryCode } : {};
    setLoading(true);
    api.get("/document-types/", { params })
       .then((r) => {
         const list = Array.isArray(r.data.results) ? r.data.results : r.data;
         setTypes(list);
       })
       .finally(() => setLoading(false));
  };

  useEffect(fetch, [categoryCode]);

  return { types, loading, refetch: fetch };
}
