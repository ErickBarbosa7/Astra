export type CategoryType = "INCOME" | "EXPENSE";

export interface Category {
  id: string;
  userId: string;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryInput {
  name: string;
  type: CategoryType;
  icon?: string | null;
  color?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  type?: CategoryType;
  icon?: string | null;
  color?: string | null;
}