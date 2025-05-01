// src/modules/employees/components/EmployeesTable.jsx
import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
} from "@material-tailwind/react";
import { employeesTableData } from "@/data/employeesData";

export function EmployeesTable() {
  return (
    <Card>
      <CardHeader variant="gradient" color="gray" className="mb-4 p-6">
        <Typography variant="h6" color="white">
          Empleados
        </Typography>
      </CardHeader>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {["empleado", "documento", "cargo", "estado", "vinculado", ""] .map((el) => (
                <th
                  key={el}
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                  >
                    {el}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employeesTableData.map(
              (
                { img, name, email, document, role, status, hiredDate },
                idx
              ) => {
                const className = `py-3 px-5 ${
                  idx === employeesTableData.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                }`;

                return (
                  <tr key={document}>
                    {/* Empleado */}
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Avatar
                          src={img}
                          alt={name}
                          size="sm"
                          variant="rounded"
                        />
                        <div>
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="font-semibold"
                          >
                            {name}
                          </Typography>
                          <Typography className="text-xs font-normal text-blue-gray-500">
                            {email}
                          </Typography>
                        </div>
                      </div>
                    </td>

                    {/* Documento */}
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {document}
                      </Typography>
                    </td>

                    {/* Cargo */}
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {role[0]}
                      </Typography>
                      <Typography className="text-xs font-normal text-blue-gray-500">
                        {role[1]}
                      </Typography>
                    </td>

                    {/* Estado */}
                    <td className={className}>
                      <Chip
                        size="sm"
                        variant="gradient"
                        color={status === "active" ? "green" : "blue-gray"}
                        value={status === "active" ? "Activo" : "Inactivo"}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>

                    {/* Fecha de vinculación */}
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {hiredDate}
                      </Typography>
                    </td>

                    {/* Acción */}
                    <td className={className}>
                      <Typography
                        as="a"
                        href="#"
                        className="text-xs font-semibold text-blue-gray-600"
                      >
                        Editar
                      </Typography>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}

export default EmployeesTable;
