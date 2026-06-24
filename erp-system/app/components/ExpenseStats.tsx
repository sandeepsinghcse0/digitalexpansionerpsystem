"use client";

import {
  Wallet,
  Receipt,
  TrendingUp,
  Tag,
} from "lucide-react";

type Props = {
  totalExpenses: number;
  totalCount: number;
  highestExpense: number;
  monthlyChangeLabel: string;
  categories: {
    category: string;
    amount: number;
    percentage: string;
  }[];
};

export default function ExpenseStats({
  totalExpenses,
  totalCount,
  highestExpense,
  monthlyChangeLabel,
  categories,
}: Props) {
  return (
    <div className="sticky top-8 rounded-3xl border border-slate-800 bg-[#071028] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">

      {/* Header */}
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
          Expense Metrics
        </p>

        <h3 className="mt-2 text-2xl font-semibold text-white">
          Summary
        </h3>
      </div>

      {/* KPI Cards */}
      <div className="space-y-5">
        {[
          {
            title: "Total Expenses",
            value: `₹${totalExpenses.toLocaleString("en-IN")}`,
            color: "text-cyan-400",
            icon: <Wallet size={18} />,
          },
          {
            title: "Total Records",
            value: totalCount,
            color: "text-green-400",
            icon: <Receipt size={18} />,
          },
          {
            title: "Highest Expense",
            value: `₹${highestExpense.toLocaleString("en-IN")}`,
            color: "text-red-400",
            icon: <TrendingUp size={18} />,
          },
          {
            title: "Monthly Change",
            value: monthlyChangeLabel,
            color: "text-emerald-400",
            icon: <TrendingUp size={18} />,
          },
        ].map((card) => (
          <div
            key={card.title}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#020817] p-5 hover:border-slate-700 transition"
          >
            <div className="flex items-center gap-3">
              <span className={card.color}>
                {card.icon}
              </span>

              <p className="text-sm text-slate-400">
                {card.title}
              </p>
            </div>

            <p
              className={`text-lg font-semibold ${card.color}`}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Category Breakdown */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Tag
            size={18}
            className="text-blue-400"
          />

          <h4 className="text-sm uppercase tracking-[0.25em] text-slate-400">
            Category Breakdown
          </h4>
        </div>

        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
          {categories.map((item) => (
            <div
              key={item.category}
              className="rounded-xl border border-slate-800 bg-[#020817] p-4 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">
                  {item.category}
                </span>

                <span className="text-white font-semibold">
                  ₹
                  {item.amount.toLocaleString(
                    "en-IN"
                  )}
                </span>
              </div>

              <div className="mt-2">
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-emerald-400">
                  {item.percentage}% of spending
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}