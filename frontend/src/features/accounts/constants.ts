import { Banknote, CreditCard, PiggyBank, TrendingUp, Wallet, type LucideIcon } from "lucide-react";
import type { AccountType } from "./types";

export const ACCOUNT_TYPE_META: Record<AccountType, { label: string; icon: LucideIcon }> = {
  CHECKING: { label: "Corriente", icon: Wallet },
  SAVINGS: { label: "Ahorro", icon: PiggyBank },
  CREDIT_CARD: { label: "Tarjeta de crédito", icon: CreditCard },
  CASH: { label: "Efectivo", icon: Banknote },
  INVESTMENT: { label: "Inversión", icon: TrendingUp },
};

export const ACCOUNT_TYPES = Object.keys(ACCOUNT_TYPE_META) as AccountType[];