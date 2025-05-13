// src/components/Calendar.jsx
import React, { useTransition } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useActivities } from "@/hooks/useActivities";

dayjs.locale("es");

export default function Calendar() {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const today        = dayjs();
  const month        = today.month() + 1;
  const year         = today.year();
  const startOfMonth = today.startOf("month").startOf("week");
  const endOfMonth   = today.endOf("month").endOf("week");

  const { activities, loading, error } = useActivities({ month, year });

  // build days array
  const days = [];
  let cursor = startOfMonth.clone();
  while (cursor.isBefore(endOfMonth, "day")) {
    days.push(cursor.clone());
    cursor = cursor.add(1, "day");
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":   return "bg-green-200";
      case "in_progress": return "bg-blue-200";
      case "pending":     return "bg-yellow-200";
      case "cancelled":   return "bg-red-200";
      default:            return "bg-gray-200";
    }
  };

  return (
    <div className="p-4">
      {loading && <div className="text-center text-blue-600 mb-2">Cargando…</div>}
      {error   && <div className="text-center text-red-600 mb-2">{error}</div>}

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayStr   = day.format("YYYY-MM-DD");
          const dayActs  = activities.filter(a =>
            dayjs(a.start_date).isSame(day, "day")
          );

          return (
            <div
              key={dayStr}
              className="border rounded-lg p-2 h-28 flex flex-col"
            >
              {/* always show + so you can add multiple */}
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-500">{day.format("D")}</span>
                <button
                  onClick={() =>
                    startTransition(() =>
                      navigate(`/dashboard/activities?date=${dayStr}`)
                    )
                  }
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Agregar actividad"
                >
                  <PlusIcon className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto">
                {dayActs.map((act) => (
                  <div
                    key={act.id}
                    onClick={() =>
                      startTransition(() =>
                        navigate(`/dashboard/activities/${act.id}`)
                      )
                    }
                    className={`p-1 rounded text-xs text-black truncate cursor-pointer ${getStatusColor(act.status)}`}
                    title={act.title}
                  >
                    {act.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
