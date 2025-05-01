// src/pages/employees/EmployeeDocumentsAdminPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmployeeDocumentForm from "@/components/EmployeeDocumentForm";
import DocumentGallery from "@/components/DocumentGallery";
import api from "@/services/api";
import { Typography } from "@material-tailwind/react";
import { useEmployees } from "@/hooks/useEmployees";

export default function EmployeeDocumentsAdminPage() {
  const { employeeId } = useParams();
  const { employees, loading: loadingEmps, error: errorEmps } = useEmployees();
  const [documents, setDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  const loadDocuments = () => {
    if (!employeeId) {
      setDocuments([]);
      setLoadingDocs(false);
      return;
    }
    setLoadingDocs(true);
    api
      .get("/documents/", { params: { employee: employeeId } })
      .then((res) => {
        setDocuments(Array.isArray(res.data.results) ? res.data.results : []);
      })
      .catch(() => {
        setDocuments([]);
      })
      .finally(() => setLoadingDocs(false));
  };

  useEffect(loadDocuments, [employeeId]);

  if (loadingEmps) {
    return <Typography>Cargando empleados…</Typography>;
  }
  if (errorEmps) {
    return <Typography color="red">{errorEmps}</Typography>;
  }

  const employee = employees.find((e) => e.id.toString() === employeeId);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <Typography variant="h4" className="mb-4">
        Documentos de {employee ? `${employee.first_name} ${employee.last_name}` : "Empleado"}
      </Typography>

      <EmployeeDocumentForm
        employeeId={employeeId}
        onUploadSuccess={loadDocuments}
      />

      {loadingDocs ? (
        <Typography className="mt-4">Cargando documentos…</Typography>
      ) : (
        <DocumentGallery documents={documents} onDelete={loadDocuments} />
      )}
    </div>
  );
}
