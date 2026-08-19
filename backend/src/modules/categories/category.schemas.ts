import { z } from "zod";
import { CategoryType } from "@prisma/client";

const colorHex = z
  .string()
  .trim()
  .regex(/^#[0-9A-Fa-f]{6}$/, "El color debe ser un hex válido");

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(40, "El nombre es demasiado largo"),
  type: z.nativeEnum(CategoryType),
  icon: z.string().trim().max(30).optional().nullable(),
  color: colorHex.optional().nullable(),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(40, "El nombre es demasiado largo")
    .optional(),
  type: z.nativeEnum(CategoryType).optional(),
  icon: z.string().trim().max(30).optional().nullable(),
  color: colorHex.optional().nullable(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
