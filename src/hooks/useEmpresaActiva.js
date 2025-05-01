import { useState, useEffect } from 'react';

export function useEmpresaActiva() {
  const [empresaActivaId, setEmpresaActivaId] = useState(() => {
    return localStorage.getItem('empresaActivaId') || null;
  });

  useEffect(() => {
    if (empresaActivaId) {
      localStorage.setItem('empresaActivaId', empresaActivaId);
    }
  }, [empresaActivaId]);

  return { empresaActivaId, setEmpresaActivaId };
}
