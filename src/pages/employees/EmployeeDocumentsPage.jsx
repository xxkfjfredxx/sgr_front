import React from 'react';
import { Spinner, Typography } from '@material-tailwind/react';
import { useParams } from 'react-router-dom';
import { useAuthUser } from '@/hooks/useAuthUser';

import { useEmployeeDocumentList } from '@/hooks/useEmployeeDocumentList';
import EmployeeDocumentForm from '@/components/EmployeeDocumentForm';
import DocumentGallery from '@/components/DocumentGallery';

const EmployeeDocumentsPage = () => {
  const { id: paramId } = useParams();
  const { employeeId: authEmployeeId } = useAuthUser(); // ya no necesitas isAdmin aquí

  const employeeId = paramId ?? authEmployeeId;

  if (!employeeId) {
    return <div className="text-red-600 p-4">No employee ID available.</div>;
  }

  const { documents, loading, error, refetch } = useEmployeeDocumentList(employeeId);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Typography variant="h4" color="blue-gray">
        Employee Documents
      </Typography>

      {/* Formulario para subir archivos */}
      <EmployeeDocumentForm
        employeeId={employeeId}
        onUploadSuccess={refetch}
      />

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-2 text-blue-600">
          <Spinner className="h-5 w-5" /> Loading documents...
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 text-sm">
          ⚠️ Error loading documents: {error}
        </div>
      )}

      {/* Galería con opción de eliminar */}
      {!loading && !error && (
        <DocumentGallery
          documents={documents}
          onDelete={() => {
            console.log("🧨 refetch() desde EmployeeDocumentsPage");
            refetch();
          }}
        />
      )}
    </div>
  );
};

export default EmployeeDocumentsPage;
