import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Input,
  Button,
  Spinner,
  Card,
  CardBody,
  Checkbox,
  Switch,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useCatalogs } from "@/hooks/useCatalogs";
import AutocompleteCargo from "@/components/AutocompleteCargo";
import api from "@/services/api";
import { EmpresaContext } from "@/context/EmpresaContext";

export default function EmployeeWizardForm() {
  const navigate = useNavigate();
  const { companies = [] } = useCatalogs();
  const companyList = Array.isArray(companies) ? companies : [];
  const { empresaId } = useContext(EmpresaContext);

  const [step, setStep] = useState(1);
  const [employee, setEmployee] = useState({
    first_name: "",
    last_name: "",
    document: "",
    phone_contact: "",
    is_active: true,
  });
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [links, setLinks] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStep(1);
    setEmployee({
      first_name: "",
      last_name: "",
      document: "",
      phone_contact: "",
      is_active: true,
    });
    setSelectedCompanies([]);
    setLinks({});
  }, [empresaId]);

  const handleEmployeeChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const toggleCompany = (cid) => {
    const exists = selectedCompanies.includes(cid);
    const newSelection = exists
      ? selectedCompanies.filter((id) => id !== cid)
      : [...selectedCompanies, cid];
    setSelectedCompanies(newSelection);

    const updatedLinks = { ...links };
    if (!exists) {
      updatedLinks[cid] = { position: "", salary: "", start_date: "" };
    } else {
      delete updatedLinks[cid];
    }
    setLinks(updatedLinks);
  };

  const handleLinkChange = (cid, field, value) => {
    setLinks((prev) => ({
      ...prev,
      [cid]: { ...prev[cid], [field]: value },
    }));
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
    return "Error creando empleado o vínculos";
  };

  const handleSubmit = async () => {
    if (selectedCompanies.length === 0) {
      alert("Debe seleccionar al menos una empresa para asociar al empleado.");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/employees/", employee);
      const empId = data.id;
      await Promise.all(
        selectedCompanies.map((cid) => {
          const rawSalary = links[cid]?.salary?.toString().replace(/\./g, "") || "0";
          return api.post("/employment-links/", {
            employee: empId,
            company: cid,
            position: links[cid]?.position,
            salary: rawSalary,
            start_date: links[cid]?.start_date,
          });
        })
      );
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
      {step === 1 ? (
        <Typography variant="h4">Información del Empleado</Typography>
      ) : (
        <Typography variant="h4">Vincular Empresas</Typography>
      )}

      {step === 1 && (
        <form className="space-y-4">
          <Input
            label="Nombres"
            name="first_name"
            value={employee.first_name}
            onChange={handleEmployeeChange}
          />
          <Input
            label="Apellidos"
            name="last_name"
            value={employee.last_name}
            onChange={handleEmployeeChange}
          />
          <Input
            label="Documento"
            name="document"
            value={employee.document}
            onChange={handleEmployeeChange}
          />
          <Input
            label="Teléfono"
            name="phone_contact"
            value={employee.phone_contact}
            onChange={handleEmployeeChange}
          />
          <div className="flex items-center gap-3">
            <Switch
              label="Empleado Activo"
              checked={employee.is_active}
              onChange={(e) => setEmployee({ ...employee, is_active: e.target.checked })}
            />
          </div>
          <Button onClick={() => setStep(2)} color="blue">
            Siguiente
          </Button>
        </form>
      )}

      {step === 2 && (
        <>
          <Typography variant="h6">Selecciona las empresas</Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-2">
            {companyList.map((c) => (
              <Checkbox
                key={c.id}
                label={c.name}
                checked={selectedCompanies.includes(c.id)}
                onChange={() => toggleCompany(c.id)}
              />
            ))}
          </div>

          {selectedCompanies.map((cid) => (
            <Card key={cid} className="my-4">
              <CardBody className="space-y-2">
                <Typography variant="h6">
                  Vínculo para {companyList.find((c) => c.id === cid)?.name || 'Empresa'}
                </Typography>

                <AutocompleteCargo
                  value={links[cid]?.position || ""}
                  onChange={(val) => handleLinkChange(cid, "position", val)}
                />

                <Input
                  label="Salario"
                  value={links[cid]?.salary || ""}
                  onChange={(e) => {
                    const formatted = formatSalary(e.target.value);
                    handleLinkChange(cid, "salary", formatted);
                  }}
                />

                <Input
                  label="Fecha inicio"
                  type="date"
                  value={links[cid]?.start_date || ""}
                  onChange={(e) => handleLinkChange(cid, "start_date", e.target.value)}
                />
              </CardBody>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button onClick={() => setStep(1)} variant="outlined">
              Atrás
            </Button>
            <Button onClick={handleSubmit} disabled={submitting} color="green">
              {submitting ? <Spinner className="h-4 w-4" /> : "Crear Empleado y Vínculos"}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
