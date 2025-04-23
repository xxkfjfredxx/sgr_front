export function useAuthUser() {
    
    const employeeId = localStorage.getItem('employeeId');
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');
    const role = localStorage.getItem('role');
    const isStaff = localStorage.getItem('isStaff') === "true";
    const isSuperuser = localStorage.getItem('isSuperuser') === "true";
    const token = localStorage.getItem('token');
  
    return { employeeId, userId, username, email, role, isStaff, isSuperuser, token };
  }