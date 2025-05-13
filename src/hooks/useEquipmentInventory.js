// src/hooks/useEquipmentInventory.js

import { useState, useEffect, useContext } from "react";
import api from "@/services/api";
import { EmpresaContext } from "@/context/EmpresaContext";

export function useEquipmentInventory() {
  const { empresaId } = useContext(EmpresaContext);
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    if (!empresaId) return;
    setLoading(true);
    api.get("/equipment-inventory/", { params: { company: empresaId } })
      .then((res) => {
        const data = Array.isArray(res.data.results) ? res.data.results : res.data;
        setItems(data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [empresaId]);

  const create = (payload) => {
    const form = new FormData();
    form.append("company", empresaId);
    form.append("categoria", payload.categoria);
    if (payload.serial)     form.append("serial", payload.serial);
    form.append("cantidad",  payload.cantidad);
    form.append("fecha_compra", payload.fecha_compra);
    if (payload.certificado) form.append("certificado", payload.certificado);
    form.append("estado",    payload.estado || "");
    return api.post("/equipment-inventory/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const update = (id, payload) => {
    const form = new FormData();
    form.append("company", empresaId);
    form.append("categoria", payload.categoria);
    if (payload.serial)     form.append("serial", payload.serial);
    form.append("cantidad",  payload.cantidad);
    form.append("fecha_compra", payload.fecha_compra);
    if (payload.certificado) form.append("certificado", payload.certificado);
    form.append("estado",    payload.estado || "");
    return api.put(`/equipment-inventory/${id}/`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const remove = (id) => api.delete(`/equipment-inventory/${id}/`);

  return { items, loading, error, create, update, remove };
}
