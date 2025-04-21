// Utility functions for week calculations
export function getMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(d.setDate(diff));
}

export function getSunday(date: Date): Date {
  const monday = getMonday(date);
  return new Date(
    monday.getFullYear(),
    monday.getMonth(),
    monday.getDate() + 6,
  );
}

export function isDateInWeek(dateStr: string, weekStart: Date): boolean {
  const weekEnd = new Date(
    weekStart.getFullYear(),
    weekStart.getMonth(),
    weekStart.getDate() + 6,
  );
  const formattedDate = formatDateYYYYMMDD(new Date(dateStr));
  const formattedWeekStart = formatDateYYYYMMDD(weekStart);
  const formattedWeekEnd = formatDateYYYYMMDD(weekEnd);

  return (
    formattedDate >= formattedWeekStart && formattedDate <= formattedWeekEnd
  );
}

export function formatDateYYYYMMDD(date: Date) {
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function formatDateYYYYDDMMWithHHmm(
  date: Date,
  withTSeparator: boolean,
) {
  const year = date.getFullYear();
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  if (withTSeparator) {
    // Format with "T" separator like ISO format
    return `${year}-${day}-${month}T${hours}:${minutes}`;
  } else {
    // Alternatively without the "T" separator:
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}

// export function  formatDateYYYYDDMMWithHHmmSS(date, withTSeparator) {
//   const year = date.getFullYear();
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//
//   const hours = String(date.getHours()).padStart(2, '0');
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   const seconds = String(date.getSeconds()).padStart(2, '0');
//
//   if (withTSeparator) {
//     // Format with "T" separator like ISO format
//     return `${year}-${day}-${month}T${hours}:${minutes}:${seconds}`;
//   } else {
//     // Alternatively without the "T" separator:
//     return `${year}-${day}-${month} ${hours}:${minutes}:${seconds}`;
//   }
//
// }
