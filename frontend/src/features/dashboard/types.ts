import type { Transaction } from "@/features/transactions/types";

export interface CategorySpending {
  categoryId: string | null;
  name: string;
  color: string | null;
  icon: string | null;
  total: string;
  count: number;
}

export interface TrendPoint {
  month: string;
  label: string;
  income: string;
  expense: string;
}

export interface DashboardOverview {
  totalBalance: string;
  monthIncome: string;
  monthExpense: string;
  spendingByCategory: CategorySpending[];
  incomeExpenseTrend: TrendPoint[];
  recentTransactions: Transaction[];
}