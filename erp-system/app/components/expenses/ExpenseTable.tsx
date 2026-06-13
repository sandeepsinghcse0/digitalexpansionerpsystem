import {
  Eye,
  Pencil,
  Trash2,
  Paperclip,
} from "lucide-react";

interface Expense {
  id: number;
  description: string;
  category: string;
  amount: number;
  expense_date: string;
  attachment?: boolean;
}

interface ExpenseTableProps {
  expenses: Expense[];
  onDelete: (id: number) => void;
}

export default function ExpenseTable({
  expenses,
  onDelete,
}: ExpenseTableProps) {
  return (
    <div
      className="
        bg-[#111C44]/80
        backdrop-blur-xl
        border border-blue-500/20
        rounded-3xl
        overflow-hidden
        shadow-[0_0_40px_rgba(59,130,246,0.15)]
      "
    >
      {/* Header */}
      <div className="px-6 py-5 border-b border-blue-500/20">
        <h2 className="text-xl font-semibold text-white">
          Expense Records
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          Manage and monitor all expenses
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0B1437] text-gray-300">
              <th className="px-6 py-4 text-left font-medium">
                ID
              </th>

              <th className="px-6 py-4 text-left font-medium">
                Description
              </th>

              <th className="px-6 py-4 text-left font-medium">
                Category
              </th>

              <th className="px-6 py-4 text-left font-medium">
                Amount
              </th>

              <th className="px-6 py-4 text-left font-medium">
                Date
              </th>

              <th className="px-6 py-4 text-left font-medium">
                Attachment
              </th>

              <th className="px-6 py-4 text-center font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {expenses?.length > 0 ? (
              expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="
                    border-b border-blue-500/10
                    hover:bg-[#182657]
                    transition-all
                  "
                >
                  <td className="px-6 py-5 text-gray-300">
                    #{expense.id}
                  </td>

                  <td className="px-6 py-5 text-white font-medium">
                    {expense.description}
                  </td>

                  <td className="px-6 py-5">
                    <span
                      className="
                        px-3 py-1
                        rounded-full
                        text-xs
                        font-medium
                        bg-blue-500/20
                        text-blue-300
                        border border-blue-500/20
                      "
                    >
                      {expense.category}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-green-400 font-bold">
                    ₹{expense.amount?.toLocaleString()}
                  </td>

                  <td className="px-6 py-5 text-gray-300">
                    {expense.expense_date}
                  </td>

                  <td className="px-6 py-5">
                    {expense.attachment ? (
                      <span
                        className="
                          inline-flex items-center gap-2
                          text-blue-300
                        "
                      >
                        <Paperclip size={14} />
                        Available
                      </span>
                    ) : (
                      <span className="text-gray-500">
                        No File
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-3">

                      {/* View */}
                      <button
                        className="
                          p-2 rounded-xl
                          bg-blue-500/15
                          text-blue-400
                          hover:bg-blue-500/30
                          transition
                        "
                      >
                        <Eye size={16} />
                      </button>

                      {/* Edit */}
                      <button
                        className="
                          p-2 rounded-xl
                          bg-yellow-500/15
                          text-yellow-400
                          hover:bg-yellow-500/30
                          transition
                        "
                      >
                        <Pencil size={16} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete?.(expense.id)}
                        className="
                          p-2 rounded-xl
                          bg-red-500/15
                          text-red-400
                          hover:bg-red-500/30
                          transition
                        "
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="py-10 text-center text-gray-400"
                >
                  No expense records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}