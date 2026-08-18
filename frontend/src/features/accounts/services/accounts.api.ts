import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import type { Account, CreateAccountInput, UpdateAccountInput } from "../types";

export const accountsApi = {
  async list(): Promise<Account[]> {
    const response = await api.get<ApiResponse<Account[]>>("/accounts");
    return response.data.data;
  },

  async create(input: CreateAccountInput): Promise<Account> {
    const response = await api.post<ApiResponse<Account>>("/accounts", input);
    return response.data.data;
  },

  async update(id: string, input: UpdateAccountInput): Promise<Account> {
    const response = await api.patch<ApiResponse<Account>>(`/accounts/${id}`, input);
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/accounts/${id}`);
  },
};