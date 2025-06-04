import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";

export default function CreateCargoModal({ open, onClose, onSave }) {
  const [name, setName] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!name.trim() || !riskLevel) {
      setError("Debes ingresar el nombre y el nivel de riesgo");
      return;
    }
    onSave({ name, risk_level: riskLevel });
    setName("");
    setRiskLevel("");
    setError(null);
    onClose();
  };

  const handleCancel = () => {
    setName("");
    setRiskLevel("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} handler={handleCancel} size="sm">
      <DialogHeader>Crear nuevo cargo</DialogHeader>
      <DialogBody className="space-y-4">
        <Input label="Nombre del cargo" value={name} onChange={(e) => setName(e.target.value)} />
        <Select label="Nivel de riesgo" value={riskLevel} onChange={setRiskLevel}>
          <Option value="bajo">Bajo</Option>
          <Option value="medio">Medio</Option>
          <Option value="alto">Alto</Option>
        </Select>
        {error && <Typography color="red" className="text-sm">⚠️ {error}</Typography>}
      </DialogBody>
      <DialogFooter>
        <Button variant="text" color="red" onClick={handleCancel}>Cancelar</Button>
        <Button variant="gradient" color="green" onClick={handleSave}>Crear</Button>
      </DialogFooter>
    </Dialog>
  );
}
