  "use client";

  import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Cell,
    PieChart,
    Pie,
  } from "recharts";

  import {
  LabelList,
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
  (acc[expense.category] || 0) +
  expense.amount;

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

  const totalExpense =
  normalizedExpenses.reduce(
  (sum, expense) =>
  sum + expense.amount,
  0
  );

  const averageExpense =
  normalizedExpenses.length > 0
  ? totalExpense /
  normalizedExpenses.length
  : 0;

  const currentDate = new Date();

  const currentMonthKey = `${currentDate.getFullYear()}-${
      currentDate.getMonth() + 1
    }`;

  const previousMonthDate = new Date(
  currentDate.getFullYear(),
  currentDate.getMonth() - 1,
  1
  );

  const previousMonthKey = `${previousMonthDate.getFullYear()}-${
      previousMonthDate.getMonth() + 1
    }`;

  const monthTotals =
  normalizedExpenses.reduce(
  (
  acc: Record<string, number>,
  expense
  ) => {
  if (!expense.date)
  return acc;


      const parsed = new Date(
        expense.date
      );

      if (
        Number.isNaN(
          parsed.getTime()
        )
      )
        return acc;

      const monthKey = `${parsed.getFullYear()}-${
        parsed.getMonth() + 1
      }`;

      acc[monthKey] =
        (acc[monthKey] || 0) +
        expense.amount;

      return acc;
    },
    {}
  );

  const currentMonthTotal =
  monthTotals[currentMonthKey] || 0;

  const previousMonthTotal =
  monthTotals[previousMonthKey] ||
  0;

  const monthlyChange =
  previousMonthTotal === 0
  ? currentMonthTotal === 0
  ? 0
  : 100
  : ((currentMonthTotal -
  previousMonthTotal) /
  previousMonthTotal) *
  100;

  const monthlyChangeLabel =
  monthlyChange === 0
  ? "↔ Stable"
  : monthlyChange > 0
  ? `📈 +${monthlyChange.toFixed(
            1
          )}%`
  : `📉 ${monthlyChange.toFixed(
            1
          )}%`;

  const topCategories =
  data.slice(0, 3);

  const categoryPercentages =
  data.reduce(
  (acc, item) => {
  acc[item.category] =
  totalExpense > 0
  ? (
  (item.amount /
  totalExpense) *
  100
  ).toFixed(1)
  : "0";

      return acc;
    },
    {} as Record<string, string>
  );
  const COLORS = [
    "#22d3ee",
    "#8b5cf6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
  ];

  if (data.length === 0) {
  return ( <div className="bg-[#020817] rounded-3xl p-12 text-center text-slate-400">
  No expense data available. </div>
  );
  }

  return ( <div className="bg-[#020817] rounded-3xl border border-slate-800 shadow-xl w-full"> <div className="p-8"> <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"> <div> <p className="text-slate-400 text-sm uppercase tracking-[0.3em]">
  Category Spend </p>

          <h2 className="mt-3 text-4xl font-bold text-white">
            ₹
            {totalExpense.toLocaleString(
              "en-IN"
            )}
          </h2>

          <p
    className={`mt-2 text-sm font-medium ${
      monthlyChange >= 0
        ? "text-emerald-400"
        : "text-rose-400"
    }`}
  >
    {monthlyChange >= 0 ? "📈" : "📉"}{" "}
    {Math.abs(monthlyChange).toFixed(1)}%
    vs last month
  </p>

          <p className="text-slate-400 text-sm mt-2">
            Total spend across all
            categories
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-3xl bg-[#020817] border border-slate-800 p-4">
            <p className="text-slate-400 text-xs uppercase tracking-[0.25em]">
              Avg per expense
            </p>

            <p className="mt-2 text-lg font-semibold text-white">
              ₹
              {Math.round(
                averageExpense
              ).toLocaleString(
                "en-IN"
              )}
            </p>
          </div>

          <div className="rounded-3xl bg-[#020817] border border-slate-800 p-4">
            <p className="text-slate-400 text-xs uppercase tracking-[0.25em]">
              Month Change
            </p>

            <p
              className={`mt-2 text-lg font-semibold ${
                monthlyChange >= 0
                  ? "text-emerald-400"
                  : "text-rose-400"
              }`}
            >
              {
                monthlyChangeLabel
              }
            </p>
          </div>
        </div>
      </div>

      
    </div>
    <div className="grid lg:grid-cols-[1.8fr_1.2fr] gap-8 mt-8 px-6 pb-8 items-center">

  {/* Bar Chart */}
  <div className="h-[420px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid
          vertical={false}
          stroke="#334155"
          strokeDasharray="4 4"
        />

        <XAxis
  dataKey="category"
  axisLine={false}
  tickLine={false}
  tick={{ fill: "#94A3B8" }}
/>

<YAxis
  axisLine={false}
  tickLine={false}
  tick={{ fill: "#94A3B8" }}
/>

        <Tooltip
          formatter={(value: number) => [
            `₹${Number(value).toLocaleString("en-IN")}`,
            "Amount",
          ]}
        />

        <Bar
  dataKey="amount"
  radius={[16, 16, 8, 8]}
>
  <LabelList
    dataKey="amount"
    position="top"
    formatter={(value: number) =>
      `₹${Number(value).toLocaleString("en-IN")}`
    }
    fill="#94A3B8"
  />

  {data.map((_, index) => (
    <Cell
      key={index}
      fill={COLORS[index % COLORS.length]}
    />
  ))}
</Bar>

      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* Donut Chart */}
  <div className="h-[420px] flex flex-col items-center justify-center">
  <ResponsiveContainer width="100%" height="100%">
    <PieChart>
      <Pie
        data={data}
        dataKey="amount"
        nameKey="category"
        innerRadius={80}
        outerRadius={120}
      >
        {data.map((_, index) => (
          <Cell
            key={index}
            fill={COLORS[index % COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip
        formatter={(value: number) => [
          `₹${Number(value).toLocaleString("en-IN")}`,
          "Amount",
        ]}
      />
    </PieChart>
  </ResponsiveContainer>

    <div className="mt-4 flex flex-wrap justify-center gap-4">
  {data.map((item, index) => (
    <div
      key={item.category}
      className="flex items-center gap-2 text-sm text-slate-300"
    >
      <span
        className="h-3 w-3 rounded-full"
        style={{
          backgroundColor:
            COLORS[index % COLORS.length],
        }}
      />
      {item.category}
    </div>
  ))}
</div>
  </div>
</div>

</div>
  );
  }
