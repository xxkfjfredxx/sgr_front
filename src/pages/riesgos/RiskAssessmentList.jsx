import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input,
  Checkbox,
} from "@material-tailwind/react";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { useEmpresaActiva } from "@/hooks/useEmpresaActiva";
import api from "@/services/api";

export default function RiskAssessmentList() {
  const [items, setItems] = useState([]);
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
      .get("/risk-assessments/", { params }) // Ajusta el endpoint real aquí si es necesario
      .then((res) => {
        const list = Array.isArray(res.data.results) ? res.data.results : [];
        setItems(list);
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

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <Card className="mt-8">
      <CardHeader variant="gradient" color="blue" className="flex flex-col md:flex-row justify-between gap-4 p-6">
        <div className="flex-1">
          <Typography variant="h6" color="white">
            Evaluaciones de Riesgo
          </Typography>
        </div>
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Input
              label="Buscar por nombre o código"
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
              label={<Typography variant="small">Solo activas</Typography>}
            />
          </div>
          <Button
            variant="gradient"
            color="white"
            className="flex items-center gap-2"
            onClick={() => navigate("create")}
          >
            <PlusIcon className="h-5 w-5" /> Nueva Evaluación
          </Button>
        </div>
      </CardHeader>

      <CardBody>
        {!empresaActivaId ? (
          <Typography color="red" className="p-4">Seleccione una empresa para ver las evaluaciones.</Typography>
        ) : loading ? (
          <Typography color="blue-gray" className="p-4">Cargando evaluaciones...</Typography>
        ) : error ? (
          <Typography color="red" className="p-4">Error: {error}</Typography>
        ) : items.length === 0 ? (
          <Typography color="blue-gray" className="p-4">No se encontraron evaluaciones.</Typography>
        ) : (
          <>
            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  {["Nombre", "Fecha", "Responsable", "Activo", "Acciones"].map((hdr) => (
                    <th key={hdr} className="border-b border-gray-200 py-2 px-4">
                      <Typography variant="small" className="text-xs font-bold uppercase text-gray-500">
                        {hdr}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <Typography className="text-sm font-semibold text-gray-700">
                        {item.name || "Sin nombre"}
                      </Typography>
                    </td>
                    <td className="py-3 px-4">
                      <Typography variant="small" className="text-gray-600">
                        {item.date || "—"}
                      </Typography>
                    </td>
                    <td className="py-3 px-4">
                      <Typography variant="small" className="text-gray-600">
                        {item.responsible_name || "—"}
                      </Typography>
                    </td>
                    <td className="py-3 px-4">
                      <Typography variant="small" className="text-gray-600">
                        {item.is_active ? "Sí" : "No"}
                      </Typography>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="text" onClick={() => navigate(`${item.id}/edit`)}>
                        Editar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-4">
              <Typography variant="small" color="blue-gray">
                Página {currentPage} de {totalPages}
              </Typography>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => goToPage(1)} disabled={currentPage === 1}>
                  <ChevronDoubleLeftIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button size="sm" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
                  <ChevronDoubleRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
