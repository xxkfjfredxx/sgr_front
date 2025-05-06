import React, { useState } from 'react';
import { Typography, Card, CardBody, Spinner, Select, Option } from '@material-tailwind/react';
import { useEmpresaActiva } from '@/hooks/useEmpresaActiva';
import { useEmploymentLinks } from '@/hooks/useEmploymentLinks';
import { useEmployees } from '@/hooks/useEmployees';

const EmploymentLinkList = () => {
  const { empresaActivaId } = useEmpresaActiva();
  const { links, loading, error } = useEmploymentLinks(empresaActivaId);
  const { employees, loading: loadingEmps } = useEmployees();

  const [selectedEmp, setSelectedEmp] = useState('');

  const filteredLinks = selectedEmp
    ? links.filter((link) => link.employee === parseInt(selectedEmp))
    : [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Typography variant="h4" className="mb-6 text-center">
        Vínculos Laborales Registrados
      </Typography>

      <div className="mb-6">
        {loadingEmps ? (
          <Spinner className="h-4 w-4 text-blue-500" />
        ) : (
          <Select
            label="Selecciona un empleado"
            value={selectedEmp}
            onChange={(val) => setSelectedEmp(val)}
          >
            {employees.map((emp) => (
              <Option key={emp.id} value={emp.id.toString()}>
                {emp.first_name} {emp.last_name}
              </Option>
            ))}
          </Select>
        )}
      </div>

      {loading && (
        <div className="text-blue-600 flex items-center gap-2 mb-4">
          <Spinner className="h-5 w-5" /> Cargando vínculos laborales...
        </div>
      )}

      {error && (
        <div className="text-red-600 bg-red-50 border border-red-200 rounded-md p-3 text-sm mb-4">
          ⚠️ Error al cargar vínculos: {error}
        </div>
      )}

      {!loading && !error && selectedEmp && filteredLinks.length === 0 && (
        <Typography className="text-gray-500 text-center">Este empleado no tiene vínculos aún.</Typography>
      )}

      {!loading && !error && filteredLinks.map((link) => (
        <Card key={link.id} className="mb-4 border border-gray-100">
          <CardBody className="space-y-1">
            <Typography variant="h6">
              Empleado #{link.employee} — {link.position || 'Sin cargo'}
            </Typography>
            <Typography color="gray">
              Empresa: {link.company || 'Desconocida'}
            </Typography>
            <Typography color="gray">
              Área: {link.area || '—'} | Salario: ${link.salary?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
            </Typography>
            <Typography color="gray">
              Desde: {link.start_date} {link.end_date ? `hasta ${link.end_date}` : '(vigente)'}
            </Typography>
            <Typography color="gray">
              Estado: {link.status}
            </Typography>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default EmploymentLinkList;
