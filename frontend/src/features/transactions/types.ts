import type { Category } from "@/features/categories/types";

export type TransactionType = "INCOME" | "EXPENSE";

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string | null;
  type: TransactionType;
  amount: string;
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
  category: Category | null;
  account: { id: string; name: string };
}

export interface TransactionFilters {
  type?: TransactionType;
  accountId?: string;
  categoryId?: string;
  from?: string;
  to?: string;
}

export interface CreateTransactionInput {
  accountId: string;
  categoryId?: string | null;
  type: TransactionType;
  amount: number;
  description?: string | null;
  date?: string;
}

export interface UpdateTransactionInput {
  accountId?: string;
  categoryId?: string | null;
  type?: TransactionType;
  amount?: number;
  description?: string | null;
  date?: string;
}