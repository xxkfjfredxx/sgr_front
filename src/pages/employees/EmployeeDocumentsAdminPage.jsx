import React, { useEffect, useState } from 'react';
import { Typography, Select, Option, Spinner } from '@material-tailwind/react';
import api from '@/services/api';
import { useEmployeeDocumentList } from '@/hooks/useEmployeeDocumentList';
import EmployeeDocumentForm from '@/components/EmployeeDocumentForm';
import DocumentGallery from '@/components/DocumentGallery';

const EmployeeDocumentsAdminPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [errorEmployees, setErrorEmployees] = useState(null);
  const [selectedId, setSelectedId] = useState('');

  const {
    documents,
    loading: loadingDocs,
    error: errorDocs,
    refetch,
  } = useEmployeeDocumentList(selectedId);

  useEffect(() => {
    api.get('/employees/')
      .then((res) => setEmployees(res.data))
      .catch((err) => {
        const status = err.response?.status;
        const msg = err.response?.data?.detail || err.message;
        setErrorEmployees(`(${status}) ${msg}`);
      })
      .finally(() => setLoadingEmployees(false));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Typography variant="h4" color="blue-gray">
        Upload Documents for Employee
      </Typography>

      {loadingEmployees ? (
        <div className="flex items-center gap-2 text-blue-600">
          <Spinner className="h-5 w-5" /> Loading employees...
        </div>
      ) : errorEmployees ? (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
          ⚠️ Error loading employees: {errorEmployees}
        </div>
      ) : (
        <Select label="Select Employee" value={selectedId} onChange={(val) => setSelectedId(val)}>
          {employees.map((emp) => (
            <Option key={emp.id} value={String(emp.id)}>
              {emp.first_name} {emp.last_name}
            </Option>
          ))}
        </Select>
      )}

      {selectedId && (
        <>
          <EmployeeDocumentForm employeeId={selectedId} onUploadSuccess={refetch} />

          {loadingDocs ? (
            <div className="flex items-center gap-2 text-blue-600">
              <Spinner className="h-5 w-5" /> Loading documents...
            </div>
          ) : errorDocs ? (
            <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 text-sm">
              ⚠️ Error loading documents: {errorDocs}
            </div>
          ) : (
            <DocumentGallery documents={documents} onDelete={refetch} />
          )}
        </>
      )}
    </div>
  );
};

export default EmployeeDocumentsAdminPage;
