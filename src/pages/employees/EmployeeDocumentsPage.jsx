import React from 'react';
import { Spinner, Typography } from '@material-tailwind/react';
import { useParams } from 'react-router-dom';
import { useAuthUser } from '@/hooks/useAuthUser'; // 👈 tu custom hook

import { useEmployeeDocumentList } from '@/hooks/useEmployeeDocumentList';
import EmployeeDocumentForm from '@/components/EmployeeDocumentForm';
import DocumentGallery from '@/components/DocumentGallery';

const EmployeeDocumentsPage = () => {
  const { id: paramId } = useParams(); // ID de la URL si existe
  const { employeeId: authEmployeeId, isStaff, isSuperuser } = useAuthUser(); // del login
  const isAdmin = isStaff || isSuperuser;

  // Elige el id según prioridad: URL primero, si no, el propio empleado logueado
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

      {/* Galería */}
      {!loading && !error && (
        <DocumentGallery documents={documents} />
      )}
    </div>
  );
};

export default EmployeeDocumentsPage;
