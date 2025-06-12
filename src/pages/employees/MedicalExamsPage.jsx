// src/pages/employees/MedicalExamsPage.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Typography, Alert, Collapse, Button } from '@material-tailwind/react';
import { ChevronDownIcon, ChevronRightIcon, DocumentTextIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useParams } from 'react-router-dom';
import api from '@/services/api';
import EmployeeMedicalExamForm from '@/pages/occupational-health/EmployeeMedicalExamForm';

export default function MedicalExamsPage() {
  const { id } = useParams();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openSections, setOpenSections] = useState({ Ingreso: true, Periódico: false, Retiro: false });

  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/medical-exams/', {
        params: { employee: id }
      });
      setExams(res.data.results || []);
    } catch (err) {
      setError('Error al cargar exámenes.');
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [id]);

  const renderFileIcon = url => {
    if (!url) return null;
    const extension = url.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
      return <PhotoIcon className="h-5 w-5 text-blue-500 inline mr-1" />;
    } else if (['pdf', 'doc', 'docx', 'xml'].includes(extension)) {
      return <DocumentTextIcon className="h-5 w-5 text-blue-500 inline mr-1" />;
    } else {
      return <DocumentTextIcon className="h-5 w-5 text-gray-400 inline mr-1" />;
    }
  };

  const examPhases = ['Ingreso', 'Periódico', 'Retiro'];

  const groupByPhaseAndSubType = () => {
    const grouped = {};
    examPhases.forEach(phase => {
      grouped[phase] = {};
    });
    exams.forEach((exam) => {
      const type = exam.exam_type || "Sin tipo";
      if (!grouped[exam.exam_phase]) grouped[exam.exam_phase] = {};
      if (!grouped[exam.exam_phase][type]) grouped[exam.exam_phase][type] = [];
      grouped[exam.exam_phase][type].push(exam);
    });
  return grouped;
    return grouped;
  };

  const groupedExams = groupByPhaseAndSubType();

  const toggleSection = phase => {
    setOpenSections(prev => ({
      ...prev,
      [phase]: !prev[phase]
    }));
  };

  return (
    <Card className="mt-8">
      <CardHeader variant="gradient" color="blue" className="flex justify-between items-center p-6">
        <Typography variant="h6" color="white">
          Exámenes Médicos
        </Typography>
      </CardHeader>

      <CardBody>
        {loading ? (
          <Typography color="blue-gray" className="p-4">
            Cargando exámenes...
          </Typography>
        ) : error ? (
          <Alert color="red" className="p-4">
            {error}
          </Alert>
        ) : (
          <>
            <EmployeeMedicalExamForm employeeId={id} onUploadSuccess={fetchExams} />

            {examPhases.map(phase => (
              <div key={phase} className="mt-6">
                <Button variant="text" onClick={() => toggleSection(phase)} className="flex items-center gap-2 text-blue-800 text-left">
                  {openSections[phase] ? <ChevronDownIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
                  <Typography variant="h6">{phase}</Typography>
                </Button>
                <Collapse open={openSections[phase]}>
                  {Object.entries(groupedExams[phase] || {}).map(([examType, items]) => (
                    <div key={examType} className="mb-4 ml-4">
                      <Typography variant="small" className="font-bold text-gray-700">
                        {examType}
                      </Typography>
                      {items.map(exam => (
                        <div key={exam.id} className="ml-4 mb-2 border-l pl-3">
                          <Typography variant="small" color="gray">
                            {exam.entity_ips} – {exam.date}
                          </Typography>
                          <Typography variant="small" color="gray">
                            Apto: {exam.aptitude || '—'} — {exam.recommendations || 'Sin recomendaciones'}
                          </Typography>
                          {exam.file && (
                            <Typography variant="small" color="blue" className="mt-1">
                              <a href={exam.file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline hover:text-blue-700">
                                {renderFileIcon(exam.file)} Ver documento
                              </a>
                            </Typography>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </Collapse>
              </div>
            ))}
          </>
        )}
      </CardBody>
    </Card>
  );
}
