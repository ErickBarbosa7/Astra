import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../utils/httpError.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "./category.schemas.js";

async function getOwnedCategory(userId: string, categoryId: string) {
  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });

  if (!category) throw new HttpError(404, "Categoría no encontrada");
  return category;
}

async function assertUniqueName(userId: string, name: string, excludeId?: string) {
  const existing = await prisma.category.findFirst({
    where: {
      userId,
      name: { equals: name, mode: "insensitive" },
      ...(excludeId ? { id: { not: excludeId } } : {}),
    },
    select: { id: true },
  });

  if (existing) throw new HttpError(409, "Ya existe una categoría con ese nombre");
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export const categoryService = {
  async list(userId: string) {
    return prisma.category.findMany({
      where: { userId },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  },

  async get(userId: string, categoryId: string) {
    return getOwnedCategory(userId, categoryId);
  },

  async create(userId: string, input: CreateCategoryInput) {
    await assertUniqueName(userId, input.name);

    try {
      return await prisma.category.create({
        data: {
          userId,
          name: input.name,
          type: input.type,
          icon: input.icon ?? null,
          color: input.color ?? null,
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new HttpError(409, "Ya existe una categoría con ese nombre");
      }
      throw error;
    }
  },

  async update(userId: string, categoryId: string, input: UpdateCategoryInput) {
    const category = await getOwnedCategory(userId, categoryId);

    if (input.name) await assertUniqueName(userId, input.name, categoryId);

    try {
      return await prisma.category.update({
        where: { id: category.id },
        data: {
          ...(input.name !== undefined && { name: input.name }),
          ...(input.type !== undefined && { type: input.type }),
          ...(input.icon !== undefined && { icon: input.icon }),
          ...(input.color !== undefined && { color: input.color }),
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new HttpError(409, "Ya existe una categoría con ese nombre");
      }
      throw error;
    }
  },

  async remove(userId: string, categoryId: string) {
    const category = await getOwnedCategory(userId, categoryId);
    await prisma.category.delete({ where: { id: category.id } });
  },
};
