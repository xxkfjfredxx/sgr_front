import React, { useEffect, useState } from 'react';
import { Button, Input, Select, Option, Typography, Spinner } from '@material-tailwind/react';
import api from '@/services/api';
import { useEmployeeDocuments } from '@/hooks/useEmployeeDocuments';

const EmployeeDocumentForm = ({ employeeId, onUploadSuccess }) => {
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState(null);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loadingTypes, setLoadingTypes] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const { uploadDocument, uploading } = useEmployeeDocuments(employeeId);

  useEffect(() => {
    console.debug('[LOG] Cargando tipos de documentos...');
    api.get('/document-types/')
      .then((res) => {
        setDocumentTypes(res.data);
        console.debug('[LOG] Document types:', res.data);
      })
      .catch((err) => {
        setLoadError('⚠️ No se pudieron cargar los tipos de documentos.');
        console.error('[ERROR] Document type load:', err);
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

    // Simular el contenido como JSON para ver en consola
    const debugJson = {
      employee: employeeId,
      document_type: documentType,
      file: file?.name,
    };

    console.log('[LOG] Enviando FormData (simulado como JSON):', debugJson);

    try {
      const response = await uploadDocument(formData);
      console.log('[LOG] Upload response:', response);
      setFile(null);
      setDocumentType('');
      onUploadSuccess?.();
    } catch (err) {
      const msg = err.response?.data?.detail || err.message;
      setUploadError(`⚠️ Error al subir documento: ${msg}`);
      console.error('[ERROR] Upload error:', err.response?.data || err.message);
    }
  };

  return (
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
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx"
        onChange={(e) => setFile(e.target.files[0])}
        label="Select File"
      />

      {uploadError && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">{uploadError}</div>
      )}

      <Button type="submit" color="blue" disabled={uploading || loadingTypes}>
        {uploading ? <Spinner className="h-4 w-4" /> : 'Upload'}
      </Button>
    </form>
  );
};

export default EmployeeDocumentForm;
