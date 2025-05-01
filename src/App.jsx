import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "@/components/PrivateRoute";
import { Dashboard, Auth } from "@/layouts";
import Login from '@/pages/auth/login';

function App() {
  return (
    <Routes>
      <Route path="/dashboard/*" element={<PrivateRoute> <Dashboard /> </PrivateRoute>} />
      <Route path="/auth/*" element={<Auth />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
      <Route path='/' element={<Login />} />
    </Routes>
  );
}

export default App;
