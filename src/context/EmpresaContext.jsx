import { createContext, useState, useEffect } from "react";

export const EmpresaContext = createContext({
  empresaId: null,
  setEmpresaId: () => {}
});

export function EmpresaProvider({ children }) {
  const [empresaId, setEmpresaId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("empresaActivaId");
    if (stored) {
      setEmpresaId(Number(stored));
    }
  }, []);

  useEffect(() => {
    if (empresaId !== null) {
      localStorage.setItem("empresaActivaId", empresaId);
    }
  }, [empresaId]);

  return (
    <EmpresaContext.Provider value={{ empresaId, setEmpresaId }}>
      {children}
    </EmpresaContext.Provider>
  );
}
