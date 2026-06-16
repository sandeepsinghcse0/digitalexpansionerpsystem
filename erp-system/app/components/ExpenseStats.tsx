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
    <div className="rounded-3xl border border-slate-800 bg-[#071028] p-6">
      <div className="mb-6">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
          Expense Metrics
        </p>
        <h3 className="mt-2 text-2xl font-semibold text-white">
          Summary
        </h3>
      </div>

      <div className="space-y-4">
        {[
          {
            title: "Total Expenses",
            value: `₹${totalExpenses.toLocaleString()}`,
            color: "text-cyan-400",
          },
          {
            title: "Total Records",
            value: totalCount,
            color: "text-green-400",
          },
          {
            title: "Highest Expense",
            value: `₹${highestExpense.toLocaleString()}`,
            color: "text-red-400",
          },
          {
            title: "Categories",
            value: categoryCount,
            color: "text-blue-400",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="flex items-center justify-between rounded-2xl border border-slate-800 bg-[#020817] p-4"
          >
            <p className="text-sm text-slate-400">
              {card.title}
            </p>

            <p className={`text-lg font-semibold ${card.color}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}