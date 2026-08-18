import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowUpDown,
  FilterX,
  Pencil,
  Plus,
  ReceiptText,
  Tags,
} from "lucide-react";
import {
  DeleteTransactionButton,
  TransactionDialog,
} from "@/features/transactions/components/TransactionDialog";
import { useAccountsStore } from "@/features/accounts/store/accountsStore";
import { useAuthStore } from "@/features/auth/store/authStore";
import { useCategoriesStore } from "@/features/categories/store/categoriesStore";
import { CategoriesDialog } from "@/features/categories/components/CategoriesDialog";
import { useTransactionsStore } from "@/features/transactions/store/transactionsStore";
import type {
  Transaction,
  TransactionFilters,
  TransactionType,
} from "@/features/transactions/types";
import { Skeleton } from "@/components/Skeleton";
import { Dropdown, type DropdownOption } from "@/components/ui/dropdown";
import { formatCurrency, formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

interface DraftFilters {
  type: TransactionType | "";
  accountId: string;
  categoryId: string;
  from: string;
  to: string;
}

const EMPTY_DRAFT: DraftFilters = { type: "", accountId: "", categoryId: "", from: "", to: "" };

function buildFilters(draft: DraftFilters): TransactionFilters {
  return {
    type: draft.type || undefined,
    accountId: draft.accountId || undefined,
    categoryId: draft.categoryId || undefined,
    from: draft.from || undefined,
    to: draft.to || undefined,
  };
}

function TransactionRow({ transaction, onEdit }: { transaction: Transaction; onEdit: () => void }) {
  const isIncome = transaction.type === "INCOME";

  return (
    <div className="flex items-center gap-4 rounded-bento bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
          isIncome ? "bg-success-soft text-success" : "bg-danger-soft text-danger-strong",
        )}
        style={
          transaction.category?.color
            ? { backgroundColor: `${transaction.category.color}22` }
            : undefined
        }
      >
        {isIncome ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">
          {transaction.description ?? transaction.category?.name ?? "Sin categoría"}
        </p>
        <p className="mt-0.5 truncate text-xs text-muted">
          {transaction.category?.name && transaction.category.name !== transaction.description
            ? `${transaction.category.name} · `
            : ""}
          {transaction.account.name} · {formatDate(transaction.date)}
        </p>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <span
          className={cn(
            "text-sm font-extrabold tabular-nums",
            isIncome ? "text-success" : "text-foreground",
          )}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Editar movimiento"
          className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-ink/5 hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <DeleteTransactionButton transaction={transaction} onDeleted={() => undefined} />
      </div>
    </div>
  );
}

