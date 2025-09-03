// src/pages/people/PeopleList.jsx
import React, { useState } from "react";
import { Card, CardHeader, CardBody, Input, Select, Option, Chip } from "@material-tailwind/react";
import { usePeople } from "@/hooks/usePeople";

export default function PeopleList() {
  const [type, setType] = useState("all");
  const [active, setActive] = useState("true");
  const [q, setQ] = useState("");

  const { data: people = [], isLoading } = usePeople({ type, active, q });

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="p-4 flex gap-4">
        <Input label="Buscar por nombre o documento" value={q} onChange={(e) => setQ(e.target.value)} />
        <Select label="Tipo" value={type} onChange={(val) => setType(val)}>
          <Option value="all">Todos</Option>
          <Option value="internal">Internos</Option>
          <Option value="contractor">Contratistas</Option>
        </Select>
        <Select label="Activo" value={active} onChange={(val) => setActive(val)}>
          <Option value="true">Activos</Option>
          <Option value="false">Inactivos</Option>
        </Select>
      </CardHeader>
      <CardBody className="overflow-x-auto">
        {isLoading ? <div>Cargando...</div> : (
          <table className="w-full min-w-[700px] table-auto text-left">
            <thead>
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Documento</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Contratista</th>
                <th className="p-2">EPP</th>
              </tr>
            </thead>
            <tbody>
              {people.map((p) => (
                <tr key={p.id} className="border-b border-blue-gray-50">
                  <td className="p-2">{p.last_name} {p.first_name}</td>
                  <td className="p-2">{p.doc_id}</td>
                  <td className="p-2">
                    <Chip size="sm" value={p.tipo === "interno" ? "Interno" : "Contratista"} />
                  </td>
                  <td className="p-2">{p.contractor_company || "-"}</td>
                  <td className="p-2">{p.tiene_epp_pendiente ? "Sí" : "No"}</td>
                </tr>
              ))}
              {!people.length && (
                <tr><td className="p-4 text-center" colSpan={5}>Sin resultados</td></tr>
              )}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
}
