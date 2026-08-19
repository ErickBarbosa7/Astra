import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { DashboardOverview } from "../types";

interface SummaryCardsProps {
  overview: DashboardOverview;
  currency: string;
}

export function SummaryCards({ overview, currency }: SummaryCardsProps) {
  const cards = [
    {
      label: "Balance total",
      value: overview.totalBalance,
      icon: Wallet,
      accent: false,
    },
    {
      label: "Ingresos del mes",
      value: overview.monthIncome,
      icon: ArrowUpRight,
      accent: true,
    },
    {
      label: "Gastos del mes",
      value: overview.monthExpense,
      icon: ArrowDownRight,
      accent: false,
    },
  ] as const;

  return (
    <section className="grid gap-6 md:grid-cols-3">
      {cards.map(({ label, value, icon: Icon, accent }) => (
        <div
          key={label}
          className={accent ? "rounded-bento bg-accent p-6" : "rounded-bento bg-card p-6"}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted">{label}</p>
            <Icon className="h-5 w-5" />
          </div>
          <p className="mt-3 text-3xl font-extrabold tabular-nums">
            {formatCurrency(value, currency)}
          </p>
        </div>
      ))}
    </section>
  );
}