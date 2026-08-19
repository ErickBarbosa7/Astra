export interface CategorySpendingRow {
  categoryId: string | null;
  name: string | null;
  color: string | null;
  icon: string | null;
  total: string;
  count: number;
}

export interface TrendRow {
  month: string;
  type: "INCOME" | "EXPENSE";
  total: string;
}

export interface TrendPoint {
  month: string;
  label: string;
  income: string;
  expense: string;
}