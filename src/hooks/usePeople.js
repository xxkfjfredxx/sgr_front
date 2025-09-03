// src/hooks/usePeople.js
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export function usePeople({ type = "all", active = "true", q = "" } = {}) {
  const params = {};
  if (type) params.type = type;
  if (active !== undefined && active !== null) params.active = active;
  if (q) params.q = q;

  return useQuery({
    queryKey: ["people", params],
    queryFn: async () => {
      const { data } = await api.get("/people/", { params });
      return Array.isArray(data) ? data : data.results || [];
    },
  });
}