export function TransactionsPage() {
  const accounts = useAccountsStore((state) => state.accounts);
  const fetchAccounts = useAccountsStore((state) => state.fetchAccounts);
  const categories = useCategoriesStore((state) => state.categories);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);
  const transactions = useTransactionsStore((state) => state.transactions);
  const transactionsLoading = useTransactionsStore((state) => state.loading);
  const transactionsError = useTransactionsStore((state) => state.error);
  const fetchTransactions = useTransactionsStore((state) => state.fetchTransactions);
  const currency = useAuthStore((state) => state.user?.currency ?? "PEN");

  const [filters, setFilters] = useState<DraftFilters>(EMPTY_DRAFT);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  useEffect(() => {
    void fetchAccounts();
    void fetchCategories();
  }, [fetchAccounts, fetchCategories]);

  useEffect(() => {
    void fetchTransactions(buildFilters(filters));
  }, [fetchTransactions, filters]);

  const hasFilters = Object.values(filters).some(Boolean);

  const accountOptions: DropdownOption[] = [
    { value: "", label: "Todas" },
    ...accounts.map((account) => ({ value: account.id, label: account.name })),
  ];

  const typeOptions: DropdownOption[] = [
    { value: "", label: "Todos" },
    { value: "INCOME", label: "Ingresos" },
    { value: "EXPENSE", label: "Gastos" },
  ];

  const categoryOptions: DropdownOption[] = [
    { value: "", label: "Todas" },
    ...categories.map((category) => ({ value: category.id, label: category.name })),
  ];

  const stats = useMemo(() => {
    const incomes = transactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    const expenses = transactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((sum, transaction) => sum + Number(transaction.amount), 0);
    return { incomes, expenses, balance: incomes - expenses };
  }, [transactions]);

  const inputClass =
    "w-full rounded-2xl border border-ink/10 bg-canvas px-4 py-2.5 text-sm outline-none transition-colors focus:border-ink";

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Movimientos</h1>
          <p className="text-muted">Ingresos y gastos de tus cuentas</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCategoriesOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-5 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-ink/10"
          >
            <Tags className="h-4 w-4" /> Categorías
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Nuevo movimiento
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-bento bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Ingresos</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-success">
            {formatCurrency(stats.incomes, currency)}
          </p>
        </div>
        <div className="rounded-bento bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Gastos</p>
          <p className="mt-1 text-2xl font-extrabold tabular-nums text-danger-strong">
            {formatCurrency(stats.expenses, currency)}
          </p>
        </div>
        <div className="rounded-bento bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Balance del período
          </p>
          <p
            className={cn(
              "mt-1 text-2xl font-extrabold tabular-nums",
              stats.balance < 0 ? "text-danger-strong" : "text-foreground",
            )}
          >
            {formatCurrency(stats.balance, currency)}
          </p>
        </div>
      </section>

      <section className="rounded-bento bg-card p-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <span className="mb-1.5 block text-xs font-semibold text-muted">Cuenta</span>
            <Dropdown
              className="w-full"
              value={filters.accountId}
              onChange={(value) => setFilters((current) => ({ ...current, accountId: value }))}
              options={accountOptions}
            />
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-semibold text-muted">Tipo</span>
            <Dropdown
              className="w-full"
              value={filters.type}
              onChange={(value) =>
                setFilters((current) => ({ ...current, type: value as TransactionType | "" }))
              }
              options={typeOptions}
            />
          </div>
          <div>
            <span className="mb-1.5 block text-xs font-semibold text-muted">Categoría</span>
            <Dropdown
              className="w-full"
              value={filters.categoryId}
              onChange={(value) => setFilters((current) => ({ ...current, categoryId: value }))}
              options={categoryOptions}
            />
          </div>
          <div>
            <label htmlFor="filter-from" className="mb-1 block text-xs font-semibold text-muted">
              Desde
            </label>
            <input
              id="filter-from"
              type="date"
              className={inputClass}
              value={filters.from}
              max={filters.to || undefined}
              onChange={(event) =>
                setFilters((current) => ({ ...current, from: event.target.value }))
              }
            />
          </div>
          <div className="lg:flex lg:items-end">
            {hasFilters ? (
              <button
                type="button"
                onClick={() => setFilters(EMPTY_DRAFT)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink/5 px-4 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-ink/10 lg:mb-1"
              >
                <FilterX className="h-4 w-4" /> Limpiar
              </button>
            ) : (
              <div className="hidden rounded-full bg-canvas px-4 py-2.5 text-sm font-semibold text-muted-foreground lg:inline-flex lg:items-center lg:gap-2">
                <ArrowUpDown className="h-4 w-4" /> Filtrar
              </div>
            )}
          </div>
        </div>
      </section>

      {transactionsLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 rounded-bento bg-card p-4">
              <Skeleton className="h-11 w-11 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      ) : transactionsError ? (
        <div className="rounded-bento bg-card p-8 text-center">
          <p className="font-semibold text-danger">{transactionsError}</p>
          <button
            type="button"
            onClick={() => void fetchTransactions(buildFilters(filters))}
            className="mt-4 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
          >
            Reintentar
          </button>
        </div>
      ) : transactions.length === 0 && !hasFilters ? (
        <div className="rounded-bento bg-card p-12 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-bento bg-accent">
            <ReceiptText className="h-8 w-8" />
          </span>
          <h2 className="mt-6 text-xl font-extrabold">Todavía no tienes movimientos</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Registra tu primer ingreso o gasto para empezar a controlar tus finanzas.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-accent transition-opacity hover:opacity-80"
          >
            <Plus className="h-4 w-4" /> Registra tu primer movimiento
          </button>
        </div>
      ) : transactions.length === 0 ? (
        <div className="rounded-bento bg-card p-10 text-center">
          <h2 className="text-lg font-extrabold">Sin resultados con estos filtros</h2>
          <p className="mt-1 text-sm text-muted">Prueba con otros filtros o limpia la búsqueda.</p>
          <button
            type="button"
            onClick={() => setFilters(EMPTY_DRAFT)}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-bold text-accent transition-opacity hover:opacity-80"
          >
            <FilterX className="h-4 w-4" /> Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onEdit={() => {
                setEditing(transaction);
                setDialogOpen(true);
              }}
            />
          ))}
        </div>
      )}

      <TransactionDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        transaction={editing}
      />
      <CategoriesDialog open={categoriesOpen} onClose={() => setCategoriesOpen(false)} />
    </div>
  );
}
