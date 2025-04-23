import React from 'react';
import { Card, Typography, Spinner } from '@material-tailwind/react';
import { useIndicatorSummary } from '@/hooks/useIndicatorSummary';

const IndicatorDashboard = () => {
  const { data, loading, error } = useIndicatorSummary();

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
