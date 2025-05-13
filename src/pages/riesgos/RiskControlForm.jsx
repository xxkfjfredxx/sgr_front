import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/services/api';

export default function RiskControlForm() {
  const { id, controlId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    description: '',
    responsible_name: '',
    due_date: '',
    implemented: false,
    assessment: id,
  });

  const isEdit = Boolean(controlId);

  useEffect(() => {
    const fetchData = async () => {
      if (!isEdit) return;
      try {
        const { data } = await api.get(`/riesgos/risk-controls/${controlId}/`);
        setFormData(data);
      } catch (err) {
        console.error('Error al cargar control', err);
      }
    };

    fetchData();
  }, [controlId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await api.put(`/riesgos/risk-controls/${controlId}/`, formData);
      } else {
        await api.post('/riesgos/risk-controls/', formData);
      }
      navigate(`/dashboard/riesgos/controles/${id}`);
    } catch (err) {
      console.error('Error al guardar control', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded">
      <h1 className="text-2xl font-semibold mb-4">
        {isEdit ? 'Editar Control de Riesgo' : 'Nuevo Control de Riesgo'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-1">Responsable</label>
          <input
            type="text"
            name="responsible_name"
            value={formData.responsible_name}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block mb-1">Fecha Límite</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="implemented"
            checked={formData.implemented}
            onChange={handleChange}
            className="mr-2"
          />
          <label>¿Implementado?</label>
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar
        </button>
      </form>
    </div>
  );
}
