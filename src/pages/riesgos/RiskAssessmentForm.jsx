import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option
} from '@material-tailwind/react';
import dayjs from 'dayjs';
import api from '@/services/api';

const RiskAssessmentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && !isNaN(Number(id));
  const [loading, setLoading] = useState(true);
  const [hazards, setHazards] = useState([]);
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState({
    hazard: '',
    area: '',
    level: '',
    probability: '',
    severity: '',
    date: dayjs().format('YYYY-MM-DD'),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hazardRes, areaRes] = await Promise.all([
          api.get('/hazards/'),
          api.get('/areas/'),
        ]);

        // Ajustamos al formato de "results" si viene así
        setHazards(Array.isArray(hazardRes.data.results) ? hazardRes.data.results : hazardRes.data);
        setAreas(Array.isArray(areaRes.data.results) ? areaRes.data.results : areaRes.data);

        if (isEdit) {
          const { data } = await api.get(`/risk-assessments/${id}/`);
          setFormData({
            hazard: String(data.hazard?.id || data.hazard),
            area: String(data.area?.id || data.area),
            level: data.level,
            probability: String(data.probability),
            severity: String(data.severity),
            date: data.date,
          });
        }
      } catch (err) {
        console.error('Error cargando datos del formulario', err);
        setHazards([]);
        setAreas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/risk-assessments/${id}/`, formData);
      } else {
        await api.post('/risk-assessments/', formData);
      }
      navigate('/riesgos');
    } catch (err) {
      console.error('Error al enviar el formulario:', err);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <Card className="mt-10 w-full max-w-3xl mx-auto">
      <CardBody>
        <Typography variant="h5" className="mb-6">
          {isEdit ? 'Editar Evaluación de Riesgo' : 'Nueva Evaluación de Riesgo'}
        </Typography>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-1">Peligro</label>
            <Select
              name="hazard"
              value={formData.hazard}
              onChange={(val) => setFormData({ ...formData, hazard: val })}
            >
              {hazards.map((h) => (
                <Option key={h.id} value={String(h.id)}>
                  {h.description}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block mb-1">Área</label>
            <Select
              name="area"
              value={formData.area}
              onChange={(val) => setFormData({ ...formData, area: val })}
            >
              {areas.map((a) => (
                <Option key={a.id} value={String(a.id)}>
                  {a.name || a.area_name}
                </Option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block mb-1">Nivel de Riesgo</label>
            <Input
              type="number"
              name="level"
              value={formData.level}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1">Probabilidad</label>
            <Input
              type="number"
              name="probability"
              value={formData.probability}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1">Severidad</label>
            <Input
              type="number"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1">Fecha</label>
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" color="blue">
            {isEdit ? 'Actualizar' : 'Crear'}
          </Button>
        </form>
      </CardBody>
    </Card>
  );
};

export default RiskAssessmentForm;
