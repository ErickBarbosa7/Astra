import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import type {
  CreateTransactionInput,
  Transaction,
  TransactionFilters,
  UpdateTransactionInput,
} from "../types";

export const transactionsApi = {
  async list(filters: TransactionFilters = {}): Promise<Transaction[]> {
    const params = new URLSearchParams();
    if (filters.type) params.set("type", filters.type);
    if (filters.accountId) params.set("accountId", filters.accountId);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.from) params.set("from", filters.from);
    if (filters.to) params.set("to", filters.to);

    const query = params.toString();
    const response = await api.get<ApiResponse<Transaction[]>>(`/transactions${query ? `?${query}` : ""}`);
    return response.data.data;
  },

  async create(input: CreateTransactionInput): Promise<Transaction> {
    const response = await api.post<ApiResponse<Transaction>>("/transactions", input);
    return response.data.data;
  },

  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const response = await api.patch<ApiResponse<Transaction>>(`/transactions/${id}`, input);
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/transactions/${id}`);
  },
};