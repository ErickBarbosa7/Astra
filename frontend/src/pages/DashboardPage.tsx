import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ReceiptText } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useDashboardStore } from "@/features/dashboard/store/dashboardStore";
import { IncomeExpenseChart } from "@/features/dashboard/components/IncomeExpenseChart";
import { RecentTransactions } from "@/features/dashboard/components/RecentTransactions";
import { SpendingChart } from "@/features/dashboard/components/SpendingChart";
import { SummaryCards } from "@/features/dashboard/components/SummaryCards";
import { Skeleton } from "@/components/Skeleton";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-bento bg-card p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-5 w-5 rounded-lg" />
            </div>
            <Skeleton className="mt-3 h-8 w-40" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="rounded-bento bg-card p-6">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="mt-4 h-56 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const overview = useDashboardStore((state) => state.overview);
  const loading = useDashboardStore((state) => state.loading);
  const error = useDashboardStore((state) => state.error);
  const fetchOverview = useDashboardStore((state) => state.fetchOverview);
  const currency = useAuthStore((state) => state.user?.currency ?? "PEN");

  useEffect(() => {
    void fetchOverview();
  }, [fetchOverview]);

  if (loading && !overview) {
    return <DashboardSkeleton />;
  }

  if (error && !overview) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted">Resumen de tus finanzas</p>
        </header>
        <div className="rounded-bento bg-card p-8 text-center">
          <p className="font-semibold text-danger">{error}</p>
          <button
            type="button"
            onClick={() => void fetchOverview()}
            className="mt-4 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const isEmpty =
    overview &&
    Number(overview.monthIncome) === 0 &&
    Number(overview.monthExpense) === 0 &&
    overview.recentTransactions.length === 0;

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-muted">Resumen de tus finanzas</p>
        </div>
      </header>

      {isEmpty ? (
        <div className="rounded-bento bg-card p-12 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-bento bg-accent">
            <ReceiptText className="h-8 w-8" />
          </span>
          <h2 className="mt-6 text-xl font-extrabold">Tu dashboard está esperando datos</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Registra tu primer ingreso o gasto para ver tu balance, gráficos y movimientos
            recientes.
          </p>
          <button
            type="button"
            onClick={() => void navigate("/transactions")}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-accent transition-opacity hover:opacity-80"
          >
            <ReceiptText className="h-4 w-4" /> Registra tu primer movimiento
          </button>
        </div>
      ) : overview ? (
        <>
          {loading && (
            <p className="text-xs font-medium text-muted-foreground">Actualizando…</p>
          )}

          <SummaryCards overview={overview} currency={currency} />

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-bento bg-card p-6">
              <h2 className="text-lg font-bold">Ingresos vs Gastos</h2>
              <p className="mt-1 text-sm text-muted">Últimos 6 meses</p>
              <div className="mt-4">
                <IncomeExpenseChart data={overview.incomeExpenseTrend} currency={currency} />
              </div>
            </div>
            <div className="rounded-bento bg-card p-6">
              <h2 className="text-lg font-bold">Distribución de gastos</h2>
              <p className="mt-1 text-sm text-muted">Este mes por categoría</p>
              <div className="mt-4">
                <SpendingChart data={overview.spendingByCategory} currency={currency} />
              </div>
            </div>
          </section>

          <section className="rounded-bento bg-card p-6">
            <h2 className="text-lg font-bold">Transacciones recientes</h2>
            <p className="mt-1 text-sm text-muted">Tus últimos movimientos</p>
            <div className="mt-4">
              <RecentTransactions transactions={overview.recentTransactions} currency={currency} />
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
}