import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Alert,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import api from "@/services/api";
import EmployeeMedicalExamForm from "@/pages/occupational-health/EmployeeMedicalExamForm";

export default function MedicalExamsPage() {
  const { id } = useParams();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchExams = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/medical-exams/", {
        params: { employee: id }
      });
      setExams(res.data.results || []);
    } catch (err) {
      setError("Error al cargar exámenes.");
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, [id]);

  return (
    <Card className="mt-8">
      <CardHeader
        variant="gradient"
        color="blue"
        className="flex justify-between items-center p-6"
      >
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
          <Alert color="red" className="p-4">{error}</Alert>
        ) : (
          <>
            {exams.length === 0 ? (
              <Alert color="blue" className="mb-6">
                No hay exámenes registrados.
              </Alert>
            ) : (
              <ul className="mb-6">
                {exams.map((exam) => (
                  <li key={exam.id} className="mb-4">
                    <Typography variant="small" color="blue-gray">
                      <strong>{exam.exam_type}</strong> — {exam.date} — {exam.entity}
                    </Typography>
                    <Typography variant="small" color="gray">
                      Apto: {exam.aptitude ? "Sí" : "No"} — {exam.recommendations}
                    </Typography>
                  </li>
                ))}
              </ul>
            )}

            <EmployeeMedicalExamForm employeeId={id} onUploadSuccess={fetchExams} />
          </>
        )}
      </CardBody>
    </Card>
  );
}
