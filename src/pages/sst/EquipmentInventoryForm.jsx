// src/pages/sst/EquipmentInventoryForm.jsx

import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import api from "@/services/api";
import { useEquipmentInventory } from "@/hooks/useEquipmentInventory";
import { EmpresaContext } from "@/context/EmpresaContext";

export default function EquipmentInventoryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { empresaId } = useContext(EmpresaContext);
  const { create, update } = useEquipmentInventory();

  const blank = {
    categoria: "",
    serial: "",
    cantidad: 1,
    fecha_compra: "",
    estado: "",
    certificado: null,
  };
  const [form, setForm] = useState(blank);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Cargar datos si estamos editando
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    api
      .get(`/equipment-inventory/${id}/`, { params: { company: empresaId } })
      .then((res) => {
        const data = res.data;
        setForm({
          categoria: data.categoria,
          serial: data.serial || "",
          cantidad: data.cantidad,
          fecha_compra: data.fecha_compra,
          estado: data.estado || "",
          certificado: null,
        });
      })
      .catch(() => setError("No se pudo cargar el registro."))
      .finally(() => setLoading(false));
  }, [id, empresaId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "certificado") {
      setForm((f) => ({ ...f, certificado: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      if (id) {
        await update(id, form);
      } else {
        await create(form);
      }
      navigate("/dashboard/sst/equipment");
    } catch (err) {
      const msg = err.response?.data
        ? JSON.stringify(err.response.data)
        : err.message;
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Typography className="p-4">Cargando…</Typography>;

  return (
    <section className="p-6 max-w-md mx-auto">
      <Card>
        <CardHeader>
          <Typography variant="h6">
            {id ? "Editar Equipo" : "Nuevo Equipo"}
          </Typography>
        </CardHeader>
        <CardBody>
          {error && (
            <Typography color="red">
              {error}
            </Typography>
          )}
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="space-y-4"
          >
            <Input
              label="Categoría"
              name="categoria"
              value={form.categoria}
              onChange={handleChange}
              required
            />
            <Input
              label="Serial (opcional)"
              name="serial"
              value={form.serial}
              onChange={handleChange}
            />
            <Input
              type="number"
              label="Cantidad"
              name="cantidad"
              value={form.cantidad}
              onChange={handleChange}
              min={1}
              required
            />
            <Input
              type="date"
              label="Fecha de compra"
              name="fecha_compra"
              value={form.fecha_compra}
              onChange={handleChange}
              required
            />
            <Input
              label="Estado"
              name="estado"
              value={form.estado}
              onChange={handleChange}
            />
            <div>
              <label className="block text-gray-700">
                Certificado (PDF/imagen)
              </label>
              <input
                type="file"
                name="certificado"
                accept="application/pdf,image/*"
                onChange={handleChange}
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting
                ? "Guardando…"
                : id
                ? "Actualizar Equipo"
                : "Crear Equipo"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
