// src/hooks/useWorkerAssignments.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/services/api";

export function useAssignmentCandidates({ contractor_company, people_type="all", active_only=true } = {}) {
  const params = {};
  if (contractor_company) params.contractor_company = contractor_company;
  if (people_type) params.people_type = people_type;
  params.active_only = active_only;

  return useQuery({
    queryKey: ["assignment-candidates", params],
    queryFn: async () => {
      const { data } = await api.get("/contratistas/worker-assignments/candidates", { params });
      return Array.isArray(data) ? data : data.results || [];
    },
    enabled: !!contractor_company || people_type === "all",
  });
}

export function useBulkClosePreview() {
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/contratistas/worker-assignments/bulk_close_preview", payload);
      return data;
    },
  });
}

export function useBulkClose() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const { data } = await api.post("/contratistas/worker-assignments/bulk_close", payload);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["assignment-candidates"] });
    }
  });
}
