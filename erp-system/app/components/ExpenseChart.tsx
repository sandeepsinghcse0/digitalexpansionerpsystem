"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface Expense {
  category: string;
  amount: number | string;
  date?: string;
}

export default function ExpenseChart({
  expenses,
}: {
  expenses: Expense[];
}) {
  const normalizedExpenses = expenses.map((expense) => ({
    ...expense,
    amount: Number(expense.amount) || 0,
  }));

  const categoryTotals = normalizedExpenses.reduce(
    (acc: Record<string, number>, expense) => {
      acc[expense.category] =
        (acc[expense.category] || 0) + expense.amount;

      return acc;
    },
    {}
  );

  const data = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  const totalExpense = normalizedExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  const averageExpense =
    normalizedExpenses.length > 0
      ? totalExpense / normalizedExpenses.length
      : 0;

  const currentDate = new Date();
  const currentMonthKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
  const previousMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1
  );
  const previousMonthKey = `${previousMonthDate.getFullYear()}-${previousMonthDate.getMonth() + 1}`;

  const monthTotals = normalizedExpenses.reduce(
    (acc: Record<string, number>, expense) => {
      if (!expense.date) return acc;
      const parsed = new Date(expense.date);
      if (Number.isNaN(parsed.getTime())) return acc;
      const monthKey = `${parsed.getFullYear()}-${parsed.getMonth() + 1}`;
      acc[monthKey] = (acc[monthKey] || 0) + expense.amount;
      return acc;
    },
    {}
  );

  const currentMonthTotal = monthTotals[currentMonthKey] || 0;
  const previousMonthTotal = monthTotals[previousMonthKey] || 0;
  const monthlyChange =
    previousMonthTotal === 0
      ? currentMonthTotal === 0
        ? 0
        : 100
      : ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;

  const monthlyChangeLabel =
    monthlyChange === 0
      ? "No change"
      : monthlyChange > 0
      ? `+${monthlyChange.toFixed(1)}%`
      : `${monthlyChange.toFixed(1)}%`;

  const topCategories = data.slice(0, 3);

  return (
    <div className="bg-[#020817] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-slate-800 overflow-hidden w-full min-w-0">
      {/* Header */}
      <div className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <p className="text-slate-400 text-sm uppercase tracking-[0.3em]">
              Category Spend
            </p>
            <h2 className="mt-3 text-4xl font-bold text-white">
              ₹{totalExpense.toLocaleString()}
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Total spend across all categories
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 text-sm">
            <div className="rounded-3xl bg-[#020817] border border-slate-800 p-4">
              <p className="text-slate-400 text-xs uppercase tracking-[0.25em]">
                Avg per expense
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                ₹{averageExpense.toFixed(0)}
              </p>
            </div>
            <div className="rounded-3xl bg-[#020817] border border-slate-800 p-4">
              <p className="text-slate-400 text-xs uppercase tracking-[0.25em]">
                Month change
              </p>
              <p
                className={`mt-2 text-lg font-semibold ${
                  monthlyChange >= 0
                    ? "text-emerald-400"
                    : "text-rose-400"
                }`}
              >
                {monthlyChangeLabel}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {topCategories.map((item) => (
            <div
              key={item.category}
              className="rounded-3xl bg-[#020817] border border-slate-800 p-4"
            >
              <p className="text-slate-400 text-xs uppercase tracking-[0.25em]">
                {item.category}
              </p>
              <p className="mt-2 text-xl font-semibold text-white">
                ₹{item.amount.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="h-[350px] min-h-[350px] px-4 pb-6 overflow-hidden w-full min-w-0">
        <ResponsiveContainer width="100%" height={350} minWidth={0} minHeight={0}>
          <BarChart
            data={data}
            margin={{ top: 24, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="expenseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#60A5FA"
                />
                <stop
                  offset="100%"
                  stopColor="#4338CA"
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              horizontal
              stroke="#334155"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="category"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94A3B8",
                fontSize: 12,
              }}
              tickMargin={12}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#94A3B8",
                fontSize: 12,
              }}
              width={40}
            />

            <Tooltip
              contentStyle={{
                borderRadius: 16,
                border: "1px solid rgba(148,163,184,0.15)",
                backgroundColor: "#0f172a",
                color: "#fff",
                boxShadow:
                  "0 15px 40px rgba(15,23,42,0.35)",
              }}
              cursor={{
                fill: "rgba(148,163,184,0.08)",
              }}
            />

            <Bar
              dataKey="amount"
              fill="url(#expenseGradient)"
              radius={[16, 16, 8, 8]}
              barSize={46}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}