// src/pages/sst/MedicalExamList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMedicalExams } from "@/hooks/useMedicalExams";

// Si el backend aún no envía `next_due`, calculamos un fallback en cliente:
function computeNextDue(dateStr, riskLevel) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  switch (riskLevel) {
    case "I":
      d.setFullYear(d.getFullYear() + 3);
      break;
    case "II":
      d.setFullYear(d.getFullYear() + 2);
      break;
    case "III":
      d.setFullYear(d.getFullYear() + 1);
      break;
    case "IV":
      d.setMonth(d.getMonth() + 6);
      break;
    default:
      d.setFullYear(d.getFullYear() + 1);
  }
  return d;
}

export default function MedicalExamList() {
  const { items, loading, error, remove } = useMedicalExams();
  const navigate = useNavigate();

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Aptitud Médica</h2>
        <button
          onClick={() => navigate("/dashboard/sst/aptitud-medica/new")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Nuevo Examen
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
                  "Fase",
                  "Sub-tipo",
                  "Riesgo",
                  "Fecha",
                  "Entidad",
                  "Aptitud",
                  "Próximo Vence",
                  "Acciones",
                ].map((h) => (
                  <th key={h} className="py-2 px-4 text-left text-sm">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((exam) => {
                // preferimos exam.next_due; si no existe, lo calculamos
                const nextDueDate = exam.next_due
                  ? new Date(exam.next_due)
                  : computeNextDue(exam.date, exam.risk_level);

                return (
                  <tr key={exam.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{exam.employee_name}</td>
                    <td className="py-2 px-4">{exam.exam_phase}</td>
                    <td className="py-2 px-4">{exam.sub_type}</td>
                    <td className="py-2 px-4">{exam.risk_level}</td>
                    <td className="py-2 px-4">
                      {new Date(exam.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">{exam.entity}</td>
                    <td className="py-2 px-4">{exam.aptitude}</td>
                    <td className="py-2 px-4">
                      {nextDueDate
                        ? nextDueDate.toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="py-2 px-4 flex gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/sst/aptitud-medica/${exam.id}`)
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() =>
                          window
                            .confirm("¿Eliminar examen?")
                            && remove(exam.id).then(() => window.location.reload())
                        }
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
