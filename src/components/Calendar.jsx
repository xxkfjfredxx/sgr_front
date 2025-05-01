import React, { useTransition } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

dayjs.locale("es");

export default function Calendar({ activities }) {
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const today = dayjs();
  const startOfMonth = today.startOf("month").startOf("week");
  const endOfMonth = today.endOf("month").endOf("week");

  const calendarDays = [];
  let current = startOfMonth.clone();
  while (current.isBefore(endOfMonth, "day")) {
    calendarDays.push(current.clone());
    current = current.add(1, "day");
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-200";
      case "in_progress":
        return "bg-blue-200";
      case "pending":
        return "bg-yellow-200";
      case "cancelled":
        return "bg-red-200";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="p-4">
      {isPending && <div className="text-center text-blue-600 mb-2">Cargando...</div>}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day) => {
          const dayActivities = activities.filter((act) =>
            dayjs(act.start_date).isSame(day, "day")
          );
          return (
            <div key={day.toString()} className="border rounded-lg p-2 h-24 overflow-y-auto">
              <div className="text-xs text-gray-500">
                {day.format("D")}
              </div>
              {dayActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() =>
                    startTransition(() => navigate(`/dashboard/activities/${act.id}`))
                  }
                  className={`mt-1 p-1 rounded text-xs text-black ${getStatusColor(act.status)} truncate cursor-pointer`}
                  title={act.title}
                >
                  {act.title}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
