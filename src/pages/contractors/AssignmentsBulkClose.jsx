// src/pages/contractors/AssignmentsBulkClose.jsx
import React, { useMemo, useState } from "react";
import { Card, CardHeader, CardBody, Select, Option, Checkbox, Button, Input, Chip } from "@material-tailwind/react";
import { useContractors } from "@/hooks/useContractors";
import { useAssignmentCandidates, useBulkClosePreview, useBulkClose } from "@/hooks/useWorkerAssignments";
import dayjs from "dayjs";

export default function AssignmentsBulkClose() {
  const { data: contractors = [] } = useContractors({ active: true });
  const [contractorId, setContractorId] = useState("");
  const [peopleType, setPeopleType] = useState("contractor");
  const [activeOnly, setActiveOnly] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [endDate, setEndDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [skipBlockers, setSkipBlockers] = useState(false);

  const { data: candidates = [], isFetching } = useAssignmentCandidates({
    contractor_company: contractorId || undefined,
    people_type: peopleType,
    active_only: activeOnly
  });

  const { mutateAsync: preview } = useBulkClosePreview();
  const { mutateAsync: bulkClose, isPending } = useBulkClose();

  const idsArray = useMemo(() => Array.from(selectedIds), [selectedIds]);

  function toggle(id) {
    setSelectedIds(prev => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  }

  async function handlePreview() {
    const payload = {
      selector: contractorId ? { type: "contractor_company", id: Number(contractorId) } : { type: "all_active" },
      people_type: peopleType,
      active_only: activeOnly,
      ids: idsArray.length ? idsArray : undefined
    };
    const data = await preview(payload);
    alert(`Cerraríamos ${data.would_close.length} asignaciones. Bloqueados: ${data.blockers.length}`);
  }

  async function handleClose() {
    const payload = {
      selector: contractorId ? { type: "contractor_company", id: Number(contractorId) } : { type: "all_active" },
      people_type: peopleType,
      active_only: activeOnly,
      ids: idsArray.length ? idsArray : undefined,
      end_date: endDate,
      skip_blockers: skipBlockers
    };
    const data = await bulkClose(payload);
    alert(`Cerrados: ${data.closed.length}. Bloqueados omitidos: ${data.skipped_blockers.length}`);
    setSelectedIds(new Set());
  }

  return (
    <Card>
      <CardHeader floated={false} shadow={false} className="p-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <Select label="Contratista" value={contractorId} onChange={(v) => setContractorId(v || "")}>
          <Option value="">Todas</Option>
          {contractors.map(c => <Option key={c.id} value={String(c.id)}>{c.name}</Option>)}
        </Select>
        <Select label="Tipo persona" value={peopleType} onChange={setPeopleType}>
          <Option value="all">Todos</Option>
          <Option value="contractor">Contratistas</Option>
          <Option value="internal">Internos</Option>
        </Select>
        <Select label="Estado" value={activeOnly ? "true" : "false"} onChange={(v) => setActiveOnly(v === "true")}>
          <Option value="true">Activos</Option>
          <Option value="false">Todos</Option>
        </Select>
        <Input type="date" label="Fecha cierre" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <div className="flex items-center">
          <Checkbox checked={skipBlockers} onChange={(e) => setSkipBlockers(e.target.checked)} label="Omitir bloqueados EPP" />
        </div>
        <div className="col-span-full flex gap-2">
          <Button variant="outlined" onClick={handlePreview}>Previsualizar</Button>
          <Button onClick={handleClose} disabled={isPending}>Cerrar seleccionados / filtros</Button>
        </div>
      </CardHeader>

      <CardBody className="overflow-x-auto">
        {isFetching ? <div>Cargando...</div> : (
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="p-2"><Checkbox
                  checked={candidates.length && idsArray.length === candidates.length}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedIds(new Set(candidates.map(c => c.id)));
                    else setSelectedIds(new Set());
                  }}
                /></th>
                <th className="p-2">ID</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Inicio</th>
                <th className="p-2">Estado</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id} className="border-b border-blue-gray-50">
                  <td className="p-2"><Checkbox checked={selectedIds.has(c.id)} onChange={() => toggle(c.id)} /></td>
                  <td className="p-2">{c.id}</td>
                  <td className="p-2"><Chip size="sm" value={c.tipo} /></td>
                  <td className="p-2">{c.start_date}</td>
                  <td className="p-2">{c.status}</td>
                </tr>
              ))}
              {!candidates.length && <tr><td className="p-4 text-center" colSpan={5}>Sin candidatos</td></tr>}
            </tbody>
          </table>
        )}
      </CardBody>
    </Card>
  );
}
