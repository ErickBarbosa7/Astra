import { z } from "zod";

export const accountFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(60, "El nombre es demasiado largo"),
  type: z.enum(["CHECKING", "SAVINGS", "CREDIT_CARD", "CASH", "INVESTMENT"]),
  initialBalance: z
    .number()
    .finite("Ingresa un monto válido")
    .min(-99999999.99, "El monto no es válido")
    .max(99999999.99, "El monto no es válido")
    .refine((value) => Math.round(value * 100) / 100 === value, {
      message: "El monto admite máximo 2 decimales",
    }),
});

export type AccountFormValues = z.infer<typeof accountFormSchema>;