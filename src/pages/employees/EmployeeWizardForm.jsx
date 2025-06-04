import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Input,
  Button,
  Spinner,
  Card,
  CardBody,
  Switch,
  Select,
  Option,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useCatalogs } from "@/hooks/useCatalogs";
import AutocompleteCargo from "@/components/AutocompleteCargo";
import api from "@/services/api";
import { EmpresaContext } from "@/context/EmpresaContext";
import { useEpsList } from "@/hooks/useEpsList";

const afpList = ["Colfondos", "Porvenir", "Protección", "Skandia"];
const educationLevels = [
  "Básica",
  "Media",
  "Técnico",
  "Tecnólogo",
  "Pregrado",
  "Posgrado",
];

export default function EmployeeWizardForm() {
  const navigate = useNavigate();
  const { empresaId } = useContext(EmpresaContext);
  const epsNames = useEpsList();
  const { positions = [] } = useCatalogs();

  const [step, setStep] = useState(1);
  const [employee, setEmployee] = useState({
    first_name: "",
    last_name: "",
    document: "",
    phone_contact: "",
    emergency_contact: "",
    emergency_name: "",
    address: "",
    afp: "",
    eps: "",
    education: "",
    is_active: true,
  });

  const [link, setLink] = useState({
    position: "",
    salary: "",
    start_date: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleEmployeeChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleLinkChange = (field, value) => {
    setLink((prev) => ({ ...prev, [field]: value }));
  };

  const formatSalary = (raw) => {
    const cleaned = raw.replace(/[^\d]/g, "");
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const parseApiError = (err) => {
    if (err.response?.data) {
      const detail = err.response.data;
      if (typeof detail === "string") return detail;
      if (typeof detail === "object") {
        return Object.entries(detail)
          .map(([field, messages]) => `${field}: ${messages.join(" ")}`)
          .join("\n");
      }
    }
    return "Error creando empleado o vínculo";
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post("/employees/", employee);
      const empId = data.id;
      const rawSalary = link.salary?.toString().replace(/\./g, "") || "0";
      await api.post("/employment-links/", {
        employee: empId,
        company: empresaId,
        position: link.position,
        salary: rawSalary,
        start_date: link.start_date,
      });
      navigate("/dashboard/employees");
    } catch (err) {
      const msg = parseApiError(err);
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Typography variant="h4">
        {step === 1 ? "Información del Empleado" : "Vínculo Laboral"}
      </Typography>

      {step === 1 && (
        <form className="space-y-4">
          <Input label="Nombres" name="first_name" value={employee.first_name} onChange={handleEmployeeChange} />
          <Input label="Apellidos" name="last_name" value={employee.last_name} onChange={handleEmployeeChange} />
          <Input label="Documento" name="document" value={employee.document} onChange={handleEmployeeChange} />
          <Input label="Teléfono" name="phone_contact" value={employee.phone_contact} onChange={handleEmployeeChange} />
          <Input label="Contacto de emergencia" name="emergency_contact" value={employee.emergency_contact} onChange={handleEmployeeChange} />
          <Input label="Nombre contacto de emergencia" name="emergency_name" value={employee.emergency_name} onChange={handleEmployeeChange} />
          <Input label="Dirección" name="address" value={employee.address} onChange={handleEmployeeChange} />

          <Select label="AFP" value={employee.afp} onChange={(val) => setEmployee({ ...employee, afp: val })}>
            {afpList.map((afp) => (
              <Option key={afp} value={afp}>{afp}</Option>
            ))}
          </Select>

          <Select label="EPS" value={employee.eps} onChange={(val) => setEmployee({ ...employee, eps: val })}>
            {epsNames?.map((name) => (
              <Option key={name} value={name}>{name}</Option>
            ))}
          </Select>

          <Select label="Nivel educativo" value={employee.education} onChange={(val) => setEmployee({ ...employee, education: val })}>
            {educationLevels.map((level) => (
              <Option key={level} value={level}>{level}</Option>
            ))}
          </Select>

          <div className="flex items-center gap-3">
            <Switch label="Empleado Activo" checked={employee.is_active} onChange={(e) => setEmployee({ ...employee, is_active: e.target.checked })} />
          </div>

          <Button onClick={() => setStep(2)} color="blue">Siguiente</Button>
        </form>
      )}

      {step === 2 && (
        <Card>
          <CardBody className="space-y-4">
            <Typography variant="h6">Datos del Vínculo Laboral</Typography>

            <AutocompleteCargo
              value={link.position}
              onChange={(val) => handleLinkChange("position", val)}
            />

            <Input
              label="Salario"
              value={link.salary}
              onChange={(e) => handleLinkChange("salary", formatSalary(e.target.value))}
            />

            <Input
              label="Fecha de Inicio"
              type="date"
              value={link.start_date}
              onChange={(e) => handleLinkChange("start_date", e.target.value)}
            />

            <div className="flex justify-between">
              <Button onClick={() => setStep(1)} variant="outlined">Atrás</Button>
              <Button onClick={handleSubmit} disabled={submitting} color="green">
                {submitting ? <Spinner className="h-4 w-4" /> : "Crear Empleado y Vínculo"}
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
