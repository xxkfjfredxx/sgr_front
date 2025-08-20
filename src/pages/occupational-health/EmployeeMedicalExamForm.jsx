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
  const empresaActivaId = useEmpresaActiva();

  const [form, setForm] = useState({
    exam_type: "",
    exam_phase: "",
    date: "",
    entity_ips: "",
    aptitude: "",
    recommendations: "",
    next_due_months: "",
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

  const computeNextDue = () => {
    if (!form.date || !form.next_due_months) return "";
    const d = new Date(form.date);
    d.setMonth(d.getMonth() + parseInt(form.next_due_months));
    return d.toISOString().split("T")[0];
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
      formData.append("date", form.date);
      formData.append("entity_ips", form.entity_ips);
      formData.append("aptitude", form.aptitude);
      formData.append("recommendations", form.recommendations);
      formData.append("next_due_months", form.next_due_months);
      formData.append("file", form.file);

      const nextDue = computeNextDue();
      formData.append("metrics", JSON.stringify({ next_due: nextDue }));

      await uploadExam(formData);
      setSuccess(true);
      if (typeof onUploadSuccess === "function") onUploadSuccess();

      setForm({
        exam_type: "",
        exam_phase: "",
        date: "",
        entity_ips: "",
        aptitude: "",
        recommendations: "",
        next_due_months: "",
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

  const examTypes = [
    "Médico general",
    "Médico ocupacional",
    "Ingreso osteomuscular con énfasis en altura",
    "Laboratorio",
    "Visión",
    "Auditivo",
    "Espirometría",
    "Electrocardiograma",
    "Radio de tórax",
    "Psicológico",
    "Psicotécnico",
    "Osteomuscular",
    "Pruebas de embarazo",
    "Específicas",
  ];

  const vencimientoOpciones = [3, 6, 9, 12, 15, 18, 21, 24];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Typography variant="h6">Subir nuevo examen médico</Typography>

      {error && <Alert color="red">{error}</Alert>}
      {success && <Alert color="green">Examen subido correctamente.</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Tipo de Examen"
          name="exam_type"
          value={form.exam_type}
          onChange={(val) => setForm(prev => ({ ...prev, exam_type: val }))}
          required
        >
          {examTypes.map((t) => (
            <Option key={t} value={t}>{t}</Option>
          ))}
        </Select>

        <Select
          label="Fase del Examen"
          value={form.exam_phase}
          onChange={(val) => setForm(prev => ({ ...prev, exam_phase: val }))}
          required
        >
          <Option value="Ingreso">Ingreso</Option>
          <Option value="Periódico">Periódico</Option>
          <Option value="Retiro">Retiro</Option>
        </Select>

        <Input label="Fecha" type="date" name="date" value={form.date} onChange={handleChange} required />
        <Input label="Entidad IPS" name="entity_ips" value={form.entity_ips} onChange={handleChange} required />

        <Select
          label="¿Apto?"
          name="aptitude"
          value={form.aptitude}
          onChange={(val) => setForm(prev => ({ ...prev, aptitude: val }))}
        >
          <Option value="Sí">Sí</Option>
          <Option value="No">No</Option>
        </Select>

        <Select
          label="Próximo vencimiento"
          name="next_due_months"
          value={form.next_due_months}
          onChange={(val) => setForm(prev => ({ ...prev, next_due_months: val }))}
          required
        >
          {vencimientoOpciones.map((m) => (
            <Option key={m} value={m}>{m} meses</Option>
          ))}
        </Select>
      </div>

      <Input
        type="date"
        label="Próximo examen estimado"
        value={computeNextDue()}
        readOnly
      />

      <Input type="file" name="file" label="Archivo (PDF o imagen)" onChange={handleChange} required />
      <Textarea label="Recomendaciones" name="recommendations" value={form.recommendations} onChange={handleChange} />

      <div className="flex justify-end">
        <Button type="submit" color="blue">Subir Examen</Button>
      </div>
    </form>
  );
}
