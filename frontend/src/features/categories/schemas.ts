import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(40, "El nombre es demasiado largo"),
  type: z.enum(["INCOME", "EXPENSE"]),
  color: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;