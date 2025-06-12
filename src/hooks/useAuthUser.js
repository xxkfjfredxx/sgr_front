import { useMemo } from "react";

export function useAuthUser() {
  let parsedRole = null;
  try {
    parsedRole = JSON.parse(localStorage.getItem("role") || "null");
  } catch (e) {
    parsedRole = null;
  }

  const user = useMemo(() => ({
    id: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    employee_id: localStorage.getItem("employeeId"),
    is_staff: localStorage.getItem("isStaff") === "true",
    is_superuser: localStorage.getItem("isSuperuser") === "true",
    role: parsedRole,
  }), []);

  const token = localStorage.getItem("token");

  return { user, token };
}
