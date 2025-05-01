import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/employees/")
      .then((res) => {
        const list = Array.isArray(res.data)
          ? res.data
          : res.data.results || [];
        setEmployees(list);
      })
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  }, []);

  const renderInitials = (first, last) =>
    [first?.[0], last?.[0]].filter(Boolean).join("").toUpperCase();

  return (
    <Card className="mt-8">
      <CardHeader variant="gradient" color="blue" className="flex justify-between items-center p-6">
        <Typography variant="h6" color="white">
          Lista de Empleados
        </Typography>
        <Button
          variant="gradient"
          color="white"
          className="flex items-center gap-2"
          onClick={() => navigate("/dashboard/employees/create")}
        >
          <PlusIcon className="h-5 w-5" />
          Agregar Empleado
        </Button>
      </CardHeader>

      <CardBody>
        {loading ? (
          <Typography color="blue-gray">Cargando empleados...</Typography>
        ) : error ? (
          <Typography color="red">Error: {error}</Typography>
        ) : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                {["Empleado", "Documento", "Email", "Teléfono", "Acciones"].map((hdr) => (
                  <th key={hdr} className="border-b border-gray-200 py-2 px-4">
                    <Typography variant="small" className="text-xs font-bold uppercase text-gray-500">
                      {hdr}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr key={emp.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 flex items-center gap-3">
                    {emp.avatar ? (
                      <Avatar size="sm" variant="circular" src={emp.avatar} />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-blue-gray-100 flex items-center justify-center">
                        <Typography className="text-sm font-semibold text-blue-gray-600">
                          {renderInitials(emp.first_name, emp.last_name)}
                        </Typography>
                      </div>
                    )}
                    <Typography variant="small" className="font-semibold text-gray-700">
                      {emp.first_name} {emp.last_name}
                    </Typography>
                  </td>
                  <td className="py-3 px-4">
                    <Typography variant="small" className="text-gray-600">{emp.document}</Typography>
                  </td>
                  <td className="py-3 px-4">
                    <Typography variant="small" className="text-gray-600">{emp.user_email || ""}</Typography>
                  </td>
                  <td className="py-3 px-4">
                    <Typography variant="small" className="text-gray-600">{emp.phone_contact || "—"}</Typography>
                  </td>
                  <td className="py-3 px-4">
                    <Button
                      size="sm"
                      variant="text"
                      onClick={() => navigate(`/dashboard/employees/${emp.id}/edit`)}
                    >
                      Editar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
);
}
