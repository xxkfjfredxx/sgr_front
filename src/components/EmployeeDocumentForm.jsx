import React, { useEffect, useState } from 'react';
import {
  Button,
  Input,
  Select,
  Option,
  Typography,
  Spinner,
} from '@material-tailwind/react';
import api from '@/services/api';
import { useEmployeeDocuments } from '@/hooks/useEmployeeDocuments';
import ToastNotification from '@/components/ToastNotification';

const EmployeeDocumentForm = ({ employeeId, onUploadSuccess }) => {
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Estado del toast reutilizable
  const [toast, setToast] = useState({ open: false, type: 'success', message: '' });

  const { uploadDocument, uploading } = useEmployeeDocuments(employeeId);

  useEffect(() => {
    api
      .get('/document-types/')
      .then((res) => {
        const list = Array.isArray(res.data.results) ? res.data.results : [];
        setDocumentTypes(list);
      })
      .catch(() => {
        setLoadError('⚠️ No se pudieron cargar los tipos de documentos.');
      })
      .finally(() => setLoadingTypes(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);

    if (!file || !documentType) {
      setUploadError('Selecciona archivo y tipo de documento.');
      return;
    }

    const formData = new FormData();
    formData.append('employee', employeeId);
    formData.append('document_type', documentType);
    formData.append('file', file);

    try {
      await uploadDocument(formData);
      onUploadSuccess();
      setFile(null);
      setDocumentType('');
      setToast({
        open: true,
        type: 'success',
        message: '✅ Documento subido exitosamente',
      });
      setTimeout(() => setToast({ ...toast, open: false }), 4000);
    } catch (err) {
      setToast({
        open: true,
        type: 'error',
        message: '❌ Error al subir el documento',
      });
    }
  };

  return (
    <>
      <ToastNotification
        open={toast.open}
        onClose={() => setToast({ ...toast, open: false })}
        type={toast.type}
        message={toast.message}
      />

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-lg shadow-md">
        <Typography variant="h6">Upload Document</Typography>

        {loadingTypes ? (
          <div className="flex items-center gap-2 text-blue-600">
            <Spinner className="h-4 w-4" /> Cargando tipos de documento...
          </div>
        ) : loadError ? (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{loadError}</div>
        ) : (
          <Select label="Document Type" value={documentType} onChange={setDocumentType}>
            {documentTypes.map((dt) => (
              <Option key={dt.id} value={dt.id.toString()}>
                {dt.name}
              </Option>
            ))}
          </Select>
        )}

        <Input
          type="file"
          onClick={(e) => (e.target.value = null)}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <Button type="submit" color="blue" disabled={uploading || loadingTypes}>
          {uploading ? <Spinner className="h-4 w-4" /> : 'Upload'}
        </Button>

        {uploadError && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{uploadError}</div>
        )}
      </form>
    </>
  );
};

export default EmployeeDocumentForm;
