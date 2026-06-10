"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function ExpensesPage() {
const [showModal, setShowModal] = useState(false);
const [searchTerm, setSearchTerm] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");
const [editingIndex, setEditingIndex] = useState<number | null>(null);
const [expenses, setExpenses] = useState([
{
title: "Internet Bill",
category: "Utilities",
amount: 1200,
date: "2026-06-10",
status: "Paid",
},
{
title: "Google Ads",
category: "Marketing",
amount: 5000,
date: "2026-06-08",
status: "Pending",
},
]);

const handleDeleteExpense = (indexToDelete: number) => {
  setExpenses(
    expenses.filter((_, index) => index !== indexToDelete)
  );
};
const [title, setTitle] = useState("");
const [amount, setAmount] = useState("");
const [category, setCategory] = useState("Utilities");
const [date, setDate] = useState("");
const [description, setDescription] = useState("");
const handleAddExpense = (e: React.FormEvent) => {
  e.preventDefault();

  if (!title || !amount || !date) return;

  const expenseData = {
    title,
    category,
    amount: Number(amount),
    date,
    status: "Paid",
  };

  if (editingIndex !== null) {
    const updatedExpenses = [...expenses];

    updatedExpenses[editingIndex] = expenseData;

    setExpenses(updatedExpenses);

    setEditingIndex(null);
  } else {
    setExpenses([expenseData, ...expenses]);
  }

  setTitle("");
  setAmount("");
  setCategory("Utilities");
  setDate("");
  setDescription("");

  setShowModal(false);
};
const filteredExpenses = expenses.filter((expense) => {
  const matchesSearch = expense.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "All" ||
    expense.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

const totalExpenses = expenses.reduce(
  (sum, expense) => sum + expense.amount,
  0
);

const highestExpense =
  expenses.length > 0
    ? Math.max(...expenses.map((e) => e.amount))
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          className="bg-[#071028] border border-slate-800 rounded-2xl p-6"
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

   <div className="flex gap-4 mb-6">
  <input
    type="text"
    placeholder="🔍 Search expenses..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full md:w-80 bg-[#071028] border border-slate-800 rounded-xl px-4 py-3 text-white"
  />

  <select
    value={selectedCategory}
    onChange={(e) => setSelectedCategory(e.target.value)}
    className="bg-[#071028] border border-slate-800 rounded-xl px-4 py-3 text-white"
  >
    <option value="All">All Categories</option>
    <option value="Utilities">Utilities</option>
    <option value="Marketing">Marketing</option>
    <option value="Travel">Travel</option>
    <option value="Office Supplies">
      Office Supplies
    </option>
  </select>
</div>


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
      onClick={() => {
        setEditingIndex(index);

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
      onClick={() => handleDeleteExpense(index)}
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

    {/* Modal */}
    {showModal && (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-8 w-full max-w-md">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {editingIndex !== null ? "Edit Expense" : "Add Expense"}
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
  </main>
</div>

);
}
