import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";

const summaryCards = [
  {
    label: "Balance total",
    value: "S/ 0.00",
    icon: Wallet,
    accent: false,
  },
  {
    label: "Ingresos del mes",
    value: "S/ 0.00",
    icon: ArrowUpRight,
    accent: true,
  },
  {
    label: "Gastos del mes",
    value: "S/ 0.00",
    icon: ArrowDownRight,
    accent: false,
  },
];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted">Resumen de tus finanzas</p>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {summaryCards.map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className={
              accent
                ? "rounded-bento bg-accent p-6"
                : "rounded-bento bg-card p-6"
            }
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted">{label}</p>
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-3 text-3xl font-extrabold">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-bento bg-card p-6">
          <h2 className="text-lg font-bold">Ingresos vs Gastos</h2>
          <p className="mt-1 text-sm text-muted">Los gráficos se integrarán en la Fase 6.</p>
        </div>
        <div className="rounded-bento bg-card p-6">
          <h2 className="text-lg font-bold">Transacciones recientes</h2>
          <p className="mt-1 text-sm text-muted">
            Sin movimientos todavía. Las transacciones llegan en la Fase 5.
          </p>
        </div>
      </section>
    </div>
  );
}
