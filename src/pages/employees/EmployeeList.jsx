import React, { useEffect, useState } from 'react';
import { Button } from '@material-tailwind/react';
import { useNavigate } from 'react-router-dom';
import api from '@/services/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await api.get('/employees/');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
    }
  };

  const handleAddEmployee = () => {
    navigate('/employees/create');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Employee List</h2>
        <Button onClick={handleAddEmployee} color="blue">+ Add Employee</Button>
      </div>

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
    </div>
  );
};

export default EmployeeList;
