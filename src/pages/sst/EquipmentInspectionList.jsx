import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEquipmentInspections } from "@/hooks/useEquipmentInspections";
import { Card, CardHeader, CardBody, Typography, Button, IconButton } from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function EquipmentInspectionList() {
  const { id: equipmentId } = useParams();
  const { items, loading, error, remove } = useEquipmentInspections(equipmentId);
  const navigate = useNavigate();

  return (
    <section className="p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <Typography variant="h5">Inspecciones</Typography>
          <Button size="sm" onClick={() => navigate(`/dashboard/sst/equipment/${equipmentId}/inspections/new`)}>
            + Nueva Inspección
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          {loading && <Typography>Cargando…</Typography>}
          {error && <Typography color="red">{error}</Typography>}
          {!loading && !error && items.length === 0 && (
            <Typography>No hay inspecciones.</Typography>
          )}
          {!loading && !error && items.length > 0 && (
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  {["Fecha","Resultado","Técnico","Evidencia","Acciones"].map(h => (
                    <th key={h} className="p-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(ins => (
                  <tr key={ins.id} className="border-b">
                    <td className="p-2">{new Date(ins.fecha).toLocaleDateString()}</td>
                    <td className="p-2">{ins.resultado}</td>
                    <td className="p-2">{ins.tecnico}</td>
                    <td className="p-2">
                      {ins.evidencia
                        ? <a href={ins.evidencia} target="_blank" rel="noreferrer" className="text-blue-600">Ver</a>
                        : "—"}
                    </td>
                    <td className="p-2 flex gap-2">
                      <IconButton variant="text" onClick={() => navigate(`/dashboard/sst/equipment/${equipmentId}/inspections/${ins.id}`)}>
                        <PencilIcon className="w-4 h-4" />
                      </IconButton>
                      <IconButton variant="text" onClick={() => window.confirm("Eliminar?") && remove(ins.id).then(() => window.location.reload())}>
                        <TrashIcon className="w-4 h-4" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </section>
  );
}
