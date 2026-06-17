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
  categoryCount: number;
};

export default function ExpenseStats({
  totalExpenses,
  totalCount,
  highestExpense,
  categoryCount,
}: Props) {
  return (
    <div className="sticky top-8 rounded-3xl border border-slate-800 bg-[#071028] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
          Expense Metrics
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-white">
          Summary
        </h3>
      </div>

      <div className="space-y-5">
        {[
  {
    title: "Total Expenses",
    value: `₹${highestExpense.toLocaleString("en-IN")}`,
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
    title: "Categories",
    value: categoryCount,
    color: "text-blue-400",
    icon: <Tag size={18} />,
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

            <p className={`text-lg font-semibold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}