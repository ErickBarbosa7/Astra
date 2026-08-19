import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../utils/httpError.js";
import { toMoney } from "../../utils/money.js";
import type { CreateAccountInput, UpdateAccountInput } from "./account.schemas.js";

async function getOwnedAccount(userId: string, accountId: string) {
  const account = await prisma.account.findFirst({
    where: { id: accountId, userId },
  });

  if (!account) throw new HttpError(404, "Cuenta no encontrada");
  return account;
}

export const accountService = {
  async list(userId: string) {
    return prisma.account.findMany({
      where: { userId, isArchived: false },
      orderBy: { createdAt: "desc" },
    });
  },

  async get(userId: string, accountId: string) {
    return getOwnedAccount(userId, accountId);
  },

  async create(userId: string, input: CreateAccountInput) {
    return prisma.account.create({
      data: {
        userId,
        name: input.name,
        type: input.type,
        balance: toMoney(input.initialBalance),
      },
    });
  },

  async update(userId: string, accountId: string, input: UpdateAccountInput) {
    await getOwnedAccount(userId, accountId);

    return prisma.account.update({
      where: { id: accountId },
      data: input,
    });
  },

  async remove(userId: string, accountId: string) {
    await getOwnedAccount(userId, accountId);

    await prisma.account.delete({ where: { id: accountId } });
  },
};