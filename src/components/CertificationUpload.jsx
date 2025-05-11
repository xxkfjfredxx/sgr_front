import {
    Dialog, DialogHeader, DialogBody, DialogFooter,
    Input, Button, Typography,
  } from "@material-tailwind/react";
  import { useState } from "react";
  import api from "@/services/api";
  
  export default function CertificationUpload({ open, onClose, participantId }) {
    const [file, setFile]       = useState(null);
    const [expires, setExpires] = useState("");
  
    const save = () => {
      if (!file) return alert("Selecciona archivo.");
      const form = new FormData();
      form.append("participant", participantId);
      form.append("certificate_file", file);
      form.append("issued_date", new Date().toISOString().slice(0,10));
      if (expires) form.append("expiration_date", expires);
      api.post("/certifications/", form)
         .then(onClose)
         .catch((e)=>alert(e.response?.data||"Error cargando certificado"));
    };
  
    return (
      <Dialog open={open} handler={onClose} size="sm">
        <DialogHeader>Subir Certificado</DialogHeader>
        <DialogBody className="grid gap-4">
          <Input type="file" accept=".pdf,.jpg,.jpeg,.png"
                 onChange={(e)=>setFile(e.target.files?.[0] || null)} />
          <Input type="date" label="Vencimiento (opcional)"
                 value={expires} onChange={(e)=>setExpires(e.target.value)} />
          <Typography variant="small" className="opacity-70">
            Se registrará la fecha de expedición automática al día de hoy.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" onClick={onClose}>Cerrar</Button>
          <Button color="blue" onClick={save}>Subir</Button>
        </DialogFooter>
      </Dialog>
    );
  }
  