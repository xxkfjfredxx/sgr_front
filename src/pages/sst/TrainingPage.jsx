import {
  Card, CardHeader, CardBody, Typography, Button,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useContext, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { EmpresaContext } from "@/context/EmpresaContext";
import { useTrainingSessions } from "@/hooks/useTrainingSessions";
import TrainingSessionForm from "@/components/TrainingSessionForm";

export default function TrainingPage() {
  const { empresaId } = useContext(EmpresaContext);
  const navigate      = useNavigate();
  const [year]        = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);

  const {
    data: sessions,
    loading,
    error,
    createSession,
  } = useTrainingSessions({ empresaId, year });

  const saveSession = (fd) =>
    createSession(fd).then(() => setShowForm(false));

  return (
    <section className="p-6">
      <Card>
        <CardHeader floated={false} shadow={false} className="flex justify-between">
          <div>
            <Typography variant="h5">Capacitaciones {year}</Typography>
            <Typography variant="small" className="opacity-70">
              Registro de sesiones de formación en SST
            </Typography>
          </div>
          <Button
            size="sm"
            color="blue"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" /> Nueva sesión
          </Button>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0">
          {loading ? (
            <Typography className="p-4">Cargando…</Typography>
          ) : error ? (
            <Typography color="red" className="p-4">
              {error}
            </Typography>
          ) : sessions.length === 0 ? (
            <Typography className="p-4 opacity-70">
              Sin sesiones registradas.
            </Typography>
          ) : (
            <table className="w-full min-w-max text-left">
              <thead>
                <tr className="bg-blue-gray-50/50">
                  {["Tema", "Fecha", "Duración (h)", "Instructor", ""].map((h) => (
                    <th key={h} className="p-4">
                      <Typography variant="small">{h}</Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sessions.map((s) => (
                  <tr key={s.id} className="border-b last:border-b-0">
                    <td className="p-4">{s.topic}</td>
                    <td className="p-4">{s.date}</td>
                    <td className="p-4">{s.duration_hours ?? "—"}</td>
                    <td className="p-4">{s.instructor}</td>
                    <td className="p-4">
                      <Button
                        size="sm"
                        variant="text"
                        onClick={() => navigate(`/dashboard/sst/capacitaciones/${s.id}`)}
                      >
                        Gestionar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Modal crear / editar sesión */}
      {showForm && (
        <TrainingSessionForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSave={saveSession}
        />
      )}
    </section>
  );
}
