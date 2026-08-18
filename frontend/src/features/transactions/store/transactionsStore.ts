import { create } from "zustand";
import { getApiErrorMessage } from "@/lib/api";
import { useAccountsStore } from "@/features/accounts/store/accountsStore";
import { transactionsApi } from "../services/transactions.api";
import type { CreateTransactionInput, Transaction, TransactionFilters, UpdateTransactionInput } from "../types";

interface TransactionsState {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchTransactions: (filters?: TransactionFilters) => Promise<void>;
  createTransaction: (input: CreateTransactionInput) => Promise<void>;
  updateTransaction: (id: string, input: UpdateTransactionInput) => Promise<void>;
  removeTransaction: (id: string) => Promise<void>;
}

async function refreshAccountBalances(): Promise<void> {
  await useAccountsStore.getState().fetchAccounts();
}

export const useTransactionsStore = create<TransactionsState>((set) => ({
  transactions: [],
  loading: false,
  error: null,

  async fetchTransactions(filters = {}) {
    set({ loading: true, error: null });
    try {
      const transactions = await transactionsApi.list(filters);
      set({ transactions, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error, "No se pudieron cargar los movimientos"), loading: false });
    }
  },

  async createTransaction(input) {
    const transaction = await transactionsApi.create(input);
    set((state) => ({ transactions: [transaction, ...state.transactions] }));
    await refreshAccountBalances();
  },

  async updateTransaction(id, input) {
    const updated = await transactionsApi.update(id, input);
    set((state) => ({
      transactions: state.transactions.map((transaction) =>
        transaction.id === id ? updated : transaction,
      ),
    }));
    await refreshAccountBalances();
  },

  async removeTransaction(id) {
    await transactionsApi.remove(id);
    set((state) => ({ transactions: state.transactions.filter((transaction) => transaction.id !== id) }));
    await refreshAccountBalances();
  },
}));