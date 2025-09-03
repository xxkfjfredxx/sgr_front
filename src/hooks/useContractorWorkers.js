// src/hooks/useContractorWorkers.js
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export function useContractorWorkers(params = {}) {
  return useQuery({
    queryKey: ["contractor-workers", params],
    queryFn: async () => {
      const { data } = await api.get("/contratistas/contractor-workers/", { params });
      return Array.isArray(data) ? data : data.results || [];
    },
  });
}
