import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="bg-blue-700 text-white w-64 min-h-screen px-4 py-6">
      <nav className="space-y-4">
      <Link to="/dashboard" className="block py-2 px-3 rounded hover:bg-blue-800">Inicio</Link>
        <Link to="/dashboard/profile" className="block py-2 px-3 rounded hover:bg-blue-800">Perfil</Link>
        <Link to="/dashboard/notifications" className="block py-2 px-3 rounded hover:bg-blue-800">Notificaciones</Link>
        <Link to="/dashboard/tables" className="block py-2 px-3 rounded hover:bg-blue-800">Tablas</Link>
      </nav>
    </aside>
  );
};

export default Sidebar;