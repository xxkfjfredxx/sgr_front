// src/pages/employees/EmployeeDocumentsAdminPage.jsx
import React, { useEffect, useState } from "react";
import { Typography, Select, Option, Spinner } from "@material-tailwind/react";
import api from "@/services/api";
import { useEmployeeDocumentList } from "@/hooks/useEmployeeDocumentList";
import EmployeeDocumentForm from "@/components/EmployeeDocumentForm";
import DocumentGallery from '@/components/DocumentGallery';
console.log("✅ DocumentGallery importado correctamente");

export default function EmployeeDocumentsAdminPage() {
  const [employees, setEmployees] = useState([]);
  const [loadingEmps, setLoadingEmps] = useState(true);
  const [errorEmps, setErrorEmps] = useState(null);
  const [selectedId, setSelectedId] = useState("");

  const calculateAge = (birthDate) => {
    if (!birthDate) return "";
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const {
    documents,
    loading: loadingDocs,
    error: errorDocs,
    refetch,
  } = useEmployeeDocumentList(selectedId);

  useEffect(() => {
    setLoadingEmps(true);
    api
      .get("/employees/")
      .then((res) => {
        const payload = res.data;
        const list = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.results)
          ? payload.results
          : [];
        setEmployees(list);

        const saved = localStorage.getItem("selectedEmployeeId");
        if (saved && list.some((e) => String(e.id) === saved)) {
          setSelectedId(saved);
        }
      })
      .catch((err) => {
        const status = err.response?.status;
        const msg = err.response?.data?.detail || err.message;
        setErrorEmps(`(${status}) ${msg}`);
      })
      .finally(() => {
        setLoadingEmps(false);
      });
  }, []);

  const handleSelect = (val) => {
    setSelectedId(val);
    localStorage.setItem("selectedEmployeeId", val);
  };

  const employeeSelected = employees.find((e) => String(e.id) === selectedId);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Typography variant="h4" color="blue-gray">
        Adjuntar documentos a un empleado
      </Typography>

      {loadingEmps ? (
        <div className="flex items-center gap-2 text-blue-600">
          <Spinner className="h-5 w-5" /> Cargando empleados…
        </div>
      ) : errorEmps ? (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
          ⚠️ Error al cargar empleados: {errorEmps}
        </div>
      ) : (
        <Select
          label="Selecciona empleado"
          value={selectedId || ""}
          onChange={handleSelect}
        >
          {employees.map((emp) => (
            <Option key={emp.id} value={String(emp.id)}>
              {emp.first_name} {emp.last_name}
            </Option>
          ))}
        </Select>
      )}

      {employeeSelected && (
        <Typography variant="h6" color="blue-gray" className="mt-2">
          Nombre: <strong>{employeeSelected.first_name} {employeeSelected.last_name}</strong>
          <br />
          Documento: <strong>{employeeSelected.document}</strong>
          <br />
          Edad: <strong>{calculateAge(employeeSelected.birth_date)} años</strong>
        </Typography>
      )}

      {employeeSelected && (
        <>
          <EmployeeDocumentForm
            employeeId={selectedId}
            onUploadSuccess={refetch}
          />

          {loadingDocs ? (
            <div className="flex items-center gap-2 text-blue-600">
              <Spinner className="h-5 w-5" /> Cargando documentos…
            </div>
          ) : errorDocs ? (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 text-sm">
              ⚠️ Error al cargar documentos: {errorDocs}
            </div>
          ) : (
            <DocumentGallery
              documents={documents}
              onDelete={() => {
                console.log("📡 refetch() desde AdminPage ejecutado");
                refetch();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}
