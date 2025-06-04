export function useAuthUser() {
  const user = {
    id: localStorage.getItem("userId"),
    username: localStorage.getItem("username"),
    email: localStorage.getItem("email"),
    employee_id: localStorage.getItem("employeeId"),
    is_staff: localStorage.getItem("isStaff") === "true",
    is_superuser: localStorage.getItem("isSuperuser") === "true",
    role: JSON.parse(localStorage.getItem("role") || "null"),
  };

  const token = localStorage.getItem("token");

  return { user, token };
}
