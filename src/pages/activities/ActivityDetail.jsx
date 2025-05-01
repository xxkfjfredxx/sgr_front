// src/pages/activities/ActivityDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useActivity } from "@/hooks/useActivity";
import api from "@/services/api";
import {
  Spinner,
  Typography,
  Button,
  Input,
  Textarea,
  Select,
  Option,
} from "@material-tailwind/react";
import { ROUTES } from "@/configs/routes";
import { EmpresaContext } from "@/context/EmpresaContext.jsx";

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { empresaId } = useContext(EmpresaContext);

  // Si no hay ID, mostramos mensaje sin intentar petición
  if (!id) {
    return (
      <div className="p-6 text-gray-600">
        <Typography variant="h6">ID de actividad no proporcionado.</Typography>
        <Button color="gray" onClick={() => navigate(ROUTES.DASHBOARD)} className="mt-4">
          ← Volver
        </Button>
      </div>
    );
  }

  const { activity, loading, error, updateActivityStatus, refetch } =
    useActivity(id);

  // Si cambia la empresa y no pertenece a esta actividad, redirigir
  useEffect(() => {
    if (activity && empresaId && activity.company !== empresaId) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [activity, empresaId, navigate]);

  // Estado local para el formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Rellenar el formulario cuando llegue la actividad
  useEffect(() => {
    if (activity) {
      setTitle(activity.title || "");
      setDescription(activity.description || "");
      setStatus(activity.status || "");
    }
  }, [activity]);

  if (loading) {
    return (
      <div className="p-6 text-blue-600 flex items-center gap-2">
        <Spinner className="h-5 w-5" />
        <Typography>Cargando actividad…</Typography>
      </div>
    );
  }

  if (error) {
    // Asegurarnos de mostrar un string
    const message = typeof error === 'string' ? error : error.message || 'Error desconocido';
    return (
      <div className="p-6 text-red-600 bg-red-50 border border-red-200 rounded-md">
        <Typography variant="h6">⚠️ {message}</Typography>
        <Button color="gray" onClick={() => navigate(ROUTES.DASHBOARD)} className="mt-4">
          ← Volver
        </Button>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="p-6 text-gray-600">
        <Typography>Actividad no encontrada o no accesible.</Typography>
        <Button color="gray" onClick={() => navigate(ROUTES.DASHBOARD)} className="mt-4">
          ← Volver
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    setSaving(true);
    setSaveMessage("");
    try {
      await api.patch(`/activities/${id}/`, { title, description, status });
      setSaveMessage("✅ Cambios guardados exitosamente.");
      refetch();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Error al guardar';
      setSaveMessage(`❌ ${msg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-md rounded-md space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" color="blue-gray">
          Editar Actividad
        </Typography>
        <Button size="sm" color="gray" onClick={handleBack}>
          ← Volver
        </Button>
      </div>

      <div className="space-y-4">
        <Input
          label="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <Textarea
          label="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Select
          label="Estado"
          value={status}
          onChange={(val) => setStatus(val)}
        >
          <Option value="pending">⏳ Pendiente</Option>
          <Option value="in_progress">🔄 En progreso</Option>
          <Option value="completed">✅ Finalizada</Option>
          <Option value="cancelled">❌ Cancelada</Option>
        </Select>

        <Button
          color="blue"
          onClick={handleSave}
          disabled={saving}
          className="mt-4"
        >
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>

        {saveMessage && (
          <div className="mt-2 text-sm text-green-600">{saveMessage}</div>
        )}
      </div>
    </div>
  );
}