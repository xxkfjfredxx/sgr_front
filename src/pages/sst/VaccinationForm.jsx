import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card, CardHeader, CardBody,
  Button, Input, List, ListItem,
  ListItemPrefix, Typography
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { useVaccinations } from "@/hooks/useVaccinations";
import { EmpresaContext } from "@/context/EmpresaContext";
import api from "@/services/api";

export default function VaccinationForm() {
  const { empresaId } = useContext(EmpresaContext);
  const { create }   = useVaccinations();
  const navigate     = useNavigate();

  const [form, setForm] = useState({
    employee: "",
    vacuna: "",
    fecha: "",
    fecha_vencimiento: "",
    soporte: null,
  });
  const [pendingSearch, setPendingSearch] = useState("");
  const [query, setQuery]                 = useState("");
  const [employees, setEmployees]         = useState([]);
  const [loadingEmp, setLoadingEmp]       = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [error, setError]                 = useState(null);

  // Buscador de empleados
  useEffect(() => {
    if (!empresaId || !query) {
      setEmployees([]);
      return;
    }
    setLoadingEmp(true);
    api.get("/employees/", { params: { company: empresaId, search: query } })
      .then(r => {
        const list = Array.isArray(r.data.results) ? r.data.results : r.data;
        setEmployees(list);
      })
      .finally(() => setLoadingEmp(false));
  }, [empresaId, query]);

  const handleSearch = () => setQuery(pendingSearch.trim());

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === "soporte" ? files[0] : value
    }));
  };

  const validate = () => {
    if (!form.employee) return "Selecciona un empleado.";
    if (!form.vacuna) return "Ingresa el nombre de la vacuna.";
    if (!form.fecha || !form.fecha_vencimiento) return "Ingresa ambas fechas.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);

    setSubmitting(true);
    setError(null);
    try {
      // Convertimos employee a número y formateamos fechas
      await create({
        ...form,
        employee: Number(form.employee),
        fecha: form.fecha.slice(0,10),
        fecha_vencimiento: form.fecha_vencimiento.slice(0,10),
      });
      navigate("/dashboard/sst/vaccinations");
    } catch (err) {
      setError(err.response?.data.detail || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="p-6">
      <Card>
        <CardHeader>
          <Typography variant="h5">Registrar Vacunación</Typography>
        </CardHeader>
        <CardBody className="space-y-4">
          {error && <Typography color="red">{error}</Typography>}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            {/* Buscador de empleados */}
            <div className="mb-4">
              <Typography className="mb-1">Buscar empleado</Typography>
              <div className="flex gap-2">
                <Input
                  label="Nombre o documento"
                  value={pendingSearch}
                  onChange={e => setPendingSearch(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && (e.preventDefault(), handleSearch())}
                />
                <Button size="sm" color="blue" onClick={handleSearch}>
                  <MagnifyingGlassIcon className="w-4 h-4" />
                </Button>
              </div>
              {loadingEmp
                ? <Typography variant="small" className="opacity-70">Buscando…</Typography>
                : query && 
                  (employees.length
                    ? (
                      <List className="max-h-40 overflow-y-auto mt-2">
                        {employees.map(emp => (
                          <ListItem
                            key={emp.id}
                            selected={form.employee===String(emp.id)}
                            onClick={()=>setForm(f=>({...f, employee:String(emp.id)}))}
                          >
                            <ListItemPrefix>
                              <UserIcon className="w-5 h-5" />
                            </ListItemPrefix>
                            {emp.first_name} {emp.last_name} — {emp.document}
                          </ListItem>
                        ))}
                      </List>
                    )
                    : <Typography variant="small" className="opacity-70">Sin coincidencias.</Typography>
                  )
              }
            </div>

            {/* Datos de vacunación */}
            <Input
              label="Vacuna"
              name="vacuna"
              value={form.vacuna}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fecha aplicación"
                type="date"
                name="fecha"
                value={form.fecha}
                onChange={handleChange}
                required
              />
              <Input
                label="Fecha vencimiento"
                type="date"
                name="fecha_vencimiento"
                value={form.fecha_vencimiento}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Typography className="mb-1">Soporte (PDF o imagen)</Typography>
              <Input
                type="file"
                name="soporte"
                accept="application/pdf,image/*"
                onChange={handleChange}
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? "Guardando…" : "Guardar Registro"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
