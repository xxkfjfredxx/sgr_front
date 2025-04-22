import React from 'react';
import { Typography, Card, CardBody, IconButton } from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';

const fileIcons = {
  pdf: '/icons/pdf-icon.png',
  doc: '/icons/word-icon.png',
  docx: '/icons/word-icon.png',
  xls: '/icons/excel-icon.png',
  xlsx: '/icons/excel-icon.png',
  default: '/icons/file-icon.png',
};

const getFileExtension = (filename) => filename.split('.').pop().toLowerCase();
const isImage = (ext) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);

const DocumentGallery = ({ documents, onDelete }) => {
  if (documents.length === 0) {
    return <Typography className="text-gray-500 text-center">No documents uploaded yet.</Typography>;
  }

  const handleDelete = async (docId) => {
    const confirmed = window.confirm('¿Deseas eliminar este documento?');
    if (!confirmed) return;

    try {
      await api.delete(`/documents/${docId}/`);
      onDelete?.(); // Refrescar después de eliminar
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Hubo un error al eliminar el documento.');
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {documents.map((doc) => {
        const ext = getFileExtension(doc.file);
        const fileUrl = doc.file;
        const isImg = isImage(ext);
        const icon = fileIcons[ext] || fileIcons.default;

        return (
          <Card key={doc.id} className="relative hover:shadow-lg transition">
            {/* Botón X arriba a la derecha */}
            <IconButton
              size="sm"
              color="red"
              variant="text"
              className="!absolute top-1 right-1 z-10"
              onClick={() => handleDelete(doc.id)}
            >
              <XMarkIcon className="w-4 h-4" />
            </IconButton>

            <CardBody className="flex flex-col items-center">
              <div className="w-24 h-24 overflow-hidden mb-2 flex justify-center items-center">
                {isImg ? (
                  <img
                    src={fileUrl}
                    alt="Document Thumbnail"
                    className="object-cover h-full w-full cursor-pointer rounded"
                    onClick={() => window.open(fileUrl, '_blank')}
                  />
                ) : (
                  <img
                    src={icon}
                    alt="File Icon"
                    className="h-16 w-16 cursor-pointer"
                    onClick={() => window.open(fileUrl, '_blank')}
                  />
                )}
              </div>
              <Typography className="text-center text-xs truncate w-24">
                {doc.document_type_name || 'Document'}
              </Typography>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
};

export default DocumentGallery;
