import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { getApiErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Modal } from "@/components/Modal";
import { ACCOUNT_TYPES, ACCOUNT_TYPE_META } from "../constants";
import { accountFormSchema, type AccountFormValues } from "../schemas";
import { useAccountsStore } from "../store/accountsStore";
import type { Account } from "../types";

function AccountForm({ account, onClose }: { account: Account | null; onClose: () => void }) {
  const createAccount = useAccountsStore((state) => state.createAccount);
  const updateAccount = useAccountsStore((state) => state.updateAccount);
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = Boolean(account);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: account
      ? { name: account.name, type: account.type, initialBalance: 0 }
      : { name: "", type: "CHECKING", initialBalance: 0 },
  });

  const selectedType = useWatch({ control, name: "type" });

  const onSubmit = async (values: AccountFormValues) => {
    setServerError(null);
    try {
      if (account) {
        await updateAccount(account.id, { name: values.name, type: values.type });
      } else {
        await createAccount({
          name: values.name,
          type: values.type,
          initialBalance: values.initialBalance,
        });
      }
      onClose();
    } catch (error) {
      setServerError(getApiErrorMessage(error, "No se pudo guardar la cuenta"));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-5">
      {serverError && (
        <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger-strong">
          {serverError}
        </div>
      )}

      <div>
        <label htmlFor="account-name" className="mb-1.5 block text-sm font-medium">
          Nombre
        </label>
        <input
          id="account-name"
          className="w-full rounded-2xl border border-ink/10 bg-canvas px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ink"
          placeholder="Ej. Cuenta de ahorros"
          {...register("name")}
        />
        {errors.name && <p className="mt-1.5 text-xs font-medium text-danger">{errors.name.message}</p>}
      </div>

      <div>
        <span className="mb-1.5 block text-sm font-medium">Tipo de cuenta</span>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {ACCOUNT_TYPES.map((type) => {
            const meta = ACCOUNT_TYPE_META[type];
            const Icon = meta.icon;
            const isSelected = selectedType === type;

            return (
              <button
                key={type}
                type="button"
                onClick={() => setValue("type", type, { shouldValidate: true })}
                aria-pressed={isSelected}
                className={cn(
                  "flex items-center gap-2 rounded-2xl border px-3 py-2.5 text-sm font-medium transition-colors",
                  isSelected
                    ? "border-ink bg-ink text-accent"
                    : "border-ink/10 bg-canvas text-muted hover:border-ink/30 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {!isEdit && (
        <div>
          <label htmlFor="account-balance" className="mb-1.5 block text-sm font-medium">
            Saldo inicial
          </label>
          <input
            id="account-balance"
            type="number"
            step="0.01"
            inputMode="decimal"
            className="w-full rounded-2xl border border-ink/10 bg-canvas px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ink"
            placeholder="0.00"
            {...register("initialBalance", { valueAsNumber: true })}
          />
          {errors.initialBalance && (
            <p className="mt-1.5 text-xs font-medium text-danger">{errors.initialBalance.message}</p>
          )}
        </div>
      )}

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
          disabled={isSubmitting}
          className="flex flex-1 items-center justify-center rounded-full bg-accent py-3 text-sm font-bold text-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEdit ? "Guardar cambios" : "Crear cuenta"}
        </button>
      </div>
    </form>
  );
}

export function AccountDialog({
  open,
  onClose,
  account,
}: {
  open: boolean;
  onClose: () => void;
  account: Account | null;
}) {
  return (
    <Modal open={open} onClose={onClose} title={account ? "Editar cuenta" : "Nueva cuenta"} className="max-w-md">
      <AccountForm key={account?.id ?? "new"} account={account} onClose={onClose} />
    </Modal>
  );
}