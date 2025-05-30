import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Card, CardHeader, CardBody, Input, Button, Typography
} from "@material-tailwind/react";
import api from "@/services/api";
import { EmpresaContext } from "@/context/EmpresaContext";

export default function ActivityDetail() {
  const { empresaId } = useContext(EmpresaContext);
  const { id: activityId } = useParams();
  const { search } = useLocation();
  const dateParam = new URLSearchParams(search).get("date");

  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_date: dateParam || "",
    end_date: dateParam || "",
    status: "pending",
  });
  const [loading, setLoading] = useState(!!activityId);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!activityId) return;
    setLoading(true);
    api.get(`/activities/${activityId}/`)
      .then((res) => {
        setForm({
          title: res.data.title,
          description: res.data.description || "",
          start_date: res.data.start_date,
          end_date: res.data.end_date,
          status: res.data.status,
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [activityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = { ...form, company: empresaId };
      if (activityId) {
        await api.put(`/activities/${activityId}/`, payload);
      } else {
        await api.post("/activities/", payload);
      }
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data.detail || e.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Typography className="p-4">Cargando…</Typography>;
  if (error) return <Typography color="red" className="p-4">{error}</Typography>;

  return (
    <section className="p-6 max-w-7xl mx-auto">
      <div className="mb-4">
        <Button variant="outlined" size="sm" onClick={() => navigate(-1)}>
          ← Volver
        </Button>
      </div>

      <Card>
        <CardHeader floated={false} shadow={false} className="bg-gray-100 px-6 py-4">
          <Typography variant="h6" color="blue-gray">
            {activityId ? "Editar Actividad" : "Nueva Actividad"}
          </Typography>
        </CardHeader>

        <CardBody className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <Input
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
                <Input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
                <Input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Completada</option>
                <option value="cancelled">Cancelada</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting
                ? "Guardando…"
                : activityId
                  ? "Actualizar"
                  : "Crear"
              }
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
