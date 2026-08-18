import { useEffect, useState } from "react";
import { Loader2, Plus, Wallet } from "lucide-react";
import { AccountCard } from "@/features/accounts/components/AccountCard";
import { AccountDialog } from "@/features/accounts/components/AccountDialog";
import { useAccountsStore } from "@/features/accounts/store/accountsStore";
import type { Account } from "@/features/accounts/types";
import { Modal } from "@/components/Modal";
import { Skeleton } from "@/components/Skeleton";

export function AccountsPage() {
  const accounts = useAccountsStore((state) => state.accounts);
  const loading = useAccountsStore((state) => state.loading);
  const error = useAccountsStore((state) => state.error);
  const fetchAccounts = useAccountsStore((state) => state.fetchAccounts);
  const removeAccount = useAccountsStore((state) => state.removeAccount);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Account | null>(null);
  const [deleting, setDeleting] = useState<Account | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (account: Account) => {
    setEditing(account);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    setDeleteError(null);
    try {
      await removeAccount(deleting.id);
      setDeleting(null);
    } catch (deleteError_) {
      setDeleteError(deleteError_ instanceof Error ? deleteError_.message : "No se pudo eliminar la cuenta");
    } finally {
      setDeletingBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Cuentas</h1>
          <p className="text-muted">Tus cuentas y balances</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-bold text-foreground transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Nueva cuenta
        </button>
      </header>

      {loading ? (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-bento bg-card p-6">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <Skeleton className="mt-6 h-4 w-24" />
              <Skeleton className="mt-2 h-6 w-40" />
              <Skeleton className="mt-3 h-8 w-28" />
            </div>
          ))}
        </section>
      ) : error ? (
        <div className="rounded-bento bg-card p-8 text-center">
          <p className="font-semibold text-danger">{error}</p>
          <button
            type="button"
            onClick={() => void fetchAccounts()}
            className="mt-4 rounded-full bg-ink px-5 py-2 text-sm font-semibold text-accent transition-opacity hover:opacity-80"
          >
            Reintentar
          </button>
        </div>
      ) : accounts.length === 0 ? (
        <div className="rounded-bento bg-card p-12 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-bento bg-accent">
            <Wallet className="h-8 w-8" />
          </span>
          <h2 className="mt-6 text-xl font-extrabold">Todavía no tienes cuentas</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            Crea tu primera cuenta para empezar a registrar tus ingresos y gastos.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-accent transition-opacity hover:opacity-80"
          >
            <Plus className="h-4 w-4" /> Crea tu primera cuenta
          </button>
        </div>
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {accounts.map((account) => (
            <AccountCard
              key={account.id}
              account={account}
              onEdit={() => openEdit(account)}
              onDelete={() => {
                setDeleteError(null);
                setDeleting(account);
              }}
            />
          ))}
        </section>
      )}

      <AccountDialog open={dialogOpen} onClose={() => setDialogOpen(false)} account={editing} />

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Eliminar cuenta"
        className="max-w-md"
      >
        <div className="mt-4 space-y-4">
          <p className="text-sm leading-relaxed text-muted">
            ¿Seguro que quieres eliminar la cuenta{" "}
            <span className="font-semibold text-foreground">{deleting?.name}</span>? Esta acción
            también borrará todos sus movimientos y no se puede deshacer.
          </p>
          {deleteError && (
            <div className="rounded-xl bg-danger-soft px-4 py-3 text-sm font-medium text-danger-strong">
              {deleteError}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setDeleting(null)}
              disabled={deletingBusy}
              className="flex-1 rounded-full bg-ink/5 py-3 text-sm font-semibold transition-colors hover:bg-ink/10 disabled:opacity-60"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => void confirmDelete()}
              disabled={deletingBusy}
              className="flex flex-1 items-center justify-center rounded-full bg-danger py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {deletingBusy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}