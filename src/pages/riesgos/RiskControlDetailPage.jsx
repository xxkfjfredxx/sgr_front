import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/services/api';

export default function RiskControlDetailPage() {
  const { id } = useParams();
  const [controls, setControls] = useState([]);
  const [assessmentInfo, setAssessmentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentRes, controlsRes] = await Promise.all([
          api.get(`/risk-assessments/${id}/`),
          api.get(`/risk-controls/`, { params: { assessment: id } }),
        ]);
        setAssessmentInfo(assessmentRes.data);
        setControls(controlsRes.data);
      } catch (error) {
        console.error('Error cargando datos', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando controles...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Controles de Evaluación</h1>
      {assessmentInfo && (
        <div className="mb-4 p-4 bg-gray-100 rounded shadow-sm">
          <p><strong>Peligro:</strong> {assessmentInfo.hazard_description}</p>
          <p><strong>Área:</strong> {assessmentInfo.area_name}</p>
          <p><strong>Fecha:</strong> {assessmentInfo.date}</p>
          <p><strong>Nivel:</strong> {assessmentInfo.level}</p>
        </div>
      )}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full table-auto text-sm text-left">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">Descripción</th>
              <th className="px-4 py-2">Responsable</th>
              <th className="px-4 py-2">Fecha Límite</th>
              <th className="px-4 py-2">¿Implementado?</th>
            </tr>
          </thead>
          <tbody>
            {controls.map((control) => (
              <tr key={control.id} className="border-t">
                <td className="px-4 py-2">{control.description}</td>
                <td className="px-4 py-2">{control.responsible_name || '—'}</td>
                <td className="px-4 py-2">{control.due_date}</td>
                <td className="px-4 py-2">{control.implemented ? 'Sí' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
