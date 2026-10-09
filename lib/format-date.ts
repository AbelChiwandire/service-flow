// Dates arrive as "YYYY-MM-DD". Format them in UTC so they never shift by a day.
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}