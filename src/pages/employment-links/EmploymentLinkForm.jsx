import React, { useState } from "react";
import { Button, Input, Select, Option, Typography, Spinner } from "@material-tailwind/react";
import { useEmployees } from "@/hooks/useEmployees";
import { useEmpresaActiva } from "@/hooks/useEmpresaActiva";
import api from "@/services/api";

export default function EmploymentLinkForm({ onSave }) {
  const { empresaId } = useEmpresaActiva();
  const { employees, loading: loadingEmps, error: errorEmps } = useEmployees();
  const [selectedEmp, setSelectedEmp] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEmp) {
      setSaveError("Selecciona un empleado");
      return;
    }
    setSaving(true);
    setSaveError(null);
    try {
      await api.post("/employment-links/", {
        company: empresaId,
        employee: selectedEmp,
      });
      onSave();
    } catch (err) {
      setSaveError(err.response?.data?.detail || err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded shadow">
      <Typography variant="h6">Vincular Empleado</Typography>

      {loadingEmps ? (
        <div className="flex items-center gap-2 text-blue-600">
          <Spinner className="h-4 w-4" /> Cargando empleados…
        </div>
      ) : errorEmps ? (
        <div className="text-red-600">{errorEmps}</div>
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

      <Button type="submit" color="blue" disabled={saving || loadingEmps}>
        {saving ? <Spinner className="h-4 w-4" /> : "Vincular"}
      </Button>

      {saveError && <div className="text-red-600">{saveError}</div>}
    </form>
  );
}
