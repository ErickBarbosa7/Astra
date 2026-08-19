import { ArrowDownLeft, ArrowUpRight, History } from "lucide-react";
import type { Transaction } from "@/features/transactions/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: string;
}

export function RecentTransactions({ transactions, currency }: RecentTransactionsProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-canvas py-10 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/5 text-muted">
          <History className="h-6 w-6" />
        </span>
        <p className="mt-3 text-sm font-semibold text-muted">Sin movimientos recientes</p>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {transactions.map((transaction) => {
        const isIncome = transaction.type === "INCOME";
        return (
          <li key={transaction.id} className="flex items-center gap-3">
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                isIncome ? "bg-success-soft text-success" : "bg-danger-soft text-danger-strong",
              )}
              style={
                transaction.category?.color
                  ? { backgroundColor: `${transaction.category.color}22` }
                  : undefined
              }
            >
              {isIncome ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">
                {transaction.description ?? transaction.category?.name ?? "Sin categoría"}
              </p>
              <p className="truncate text-xs text-muted">
                {transaction.category?.name && transaction.category.name !== transaction.description
                  ? `${transaction.category.name} · `
                  : ""}
                {transaction.account.name} · {formatDate(transaction.date)}
              </p>
            </div>

            <span
              className={cn(
                "text-sm font-extrabold tabular-nums",
                isIncome ? "text-success" : "text-foreground",
              )}
            >
              {isIncome ? "+" : "-"}
              {formatCurrency(transaction.amount, currency)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}