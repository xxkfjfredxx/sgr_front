// AutocompleteCargo: selecciona o crea cargo dinámicamente
import React, { useEffect, useState } from "react";
import { Input, List, ListItem, Spinner } from "@material-tailwind/react";
import api from "@/services/api";

export default function AutocompleteCargo({ value, onChange }) {
  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState(value || "");
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      try {
        const res = await api.get("/positions/");
        const raw = res.data;
        const parsed = Array.isArray(raw.results) ? raw.results : raw;
        setOptions(parsed.map((p) => p.name));
      } catch (err) {
        console.error("Error fetching positions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  const handleSelect = (val) => {
    setInputValue(val);
    setShowOptions(false);
    onChange(val);
  };

  const handleCreate = async (name) => {
    if (!name.trim()) return;
    try {
      const res = await api.post("/positions/", { name });
      const newName = res.data.name;
      setOptions((prev) => [...prev, newName]);
      handleSelect(newName);
    } catch (err) {
      alert("No se pudo crear el cargo");
    }
  };

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(inputValue.toLowerCase())
  );
  const showCreate = inputValue && !options.includes(inputValue);

  return (
    <div className="relative">
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
        <List className="absolute z-10 w-full bg-white shadow max-h-60 overflow-auto">
          {loading && <ListItem><Spinner className="h-4 w-4" /> Cargando...</ListItem>}

          {!loading && filtered.map((opt) => (
            <ListItem key={opt} onClick={() => handleSelect(opt)}>
              {opt}
            </ListItem>
          ))}

          {!loading && showCreate && (
            <ListItem onClick={() => handleCreate(inputValue)}>
              ➕ Crear "{inputValue}"
            </ListItem>
          )}
        </List>
      )}
    </div>
  );
}
