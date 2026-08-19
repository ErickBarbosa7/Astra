import { prisma } from "../../lib/prisma.js";
import type { CategorySpendingRow, TrendPoint, TrendRow } from "./report.types.js";

function monthBounds(now: Date): { start: Date; end: Date } {
  return {
    start: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)),
    end: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1)),
  };
}

const MONTH_NAMES = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
] as const;

function trendMonthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthsBack(now: Date, count: number): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (count - 1), 1));
}

function padTrend(rows: TrendRow[], now: Date): TrendPoint[] {
  const monthKey = trendMonthKey(now);
  const year = Number(monthKey.split("-")[0]);
  const month = Number(monthKey.split("-")[1]);
  const months: TrendPoint[] = [];

  for (let index = 5; index >= 0; index -= 1) {
    const date = new Date(Date.UTC(year, month - 1 - index, 1));
    const key = trendMonthKey(date);
    const row = rows.find((candidate) => candidate.month === key);
    months.push({
      month: key,
      label: MONTH_NAMES[date.getUTCMonth()]! as (typeof MONTH_NAMES)[number],
      income: row?.type === "INCOME" ? row.total : "0.00",
      expense: row?.type === "EXPENSE" ? row.total : "0.00",
    });
  }

  return months;
}

export const reportService = {
  async overview(userId: string) {
    const now = new Date();
    const { start: monthStart, end: monthEnd } = monthBounds(now);

    const [balanceResult, monthTotals, spendingRows, trendRows, recentTransactions] =
      await Promise.all([
        prisma.account.aggregate({
          where: { userId, isArchived: false },
          _sum: { balance: true },
        }),
        prisma.transaction.groupBy({
          by: ["type"],
          where: {
            userId,
            date: { gte: monthStart, lt: monthEnd },
          },
          _sum: { amount: true },
        }),
        prisma.$queryRaw<CategorySpendingRow[]>`
          SELECT
            t."categoryId" AS "categoryId",
            c.name AS name,
            c.color AS color,
            c.icon AS icon,
            SUM(t.amount)::text AS total,
            COUNT(*)::int AS count
          FROM transactions t
          LEFT JOIN categories c ON c.id = t."categoryId"
          WHERE t."userId" = ${userId}
            AND t.type = 'EXPENSE'
            AND t.date >= ${monthStart}
            AND t.date < ${monthEnd}
          GROUP BY t."categoryId", c.name, c.color, c.icon
          ORDER BY total DESC
        `,
        prisma.$queryRaw<TrendRow[]>`
          SELECT
            to_char(date_trunc('month', t.date), 'YYYY-MM') AS month,
            t.type AS type,
            SUM(t.amount)::text AS total
          FROM transactions t
          WHERE t."userId" = ${userId}
            AND t.date >= ${monthsBack(now, 6)}
          GROUP BY month, t.type
          ORDER BY month ASC
        `,
        prisma.transaction.findMany({
          where: { userId },
          include: {
            category: true,
            account: { select: { id: true, name: true } },
          },
          orderBy: { date: "desc" },
          take: 6,
        }),
      ]);

    const totalBalance = balanceResult._sum.balance?.toString() ?? "0.00";
    const totalsByType = new Map(
      monthTotals.map((row) => [row.type, row._sum.amount?.toString() ?? "0.00"]),
    );
    const monthIncome = totalsByType.get("INCOME") ?? "0.00";
    const monthExpense = totalsByType.get("EXPENSE") ?? "0.00";

    const spendingByCategory = spendingRows.map((row) => ({
      categoryId: row.categoryId,
      name: row.name ?? "Sin categoría",
      color: row.color,
      icon: row.icon,
      total: row.total,
      count: Number(row.count),
    }));

    const trend = padTrend(trendRows, now);

    return {
      totalBalance,
      monthIncome,
      monthExpense,
      spendingByCategory,
      incomeExpenseTrend: trend,
      recentTransactions,
    };
  },
};
