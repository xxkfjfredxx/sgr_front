import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import {
  PlusIcon,
  DocumentIcon,
  ClipboardDocumentListIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useEmpresaActiva } from "@/hooks/useEmpresaActiva";
import api from "@/services/api";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [pendingSearch, setPendingSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterActive, setFilterActive] = useState(true);
  const navigate = useNavigate();
  const { empresaActivaId } = useEmpresaActiva();

  const fetchData = (page = currentPage, query = search, isActive = filterActive) => {
    if (!empresaActivaId) return;
    setLoading(true);
    const params = {
      page,
      search: query,
      company: empresaActivaId,
      is_active: isActive,
    };

    api
      .get("/employees/", { params })
      .then((res) => {
        const list = Array.isArray(res.data.results) ? res.data.results : [];
        setEmployees(list);
        setTotalPages(Math.ceil(res.data.count / 20));
      })
      .catch((err) => setError(err.response?.data?.detail || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData(1, search, filterActive);
  }, [empresaActivaId, filterActive]);

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleSearchChange = (e) => setPendingSearch(e.target.value);

  const handleSearchSubmit = () => {
    setSearch(pendingSearch);
    setCurrentPage(1);
    fetchData(1, pendingSearch, filterActive);
  };

  const renderInitials = (first, last) => [first?.[0], last?.[0]].filter(Boolean).join("").toUpperCase();

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Card className="mt-8">
      <CardHeader variant="gradient" color="blue" className="flex flex-col md:flex-row justify-between gap-4 p-6">
        <div className="flex-1">
          <Typography variant="h6" color="white">
            Lista de Empleados
          </Typography>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Input
              label="Buscar por nombre, correo o cédula"
              value={pendingSearch}
              onChange={handleSearchChange}
              className="min-w-[250px]"
            />
            <Button onClick={handleSearchSubmit} size="sm" className="flex items-center gap-1">
              <MagnifyingGlassIcon className="h-4 w-4" /> Buscar
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={filterActive}
              onChange={(e) => setFilterActive(e.target.checked)}
              label={<Typography variant="small">Solo activos</Typography>}
            />
          </div>
          <Button
            variant="gradient"
            color="white"
            className="flex items-center gap-2"
            onClick={() => navigate("create-wizard")}
          >
            <PlusIcon className="h-5 w-5" /> Agregar Empleado
          </Button>
        </div>
      </CardHeader>

      <CardBody className="overflow-x-auto">
        {!empresaActivaId ? (
          <Typography color="red" className="p-4">Seleccione una empresa para listar empleados.</Typography>
        ) : loading ? (
          <Typography color="blue-gray" className="p-4">Cargando empleados...</Typography>
        ) : error ? (
          <Typography color="red" className="p-4">Error: {error}</Typography>
        ) : employees.length === 0 ? (
          <Typography color="blue-gray" className="p-4">No se encontraron empleados.</Typography>
        ) : (
          <table className="w-full table-auto text-left min-w-[1100px]">
            <thead>
              <tr>
                {["Empleado", "Documento", "Teléfono", "Activo", "Docs", "Exámenes Médicos", "Cursos", "Próximos Exámenes", "Acciones"].map((hdr) => (
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
                    <div>
                      <Typography className="text-sm font-semibold text-gray-700">
                        {emp.first_name} {emp.last_name}
                      </Typography>
                      <Typography className="text-xs text-gray-500">{emp.user_email}</Typography>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <Typography variant="small" className="text-gray-600">{emp.document}</Typography>
                  </td>
                  <td className="py-3 px-4">
                    <Typography variant="small" className="text-gray-600">{emp.phone_contact || "—"}</Typography>
                  </td>
                  <td className="py-3 px-4">
                    <Typography variant="small" className="text-gray-600">
                      {emp.employment_links?.some((link) => link.status === "ACTIVE") ? "Sí" : "No"}
                    </Typography>
                  </td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="text" className="flex items-center gap-1" onClick={() => navigate(`${emp.id}/documents`)}>
                      <DocumentIcon className="h-4 w-4" /> Ver Docs
                    </Button>
                  </td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="text" className="flex items-center gap-1" onClick={() => navigate(`${emp.id}/medical-exams`)}>
                      <ClipboardDocumentListIcon className="h-4 w-4" /> Ver Exams
                    </Button>
                  </td>
                  <td className="py-3 px-4">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {emp.course_expirations?.map((c, i) => (
                        <li key={`curso-${i}`} className="text-blue-700">
                          {c.name}: {c.expires_on}
                        </li>
                      )) || <li className="text-gray-400">Sin cursos</li>}
                    </ul>
                  </td>
                  <td className="py-3 px-4">
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {emp.exam_expirations?.map((e, i) => (
                        <li key={`exam-${i}`} className="text-red-600">
                          {e.type}: {e.expires_on}
                        </li>
                      )) || <li className="text-gray-400">Sin exámenes</li>}
                    </ul>
                  </td>
                  <td className="py-3 px-4">
                    <Button size="sm" variant="text" onClick={() => navigate(`${emp.id}/edit`)}>
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