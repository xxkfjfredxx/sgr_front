// src/components/EmpresaSelector.jsx
import { useState, useContext, useEffect } from "react";
import { EmpresaContext } from "../context/EmpresaContext.jsx";
import api from "@/services/api";

export default function EmpresaSelector() {
  const { empresaId, setEmpresaId } = useContext(EmpresaContext);
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    api.get("/companies/").then((res) => setEmpresas(res.data.results));
  }, []);

  return (
    <div className="inline-block w-64">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Empresa
      </label>
      <select
        className="
          block w-full 
          px-4 py-2 
          bg-white 
          border border-gray-300 
          rounded-lg 
          shadow-sm 
          text-gray-700 
          text-sm 
          focus:outline-none 
          focus:ring-2 focus:ring-blue-400 
          focus:border-transparent
        "
        value={empresaId ?? ""}
        onChange={(e) => setEmpresaId(Number(e.target.value))}
      >
        <option value="" disabled>
          Selecciona empresa
        </option>
        {empresas.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
