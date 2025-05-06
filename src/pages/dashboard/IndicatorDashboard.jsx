import React, { useContext, useEffect, useState } from 'react';
import { Card, Typography, Spinner } from '@material-tailwind/react';
import { EmpresaContext } from '@/context/EmpresaContext';
import api from '@/services/api';
import dayjs from 'dayjs';

const IndicatorDashboard = () => {
  const { empresaId } = useContext(EmpresaContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const currentYear = dayjs().year();
  const from = `${currentYear}-01`;
  const to = `${currentYear}-12`;

  useEffect(() => {
    if (!empresaId) return;

    setLoading(true);
    setError(null);

    api.get('/indicators/summary/', {
      params: { company: empresaId, from, to }
    })
      .then(res => setData(res.data))
      .catch(err => setError("Error al cargar los indicadores."))
      .finally(() => setLoading(false));
  }, [empresaId]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Typography variant="h4" color="blue-gray">SST Indicators Dashboard</Typography>

      {loading && <Spinner className="h-6 w-6 text-blue-500" />}
      {error && <div className="text-red-500">⚠️ {error}</div>}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-4">
            <Typography variant="h6">Absenteeism %</Typography>
            <Typography>{data.absenteeism_percent}%</Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h6">Training Completion %</Typography>
            <Typography>{data.training_completion_percent}%</Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h6">Accident Rate</Typography>
            <Typography>{data.accident_rate}%</Typography>
          </Card>
          <Card className="p-4">
            <Typography variant="h6">Medical Aptitude %</Typography>
            <Typography>{data.aptitude_percent}%</Typography>
          </Card>
        </div>
      )}
    </div>
  );
};

export default IndicatorDashboard;
