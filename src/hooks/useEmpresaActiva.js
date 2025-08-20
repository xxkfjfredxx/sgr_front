import { useState } from 'react';

export function useEmpresaActiva() {
  // Inicializamos una sola vez desde localStorage
  const [empresaActivaId] = useState(() => {
    return localStorage.getItem('empresaActivaId');
  });

  // Devolvemos directamente el estado
  return empresaActivaId;
}
