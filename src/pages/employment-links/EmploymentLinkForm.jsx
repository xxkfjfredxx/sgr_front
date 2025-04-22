import React, { useState } from 'react';
import {
  Button,
  Input,
  Typography,
  Select,
  Option,
  Spinner,
} from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';
import { useEmploymentLinkData } from '@/hooks/useEmploymentLinkData';

const EmploymentLinkForm = () => {
  const navigate = useNavigate();
  const { employees, positions, workAreas, companies, loading, error } =
    useEmploymentLinkData();

  const [formData, setFormData] = useState({
    employee: '',
    company: '',
    position: '',
    work_area: '',
    contract_type: '',
    salary: '',
    start_date: '',
    end_date: '',
    shift: '',
    status: 'ACTIVO',
  });

  const handleSalaryChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    setFormData({ ...formData, salary: formatted });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cleanFormData = {
        ...formData,
        salary: formData.salary.replace(/\./g, ''),
      };
      await api.post('/employment-links/', cleanFormData);
      navigate('/dashboard/employment-links');
    } catch (error) {
      console.error('Error creating employment link:', error);
      alert('There was an error creating the employment link.');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Typography variant="h4" color="blue-gray" className="mb-4">
        Create Employment Link
      </Typography>

      {loading && (
        <div className="text-blue-600 flex items-center gap-2 mb-4">
          <Spinner className="h-5 w-5" /> Loading options...
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 text-sm mb-4">
          ⚠️ Error loading options: {error}
        </div>
      )}

      {!loading && !error && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Employee"
            value={formData.employee}
            onChange={(val) => setFormData({ ...formData, employee: val })}
          >
            {employees.map((emp) => (
              <Option key={emp.id} value={String(emp.id)}>
                {emp.first_name} {emp.last_name}
              </Option>
            ))}
          </Select>

          <Select
            label="Company"
            value={formData.company}
            onChange={(val) => setFormData({ ...formData, company: val })}
          >
            {companies.map((c) => (
              <Option key={c.id} value={String(c.id)}>
                {c.name}
              </Option>
            ))}
          </Select>

          <Select
            label="Position"
            value={formData.position}
            onChange={(val) => setFormData({ ...formData, position: val })}
          >
            {positions.map((p) => (
              <Option key={p.id} value={String(p.id)}>
                {p.name}
              </Option>
            ))}
          </Select>

          <Select
            label="Work Area"
            value={formData.work_area}
            onChange={(val) => setFormData({ ...formData, work_area: val })}
          >
            {workAreas.map((wa) => (
              <Option key={wa.id} value={String(wa.id)}>
                {wa.name}
              </Option>
            ))}
          </Select>

          <Select
            label="Contract Type"
            value={formData.contract_type}
            onChange={(val) =>
              setFormData({ ...formData, contract_type: val })
            }
          >
            <Option value="">Seleccionar</Option>
            <Option value="Indefinido">Indefinido</Option>
            <Option value="Fijo">Fijo</Option>
            <Option value="Prestación de servicios">
              Prestación de servicios
            </Option>
          </Select>

          <Input
            label="Salary"
            name="salary"
            value={formData.salary}
            onChange={handleSalaryChange}
            maxLength={15}
          />

          <Input
            label="Start Date"
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
          />

          <Input
            label="End Date"
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
          />

          <Select
            label="Shift"
            value={formData.shift}
            onChange={(val) => setFormData({ ...formData, shift: val })}
          >
            <Option value="">Seleccionar</Option>
            <Option value="Jornada completa">Jornada completa</Option>
            <Option value="Medio tiempo">Medio tiempo</Option>
            <Option value="Turno nocturno">Turno nocturno</Option>
            <Option value="Rotativo">Rotativo</Option>
          </Select>

          <Select
            label="Status"
            value={formData.status}
            onChange={(val) => setFormData({ ...formData, status: val })}
          >
            <Option value="ACTIVO">Activo</Option>
            <Option value="FINALIZADO">Finalizado</Option>
          </Select>

          <Button type="submit" color="blue">
            Save Link
          </Button>
        </form>
      )}
    </div>
  );
};

export default EmploymentLinkForm;
