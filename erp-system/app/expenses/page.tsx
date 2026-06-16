"use client";
import ExpenseStats from "../components/ExpenseStats";
import ExpenseFilters from "../components/ExpenseFilters";
import { useState, useEffect } from "react";
import ExpenseChart from "../components/ExpenseChart";
import Sidebar from "../components/Sidebar";

export default function ExpensesPage() {
const [showModal, setShowModal] = useState(false);
const [viewExpense, setViewExpense] = useState<any>(null);
const [showViewModal, setShowViewModal] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");
const [editingIndex, setEditingIndex] = useState<number | null>(null);
const [editingId, setEditingId] =
  useState<number | null>(null);
const [expenses, setExpenses] = useState<any[]>([]);
const totalExpenses = expenses.reduce(
  (sum, expense) =>
    sum + Number(expense.amount || 0),
  0
);

const handleDeleteExpense = async (
  
  expenseId: number
) => {
  await fetch(
    `/api/expenses/${expenseId}`,
    {
      method: "DELETE",
    }
  );

  setExpenses(
    expenses.filter(
      (expense) =>
        expense.id !== expenseId
    )
  );
};
const [title, setTitle] = useState("");
const [amount, setAmount] = useState("");
const [category, setCategory] = useState("Utilities");
const [date, setDate] = useState("");
const [description, setDescription] = useState("");
const handleViewExpense = (expense: any) => {
  setViewExpense(expense);
  setShowViewModal(true);
};

useEffect(() => {
  fetch("/api/expenses")
    .then((res) => res.json())
    .then((data) => {
      console.log("API RESPONSE:", data);

      if (!Array.isArray(data)) {
        console.error("Expected array but got:", data);
        return;
      }

      const formattedExpenses = data.map(
        (expense: any) => ({
          id: expense.id,
          title: expense.description,
          category: expense.category?.name || "Unknown",
          amount: expense.amount,
          date: expense.expense_date?.split("T")[0],
          status: "Paid",
        })
      );

      setExpenses(formattedExpenses);
    })
    .catch(console.error);
}, []);

const handleAddExpense = async (
  e: React.FormEvent
) => {
  e.preventDefault();
  if (editingId) {
  await fetch(
    `/api/expenses/${editingId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type":
          "application/json",
      },
      body: JSON.stringify({
        description: title,
        amount, 
        date,
        notes: description,
        category,
      }),
    }
  );

  setEditingId(null);
setEditingIndex(null);
window.location.reload();
return;
}
  alert("SAVE CLICKED");

  if (!title || !amount || !date) return;

  const response = await fetch(
    "/api/expenses",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/json",
      },
body: JSON.stringify({
  description: title,
  amount,
  date,
  notes: description,
  category,
}),
    }
  );

 console.log("STATUS:", response.status);

const savedExpense = await response.json();

console.log("RESPONSE:", savedExpense);

setExpenses([
  {
    id: savedExpense.id,
    title: savedExpense.description,
    category,
    amount: savedExpense.amount,
    date,
    status: "Paid",
  },
  ...expenses,
]);

setTitle("");
setAmount("");
setCategory("Utilities");
setDate("");
setDescription("");

setShowModal(false);
};
const filteredExpenses = expenses.filter((expense) => {
  const searchValue =
    searchTerm.toLowerCase();

  const matchesSearch =
    expense.title
      ?.toLowerCase()
      .includes(searchValue) ||
    expense.category
      ?.toLowerCase()
      .includes(searchValue) ||
    expense.amount
      ?.toString()
      .includes(searchTerm) ||
    expense.date
      ?.toLowerCase()
      .includes(searchValue);

  const matchesCategory =
    selectedCategory === "All" ||
    expense.category === selectedCategory;

  return (
    matchesSearch &&
    matchesCategory
  );
});

const highestExpense =
  expenses.length > 0
    ? Math.max(
        ...expenses.map((e) =>
          Number(e.amount || 0)
        )
      )
    : 0;


const totalCount = expenses.length;



return ( <div className="flex min-h-screen bg-[#020817]"> <Sidebar />


  <main className="flex-1 p-8">
    {/* Header */}

    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-4xl font-bold text-white">
          Expense Management
        </h1>

        <p className="text-gray-400 mt-2">
          Monitor and control company spending.
        </p>
      </div>

      <button
  onClick={() => setShowModal(true)}
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
>
  + Add Expense
</button>
    </div>

  
{/* Stats Cards */}
<ExpenseStats
  totalExpenses={totalExpenses}
  totalCount={totalCount}
  highestExpense={highestExpense}
/>

{/* Filters */}
<ExpenseFilters
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
/>


    {/* Expense Table */}
    <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        Recent Expenses
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left py-4 text-gray-400">
                Expense
              </th>

              <th className="text-left py-4 text-gray-400">
                Category
              </th>

              <th className="text-left py-4 text-gray-400">
                Amount
              </th>

              <th className="text-left py-4 text-gray-400">
  Date
</th>

<th className="text-left py-4 text-gray-400">
  Status
</th>

<th className="text-left py-4 text-gray-400">
  Actions
</th>
            </tr>
          </thead>

          <tbody>
            {filteredExpenses.map((expense, index) => (

                
              <tr
                key={index}
                className="border-b border-slate-800"
              >
                <td className="py-4 text-white">
                  {expense.title}
                </td>

                <td className="py-4 text-gray-300">
                  {expense.category}
                </td>

                <td className="py-4 text-red-400">
                  ₹{expense.amount}
                </td>

                <td className="py-4 text-gray-300">
                  {expense.date}
                </td>

                <td className="py-4">
  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
    {expense.status}
  </span>
</td>

<td className="py-4">
  <div className="flex gap-2">

    <button
      onClick={() => handleViewExpense(expense)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
    >
      View
    </button>

    <button
      onClick={() => {
        setEditingIndex(index);
        setEditingId(expense.id);

        setTitle(expense.title);
        setAmount(expense.amount.toString());
        setCategory(expense.category);
        setDate(expense.date);

        setShowModal(true);
      }}
      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg"
    >
      Edit
    </button>

    <button
      onClick={() =>
        handleDeleteExpense(expense.id)
      }
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
    >
      Delete
    </button>

  </div>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

    <div className="w-full mt-8">
  <ExpenseChart expenses={expenses} />
</div>

    {/* Modal */}
    {/* Add/Edit Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-[#071028] border border-slate-800 rounded-2xl p-8 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          {editingIndex !== null
            ? "Edit Expense"
            : "Add Expense"}
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <form
        onSubmit={handleAddExpense}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Expense Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white"
        />

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value)
          }
          className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white"
        />

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
          className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white"
        >
          <option>Utilities</option>
          <option>Marketing</option>
          <option>Travel</option>
          <option>Office Supplies</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(e.target.value)
          }
          className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white"
        />

        <textarea
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Description"
          rows={3}
          className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
        >
          Save Expense
        </button>
      </form>
    </div>
  </div>
)}

{/* View Modal */}
{showViewModal && viewExpense && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-[#071028] border border-slate-800 rounded-2xl p-8 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Expense Details
        </h2>

        <button
          onClick={() =>
            setShowViewModal(false)
          }
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-4 text-white">
        <p>
          <strong>Title:</strong>{" "}
          {viewExpense.title}
        </p>

        <p>
          <strong>Category:</strong>{" "}
          {viewExpense.category}
        </p>

        <p>
          <strong>Amount:</strong> ₹
          {viewExpense.amount}
        </p>

        <p>
          <strong>Date:</strong>{" "}
          {viewExpense.date}
        </p>

        <p>
          <strong>Status:</strong>{" "}
          {viewExpense.status}
        </p>
      </div>
    </div>
  </div>
)}
</main>
</div>
);
}