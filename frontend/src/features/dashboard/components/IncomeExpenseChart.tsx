import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartColumnBig } from "lucide-react";
import { formatCurrency } from "@/lib/format";
import type { TrendPoint } from "../types";

interface IncomeExpenseChartProps {
  data: TrendPoint[];
  currency: string;
}

interface ChartDatum {
  label: string;
  income: number;
  expense: number;
}

const AXIS_STYLE = { fill: "#a1a1aa", fontSize: 12 };
const CARTESIAN_STYLE = { stroke: "#e4e4e7" };

function TrendTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: ReadonlyArray<{ name: string; value: number; color: string }>;
  label?: string;
  currency: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-lg">
      <p className="font-bold">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="mt-1 flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="capitalize text-muted-foreground">{entry.name}</span>
          <span className="ml-auto pl-4 font-bold tabular-nums">
            {formatCurrency(entry.value, currency)}
          </span>
        </p>
      ))}
    </div>
  );
}

export function IncomeExpenseChart({ data, currency }: IncomeExpenseChartProps) {
  const chartData: ChartDatum[] = data.map((point, index) => ({
    label: index === data.length - 1 ? `${point.label} (mes actual)` : point.label,
    income: Number(point.income),
    expense: Number(point.expense),
  }));
  const hasData = chartData.some((point) => point.income > 0 || point.expense > 0);

  if (!hasData) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl bg-canvas text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink/5 text-muted">
          <ChartColumnBig className="h-6 w-6" />
        </span>
        <p className="mt-3 text-sm font-semibold text-muted">
          Los ingresos y gastos aparecerán aquí
        </p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 0 }} barGap={4}>
          <CartesianGrid strokeDasharray="4 4" vertical={false} {...CARTESIAN_STYLE} />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={AXIS_STYLE}
            tickMargin={8}
          />
          <YAxis
            tickFormatter={(value: number) => formatCurrency(value, currency)}
            tickLine={false}
            axisLine={false}
            tick={AXIS_STYLE}
            width={72}
          />
          <Tooltip
            cursor={{ fill: "rgba(26, 26, 26, 0.04)" }}
            content={<TrendTooltip currency={currency} />}
          />
          <Bar dataKey="income" name="Ingresos" radius={[8, 8, 0, 0]} fill="#d8fb52" />
          <Bar dataKey="expense" name="Gastos" radius={[8, 8, 0, 0]} fill="#1a1a1a" />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-2 flex items-center justify-center gap-6 text-xs font-medium text-muted">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#d8fb52" }} />
          Ingresos
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-ink" />
          Gastos
        </span>
      </div>
    </div>
  );
}