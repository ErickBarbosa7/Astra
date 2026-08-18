import { z } from "zod";
import type { TransactionType } from "./types";

export const transactionFormSchema = z.object({
  accountId: z.string().min(1, "Selecciona una cuenta"),
  categoryId: z.string().optional(),
  type: z.enum(["INCOME", "EXPENSE"]),
  amount: z
    .number({ message: "Ingresa un monto válido" })
    .positive("El monto debe ser mayor a 0")
    .max(99999999.99, "El monto no es válido")
    .refine((value) => Math.round(value * 100) / 100 === value, {
      message: "El monto admite máximo 2 decimales",
    }),
  description: z
    .string()
    .trim()
    .max(200, "La descripción es demasiado larga")
    .optional()
    .or(z.literal("")),
  date: z.string().min(1, "Selecciona una fecha"),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export interface TransactionListParams {
  type?: TransactionType;
  accountId?: string;
  categoryId?: string;
  from?: string;
  to?: string;
}