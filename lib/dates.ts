/** Dates render as plain English, always in en-GB order, never localised. */
const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const dayMonth = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

export function formatDateRange(
  start: string | null,
  end: string | null,
): string {
  if (!start) return "";
  const from = new Date(`${start}T00:00:00Z`);
  if (!end) return formatter.format(from);
  const to = new Date(`${end}T00:00:00Z`);
  const sameYear = from.getUTCFullYear() === to.getUTCFullYear();
  return sameYear
    ? `${dayMonth.format(from)} to ${formatter.format(to)}`
    : `${formatter.format(from)} to ${formatter.format(to)}`;
}
