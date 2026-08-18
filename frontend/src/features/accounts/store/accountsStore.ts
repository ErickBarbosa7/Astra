import { create } from "zustand";
import { getApiErrorMessage } from "@/lib/api";
import { accountsApi } from "../services/accounts.api";
import type { Account, CreateAccountInput, UpdateAccountInput } from "../types";

interface AccountsState {
  accounts: Account[];
  loading: boolean;
  error: string | null;
  fetchAccounts: () => Promise<void>;
  createAccount: (input: CreateAccountInput) => Promise<void>;
  updateAccount: (id: string, input: UpdateAccountInput) => Promise<void>;
  removeAccount: (id: string) => Promise<void>;
}

export const useAccountsStore = create<AccountsState>((set) => ({
  accounts: [],
  loading: false,
  error: null,

  async fetchAccounts() {
    set({ loading: true, error: null });
    try {
      const accounts = await accountsApi.list();
      set({ accounts, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error, "No se pudieron cargar las cuentas"), loading: false });
    }
  },

  async createAccount(input) {
    const account = await accountsApi.create(input);
    set((state) => ({ accounts: [account, ...state.accounts] }));
  },

  async updateAccount(id, input) {
    const updated = await accountsApi.update(id, input);
    set((state) => ({
      accounts: state.accounts.map((account) => (account.id === id ? updated : account)),
    }));
  },

  async removeAccount(id) {
    await accountsApi.remove(id);
    set((state) => ({ accounts: state.accounts.filter((account) => account.id !== id) }));
  },
}));