import React, { useState } from 'react';
import { Typography, Card, CardBody, IconButton } from '@material-tailwind/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import api from '@/services/api';
import ConfirmDialog from '@/components/ConfirmDialog';

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
  const showDelete = typeof onDelete === 'function';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState(null);

  const handleDelete = async () => {
    try {
      await api.delete(`/documents/${selectedDocId}/`);
      setDialogOpen(false);
      setSelectedDocId(null);
      onDelete?.();
    } catch (error) {
      console.error("❌ Error al eliminar documento:", error);
      alert("No se pudo eliminar el documento.");
    }
  };

  const visibleDocs = documents.filter((doc) => !doc.is_deleted);

  if (visibleDocs.length === 0) {
    return <Typography className="text-gray-500 text-center">No hay documentos disponibles.</Typography>;
  }

  return (
    <>
      <ConfirmDialog
        open={dialogOpen}
        onCancel={() => {
          setDialogOpen(false);
          setSelectedDocId(null);
        }}
        onConfirm={handleDelete}
        title="¿Eliminar documento?"
        message="Esta acción eliminará el documento permanentemente."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {visibleDocs.map((doc) => {
          const ext = getFileExtension(doc.file);
          const fileUrl = doc.file;
          const isImg = isImage(ext);
          const icon = fileIcons[ext] || fileIcons.default;

          return (
            <Card key={doc.id} className="relative hover:shadow-lg transition">
              {showDelete && (
                <IconButton
                  size="sm"
                  color="red"
                  variant="text"
                  className="!absolute top-1 right-1 z-10"
                  onClick={() => {
                    setSelectedDocId(doc.id);
                    setDialogOpen(true);
                  }}
                >
                  <XMarkIcon className="w-4 h-4" />
                </IconButton>
              )}

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
                  {doc.document_type_name || 'Documento'}
                </Typography>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default DocumentGallery;
