import { create } from "zustand";
import { getApiErrorMessage } from "@/lib/api";
import { categoriesApi } from "../services/categories.api";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "../types";

interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  createCategory: (input: CreateCategoryInput) => Promise<Category>;
  updateCategory: (id: string, input: UpdateCategoryInput) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  loading: false,
  error: null,

  async fetchCategories() {
    set({ loading: true, error: null });
    try {
      const categories = await categoriesApi.list();
      set({ categories, loading: false });
    } catch (error) {
      set({ error: getApiErrorMessage(error, "No se pudieron cargar las categorías"), loading: false });
    }
  },

  async createCategory(input) {
    const category = await categoriesApi.create(input);
    set((state) => ({ categories: [...state.categories, category] }));
    return category;
  },

  async updateCategory(id, input) {
    const updated = await categoriesApi.update(id, input);
    set((state) => ({
      categories: state.categories.map((category) => (category.id === id ? updated : category)),
    }));
  },

  async removeCategory(id) {
    await categoriesApi.remove(id);
    set((state) => ({ categories: state.categories.filter((category) => category.id !== id) }));
  },
}));