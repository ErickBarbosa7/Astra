import { Pencil, Trash2 } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/authStore";
import { formatCurrency } from "@/lib/format";
import { ACCOUNT_TYPE_META } from "../constants";
import type { Account } from "../types";

export function AccountCard({
  account,
  onEdit,
  onDelete,
}: {
  account: Account;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const currency = useAuthStore((state) => state.user?.currency ?? "PEN");
  const meta = ACCOUNT_TYPE_META[account.type];
  const Icon = meta.icon;

  return (
    <div className="rounded-bento bg-card p-6">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={onEdit}
            aria-label="Editar cuenta"
            className="rounded-full p-2 text-muted transition-colors hover:bg-ink/5 hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Eliminar cuenta"
            className="rounded-full p-2 text-muted transition-colors hover:bg-danger/10 hover:text-danger"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-6 text-sm font-medium text-muted">{meta.label}</p>
      <p className="mt-1 truncate text-2xl font-extrabold">{account.name}</p>
      <p className="mt-2 text-3xl font-extrabold">{formatCurrency(account.balance, currency)}</p>
    </div>
  );
}