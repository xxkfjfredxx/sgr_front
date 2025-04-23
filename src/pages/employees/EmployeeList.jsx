import React from 'react';
import { Button, Spinner } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import { useEmployees } from '@/hooks/useEmployees';

const EmployeeList = () => {
  const { employees, loading, error } = useEmployees();
  const navigate = useNavigate();

  const handleAddEmployee = () => {
    navigate('/dashboard/create-employee');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Employee List</h2>
        <Button onClick={handleAddEmployee} color="blue">+ Add Employee</Button>
      </div>

      {/* Spinner de carga */}
      {loading && (
        <div className="text-center py-6">
          <Spinner className="h-6 w-6" /> Loading employees...
        </div>
      )}

      {/* Mostrar error si ocurre */}
      {!loading && error && (
        <div className="text-center py-6 text-red-600 font-medium bg-red-50 border border-red-200 rounded-md p-4">
          ⚠️ Error loading employees: {error}
        </div>
      )}

      {/* Tabla cuando hay datos */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Active</th>
                <th className="px-6 py-3">Start Date</th>
                <th className="px-6 py-3">Courses Up to Date</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-t">
                  <td className="px-6 py-3">{employee.first_name} {employee.last_name}</td>
                  <td className="px-6 py-3">{employee.is_active ? 'Yes' : 'No'}</td>
                  <td className="px-6 py-3">{employee.start_date || '-'}</td>
                  <td className="px-6 py-3">{employee.courses_up_to_date ? '✅' : '❌'}</td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-3 text-center text-gray-500">No employees registered.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
