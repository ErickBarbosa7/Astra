import { z } from "zod";
import { TransactionType } from "@prisma/client";
import { moneySchema } from "../../utils/money.js";

export const createTransactionSchema = z.object({
  accountId: z.string().trim().min(1, "Selecciona una cuenta"),
  categoryId: z.string().trim().min(1).optional().nullable(),
  type: z.nativeEnum(TransactionType),
  amount: moneySchema.refine((value) => value > 0, "El monto debe ser mayor a 0"),
  description: z.string().trim().max(200, "La descripción es demasiado larga").optional().nullable(),
  date: z.coerce.date().optional(),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionFiltersSchema = z.object({
  type: z.nativeEnum(TransactionType).optional(),
  accountId: z.string().trim().min(1).optional(),
  categoryId: z.string().trim().min(1).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha inicial no es válida").optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "La fecha final no es válida").optional(),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionFilters = z.infer<typeof transactionFiltersSchema>;