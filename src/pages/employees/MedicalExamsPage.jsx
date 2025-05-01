// src/pages/employees/MedicalExamsPage.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { useMedicalExams } from '@/hooks/useMedicalExams';
import { Typography, Button } from '@material-tailwind/react';
import { useTransition } from 'react';

export default function MedicalExamsPage() {
  const { id } = useParams();
  const { data, loading, error } = useMedicalExams(id);
  // extraer la lista de exámenes de data.results
  const exams = data?.results ?? [];
  const [isPending, startTransition] = useTransition();

  if (loading) return <Typography color="blue-gray" className="p-4">Cargando exámenes…</Typography>;
  if (error)   return <Typography color="red" className="p-4">Error: {error}</Typography>;

  return (
    <div className="p-4">
      <Typography variant="h6" className="mb-4">Exámenes Médicos</Typography>
      {exams.length === 0 ? (
        <Typography>No hay exámenes registrados.</Typography>
      ) : (
        <ul className="list-disc ml-6 space-y-2">
          {exams.map(ex => (
            <li key={ex.id} className="flex justify-between items-center">
              <span>
                {ex.date} — {ex.exam_phase} / {ex.sub_type} — Próximo: {ex.next_due || 'n/a'}
              </span>
              <Button size="sm" variant="text" onClick={() => startTransition(() => {/* navegar o descargar */})} disabled={isPending}>
                Ver archivo
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
