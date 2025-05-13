// src/pages/sst/MedicalExamForm.jsx
import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { useMedicalExams } from "@/hooks/useMedicalExams";
import { EmpresaContext } from "@/context/EmpresaContext";
import api from "@/services/api";

export default function MedicalExamForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { empresaId } = useContext(EmpresaContext);
  const { create, update } = useMedicalExams();

  // Blank template for form fields
  const blankForm = {
    employee: "",
    exam_phase: "Ingreso",
    sub_type: "Otro",
    risk_level: "II",
    date: "",
    entity: "",
    aptitude: "",
    recommendations: "",
    file: null,
  };

  const [form, setForm] = useState(blankForm);
  const [metrics, setMetrics] = useState([]); // array of { key, value }
  const [pendingSearch, setPendingSearch] = useState("");
  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loadingEmp, setLoadingEmp] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Compute next_due based on date and risk level
  const computeNextDue = () => {
    if (!form.date) return "";
    const d = new Date(form.date);
    switch (form.risk_level) {
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
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  // Load existing exam when editing
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/medical-exams/${id}/`)
      .then((res) => {
        const data = res.data;
        setForm({
          employee: data.employee,
          exam_phase: data.exam_phase,
          sub_type: data.sub_type,
          risk_level: data.risk_level,
          date: data.date,
          entity: data.entity,
          aptitude: data.aptitude,
          recommendations: data.recommendations,
          file: null,
        });
        setPendingSearch(data.employee_name);
        const m = data.metrics || {};
        setMetrics(Object.entries(m).map(([key, value]) => ({ key, value })));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Search employees by name or document
  useEffect(() => {
    if (!empresaId || !query) {
      setEmployees([]);
      return;
    }
    setLoadingEmp(true);
    api
      .get("/employees/", {
        params: { company: empresaId, search: query },
      })
      .then((r) => {
        const list = Array.isArray(r.data.results) ? r.data.results : r.data;
        setEmployees(list);
      })
      .finally(() => setLoadingEmp(false));
  }, [empresaId, query]);

  const handleSearch = () => setQuery(pendingSearch.trim());

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setForm((f) => ({ ...f, file: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  // Metrics helpers
  const addMetric = () => setMetrics((m) => [...m, { key: "", value: "" }]);
  const removeMetric = (idx) => setMetrics((m) => m.filter((_, i) => i !== idx));
  const updateMetric = (idx, field, val) => {
    setMetrics((m) => {
      const copy = [...m];
      copy[idx][field] = val;
      return copy;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData();
    data.append("employee", form.employee);
    data.append("company", empresaId);
    data.append("exam_phase", form.exam_phase);
    data.append("sub_type", form.sub_type);
    data.append("risk_level", form.risk_level);
    data.append("date", form.date);
    data.append("entity", form.entity);
    data.append("aptitude", form.aptitude);
    data.append("recommendations", form.recommendations);

    // Build metrics JSON and inject next_due
    const metricsObj = {};
    metrics.forEach(({ key, value }) => {
      if (key.trim()) metricsObj[key.trim()] = value;
    });
    const nextDue = computeNextDue();
    if (nextDue) metricsObj.next_due = nextDue;
    data.append("metrics", JSON.stringify(metricsObj));

    if (form.file) data.append("file", form.file);

    try {
      if (id) {
        await update(id, data);
      } else {
        await create(data);
      }
      navigate("/dashboard/sst/aptitud-medica");
    } catch (err) {
      setError(err.response?.data.detail || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Typography className="p-4">Cargando…</Typography>;
  if (error) return <Typography color="red" className="p-4">{error}</Typography>;

  return (
    <section className="p-6 max-w-lg mx-auto">
      <Card>
        <CardHeader>
          <Typography variant="h6">
            {id ? "Editar Examen Médico" : "Nuevo Examen Médico"}
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            {/* Employee search */}
            <div>
              <Typography className="mb-1">Empleado</Typography>
              <div className="flex gap-2 mb-2">
                <Input
                  label="Buscar por nombre o cédula"
                  value={pendingSearch}
                  onChange={(e) => setPendingSearch(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleSearch())
                  }
                />
                <Button size="sm" color="blue" onClick={handleSearch}>
                  <MagnifyingGlassIcon className="w-4 h-4" /> Buscar
                </Button>
              </div>
              {loadingEmp ? (
                <Typography variant="small" className="opacity-70 p-2">
                  Buscando…
                </Typography>
              ) : employees.length > 0 ? (
                <List className="max-h-40 overflow-y-auto">
                  {employees.map((emp) => (
                    <ListItem
                      key={emp.id}
                      selected={String(emp.id) === String(form.employee)}
                      onClick={() => {
                        setForm((f) => ({ ...f, employee: emp.id }));
                        setPendingSearch(
                          `${emp.first_name} ${emp.last_name}`
                        );
                        setEmployees([]);
                      }}
                    >
                      <ListItemPrefix>
                        <UserIcon className="w-5 h-5" />
                      </ListItemPrefix>
                      {emp.first_name} {emp.last_name} — {emp.document}
                    </ListItem>
                  ))}
                </List>
              ) : query ? (
                <Typography variant="small" className="opacity-70 p-2">
                  Sin coincidencias.
                </Typography>
              ) : null}
            </div>

            {/* Core exam fields */}
            <select
              name="exam_phase"
              value={form.exam_phase}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Ingreso">Ingreso</option>
              <option value="Periódico">Periódico</option>
              <option value="Retiro">Retiro</option>
            </select>

            <select
              name="sub_type"
              value={form.sub_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Espirometría">Espirometría</option>
              <option value="Visión">Visión</option>
              <option value="Laboratorio">Laboratorio</option>
              <option value="Presión arterial">Presión arterial</option>
              <option value="Otro">Otro</option>
            </select>

            <select
              name="risk_level"
              value={form.risk_level}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="I">Bajo (I)</option>
              <option value="II">Medio (II)</option>
              <option value="III">Alto (III)</option>
              <option value="IV">Muy alto (IV)</option>
            </select>

            <Input
              type="date"
              label="Fecha examen"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <Input
              label="Entidad ejecutora"
              name="entity"
              value={form.entity}
              onChange={handleChange}
              required
            />

            <Input
              label="Calificación aptitud"
              name="aptitude"
              value={form.aptitude}
              onChange={handleChange}
              required
            />

            <div>
              <label className="block text-gray-700">Recomendaciones</label>
              <textarea
                name="recommendations"
                value={form.recommendations}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Dynamic metrics key/value */}
            <div>
              <Typography className="mb-1">Resultados / Métricas</Typography>
              {metrics.map((m, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <Input
                    label="Métrica"
                    value={m.key}
                    onChange={(e) => updateMetric(i, "key", e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Input
                    label="Valor"
                    value={m.value}
                    onChange={(e) =>
                      updateMetric(i, "value", e.target.value)
                    }
                    required
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    variant="text"
                    color="red"
                    onClick={() => removeMetric(i)}
                  >
                    X
                  </Button>
                </div>
              ))}
              <Button size="sm" color="blue" onClick={addMetric}>
                + Agregar métrica
              </Button>
            </div>

            {/* File upload */}
            <Input
              type="file"
              label="Soporte (PDF/foto)"
              name="file"
              accept="application/pdf,image/*"
              onChange={handleChange}
            />

            {/* Read-only next_due field */}
            <div>
              <label className="block text-gray-700">Próximo Vence</label>
              <Input
                type="date"
                value={computeNextDue()}
                readOnly
                className="w-full mt-1"
              />
            </div>

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting
                ? "Guardando…"
                : id
                ? "Actualizar"
                : "Crear Examen"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
