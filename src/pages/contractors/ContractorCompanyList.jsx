// src/pages/contractors/ContractorCompanyList.jsx
import React from "react";
import { Card, CardHeader, CardBody, Button } from "@material-tailwind/react";
import { useContractors } from "@/hooks/useContractors";
import { useNavigate } from "react-router-dom";

export default function ContractorCompanyList() {
  const { data = [], isLoading } = useContractors();
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="p-4 flex justify-between">
        <div className="font-semibold">Empresas contratistas</div>
      </CardHeader>
      <CardBody className="overflow-x-auto">
        {isLoading ? <div>Cargando...</div> : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">NIT</th>
                <th className="p-2">Contacto</th>
                <th className="p-2">Trabajadores</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {data.map((c) => (
                <tr key={c.id} className="border-b border-blue-gray-50">
                  <td className="p-2">{c.name}</td>
                  <td className="p-2">{c.nit}</td>
                  <td className="p-2">{c.contact_name || c.contact_person || "-"}</td>
                  <td className="p-2">{c.workers_count ?? "-"}</td>
                  <td className="p-2">
                    <Button size="sm" onClick={() => navigate(`/dashboard/contractors/${c.id}/workers`)}>Ver trabajadores</Button>
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
