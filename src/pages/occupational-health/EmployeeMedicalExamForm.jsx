// src/pages/occupational-health/EmployeeMedicalExamForm.jsx
import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  Option,
  Textarea,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { useEmployeeMedicalExams } from "@/hooks/useEmployeeMedicalExams";
import { useEmpresaActiva } from "@/hooks/useEmpresaActiva";

export default function EmployeeMedicalExamForm({ employeeId, onUploadSuccess }) {
  const { uploadExam } = useEmployeeMedicalExams(employeeId);
  const { empresaActivaId } = useEmpresaActiva();

  const [form, setForm] = useState({
    exam_type: "",
    exam_phase: "",
    sub_type: "",
    risk_level: "",
    date: "",
    entity: "",
    aptitude: "",
    recommendations: "",
    file: null,
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = ({ target }) => {
    const { name, value, files } = target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!empresaActivaId) {
      setError("No se ha seleccionado una empresa.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("employee", employeeId);
      formData.append("company", empresaActivaId);
      formData.append("exam_type", form.exam_type);
      formData.append("exam_phase", form.exam_phase);
      formData.append("sub_type", form.sub_type);
      formData.append("risk_level", form.risk_level);
      formData.append("date", form.date);
      formData.append("entity", form.entity);
      formData.append("aptitude", form.aptitude);
      formData.append("recommendations", form.recommendations);
      formData.append("file", form.file);

      await uploadExam(formData);
      setSuccess(true);
      if (typeof onUploadSuccess === "function") {
        onUploadSuccess();
      }

      setForm({
        exam_type: "",
        exam_phase: "",
        sub_type: "",
        risk_level: "",
        date: "",
        entity: "",
        aptitude: "",
        recommendations: "",
        file: null,
      });
    } catch (err) {
      setError("No se pudo subir el examen. Verifica los campos requeridos.");
    }
  };

  if (!empresaActivaId) {
    return (
      <Alert color="blue" variant="outlined" className="my-4">
        Debes seleccionar una empresa activa para registrar un examen médico.
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Typography variant="h6">Subir nuevo examen médico</Typography>

      {error && <Alert color="red">{error}</Alert>}
      {success && <Alert color="green">Examen subido correctamente.</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Tipo de Examen (general)" name="exam_type" value={form.exam_type} onChange={handleChange} required />

        <Select label="Fase del Examen" value={form.exam_phase} onChange={(val) => setForm(prev => ({ ...prev, exam_phase: val }))} required>
          <Option value="Ingreso">Ingreso</Option>
          <Option value="Periódico">Periódico</Option>
          <Option value="Retiro">Retiro</Option>
        </Select>

        <Select label="Subtipo de Examen" value={form.sub_type} onChange={(val) => setForm(prev => ({ ...prev, sub_type: val }))}>
          <Option value="Audiometría">Audiometría</Option>
          <Option value="Espirometría">Espirometría</Option>
          <Option value="Visión">Visión</Option>
          <Option value="Laboratorio">Laboratorio</Option>
          <Option value="Presión arterial">Presión arterial</Option>
          <Option value="Otro">Otro</Option>
        </Select>

        <Select label="Nivel de Riesgo" value={form.risk_level} onChange={(val) => setForm(prev => ({ ...prev, risk_level: val }))}>
          <Option value="I">Bajo (I)</Option>
          <Option value="II">Medio (II)</Option>
          <Option value="III">Alto (III)</Option>
          <Option value="IV">Crítico (IV)</Option>
        </Select>

        <Input label="Fecha" type="date" name="date" value={form.date} onChange={handleChange} required />
        <Input label="Entidad" name="entity" value={form.entity} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="¿Apto?" name="aptitude" value={form.aptitude} onChange={(val) => setForm(prev => ({ ...prev, aptitude: val }))}>
          <Option value="Sí">Sí</Option>
          <Option value="No">No</Option>
        </Select>
        <Input type="file" name="file" label="Archivo (PDF o imagen)" onChange={handleChange} required />
      </div>

      <Textarea label="Recomendaciones" name="recommendations" value={form.recommendations} onChange={handleChange} />

      <div className="flex justify-end">
        <Button type="submit" color="blue">Subir Examen</Button>
      </div>
    </form>
  );
}