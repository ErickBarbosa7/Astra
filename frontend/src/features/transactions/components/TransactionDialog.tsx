import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Trash2 } from "lucide-react";
import { useForm, useWatch, Controller } from "react-hook-form";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import { Dropdown, type DropdownOption } from "@/components/ui/dropdown";
import { useAccountsStore } from "@/features/accounts/store/accountsStore";
import { useCategoriesStore } from "@/features/categories/store/categoriesStore";
import { transactionFormSchema, type TransactionFormValues } from "../schemas";
import { useTransactionsStore } from "../store/transactionsStore";
import type { Transaction, TransactionType } from "../types";

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function TransactionForm({
  transaction,
  onClose,
}: {
  transaction: Transaction | null;
  onClose: () => void;
}) {
  const accounts = useAccountsStore((state) => state.accounts);
  const categories = useCategoriesStore((state) => state.categories);
  const createTransaction = useTransactionsStore((state) => state.createTransaction);
  const updateTransaction = useTransactionsStore((state) => state.updateTransaction);
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = Boolean(transaction);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: transaction
      ? {
          accountId: transaction.accountId,
          categoryId: transaction.categoryId ?? "",
          type: transaction.type,
          amount: Number(transaction.amount),
          description: transaction.description ?? "",
          date: transaction.date.slice(0, 10),
        }
      : {
          accountId: accounts[0]?.id ?? "",
          categoryId: "",
          type: "EXPENSE",
          amount: 0,
          description: "",
          date: toDateInputValue(new Date()),
        },
  });

  const selectedType = useWatch({ control, name: "type" });
  const typeCategories = categories.filter((category) => category.type === selectedType);

  const onSubmit = async (values: TransactionFormValues) => {
    setServerError(null);
    try {
      const payload = {
        accountId: values.accountId,
        categoryId: values.categoryId || null,
        type: values.type,
        amount: values.amount,
        description: values.description || null,
        date: values.date,
      };

      if (transaction) {
        await updateTransaction(transaction.id, payload);
      } else {
        await createTransaction(payload);
      }
      onClose();
    } catch (error) {
      setServerError(getApiErrorMessage(error, "No se pudo guardar el movimiento"));
    }
  };

  const typeButton = (type: TransactionType, activeClass: string) => (
    <button
      key={type}
      type="button"
      aria-pressed={selectedType === type}
      onClick={() => {
        setValue("type", type, { shouldValidate: true });
        setValue("categoryId", "", { shouldValidate: true });
      }}
      className={cn(
        "flex flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-bold transition-colors",
        selectedType === type
          ? activeClass
          : "border-ink/10 bg-canvas text-muted hover:border-ink/30 hover:text-foreground",
      )}
    >
      {type === "INCOME" ? "Ingreso" : "Gasto"}
    </button>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
      {serverError && (
        <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger-strong">
          {serverError}
        </div>
      )}

      <div>
        <span className="mb-1.5 block text-sm font-medium">Tipo</span>
        <div className="flex gap-2">
          {typeButton("INCOME", "border-success bg-success-soft text-success")}
          {typeButton("EXPENSE", "border-danger bg-danger-soft text-danger-strong")}
        </div>
      </div>

      <div>
        <label htmlFor="transaction-amount" className="mb-1.5 block text-sm font-medium">
          Monto
        </label>
        <input
          id="transaction-amount"
          type="number"
          step="0.01"
          inputMode="decimal"
          className="w-full rounded-2xl border border-ink/10 bg-canvas px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ink"
          placeholder="0.00"
          {...register("amount", { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="mt-1.5 text-xs font-medium text-danger">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium">Cuenta</span>
        <Controller
          control={control}
          name="accountId"
          render={({ field }) => (
            <Dropdown
              className="w-full"
              value={field.value}
              onChange={field.onChange}
              placeholder="Selecciona una cuenta"
              options={accounts.map((account): DropdownOption => ({
                value: account.id,
                label: account.name,
              }))}
              disabled={accounts.length === 0}
            />
          )}
        />
        {errors.accountId && (
          <p className="mt-1.5 text-xs font-medium text-danger">{errors.accountId.message}</p>
        )}
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium">
          Categoría <span className="text-muted-foreground">(opcional)</span>
        </span>
        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Dropdown
              className="w-full"
              value={field.value ?? ""}
              onChange={field.onChange}
              placeholder="Sin categoría"
              options={[
                { value: "", label: "Sin categoría" },
                ...typeCategories.map((category): DropdownOption => ({
                  value: category.id,
                  label: category.name,
                })),
              ]}
            />
          )}
        />
      </div>

      <div>
        <label htmlFor="transaction-date" className="mb-1.5 block text-sm font-medium">
          Fecha
        </label>
        <input
          id="transaction-date"
          type="date"
          className="w-full rounded-2xl border border-ink/10 bg-canvas px-4 py-3 text-sm outline-none transition-colors focus:border-ink"
          {...register("date")}
        />
        {errors.date && (
          <p className="mt-1.5 text-xs font-medium text-danger">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="transaction-description" className="mb-1.5 block text-sm font-medium">
          Descripción <span className="text-muted-foreground">(opcional)</span>
        </label>
        <input
          id="transaction-description"
          className="w-full rounded-2xl border border-ink/10 bg-canvas px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ink"
          placeholder="Ej. Almuerzo con el equipo"
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs font-medium text-danger">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-full bg-ink/5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-ink/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting || accounts.length === 0}
          className="flex flex-1 items-center justify-center rounded-full bg-accent py-3 text-sm font-bold text-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Guardar cambios" : "Registrar movimiento"}
        </button>
      </div>
    </form>
  );
}

export function TransactionDialog({
  open,
  onClose,
  transaction,
}: {
  open: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={transaction ? "Editar movimiento" : "Nuevo movimiento"}
      className="max-w-md"
    >
      <TransactionForm key={transaction?.id ?? "new"} transaction={transaction} onClose={onClose} />
    </Modal>
  );
}

export function DeleteTransactionButton({
  transaction,
  onDeleted,
}: {
  transaction: Transaction;
  onDeleted: () => void;
}) {
  const removeTransaction = useTransactionsStore((state) => state.removeTransaction);
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          await removeTransaction(transaction.id);
          onDeleted();
        } finally {
          setBusy(false);
        }
      }}
      aria-label={`Eliminar ${transaction.description ?? transaction.category?.name ?? "movimiento"}`}
      className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger-strong disabled:opacity-60"
    >
      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
    </button>
  );
}
