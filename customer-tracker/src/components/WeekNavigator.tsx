import React from "react";

import { getMonday, getSunday } from "../utils/dateUtils";

interface WeekNavigatorProps {
  currentMonday: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

const formatDateYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDateYYYYDDMMWithTime = (date: Date) => {
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  // Format with "T" separator like ISO format
  return `${year}-${day}-${month}T${hours}:${minutes}:${seconds}`;

  // Alternatively without the "T" separator:
  // return `${year}-${day}-${month} ${hours}:${minutes}:${seconds}`;
};

const WeekNavigator: React.FC<WeekNavigatorProps> = ({
  currentMonday,
  onPrevWeek,
  onNextWeek,
}) => {
  const weekStart = getMonday(currentMonday);
  const weekEnd = getSunday(weekStart);
  return (
    <nav className="flex justify-between items-center mb-4 bg-sky text-deepteal rounded p-2">
      <button
        className="px-4 py-2 bg-teal text-sand rounded hover:bg-deepteal hover:text-sand"
        onClick={onPrevWeek}
      >
        Previous
      </button>
      <div className="font-semibold">
        Week of {formatDateYYYYMMDD(weekStart)} – {formatDateYYYYMMDD(weekEnd)}
      </div>
      <button
        className="px-4 py-2 bg-teal text-sand rounded hover:bg-deepteal hover:text-sand"
        onClick={onNextWeek}
      >
        Next
      </button>
    </nav>
  );
};

export default WeekNavigator;
