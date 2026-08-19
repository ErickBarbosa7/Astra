import { z } from "zod";
import { AccountType } from "@prisma/client";
import { moneySchema } from "../../utils/money.js";

export const createAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(60, "El nombre es demasiado largo"),
  type: z.nativeEnum(AccountType).default(AccountType.CHECKING),
  initialBalance: moneySchema.default(0),
});

export const updateAccountSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(60, "El nombre es demasiado largo")
    .optional(),
  type: z.nativeEnum(AccountType).optional(),
  isArchived: z.boolean().optional(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;