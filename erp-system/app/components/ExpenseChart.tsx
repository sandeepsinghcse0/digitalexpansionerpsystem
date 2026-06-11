"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ExpenseChart({
  expenses,
}: {
  expenses: any[];
}) {
  const categoryTotals = expenses.reduce(
    (acc: any, expense) => {
      acc[expense.category] =
        (acc[expense.category] || 0) +
        expense.amount;

      return acc;
    },
    {}
  );

  const data = Object.entries(categoryTotals).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );

  return (
    <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        Expense Analytics
      </h2>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="99%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}