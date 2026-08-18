export type AccountType = "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "CASH" | "INVESTMENT";

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  balance: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  initialBalance: number;
}

export interface UpdateAccountInput {
  name?: string;
  type?: AccountType;
  isArchived?: boolean;
}