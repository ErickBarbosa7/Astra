import { Prisma } from "@prisma/client";
import { z } from "zod";

export const moneySchema = z
  .coerce.number()
  .finite("El monto debe ser un número válido")
  .min(-99999999.99, "El monto no es válido")
  .max(99999999.99, "El monto no es válido")
  .refine((value) => Math.round(value * 100) / 100 === value, {
    message: "El monto admite máximo 2 decimales",
  });

export function toMoney(value: number | string): Prisma.Decimal {
  return new Prisma.Decimal(value.toString());
}
