// src/pages/sst/WorkAccidentList.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useWorkAccidents } from "@/hooks/useWorkAccidents";

export default function WorkAccidentList() {
  const { items, loading, error, remove } = useWorkAccidents();
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Accidentes de Trabajo</h2>
        <button
          onClick={() => navigate("/dashboard/sst/accidentes/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Nuevo Accidente
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando…</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Empleado",
                  "Fecha",
                  "Tipo",
                  "Severidad",
                  "Ubicación",
                  "Descripción",
                  "Días Perdidos",
                  "Acciones",
                ].map((h) => (
                  <th key={h} className="py-2 px-4 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((acc) => (
                <tr key={acc.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {acc.employee_data.first_name} {acc.employee_data.last_name} — {acc.employee_data.document}
                  </td>
                  <td className="py-2 px-4">{new Date(acc.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{acc.incident_type}</td>
                  <td className="py-2 px-4">{acc.severity}</td>
                  <td className="py-2 px-4">{acc.location}</td>
                  <td className="py-2 px-4">{acc.description}</td>
                  <td className="py-2 px-4">{acc.days_lost}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/dashboard/sst/accidentes/${acc.id}`)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        window.confirm("Eliminar?") &&
                        remove(acc.id).then(() => window.location.reload())
                      }
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
