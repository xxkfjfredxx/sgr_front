// src/hooks/useEmployees.js
import { useQuery } from "@tanstack/react-query";
import api from "@/services/api";

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const res = await api.get("/employees/");
      const payload = res.data;
      return Array.isArray(payload) ? payload : payload.results || [];
    },
  });
}
