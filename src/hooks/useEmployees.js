import { useGetEmployeesQuery } from '@/store/apiSlice';

export function useEmployees() {
  return useGetEmployeesQuery();
}
