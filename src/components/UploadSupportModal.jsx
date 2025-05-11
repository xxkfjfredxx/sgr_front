import {
  Dialog, DialogHeader, DialogBody, DialogFooter,
  Input, Select, Option, Button, Typography,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import { useDocumentTypes } from "@/hooks/useDocumentTypes";
import api from "@/services/api";

/**
 * ctx = { employee: number, absenceId: number, absenceType: string }
 */
export default function UploadSupportModal({ open, onClose, ctx }) {
  /* ---- tipos de documento ---- */
  const { types, loading, refetch } = useDocumentTypes("LIC_EPS");

  /* ---- default según ausencia ---- */
  const mapDefault = (absType) => {
    switch (absType) {
      case "Incapacidad":            return "LIC_EPS_INC";
      case "Licencia de Maternidad": return "LIC_EPS_MAT";
      case "Licencia de Paternidad": return "LIC_EPS_PAT";
      default:                       return "";
    }
  };

  const [typeId, setTypeId] = useState("");
  const [file, setFile]     = useState(null);

  useEffect(() => {
    if (ctx?.absenceType && types.length) {
      const code  = mapDefault(ctx.absenceType);
      const found = types.find((t) => t.code === code);
      setTypeId(found ? String(found.id) : "");
    }
  }, [ctx, types]);

  /* ---- crear tipo inline ---- */
  const [creating, setCreating] = useState(false);
  const [newName, setNewName]   = useState("");
  const [newCode, setNewCode]   = useState("");

  const saveNewType = async () => {
    if (!newName || !newCode) return;
    const resp = await api.post("/document-types/", {
      name: newName, code: newCode, category: "LIC_EPS",
    });
    setCreating(false); setNewName(""); setNewCode("");
    await refetch();                          // recarga lista
    setTypeId(String(resp.data.id));          // selecciona nuevo
  };

  /* ---- subir archivo ---- */
  const save = () => {
    if (!typeId || !file) return alert("Selecciona tipo y archivo.");
    const form = new FormData();
    form.append("employee", ctx.employee);
    form.append("document_type", typeId);
    form.append("absence", ctx.absenceId);
    form.append("file", file);
    api.post("/documents/", form)
       .then(onClose)
       .catch((e) => alert(e.response?.data || "Error al subir"));
  };

  return (
    <Dialog open={open}   handler={onClose} size="md" dismiss={{ outsidePress: false }}>
      <DialogHeader>Subir Soporte de Ausencia</DialogHeader>

      <DialogBody className="grid gap-4">
        {/* Select + enlace nuevo tipo */}
        {loading ? (
          <Typography className="opacity-70">Cargando tipos…</Typography>
        ) : (
          <>
            <Select label="Tipo de documento" value={typeId} onChange={setTypeId}>
              {types.map((t) => (
                <Option key={t.id} value={String(t.id)}>{t.name}</Option>
              ))}
            </Select>

            {!creating && (
              <Typography
                variant="small"
                className="text-blue-600 cursor-pointer"
                onClick={() => setCreating(true)}
              >
                + Nuevo tipo
              </Typography>
            )}
          </>
        )}

        {/* form inline para nuevo tipo */}
        {creating && (
          <div className="border rounded-lg p-3 grid gap-2">
            <Input label="Nombre" value={newName} onChange={(e)=>setNewName(e.target.value)} />
            <Input label="Código" value={newCode} onChange={(e)=>setNewCode(e.target.value)} />
            <div className="flex gap-2">
              <Button size="sm" onClick={saveNewType}>Guardar</Button>
              <Button size="sm" variant="text" onClick={()=>setCreating(false)}>Cancelar</Button>
            </div>
          </div>
        )}

        {/* archivo */}
        <Input
          type="file"
          label="Archivo PDF/JPG"
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
      </DialogBody>

      <DialogFooter>
        <Button variant="text" onClick={onClose}>Omitir</Button>
        <Button color="blue" onClick={save}>Subir</Button>
      </DialogFooter>
    </Dialog>
  );
}
