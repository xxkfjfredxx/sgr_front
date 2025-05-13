import React from "react";
import { useNavigate } from "react-router-dom";
import { useVaccinations } from "@/hooks/useVaccinations";

export default function VaccinationList() {
  const { items, loading, error, remove } = useVaccinations();
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Registros de Vacunación</h2>
        <button
          onClick={() => navigate("/dashboard/sst/vaccinations/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Nuevo registro
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando registros...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 text-left">Empleado</th>
                <th className="py-2 px-4 text-left">Vacuna</th>
                <th className="py-2 px-4 text-left">Fecha</th>
                <th className="py-2 px-4 text-left">Vence</th>
                <th className="py-2 px-4 text-left">Soporte</th>
                <th className="py-2 px-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <div className="font-medium">{v.employee_name}</div>
                    <div className="text-sm text-gray-500">{v.employee_document}</div>
                  </td>
                  <td className="py-2 px-4">{v.vacuna}</td>
                  <td className="py-2 px-4">
                    {new Date(v.fecha).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(v.fecha_vencimiento).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">
                    {v.soporte ? (
                      <a
                        href={v.soporte}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline"
                      >
                        Ver
                      </a>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() =>
                        remove(v.id).then(() => window.location.reload())
                      }
                      className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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
