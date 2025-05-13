// src/pages/sst/WorkAccidentForm.jsx
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
import { useWorkAccidents } from "@/hooks/useWorkAccidents";
import { EmpresaContext } from "@/context/EmpresaContext";
import api from "@/services/api";

export default function WorkAccidentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { empresaId } = useContext(EmpresaContext);
  const { create, update } = useWorkAccidents();

  const blank = {
    employee: "",
    date: "",
    incident_type: "Accidente",
    location: "",
    description: "",
    injury_type: "",
    severity: "Leve",
    reported_to_arl: false,
    days_lost: 0,
    training_valid: false,
    medical_exam_valid: false,
    corrective_actions: "",
    evidence_file: null,
  };

  const [form, setForm] = useState(blank);
  const [pendingSearch, setPendingSearch] = useState("");
  const [query, setQuery] = useState("");
  const [employees, setEmployees] = useState([]);
  const [loadingEmp, setLoadingEmp] = useState(false);

  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Load for edit
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .get(`/work-accidents/${id}/`)
      .then((res) => {
        setForm({
          ...res.data,
          evidence_file: null,
          employee: res.data.employee,
        });
        setPendingSearch(
          `${res.data.employee_data.first_name} ${res.data.employee_data.last_name}`
        );
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Search employees
  useEffect(() => {
    if (!empresaId || query === "") {
      setEmployees([]);
      return;
    }
    setLoadingEmp(true);
    api
      .get("/employees/", {
        params: { company: empresaId, search: query },
      })
      .then((r) => {
        const list = Array.isArray(r.data.results)
          ? r.data.results
          : r.data;
        setEmployees(list);
      })
      .finally(() => setLoadingEmp(false));
  }, [empresaId, query]);

  const handleSearch = () => {
    setQuery(pendingSearch.trim());
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((f) => ({
      ...f,
      [name]:
        name === "evidence_file"
          ? files[0]
          : type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const data = new FormData();
    data.append("employee", form.employee);
    data.append("company", empresaId);
    data.append("incident_type", form.incident_type);
    data.append("date", form.date);
    data.append("location", form.location);
    data.append("description", form.description);
    data.append("injury_type", form.injury_type);
    data.append("severity", form.severity);
    data.append("reported_to_arl", form.reported_to_arl);
    data.append("days_lost", form.days_lost);
    data.append("training_valid", form.training_valid);
    data.append("medical_exam_valid", form.medical_exam_valid);
    data.append("corrective_actions", form.corrective_actions);
    if (form.evidence_file) data.append("evidence_file", form.evidence_file);

    try {
      if (id) {
        await update(id, data);
      } else {
        await create(data);
      }
      navigate("/dashboard/sst/accidentes");
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
            {id ? "Editar Accidente" : "Nuevo Accidente"}
          </Typography>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            {/* Buscador de empleado */}
            <div>
              <Typography className="mb-1">Empleado</Typography>
              <div className="flex gap-2 mb-2">
                <Input
                  label="Buscar por nombre o cédula"
                  value={pendingSearch}
                  onChange={(e) => setPendingSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleSearch())}
                />
                <Button size="sm" color="blue" onClick={handleSearch}>
                  <MagnifyingGlassIcon className="w-4 h-4" /> Buscar
                </Button>
              </div>
              {loadingEmp ? (
                <Typography variant="small" className="opacity-70 p-2">
                  Buscando…
                </Typography>
              ) : query && (
                employees.length > 0 ? (
                  <List className="max-h-40 overflow-y-auto">
                    {employees.map((emp) => (
                      <ListItem
                        key={emp.id}
                        selected={String(emp.id) === String(form.employee)}
                        onClick={() => {
                          setForm((f) => ({ ...f, employee: emp.id }));
                          setPendingSearch(`${emp.first_name} ${emp.last_name}`);
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
                ) : (
                  <Typography variant="small" className="opacity-70 p-2">
                    Sin coincidencias.
                  </Typography>
                )
              )}
            </div>

            {/* Resto del formulario */}
            <Input
              type="date"
              label="Fecha"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <select
              name="incident_type"
              value={form.incident_type}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Accidente">Accidente</option>
              <option value="Incidente">Incidente</option>
            </select>

            <Input
              label="Ubicación"
              name="location"
              value={form.location}
              onChange={handleChange}
            />

            <Input
              label="Descripción"
              name="description"
              value={form.description}
              onChange={handleChange}
            />

            <Input
              label="Tipo de lesión"
              name="injury_type"
              value={form.injury_type}
              onChange={handleChange}
            />

            <select
              name="severity"
              value={form.severity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="Leve">Leve</option>
              <option value="Grave">Grave</option>
              <option value="Mortal">Mortal</option>
            </select>

            <div className="flex items-center gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="reported_to_arl"
                  checked={form.reported_to_arl}
                  onChange={handleChange}
                  className="mr-2"
                />
                Reportado a ARL
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="training_valid"
                  checked={form.training_valid}
                  onChange={handleChange}
                  className="mr-2"
                />
                Capacitación válida
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="medical_exam_valid"
                  checked={form.medical_exam_valid}
                  onChange={handleChange}
                  className="mr-2"
                />
                Examen médico válido
              </label>
            </div>

            <Input
              type="number"
              label="Días perdidos"
              name="days_lost"
              value={form.days_lost}
              onChange={handleChange}
            />

            <Input
              label="Acciones correctivas"
              name="corrective_actions"
              value={form.corrective_actions}
              onChange={handleChange}
            />

            <Input
              type="file"
              name="evidence_file"
              accept="image/*,application/pdf"
              onChange={handleChange}
            />

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Guardando…" : id ? "Actualizar" : "Crear Accidente"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
