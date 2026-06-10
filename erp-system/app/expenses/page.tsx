export default function ExpensesPage() {
  const expenses = [
    {
      id: "EXP-001",
      category: "Office Rent",
      amount: "₹25,000",
      date: "10 Jun 2026",
      status: "Paid",
    },
    {
      id: "EXP-002",
      category: "Internet Bill",
      amount: "₹2,500",
      date: "08 Jun 2026",
      status: "Paid",
    },
    {
      id: "EXP-003",
      category: "Electricity",
      amount: "₹6,800",
      date: "05 Jun 2026",
      status: "Pending",
    },
  ];

  return (
    <div className="p-8 text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">
          Expenses Management
        </h1>
        <p className="text-slate-400 mt-2">
          Track and manage company expenses
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Total Expenses
          </h3>
          <p className="text-3xl font-bold mt-2">
            ₹34,300
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Paid
          </h3>
          <p className="text-3xl font-bold mt-2 text-green-400">
            ₹27,500
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Pending
          </h3>
          <p className="text-3xl font-bold mt-2 text-yellow-400">
            ₹6,800
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071028] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4">
                Expense ID
              </th>
              <th className="text-left p-4">
                Category
              </th>
              <th className="text-left p-4">
                Amount
              </th>
              <th className="text-left p-4">
                Date
              </th>
              <th className="text-left p-4">
                Status
              </th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="border-b border-slate-800"
              >
                <td className="p-4">
                  {expense.id}
                </td>

                <td className="p-4">
                  {expense.category}
                </td>

                <td className="p-4">
                  {expense.amount}
                </td>

                <td className="p-4">
                  {expense.date}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      expense.status === "Paid"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {expense.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}