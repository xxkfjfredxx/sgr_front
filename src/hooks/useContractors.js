// src/hooks/useContractors.js
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export function useContractors(params = {}) {
  return useQuery({
    queryKey: ["contractors", params],
    queryFn: async () => {
      const { data } = await api.get("/contratistas/contractors/", { params });
      return Array.isArray(data) ? data : data.results || [];
    },
  });
}
