// src/pages/contractors/ContractorWorkerList.jsx
import React from "react";
import { Card, CardHeader, CardBody } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { useContractorWorkers } from "@/hooks/useContractorWorkers";

export default function ContractorWorkerList() {
  const { id } = useParams(); // contractor_company id
  const { data = [], isLoading } = useContractorWorkers({ contractor_company: id, is_active: true });

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="p-4">
        <div className="font-semibold">Trabajadores de contratista #{id}</div>
      </CardHeader>
      <CardBody className="overflow-x-auto">
        {isLoading ? <div>Cargando...</div> : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Documento</th>
                <th className="p-2">Oficio</th>
                <th className="p-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {data.map((w) => (
                <tr key={w.id} className="border-b border-blue-gray-50">
                  <td className="p-2">{w.first_name} {w.last_name}</td>
                  <td className="p-2">{w.doc_id}</td>
                  <td className="p-2">{w.trade || "-"}</td>
                  <td className="p-2">{w.is_active ? "Activo" : "Inactivo"}</td>
                </tr>
              ))}
              {!data.length && <tr><td className="p-4 text-center" colSpan={4}>Sin trabajadores</td></tr>}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
}
