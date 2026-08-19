import { Prisma, TransactionType } from "@prisma/client";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../utils/httpError.js";
import { toMoney } from "../../utils/money.js";
import type { CreateTransactionInput, TransactionFilters, UpdateTransactionInput } from "./transaction.schemas.js";

type Tx = Prisma.TransactionClient;

function signed(amount: Prisma.Decimal, apply: boolean): Prisma.Decimal {
  return apply ? amount : amount.neg();
}

function effect(type: TransactionType, amount: Prisma.Decimal): Prisma.Decimal {
  return signed(amount, type === "INCOME");
}

async function getOwnedAccount(tx: Tx, userId: string, accountId: string) {
  const account = await tx.account.findFirst({ where: { id: accountId, userId } });
  if (!account) throw new HttpError(400, "Cuenta no encontrada");
  return account;
}

async function assertOwnedCategory(tx: Tx, userId: string, categoryId?: string | null) {
  if (!categoryId) return;
  const category = await tx.category.findFirst({ where: { id: categoryId, userId } });
  if (!category) throw new HttpError(400, "Categoría no encontrada");
}

export const transactionService = {
  async list(userId: string, filters: TransactionFilters) {
    const where: Prisma.TransactionWhereInput = { userId };

    if (filters.type) where.type = filters.type;
    if (filters.accountId) {
      const account = await prisma.account.findFirst({
        where: { id: filters.accountId, userId },
        select: { id: true },
      });
      if (!account) throw new HttpError(400, "Cuenta no encontrada");
      where.accountId = filters.accountId;
    }
    if (filters.categoryId) where.categoryId = filters.categoryId;

    if (filters.from || filters.to) {
      where.date = {
        ...(filters.from && { gte: new Date(`${filters.from}T00:00:00.000Z`) }),
        ...(filters.to && { lte: new Date(`${filters.to}T23:59:59.999Z`) }),
      };
    }

    return prisma.transaction.findMany({
      where,
      include: {
        category: true,
        account: { select: { id: true, name: true } },
      },
      orderBy: { date: "desc" },
      take: filters.limit,
    });
  },

  async get(userId: string, transactionId: string) {
    const transaction = await prisma.transaction.findFirst({
      where: { id: transactionId, userId },
      include: {
        category: true,
        account: { select: { id: true, name: true } },
      },
    });

    if (!transaction) throw new HttpError(404, "Transacción no encontrada");
    return transaction;
  },

  async create(userId: string, input: CreateTransactionInput) {
    return prisma.$transaction(async (tx) => {
      const account = await getOwnedAccount(tx, userId, input.accountId);
      await assertOwnedCategory(tx, userId, input.categoryId);

      const amount = toMoney(input.amount);

      const transaction = await tx.transaction.create({
        data: {
          userId,
          accountId: input.accountId,
          categoryId: input.categoryId ?? null,
          type: input.type,
          amount,
          description: input.description ?? null,
          date: input.date ?? new Date(),
        },
      });

      await tx.account.update({
        where: { id: account.id },
        data: { balance: account.balance.plus(effect(input.type, amount)) },
      });

      return transaction;
    });
  },

  async update(userId: string, transactionId: string, input: UpdateTransactionInput) {
    return prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findFirst({
        where: { id: transactionId, userId },
      });
      if (!existing) throw new HttpError(404, "Transacción no encontrada");

      const newAccountId = input.accountId ?? existing.accountId;
      const newType = input.type ?? existing.type;
      const newAmount = input.amount !== undefined ? toMoney(input.amount) : existing.amount;

      await assertOwnedCategory(tx, userId, input.categoryId === undefined ? existing.categoryId : input.categoryId);
      const targetAccount = await getOwnedAccount(tx, userId, newAccountId);

      const transaction = await tx.transaction.update({
        where: { id: transactionId },
        data: {
          ...(input.accountId !== undefined && { accountId: input.accountId }),
          ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
          ...(input.type !== undefined && { type: input.type }),
          ...(input.amount !== undefined && { amount: newAmount }),
          ...(input.description !== undefined && { description: input.description }),
          ...(input.date !== undefined && { date: input.date }),
        },
      });

      const oldEffect = effect(existing.type, existing.amount);
      const newEffect = effect(newType, newAmount);

      if (existing.accountId === newAccountId) {
        await tx.account.update({
          where: { id: newAccountId },
          data: { balance: targetAccount.balance.minus(oldEffect).plus(newEffect) },
        });
      } else {
        const oldAccount = await tx.account.findFirst({
          where: { id: existing.accountId, userId },
        });
        if (oldAccount) {
          await tx.account.update({
            where: { id: oldAccount.id },
            data: { balance: oldAccount.balance.minus(oldEffect) },
          });
        }
        await tx.account.update({
          where: { id: newAccountId },
          data: { balance: targetAccount.balance.plus(newEffect) },
        });
      }

      return transaction;
    });
  },

  async remove(userId: string, transactionId: string) {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.transaction.findFirst({
        where: { id: transactionId, userId },
      });
      if (!existing) throw new HttpError(404, "Transacción no encontrada");

      const account = await tx.account.findFirst({
        where: { id: existing.accountId, userId },
      });
      if (account) {
        await tx.account.update({
          where: { id: account.id },
          data: { balance: account.balance.minus(effect(existing.type, existing.amount)) },
        });
      }

      await tx.transaction.delete({ where: { id: transactionId } });
    });
  },
};