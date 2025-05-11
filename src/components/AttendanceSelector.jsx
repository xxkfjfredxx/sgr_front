import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Input, Button, Checkbox, Typography,
} from "@material-tailwind/react";
import { useEffect, useState, useMemo } from "react";
import api from "@/services/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function AttendanceSelector({
  open,
  onClose,
  empresaId,
  sessionId,
  attendancesExisting = [],   // activos + borrados
}) {
  /* ──────────────────────────────────────────────────────────
     1.  IDs de asistentes activos  (ya inscrito en la sesión)
  ────────────────────────────────────────────────────────── */
  const activeIds = useMemo(
    () =>
      new Set(
        attendancesExisting
          .filter((a) => !a.is_deleted)           // solo activos
          .map((a) => a.employee)
      ),
    [attendancesExisting]
  );

  /* ──────────────────────────────────────────────────────────
     2.  State: búsqueda, lista y selección
  ────────────────────────────────────────────────────────── */
  const [search, setSearch]       = useState("");
  const [list, setList]           = useState([]);
  const [selected, setSelected]   = useState(new Set());

  // Al abrir el modal, pre-seleccionamos los que ya están activos
  useEffect(() => {
    if (open) setSelected(new Set(activeIds));
  }, [open, activeIds]);

  /* ──────────────────────────────────────────────────────────
     3.  Buscar empleados activos por empresa
  ────────────────────────────────────────────────────────── */
  const fetch = () => {
    if (!empresaId) return;
    api
      .get("/employees/", {
        params: { company: empresaId, search, is_active: true },
      })
      .then((r) => {
        const data = Array.isArray(r.data.results) ? r.data.results : r.data;
        setList(data);
      });
  };
  useEffect(fetch, [empresaId]); // carga inicial cuando cambia empresa

  const toggle = (id) => {
    if (activeIds.has(id)) return;          // no permitimos des-marcar un activo
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  /* ──────────────────────────────────────────────────────────
     4.  Guardar: reactiva o crea (misma lógica robusta)
  ────────────────────────────────────────────────────────── */
  const save = async () => {
    const existingMap = {};
    attendancesExisting.forEach((a) => {
      existingMap[a.employee] = a;
    });

    const idsSelected = Array.from(selected);
    const toRestoreIds = idsSelected.filter(
      (id) => existingMap[id] && existingMap[id].is_deleted
    );
    const toCreateIds = idsSelected.filter((id) => !existingMap[id]);

    const URL = "/training-attendance/";

    try {
      /* Restaurar soft-deleted */
      await Promise.all(
        toRestoreIds.map((id) =>
          api.patch(`${URL}${existingMap[id].id}/`, {
            is_deleted: false,
            attended: true,
          })
        )
      );

      /* Crear nuevos */
      await Promise.all(
        toCreateIds.map((emp) =>
          api
            .post(URL, { session: sessionId, employee: emp, attended: true })
            .catch((e) => {
              if (
                e.response?.status === 400 &&
                JSON.stringify(e.response.data).includes("unique set")
              )
                return null;
              throw e;
            })
        )
      );

      onClose(); // el padre refresca la lista
    } catch (err) {
      alert(err.response?.data || "Error guardando asistencia");
    }
  };

  /* ──────────────────────────────────────────────────────────
     5.  UI
  ────────────────────────────────────────────────────────── */
  return (
    <Dialog open={open} handler={onClose} size="lg" dismiss={{ outsidePress: false }}>
      <DialogHeader>Seleccionar Asistentes</DialogHeader>

      <DialogBody className="grid gap-4">
        <div className="flex gap-2">
          <Input
            label="Buscar empleado"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetch()}
          />
          <Button size="sm" onClick={fetch}>
            <MagnifyingGlassIcon className="w-4 h-4" />
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto border rounded-lg p-2">
          {list.map((emp) => {
            const already = activeIds.has(emp.id);
            return (
              <label
                key={emp.id}
                className={`flex items-center gap-2 py-1 ${
                  already ? "opacity-60 cursor-not-allowed" : ""
                }`}
              >
                <Checkbox
                  checked={selected.has(emp.id)}
                  disabled={already}
                  onChange={() => toggle(emp.id)}
                />
                <Typography variant="small">
                  {emp.first_name} {emp.last_name} — {emp.document}
                  {already && " (ya inscrito)"}
                </Typography>
              </label>
            );
          })}
          {list.length === 0 && (
            <Typography variant="small" className="opacity-70">
              Sin resultados.
            </Typography>
          )}
        </div>
      </DialogBody>

      <DialogFooter>
        <Button variant="text" onClick={onClose}>
          Cancelar
        </Button>
        <Button color="blue" onClick={save}>
          Guardar
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
