import {
    Dialog, DialogHeader, DialogBody, DialogFooter,
    Input, Select, Option, Button,
  } from "@material-tailwind/react";
  import { useState } from "react";
  import AttendanceSelector from "./AttendanceSelector";
  import { EmpresaContext } from "@/context/EmpresaContext";
  import { useContext } from "react";
  
  const MODALITIES = ["Presencial", "Virtual", "Mixta"];
  
  export default function TrainingSessionForm({ open, onClose, onSave, initial }) {
    const { empresaId } = useContext(EmpresaContext);
  
    const blank = {
      topic: "",
      date: "",
      duration_hours: "",
      modality: "Presencial",
      instructor: "",
      supporting_document: null,
    };
    const [form, setForm] = useState(initial || blank);
    const [file, setFile] = useState(null);
  
    /* asistentes */
    const [sessionSaved, setSessionSaved] = useState(null);
  
    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
    const saveSession = () => {
      if (!form.topic || !form.date || !form.instructor) return alert("Completa los campos obligatorios.");
      const payload = {
        ...form,
        company: empresaId,
        duration_hours: form.duration_hours || null,
      };
      const fd = new FormData();
      Object.entries(payload).forEach(([k,v])=>fd.append(k,v ?? ""));
      if (file) fd.append("supporting_document", file);
      onSave(fd).then((r) => setSessionSaved(r.data));  // abre selector asistentes
    };
  
    return (
      <>
        <Dialog open={open} handler={onClose} size="lg" dismiss={{ outsidePress:false }}>
          <DialogHeader>{initial ? "Editar" : "Nueva"} Capacitación</DialogHeader>
  
          <DialogBody className="grid grid-cols-2 gap-4">
            <Input label="Tema" name="topic" value={form.topic} onChange={handleChange} />
            <Input type="date" label="Fecha" name="date" value={form.date} onChange={handleChange} />
  
            <Input type="number" label="Duración (horas)" name="duration_hours"
                   value={form.duration_hours} onChange={handleChange} />
  
            <Select label="Modalidad" value={form.modality}
                    onChange={(val)=>setForm({...form, modality:val})}>
              {MODALITIES.map((m)=><Option key={m} value={m}>{m}</Option>)}
            </Select>
  
            <Input label="Instructor" name="instructor" value={form.instructor} onChange={handleChange} />
  
            <Input type="file" label="Evidencia (PDF)" accept=".pdf"
                   onChange={(e)=>setFile(e.target.files?.[0]||null)} />
          </DialogBody>
  
          <DialogFooter>
            <Button variant="text" onClick={onClose}>Cancelar</Button>
            <Button color="blue" onClick={saveSession}>{initial ? "Actualizar" : "Guardar"}</Button>
          </DialogFooter>
        </Dialog>
  
        {/* selector de asistentes */}
        {sessionSaved && (
          <AttendanceSelector
            open={!!sessionSaved}
            onClose={()=>setSessionSaved(null)}
            empresaId={empresaId}
            sessionId={sessionSaved.id}
          />
        )}
      </>
    );
  }
  