import {
  Card, CardHeader, CardBody, Typography, Button, Chip,
} from "@material-tailwind/react";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import api from "@/services/api";
import AttendanceSelector from "@/components/AttendanceSelector";
import CertificationUpload from "@/components/CertificationUpload";
import { EmpresaContext } from "@/context/EmpresaContext";

export default function TrainingSessionDetail() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { empresaId } = useContext(EmpresaContext);

  const [session, setSession]           = useState(null);
  const [attendances, setAttendances]   = useState([]);      // activos + borrados
  const [loading, setLoading]           = useState(true);
  const [attendanceOpen, setAttendanceOpen] = useState(false);
  const [certUpload, setCertUpload]     = useState(null);    // participantId

  /* ---- obtener sesión ---- */
  useEffect(() => {
    api.get(`/training-sessions/${id}/`).then((r) => {
      setSession(r.data);
      setLoading(false);
    });
  }, [id]);

  /* ---- obtener asistencias (incluye borrados) ---- */
  const fetchAtt = () => {
    api
      .get("/training-attendance/", {
        params: { session: id, include_deleted: true },
      })
      .then((r) => {
        const list = Array.isArray(r.data.results) ? r.data.results : r.data;
        setAttendances(list);
      });
  };
  useEffect(fetchAtt, [id]);

  if (loading)  return <Typography className="p-8">Cargando…</Typography>;
  if (!session) return <Typography className="p-8">Sesión no encontrada.</Typography>;

  const isRegulated = /alturas|espacios confinados/i.test(session.topic);

  /* ---- solo registros activos ---- */
  const attActive = attendances.filter((a) => !a.is_deleted);

  /* ---- helper para campo label/valor ---- */
  const Field = ({ label, value, className = "" }) => (
    <div className={`flex flex-col ${className}`}>
      <Typography variant="small" className="opacity-70">{label}</Typography>
      <Typography>{value}</Typography>
    </div>
  );

  return (
    <section className="p-6 grid gap-6">
      <Button variant="text" onClick={() => navigate(-1)}>← Volver</Button>

      {/* Datos básicos */}
      <Card>
        <CardHeader floated={false} className="pb-0">
          <Typography variant="h6">Datos de la sesión</Typography>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-2 gap-2">
            <Field label="Tema"           value={session.topic} />
            <Field label="Fecha"          value={session.date} />
            <Field label="Duración (h)"   value={session.duration_hours || "—"} />
            <Field label="Modalidad"      value={session.modality || "—"} />
            <Field label="Instructor"     value={session.instructor} className="md:col-span-2" />
            <Field
              label="Evidencia"
              value={
                session.supporting_document
                  ? (
                    <a
                      href={session.supporting_document}
                      className="text-blue-600"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ver documento
                    </a>
                  )
                  : "—"
              }
              className="md:col-span-2"
            />
          </div>
        </CardBody>
      </Card>

      {/* Asistentes */}
      <Card>
        <CardHeader floated={false} className="pb-0 flex justify-between">
          <Typography variant="h6">Asistentes</Typography>
          <Button size="sm" onClick={() => setAttendanceOpen(true)}>
            Agregar / Editar
          </Button>
        </CardHeader>

        <CardBody className="overflow-x-auto px-0">
          {attActive.length === 0 ? (
            <Typography className="p-4 opacity-70">Sin asistentes.</Typography>
          ) : (
            <table className="w-full min-w-max text-left">
              <thead>
                <tr className="bg-blue-gray-50/50">
                  {["Empleado", "Asistió", "Firma", "Acciones"].map((h) => (
                    <th key={h} className="p-3">
                      <Typography variant="small">{h}</Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attActive.map((a) => (
                  <tr key={a.id} className="border-b last:border-b-0">
                    <td className="p-3">{a.employee_name}</td>
                    <td className="p-3">
                      {a.attended ? <Chip value="Sí" color="green" size="sm" /> : "No"}
                    </td>
                    <td className="p-3">
                      {a.signature_file ? (
                        <a
                          href={a.signature_file}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600"
                        >
                          📎
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-3 flex gap-2">
                      {/* subir firma */}
                      <label className="cursor-pointer text-blue-600">
                        📤
                        <input
                          type="file"
                          hidden
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const fd = new FormData();
                            fd.append("signature_file", file);
                            api
                              .patch(`/training-attendance/${a.id}/`, fd)
                              .then(fetchAtt);
                          }}
                        />
                      </label>

                      {/* eliminar lógico */}
                      <Button
                        size="sm"
                        variant="text"
                        color="red"
                        onClick={() => {
                          if (!window.confirm("¿Quitar asistencia?")) return;
                          api
                            .patch(`/training-attendance/${a.id}/`, { is_deleted: true })
                            .then(fetchAtt);
                        }}
                      >
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      {/* Certificados */}
      {isRegulated && (
        <Card>
          <CardHeader floated={false} className="pb-0">
            <Typography variant="h6">Certificados</Typography>
          </CardHeader>
          <CardBody className="overflow-x-auto px-0">
            {attActive.filter((a) => a.attended).length === 0 ? (
              <Typography className="p-4 opacity-70">
                Aún no hay asistentes registrados.
              </Typography>
            ) : (
              <table className="w-full min-w-max text-left">
                <thead>
                  <tr className="bg-blue-gray-50/50">
                    {["Participante", "Certificado", ""].map((h) => (
                      <th key={h} className="p-3">
                        <Typography variant="small">{h}</Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {attActive
                    .filter((a) => a.attended)
                    .map((a) => (
                      <tr key={a.id} className="border-b last:border-b-0">
                        <td className="p-3">{a.employee_name}</td>
                        <td className="p-3">
                          {a.certificate ? (
                            <a
                              href={a.certificate.certificate_file}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600"
                            >
                              Descargar
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td className="p-3">
                          {!a.certificate && (
                            <Button
                              size="sm"
                              variant="text"
                              onClick={() => setCertUpload(a.employee)}
                            >
                              Subir certificado
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      )}

      {/* Modales */}
      {attendanceOpen && (
        <AttendanceSelector
          open={attendanceOpen}
          onClose={() => {
            setAttendanceOpen(false);
            fetchAtt();
          }}
          empresaId={empresaId}
          sessionId={session.id}
          attendancesExisting={attendances} /* activos + borrados */
        />
      )}

      {certUpload && (
        <CertificationUpload
          open={!!certUpload}
          onClose={() => {
            setCertUpload(null);
            fetchAtt();
          }}
          participantId={certUpload}
        />
      )}
    </section>
  );
}
