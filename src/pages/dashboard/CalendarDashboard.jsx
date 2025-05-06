import React, { useState, useMemo } from "react";
import dayjs from "dayjs";
import Calendar from "@/components/Calendar";
import { useActivities } from "@/hooks/useActivities";
import { useEmpresaActiva } from "@/hooks/useEmpresaActiva";
import {
  Button,
  Select,
  Option,
  Typography,
} from "@material-tailwind/react";

export default function CalendarDashboard() {
  const { empresaActivaId } = useEmpresaActiva();

  const [currentMonth, setCurrentMonth] = useState(dayjs().month());
  const [currentYear, setCurrentYear] = useState(dayjs().year());

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const formattedMonth = useMemo(() => {
    const month = String(currentMonth + 1).padStart(2, "0");
    return `${currentYear}-${month}`;
  }, [currentMonth, currentYear]);

  const { activities, loading } = useActivities(formattedMonth, empresaActivaId);

  const handlePrevMonth = () => {
    const date = dayjs(`${currentYear}-${currentMonth + 1}-01`).subtract(1, "month");
    setCurrentMonth(date.month());
    setCurrentYear(date.year());
  };

  const handleNextMonth = () => {
    const date = dayjs(`${currentYear}-${currentMonth + 1}-01`).add(1, "month");
    setCurrentMonth(date.month());
    setCurrentYear(date.year());
  };

  const handleYearChange = (year) => {
    setCurrentYear(parseInt(year));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto space-y-6">
      <Typography variant="h5" color="blue-gray" className="text-center">
        Calendario de Actividades
      </Typography>

      <div className="flex flex-wrap justify-center items-center gap-4">
        <Button size="sm" onClick={handlePrevMonth}>
          ← {monthNames[(currentMonth + 11) % 12]}
        </Button>

        <Typography className="font-medium">
          {monthNames[currentMonth]} {currentYear}
        </Typography>

        <Button size="sm" onClick={handleNextMonth}>
          {monthNames[(currentMonth + 1) % 12]} →
        </Button>

        {/* Año en una segunda línea centrado */}
        <div className="w-full flex justify-center">
        <Select
          label="Año"
          value={String(currentYear)}
          onChange={handleYearChange}
          containerProps={{ className: "min-w-[7rem] w-auto" }}
          labelProps={{ className: "left-0" }}
        >
            {Array.from({ length: 10 }, (_, i) => {
              const year = dayjs().year() - 5 + i;
              return (
                <Option key={year} value={String(year)}>
                  {year}
                </Option>
              );
            })}
          </Select>
        </div>
      </div>

      {loading ? (
        <p className="text-blue-600 text-center">Cargando actividades...</p>
      ) : (
        <Calendar activities={activities} />
      )}
    </div>
  );
}
