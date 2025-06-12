import React, { useEffect, useState } from "react";
import {
  Button,
  Input,
  Select,
  Option,
  Typography,
  Spinner,
} from "@material-tailwind/react";
import { useEmployees } from "@/hooks/useEmployees";
import { useEmpresaActiva } from "@/hooks/useEmpresaActiva";
import { useEmploymentLinks } from "@/hooks/useEmploymentLinks";
import ToastNotification from "@/components/ToastNotification";
import api from "@/services/api";

export default function EmploymentLinkForm({ onSave = () => {} }) {
  const { empresaActivaId } = useEmpresaActiva();
  const {
    data: employees = [],
    isLoading: loadingEmps,
    error: errorEmps,
  } = useEmployees();
  const { links, loading: loadingLinks } = useEmploymentLinks(empresaActivaId);

  const [selectedEmp, setSelectedEmp] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
  const [startDate, setStartDate] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const [toast, setToast] = useState({ open: false, message: "", type: "info" });

  useEffect(() => {
    if (!selectedEmp) return;
    const existing = links.find(
      (l) =>
        l.employee?.toString() === selectedEmp &&
        l.company?.toString() === empresaActivaId?.toString()
    );
    if (existing) {
      setPosition(existing.position || "");
      setSalary(formatSalary(existing.salary?.toString() || ""));
      setStartDate(existing.start_date || "");
    } else {
      setPosition("");
      setSalary("");
      setStartDate("");
    }
  }, [selectedEmp, empresaActivaId, links]);

  const formatSalary = (val) => {
    const num = val.replace(/\D/g, "");
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleSalaryChange = (e) => {
    const raw = e.target.value;
    setSalary(formatSalary(raw));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmp || !position || !salary || !startDate) {
      setSaveError("Todos los campos son obligatorios");
      setToast({
        open: true,
        message: "Completa todos los campos requeridos",
        type: "warning",
      });
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      const rawSalary = salary.replace(/\./g, "");
      await api.post("/employment-links/", {
        company: empresaActivaId,
        employee: selectedEmp,
        position,
        salary: rawSalary,
        start_date: startDate,
      });
      setToast({
        open: true,
        message: "Vínculo creado exitosamente",
        type: "success",
      });
      onSave();
    } catch (err) {
      setToast({
        open: true,
        message: "Error al guardar el vínculo",
        type: "error",
      });
      setSaveError(err.response?.data || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <ToastNotification
        open={toast.open}
        onClose={() => setToast((prev) => ({ ...prev, open: false }))}
        message={toast.message}
        type={toast.type}
      />

      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-4 bg-white rounded shadow max-w-xl mx-auto"
      >
        <Typography variant="h6">Vincular Empleado</Typography>

        {loadingEmps ? (
          <div className="flex items-center gap-2 text-blue-600">
            <Spinner className="h-4 w-4" /> Cargando empleados…
          </div>
        ) : errorEmps ? (
          <div className="text-red-600">{errorEmps.message}</div>
        ) : (
          <Select
            label="Empleado"
            value={selectedEmp}
            onChange={(val) => setSelectedEmp(val)}
          >
            {employees.map((emp) => (
              <Option key={emp.id} value={emp.id.toString()}>
                {emp.first_name} {emp.last_name}
              </Option>
            ))}
          </Select>
        )}

        <Input
          label="Cargo"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        <Input
          label="Salario"
          value={salary}
          onChange={handleSalaryChange}
        />

        <Input
          label="Fecha de Inicio"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <Button type="submit" color="blue" disabled={saving || loadingEmps}>
          {saving ? <Spinner className="h-4 w-4" /> : "Guardar Vinculación"}
        </Button>

        {saveError && (
          <div className="text-red-600 text-sm whitespace-pre-wrap">
            {typeof saveError === "string"
              ? saveError
              : JSON.stringify(saveError, null, 2)}
          </div>
        )}

        <div className="pt-4">
          <Typography variant="small" color="gray">
            Vínculos existentes:
          </Typography>
          {loadingLinks ? (
            <Spinner className="h-4 w-4" />
          ) : links.filter((l) => l.employee?.toString() === selectedEmp).length === 0 ? (
            <p className="text-sm">No hay vínculos registrados.</p>
          ) : (
            <ul className="text-sm list-disc list-inside text-gray-700">
              {links
                .filter((l) => l.employee?.toString() === selectedEmp)
                .map((l) => (
                  <li key={l.id}>
                    {l.position} desde {l.start_date} — Estado: {l.status}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </form>
    </>
  );
}
