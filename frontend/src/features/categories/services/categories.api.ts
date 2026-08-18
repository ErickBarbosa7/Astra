import { api } from "@/lib/api";
import type { ApiResponse } from "@/lib/types";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "../types";

export const categoriesApi = {
  async list(): Promise<Category[]> {
    const response = await api.get<ApiResponse<Category[]>>("/categories");
    return response.data.data;
  },

  async create(input: CreateCategoryInput): Promise<Category> {
    const response = await api.post<ApiResponse<Category>>("/categories", input);
    return response.data.data;
  },

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const response = await api.patch<ApiResponse<Category>>(`/categories/${id}`, input);
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await api.delete<ApiResponse<null>>(`/categories/${id}`);
  },
};