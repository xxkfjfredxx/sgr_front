import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-700">Sistema Gestión Riesgos</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">Cristian Suarez</span>
        <img
          src="https://via.placeholder.com/40"
          alt="User Avatar"
          className="w-10 h-10 rounded-full"
        />
      </div>
    </header>
  );
};

export default Navbar;