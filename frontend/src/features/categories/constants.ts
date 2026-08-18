import { ArrowDownCircle, ArrowUpCircle, type LucideIcon } from "lucide-react";
import type { CategoryType } from "./types";

export const CATEGORY_TYPE_META: Record<CategoryType, { label: string; icon: LucideIcon }> = {
  INCOME: { label: "Ingreso", icon: ArrowDownCircle },
  EXPENSE: { label: "Gasto", icon: ArrowUpCircle },
};

export const CATEGORY_TYPES = Object.keys(CATEGORY_TYPE_META) as CategoryType[];

export const CATEGORY_COLORS = [
  "#1A1A1A",
  "#D8FB52",
  "#3B82F6",
  "#22C55E",
  "#F97316",
  "#8B5CF6",
  "#EC4899",
  "#14B8A6",
  "#EAB308",
  "#94A3B8",
] as const;