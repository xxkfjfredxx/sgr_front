// src/components/EmpresaSelector.jsx
import { useState, useContext, useEffect } from "react";
import { EmpresaContext } from "../context/EmpresaContext.jsx";
import { useAuthUser } from "@/hooks/useAuthUser";
import api from "@/services/api";

export default function EmpresaSelector() {
  const { empresaId, setEmpresaId } = useContext(EmpresaContext);
  const { user } = useAuthUser();
  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    if (!user) return;

    const isSuperAdmin =
      user.is_superuser ||
      (user.role?.name?.toLowerCase() === "admin" && !user.role.company);

    const endpoint = isSuperAdmin ? "/companies/" : "/companies/my-companies/";

    console.log("Usuario:", user);
    console.log("isSuperAdmin:", isSuperAdmin);
    console.log("Consultando endpoint:", endpoint);

    api
      .get(endpoint)
      .then((res) => {
        console.log("Empresas cargadas:", res.data.results);
        setEmpresas(res.data.results);
      })
      .catch((err) => {
        console.error("Error cargando empresas:", err);
      });
  }, [user]);

  // ✅ Seleccionar automáticamente si hay una sola empresa
  useEffect(() => {
    if (empresas.length === 1 && !empresaId) {
      setEmpresaId(empresas[0].id);
    }
  }, [empresas, empresaId, setEmpresaId]);

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
        onChange={(e) => setEmpresaId(Number(e.target.value))}>
        {empresas.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
