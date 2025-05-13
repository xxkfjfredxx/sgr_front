// src/pages/sst/EquipmentInventoryList.jsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { useEquipmentInventory } from "@/hooks/useEquipmentInventory";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  IconButton,
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function EquipmentInventoryList() {
  const { items, loading, error, remove } = useEquipmentInventory();
  const navigate = useNavigate();

  return (
    <section className="p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <Typography variant="h5">Inventario de Equipos</Typography>
          <Button
            onClick={() => navigate("/dashboard/sst/equipment/new")}
            size="sm"
          >
            + Nuevo Equipo
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          {loading && <Typography>Cargando…</Typography>}
          {error && <Typography color="red">{error}</Typography>}
          {!loading && !error && items.length === 0 && (
            <Typography>No hay equipos registrados.</Typography>
          )}
          {!loading && !error && items.length > 0 && (
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "Categoría",
                    "Serial",
                    "Cantidad",
                    "Fecha compra",
                    "Certificado",
                    "Estado",
                    "Acciones",
                  ].map((h) => (
                    <th key={h} className="p-2">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((e) => (
                  <tr key={e.id} className="border-b">
                    <td className="p-2">{e.categoria}</td>
                    <td className="p-2">{e.serial || "—"}</td>
                    <td className="p-2">{e.cantidad}</td>
                    <td className="p-2">
                      {new Date(e.fecha_compra).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      {e.certificado ? (
                        <a
                          href={e.certificado}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600"
                        >
                          Ver
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-2">{e.estado || "—"}</td>
                    <td className="p-2 flex gap-2">
                      <IconButton
                        variant="text"
                        onClick={() =>
                          navigate(`/dashboard/sst/equipment/${e.id}`)
                        }
                      >
                        <PencilIcon className="w-4 h-4" />
                      </IconButton>
                      <IconButton
                        variant="text"
                        onClick={() =>
                          window
                            .confirm("Eliminar equipo?")
                            && remove(e.id).then(() => window.location.reload())
                        }
                      >
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
