import React from "react";
import Calendar from "@/components/Calendar";
import { useActivities } from "@/hooks/useActivities";
import { useEmpresaActiva } from "@/hooks/useEmpresaActiva";
import dayjs from "dayjs";

export default function CalendarDashboard() {
  const { empresaActivaId } = useEmpresaActiva();
  const currentMonth = dayjs().format("YYYY-MM");
  const { activities, loading } = useActivities(currentMonth, empresaActivaId);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Calendario de Actividades</h2>
      {loading ? (
        <p>Cargando actividades...</p>
      ) : (
        <Calendar activities={activities} />
      )}
    </div>
  );
}
