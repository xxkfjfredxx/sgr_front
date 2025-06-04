// AutocompleteCargo: selecciona o crea cargo dinámicamente con modal
import React, { useEffect, useState } from "react";
import {
  Input,
  List,
  ListItem,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import api from "@/services/api";
import CreateCargoModal from "@/components/CreateCargoModal";

export default function AutocompleteCargo({ value, onChange }) {
  const [options, setOptions] = useState([]); // { id, name, risk_level }
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    setLoading(true);
    try {
      const res = await api.get("/positions/");
      const raw = res.data;
      const parsed = Array.isArray(raw.results) ? raw.results : raw;
      setOptions(parsed);
    } catch (err) {
      console.error("Error fetching positions", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (name) => {
    setInputValue(name);
    setShowOptions(false);
    onChange(name);
  };

  const handleCreateCargo = async ({ name, risk_level }) => {
    try {
      const res = await api.post("/positions/", { name, risk_level });
      await fetchPositions();
      setInputValue(res.data.name);
      onChange(res.data.name);
    } catch (err) {
      alert("Error creando el cargo");
    }
  };

  const filtered = options.filter((opt) =>
    opt.name.toLowerCase().includes(inputValue.toLowerCase())
  );
  const showCreate = inputValue && !options.some((o) => o.name.toLowerCase() === inputValue.toLowerCase());

  return (
    <div className="relative space-y-2">
      <Input
        label="Cargo"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setShowOptions(true);
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 200)}
      />

      {showOptions && (
        <List className="absolute z-10 w-full bg-white shadow max-h-60 overflow-y-auto">
          {loading && (
            <ListItem disabled>
              <Spinner className="h-4 w-4 mr-2" /> Cargando...
            </ListItem>
          )}
          {!loading && filtered.map((item) => (
            <ListItem key={item.id} onClick={() => handleSelect(item.name)}>
              {item.name} · Riesgo {item.risk_level.toUpperCase()}
            </ListItem>
          ))}
          {!loading && showCreate && (
            <ListItem
              className="text-blue-600 hover:bg-blue-50"
              onClick={() => setShowModal(true)}
            >
              + Crear nuevo cargo "{inputValue}"
            </ListItem>
          )}
        </List>
      )}

      <CreateCargoModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleCreateCargo}
      />
    </div>
  );
}