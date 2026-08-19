import { z } from "zod";
import { HttpError } from "./httpError.js";

export function parseInput<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.errors[0]?.message ?? "Datos inválidos";
    throw new HttpError(400, message);
  }
  return result.data;
}