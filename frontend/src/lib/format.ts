export function formatCurrency(amount: number | string, currency = "PEN"): string {
  const value = typeof amount === "string" ? Number(amount) : amount;

  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
}