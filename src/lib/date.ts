export function formatThaiDate(date: Date | string | null | undefined): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  return dateObj.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatThaiDateTime(date: Date | string | null | undefined): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  return dateObj.toLocaleString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatThaiDateShort(date: Date | string | null | undefined): string {
  if (!date) return "-";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "-";

  return dateObj.toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
