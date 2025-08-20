import { createContext, useState } from "react";

export const EmpresaContext = createContext({
  empresaId: null,
  setEmpresaId: () => {}
});

export function EmpresaProvider({ children }) {
  // Solo una lectura, al inicializar el state
  const [empresaId, setEmpresaId] = useState(() => {
    const stored = localStorage.getItem("empresaActivaId");
    return stored ? Number(stored) : null;
  });

  return (
    <EmpresaContext.Provider value={{ empresaId, setEmpresaId }}>
      {children}
    </EmpresaContext.Provider>
  );
}
