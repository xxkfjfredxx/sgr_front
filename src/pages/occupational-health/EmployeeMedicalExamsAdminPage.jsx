import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Select,
  Option,
  Alert,
  Collapse,
  Button,
  Spinner,
} from "@material-tailwind/react";
import { ChevronDownIcon, ChevronRightIcon, DocumentTextIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useEmployees } from "@/hooks/useEmployees";
import { useEmployeeMedicalExams } from "@/hooks/useEmployeeMedicalExams";
import EmployeeMedicalExamForm from "@/pages/occupational-health/EmployeeMedicalExamForm";

export default function EmployeeMedicalExamsAdminPage() {
  const { data: employees = [], isLoading: loadingEmployees, isError: errorEmployees } = useEmployees();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [openSections, setOpenSections] = useState({ Ingreso: true, Periódico: false, Retiro: false });

  const { exams = [], loading, error, uploadExam } = useEmployeeMedicalExams(selectedEmployeeId);

  const renderFileIcon = (url) => {
    if (!url) return null;
    const extension = url.split('.').pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension)) {
      return <PhotoIcon className="h-5 w-5 text-blue-500 inline mr-1" />;
    } else if (["pdf", "doc", "docx", "xml"].includes(extension)) {
      return <DocumentTextIcon className="h-5 w-5 text-blue-500 inline mr-1" />;
    } else {
      return <DocumentTextIcon className="h-5 w-5 text-gray-400 inline mr-1" />;
    }
  };

  const examPhases = ["Ingreso", "Periódico", "Retiro"];

  const groupByPhaseAndSubType = () => {
    const grouped = {};
    examPhases.forEach(phase => {
      grouped[phase] = {};
    });
    exams.forEach(exam => {
      if (!grouped[exam.exam_phase]) grouped[exam.exam_phase] = {};
      if (!grouped[exam.exam_phase][exam.sub_type]) grouped[exam.exam_phase][exam.sub_type] = [];
      grouped[exam.exam_phase][exam.sub_type].push(exam);
    });
    return grouped;
  };

  const groupedExams = groupByPhaseAndSubType();

  const toggleSection = (phase) => {
    setOpenSections((prev) => ({
      ...prev,
      [phase]: !prev[phase],
    }));
  };

  return (
    <Card className="mt-8">
      <CardHeader
        variant="gradient"
        color="blue"
        className="flex justify-between items-center p-6"
      >
        <Typography variant="h6" color="white">
          Administrar Exámenes Médicos de Empleados
        </Typography>
      </CardHeader>

      <CardBody>
        {loadingEmployees ? (
          <div className="flex items-center gap-2 text-blue-600">
            <Spinner className="h-4 w-4" /> Cargando empleados...
          </div>
        ) : errorEmployees ? (
          <Alert color="red">Error al cargar empleados.</Alert>
        ) : (
          <Select
            label="Selecciona un empleado"
            value={selectedEmployeeId || ""}
            onChange={(val) => setSelectedEmployeeId(val)}
          >
            {employees.map((emp) => (
              <Option key={emp.id} value={emp.id.toString()}>
                {emp.first_name} {emp.last_name} ({emp.document})
              </Option>
            ))}
          </Select>
        )}

        {selectedEmployeeId && (
          <div className="mt-6 space-y-6">
            <EmployeeMedicalExamForm employeeId={selectedEmployeeId} onUploadSuccess={() => {}} />

            <div>
              <Typography variant="h6" className="mb-2 text-blue-800 border-b pb-1">
                Exámenes registrados
              </Typography>
              {loading ? (
                <Typography color="gray">Cargando exámenes...</Typography>
              ) : exams.length === 0 ? (
                <Alert color="blue">No hay exámenes registrados para este empleado.</Alert>
              ) : (
                examPhases.map(phase => (
                  <div key={phase} className="mb-6">
                    <Button
                      variant="text"
                      onClick={() => toggleSection(phase)}
                      className="flex items-center gap-2 text-blue-800 text-left"
                    >
                      {openSections[phase] ? (
                        <ChevronDownIcon className="h-5 w-5" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5" />
                      )}
                      <Typography variant="h6">{phase}</Typography>
                    </Button>
                    <Collapse open={openSections[phase]}>
                      {Object.entries(groupedExams[phase] || {}).map(([subType, items]) => (
                        <div key={subType} className="ml-4 mb-3">
                          <Typography variant="small" className="font-bold text-gray-800">
                            {subType}
                          </Typography>
                          {items.map((exam) => (
                            <div key={exam.id} className="ml-4 border-l pl-3 mb-2">
                              <Typography variant="small" color="gray">
                                {exam.entity} – {exam.date}
                              </Typography>
                              <Typography variant="small" color="gray">
                                Apto: {exam.aptitude || "—"} — {exam.recommendations || "Sin recomendaciones"}
                              </Typography>
                              {exam.file && (
                                <Typography variant="small" color="blue" className="mt-1">
                                  <a
                                    href={exam.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 underline hover:text-blue-700"
                                  >
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
                ))
              )}
            </div>
          </div>
        )}

        {error && <Alert color="red" className="mt-4">{error}</Alert>}
      </CardBody>
    </Card>
  );
}
