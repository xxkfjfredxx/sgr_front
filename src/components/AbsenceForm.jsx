import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Input, Select, Option, Checkbox, Button, List,
  ListItem, ListItemPrefix, Typography,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, UserIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { useEpsList } from "@/hooks/useEpsList";
import api from "@/services/api";

const TYPES = [
  "Incapacidad",
  "Licencia de Maternidad",
  "Licencia de Paternidad",
  "Vacaciones",
  "Licencia Luto",
  "Licencia Calamidad",
  "Licencia No Remunerada",
];

export default function AbsenceForm({ open, onClose, onSave, initial, empresaId }) {
  /* ---------- estado ---------- */
  const blank = {
    employee: "",
    absence_type: "Incapacidad",
    start_date: "",
    end_date: "",
    diagnosis_code: "",
    diagnosis_description: "",
    health_provider: "",
    reintegrated: false,
  };
  const [form, setForm] = useState(blank);
  useEffect(() => {
    setForm(initial ? { ...initial, employee: String(initial.employee) } : blank);
  }, [initial]);

  /* ---------- EPS ---------- */
  const epsList = useEpsList();

  /* ---------- búsqueda empleados ---------- */
  const [pendingSearch, setPendingSearch] = useState("");
  const [query, setQuery]               = useState("");
  const [employees, setEmployees]       = useState([]);
  const [loadingEmp, setLoadingEmp]     = useState(false);

  useEffect(() => {
    if (!empresaId || query === "") { setEmployees([]); return; }
    setLoadingEmp(true);
    api.get("/employees/", { params: { company: empresaId, search: query } })
       .then((r) => {
         const list = Array.isArray(r.data.results) ? r.data.results : r.data;
         setEmployees(list);
       })
       .finally(() => setLoadingEmp(false));
  }, [empresaId, query]);

  const handleSearch = () => setQuery(pendingSearch.trim());

  /* ---------- helper ---------- */
  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ---------- validación ---------- */
  const epsRequired  = ["Incapacidad", "Licencia de Maternidad", "Licencia de Paternidad"].includes(form.absence_type);
  const diagRequired = form.absence_type === "Incapacidad";

  const validate = () => {
    if (!form.employee) return "Selecciona un empleado.";
    if (!form.start_date || !form.end_date) return "Ingresa las fechas.";
    if (epsRequired && !form.health_provider) return "Selecciona la EPS.";
    if (diagRequired && !form.diagnosis_code) return "Ingresa el código CIE‑10.";
    return null;
  };

  const save = () => {
    const err = validate();
    if (err) return alert(err);
    onSave({
      ...form,
      employee: Number(form.employee),
      company: empresaId,           // ✅ se envía la empresa activa
    });
  };

  const showEps  = epsRequired;
  const showDiag = diagRequired;

  /* ---------- JSX ---------- */
  return (
    <Dialog open={open} handler={onClose} size="lg" dismiss={{ outsidePress: false }}>
      <DialogHeader>{initial ? "Editar" : "Nueva"} Ausencia</DialogHeader>

      <DialogBody className="grid grid-cols-2 gap-4">
        {/* Buscador de empleados */}
        <div className="col-span-2">
          <div className="flex gap-2 mb-2">
            <Input
              label="Buscar empleado (nombre o cédula)"
              value={pendingSearch}
              onChange={(e) => setPendingSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} color="blue" size="sm">
              <MagnifyingGlassIcon className="w-4 h-4" /> Buscar
            </Button>
          </div>

          {loadingEmp ? (
            <Typography variant="small" className="opacity-70 p-2">Buscando…</Typography>
          ) : employees.length === 0 ? (
            query && <Typography variant="small" className="opacity-70 p-2">Sin coincidencias.</Typography>
          ) : (
            <List className="max-h-40 overflow-y-auto">
              {employees.map((emp) => (
                <ListItem
                  key={emp.id}
                  selected={form.employee === String(emp.id)}
                  onClick={() => setForm({ ...form, employee: String(emp.id) })}
                >
                  <ListItemPrefix><UserIcon className="w-5 h-5" /></ListItemPrefix>
                  {emp.first_name} {emp.last_name} — {emp.document}
                </ListItem>
              ))}
            </List>
          )}
        </div>

        {/* Tipo y fechas */}
        <Select label="Tipo de ausencia"
                value={form.absence_type}
                onChange={(val) => setForm({ ...form, absence_type: val })}>
          {TYPES.map((t) => <Option key={t} value={t}>{t}</Option>)}
        </Select>

        <Input type="date" label="Fecha inicio" name="start_date"
               value={form.start_date} onChange={handle} />
        <Input type="date" label="Fecha fin" name="end_date"
               value={form.end_date} onChange={handle} />

        {/* EPS y diagnóstico condicionados */}
        {showEps && (
          <Select label="EPS" value={form.health_provider}
                  onChange={(val) => setForm({ ...form, health_provider: val })}>
            {epsList.map((e) => <Option key={e} value={e}>{e}</Option>)}
          </Select>
        )}

        {showDiag && (
          <>
            <Input label="Código diagnóstico (CIE‑10)" name="diagnosis_code"
                   value={form.diagnosis_code} onChange={handle} />
            <Input className="col-span-2" label="Descripción diagnóstico"
                   name="diagnosis_description"
                   value={form.diagnosis_description} onChange={handle} />
          </>
        )}

        <div className="col-span-2">
          <Checkbox
            label="Reintegrado"
            checked={form.reintegrated}
            onChange={(e) => setForm({ ...form, reintegrated: e.target.checked })}
          />
        </div>
      </DialogBody>

      <DialogFooter>
        <Button variant="text" onClick={onClose}>Cancelar</Button>
        <Button color="blue" onClick={save}>Guardar</Button>
      </DialogFooter>
    </Dialog>
  );
}
