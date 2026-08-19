import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartPie } from "lucide-react";
import { CATEGORY_COLORS } from "@/features/categories/constants";
import { formatCurrency } from "@/lib/format";
import type { CategorySpending } from "../types";

interface SpendingChartProps {
  data: CategorySpending[];
  currency: string;
}

const FALLBACK_COLORS = CATEGORY_COLORS;

function resolveColor(color: string | null, index: number): string {
  return color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length] ?? "#71717a";
}

interface ChartDatum {
  name: string;
  value: number;
  color: string;
}

const LABEL_STYLE = { fill: "#71717a", fontSize: 12 };

function SpendingTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ payload: ChartDatum }>;
  currency: string;
}) {
  if (!active || !payload?.[0]) return null;
  const datum = payload[0].payload;

  return (
    <div className="rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-lg">
      <p className="font-bold">{datum.name}</p>
      <p className="mt-0.5 text-accent">{formatCurrency(datum.value, currency)}</p>
    </div>
  );
}

export function SpendingChart({ data, currency }: SpendingChartProps) {
  const chartData: ChartDatum[] = data.map((entry, index) => ({
    name: entry.name,
    value: Number(entry.total),
    color: resolveColor(entry.color, index),
  }));
  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-canvas text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/5 text-muted">
          <ChartPie className="h-6 w-6" />
        </span>
        <p className="mt-3 text-sm font-semibold text-muted">
          Aún no hay gastos categorizados este mes
        </p>
      </div>
    );
  }

  return (
    <div className="grid items-center gap-6 sm:grid-cols-2">
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={54}
              outerRadius={88}
              paddingAngle={3}
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`${entry.name}-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={<SpendingTooltip currency={currency} />}
              labelStyle={LABEL_STYLE}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
        {chartData.map((entry, index) => {
          const percentage = total > 0 ? Math.round((entry.value / total) * 100) : 0;
          return (
            <li key={`${entry.name}-${index}`} className="flex items-center gap-2 text-sm">
              <span
                className="h-3 w-3 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                {entry.name}
              </span>
              <span className="tabular-nums text-muted">{percentage}%</span>
              <span className="w-24 text-right font-bold tabular-nums">
                {formatCurrency(entry.value, currency)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}