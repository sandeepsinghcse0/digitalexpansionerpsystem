type Props = {
  totalExpenses: number;
  totalCount: number;
  highestExpense: number;
};

export default function ExpenseStats({
  totalExpenses,
  totalCount,
  highestExpense,
}: Props) {
  return (
    <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-6">
        Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: "Total Expenses",
            value: `₹${totalExpenses}`,
          },
          {
            title: "Total Records",
            value: totalCount,
          },
          {
            title: "Highest Expense",
            value: `₹${highestExpense}`,
          },
          {
            title: "Categories",
            value: 4,
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-[#020817] border border-slate-800 rounded-2xl p-6"
          >
            <p className="text-gray-400 text-sm">
              {card.title}
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              {card.value}
            </h2>
          </div>
        ))}
      </div>
    </div>
  );
}