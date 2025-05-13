import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardBody, Input, Button, Typography } from "@material-tailwind/react";
import { useEquipmentInspections } from "@/hooks/useEquipmentInspections";

export default function EquipmentInspectionForm() {
  const { id: equipmentId, inspectionId } = useParams();
  const navigate = useNavigate();
  const { create } = useEquipmentInspections(equipmentId);

  const blank = { fecha: "", resultado: "", tecnico: "", evidencia: null };
  const [form, setForm] = useState(blank);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === "evidencia") {
      setForm(f => ({ ...f, evidencia: files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await create(form);
      navigate(`/dashboard/sst/equipment/${equipmentId}/inspections`);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="p-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <Typography variant="h6">Nueva Inspección</Typography>
        </CardHeader>
        <CardBody>
          {error && <Typography color="red">{JSON.stringify(error)}</Typography>}
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">
            <Input type="date" label="Fecha" name="fecha" value={form.fecha} onChange={handleChange} required />
            <Input label="Resultado" name="resultado" value={form.resultado} onChange={handleChange} required />
            <Input label="Técnico" name="tecnico" value={form.tecnico} onChange={handleChange} required />
            <div>
              <label className="block text-gray-700">Evidencia</label>
              <input type="file" name="evidencia" accept="application/pdf,image/*" onChange={handleChange} />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Guardando…" : "Crear Inspección"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
