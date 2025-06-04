import React, { useState, useEffect, useContext } from 'react';
import {
  Button,
  Input,
  Typography,
  Select,
  Option,
  Spinner,
} from '@material-tailwind/react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '@/services/api';
import { useCatalogs } from '@/hooks/useCatalogs';
import { EmpresaContext } from '@/context/EmpresaContext';

export default function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const {
    positions = [],
    workAreas = [],
    companies = [],
    loading: loadingCatalogs,
    error: errorCatalogs,
  } = useCatalogs();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    document: '',
    is_active: true,
    birth_date: '',
    gender: '',
    eps: '',
    afp: '',
    education: '',
    marital_status: '',
    emergency_contact: '',
    phone_contact: '',
    address: '',
    ethnicity: '',
    socioeconomic_stratum: '',
    position: '',
    work_area: '',
  });

  const { empresaId } = useContext(EmpresaContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEditing) return;
    setLoading(true);
    api
      .get(`/employees/${id}/`)
      .then(({ data }) => {
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          document: data.document || '',
          is_active: data.is_active ?? true,
          birth_date: data.birth_date || '',
          gender: data.gender || '',
          eps: data.eps || '',
          afp: data.afp || '',
          education: data.education || '',
          marital_status: data.marital_status || '',
          emergency_contact: data.emergency_contact || '',
          phone_contact: data.phone_contact || '',
          address: data.address || '',
          ethnicity: data.ethnicity || '',
          socioeconomic_stratum: data.socioeconomic_stratum || '',
          position: data.position?.toString() || '',
          work_area: data.work_area?.toString() || '',
        });
      })
      .catch(() => setError('Error cargando datos del empleado'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEditing) {
        await api.put(`/employees/${id}/`, formData);
      } else {
        await api.post('/employees/', { ...formData, company: empresaId });
      }
      navigate('/dashboard/employees');
    } catch {
      setError('Hubo un error guardando el empleado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        {isEditing ? 'Editar Empleado' : 'Crear Empleado'}
      </Typography>

      {loadingCatalogs && (
        <div className="flex items-center gap-2 mb-4 text-blue-600">
          <Spinner className="h-5 w-5" /> Cargando catálogos...
        </div>
      )}
      {errorCatalogs && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          ⚠️ Error catálogos: {errorCatalogs}
        </div>
      )}
      {loading && (
        <div className="flex items-center gap-2 mb-4 text-blue-600">
          <Spinner className="h-5 w-5" /> Procesando...
        </div>
      )}
      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 mb-4">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} required />
        <Input label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} required />
        <Input label="Document" name="document" value={formData.document} onChange={handleChange} required />
        <Input label="Birth Date" name="birth_date" type="date" value={formData.birth_date} onChange={handleChange} />

        <Select label="Gender" value={formData.gender} onChange={(val) => setFormData((f) => ({ ...f, gender: val }))}>
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
          <Option value="Other">Other</Option>
        </Select>

        <Input label="EPS" name="eps" value={formData.eps} onChange={handleChange} />
        <Input label="AFP" name="afp" value={formData.afp} onChange={handleChange} />
        <Input label="Education" name="education" value={formData.education} onChange={handleChange} />

        <Select label="Marital Status" value={formData.marital_status} onChange={(val) => setFormData((f) => ({ ...f, marital_status: val }))}>
          <Option value="Single">Single</Option>
          <Option value="Married">Married</Option>
          <Option value="Divorced">Divorced</Option>
          <Option value="Widowed">Widowed</Option>
        </Select>

        <Input label="Emergency Contact" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} />
        <Input label="Phone Contact" name="phone_contact" value={formData.phone_contact} onChange={handleChange} />
        <Input label="Address" name="address" value={formData.address} onChange={handleChange} />

        <Select label="Ethnicity" value={formData.ethnicity} onChange={(val) => setFormData((f) => ({ ...f, ethnicity: val }))}>
          <Option value="None">None</Option>
          <Option value="Afro-Colombian">Afro-Colombian</Option>
          <Option value="Indigenous">Indigenous</Option>
          <Option value="ROM">ROM</Option>
          <Option value="Raizal">Raizal</Option>
          <Option value="Other">Other</Option>
        </Select>

        <Select label="Socioeconomic Stratum" value={formData.socioeconomic_stratum} onChange={(val) => setFormData((f) => ({ ...f, socioeconomic_stratum: val }))}>
          <Option value="1">1 - Very Low</Option>
          <Option value="2">2 - Low</Option>
          <Option value="3">3 - Medium Low</Option>
          <Option value="4">4 - Medium</Option>
          <Option value="5">5 - Medium High</Option>
          <Option value="6">6 - High</Option>
        </Select>

        {positions.length > 0 && (
          <>
            <Select label="Position (Cargo)" value={formData.position} onChange={(val) => setFormData((f) => ({ ...f, position: val }))}>
              {positions.map((pos) => (
                <Option key={pos.id} value={String(pos.id)}>{pos.name}</Option>
              ))}
            </Select>
            {formData.position && (
              <Typography variant="small" className="text-gray-700 mt-1">
                Nivel de riesgo: {
                  positions.find((p) => String(p.id) === formData.position)?.risk_level?.toUpperCase() || "No especificado"
                }
              </Typography>
            )}
          </>
        )}

        {workAreas.length > 0 && (
          <Select label="Work Area (Área)" value={formData.work_area} onChange={(val) => setFormData((f) => ({ ...f, work_area: val }))}>
            {workAreas.map((area) => (
              <Option key={area.id} value={String(area.id)}>{area.name}</Option>
            ))}
          </Select>
        )}

        <div className="flex items-center gap-2">
          <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} id="is_active" />
          <label htmlFor="is_active">Active</label>
        </div>

        <Button type="submit" color="blue" disabled={loading}>
          {isEditing ? 'Actualizar Empleado' : 'Crear Empleado'}
        </Button>
      </form>
    </div>
  );
}
