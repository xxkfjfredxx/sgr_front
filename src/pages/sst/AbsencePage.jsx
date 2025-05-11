import {
  Card, CardHeader, CardBody, Typography, Button, IconButton,
} from "@material-tailwind/react";
import {
    PlusIcon, PencilIcon, TrashIcon, PaperClipIcon,
  } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import { EmpresaContext } from "@/context/EmpresaContext";
import { useAbsences } from "@/hooks/useAbsences";
import AbsenceForm from "@/components/AbsenceForm";
import UploadSupportModal from "@/components/UploadSupportModal";

export default function AbsencePage() {
  const { empresaId } = useContext(EmpresaContext);
  const [year]                  = useState(new Date().getFullYear());
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);

  /* modal subir soporte */
  const [uploadCtx, setUploadCtx] = useState(null);

  const {
    data: absencesRaw,
    loading,
    error,
    createAbsence,
    updateAbsence,
    deleteAbsence,
  } = useAbsences({ empresaId, year });

  const absences = Array.isArray(absencesRaw) ? absencesRaw : [];

  /* ---------------- actions ---------------- */
  const openNew  = () => { setEditing(null); setShowForm(true); };
  const openEdit = (row) => { setEditing(row); setShowForm(true); };

  const handleSave = (payload) => {
    const action = editing
      ? updateAbsence(editing.id, payload)
      : createAbsence(payload);

    action.then((resp) => {
      setShowForm(false);
      const absenceId = editing ? editing.id : resp.data.id;
      /* abre modal subir soporte SOLO si tipo requiere EPS */
      const epsTypes = ["Incapacidad", "Licencia de Maternidad", "Licencia de Paternidad"];
      if (epsTypes.includes(payload.absence_type)) {
        setUploadCtx({
          employee: payload.employee,
          absenceId,
          absenceType: payload.absence_type,
        });
      }
    });
  };

  if (!empresaId) {
    return <Typography className="p-8">Selecciona una empresa para ver las ausencias.</Typography>;
  }

  return (
    <section className="p-6">
      <Card>
        <CardHeader floated={false} shadow={false} className="flex justify-between">
          <div>
            <Typography variant="h5">Ausentismo {year}</Typography>
            <Typography variant="small" className="opacity-70">
              Registro y seguimiento de ausencias de empleados
            </Typography>
          </div>
          <Button onClick={openNew} size="sm" color="blue" className="flex items-center gap-1">
            <PlusIcon className="w-4 h-4" /> Nuevo
          </Button>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0">
          {loading && <Typography className="p-4">Cargando…</Typography>}
          {error   && <Typography color="red" className="p-4">{error}</Typography>}

          {!loading && !error && absences.length === 0 && (
            <Typography className="p-4 opacity-70">No hay registros de ausentismo.</Typography>
          )}

          {!loading && !error && absences.length > 0 && (
            <table className="w-full min-w-max text-left">
              <thead>
                <tr className="bg-blue-gray-50/50">
                  {["Empleado", "Tipo", "Inicio", "Fin", "Días", ""].map((h) => (
                    <th key={h} className="p-4">
                      <Typography variant="small">{h}</Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {absences.map((row) => {
                  const days =
                    (new Date(row.end_date) - new Date(row.start_date)) / 86400000 + 1;
                  return (
                    <tr key={row.id} className="border-b last:border-b-0">
                      <td className="p-4">{row.employee_name}</td>
                      <td className="p-4">{row.absence_type}</td>
                      <td className="p-4">{row.start_date}</td>
                      <td className="p-4">{row.end_date}</td>
                      <td className="p-4">{days}</td>
                      <td className="p-4 flex gap-2">
                        {/* clip si hay soporte */}
                        {row.support_docs_count > 0 && (
                          <PaperClipIcon className="w-4 h-4 text-blue-500" />
                        )}
                        <IconButton variant="text" onClick={() => openEdit(row)}>
                          <PencilIcon className="w-4 h-4" />
                        </IconButton>
                        <IconButton
                          variant="text"
                          onClick={() =>
                            window.confirm("¿Eliminar?") && deleteAbsence(row.id)
                          }
                        >
                          <TrashIcon className="w-4 h-4" />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Formulario de ausencia */}
      {showForm && (
        <AbsenceForm
          open={showForm}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          initial={editing}
          empresaId={empresaId}
        />
      )}

      {/* Modal subir soporte */}
      {uploadCtx && (
        <UploadSupportModal
          open={!!uploadCtx}
          onClose={() => setUploadCtx(null)}
          ctx={uploadCtx}
        />
      )}
    </section>
  );
}
