"use client";
import ExpenseStats from "../components/ExpenseStats";
import ExpenseFilters from "../components/ExpenseFilters";
import { useState, useEffect, type FormEvent } from "react";
import Sidebar from "../components/Sidebar";
import ExpenseChart from "../components/ExpenseChart";


const defaultCategories = [
  "Utilities",
  "Marketing",
  "Travel",
  "Office Supplies",
  "Other",
];

type ExpenseItem = {
  id: number;
  title: string;
  category: string;
  amount: number;
  date: string;
  status: string;
  notes?: string;
  attachment_url?: string;
  created_by?: number;
};

export default function ExpensesPage() {
  const [selectedDate, setSelectedDate] =
  useState<Date | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [customCategory, setCustomCategory] = useState("");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Utilities");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [viewExpense, setViewExpense] = useState<ExpenseItem | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  

const handleViewExpense = (
  expenseId: number
) => {
  const expense = expenses.find(
    (e) => e.id === expenseId
  );

  if (!expense) return;

  setViewExpense(expense);
  setIsViewMode(true);
};

  const resetForm = () => {
    setTitle("");
    setAmount("");
    setCategory("Utilities");
    setDate("");
    setDescription("");
    setCustomCategory("");
    setEditingId(null);
    setEditingIndex(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };
const handleDeleteExpense = async (
  expenseId: number
) => {
  try {
    console.log("Deleting ID:", expenseId);
    const response = await fetch(
      `/api/expenses/${expenseId}`,
      {
        method: "DELETE",
      }
    );

    console.log("STATUS:", response.status);

    const data = await response.json();
    console.log("DATA:", data);

    if (!response.ok) {
      throw new Error(
        data.error || "Failed to delete expense"
      );
    }

    setExpenses((prev) =>
      prev.filter(
        (expense) =>
          expense.id !== expenseId
      )
    );
  } catch (error) {
    console.error(error);
  }
};
  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) => {
        const formattedExpenses = data.map(
          (expense: any) => ({
            id: expense.id,
            title: expense.description,
            category: expense.category?.name || "Unknown",
            amount: Number(expense.amount) || 0,
            date: expense.expense_date.split("T")[0],
            status: "Approved",
            notes: expense.notes || "",
            attachment_url: expense.attachment_url || "",
            created_by: expense.created_by || 1,
          })
        );

        setExpenses(formattedExpenses);
        setCategories((prevCategories) =>
          Array.from(
            new Set([
              ...defaultCategories,
              ...formattedExpenses.map((expense: ExpenseItem) => expense.category),
            ])
          )
        );
      })
      .catch((error) => {
        console.error("Failed to load expenses:", error);
      });
  }, []);

  const handleAddExpense = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const finalCategory =
      category === "Other"
        ? customCategory.trim() || "Other"
        : category;

    if (!title || !amount || !date) return;

    const payload = {
      description: title,
      amount,
      date,
      notes: description,
      category: finalCategory,
    };

    if (editingId !== null) {
      const response = await fetch(
        `/api/expenses/${editingId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        console.error("Failed to update expense");
        return;
      }

      const updatedExpense = await response.json();
      const updatedRecord = {
        id: updatedExpense.id,
        title: updatedExpense.description,
        category: updatedExpense.category?.name || finalCategory,
        amount: Number(updatedExpense.amount) || 0,
        date: updatedExpense.expense_date.split("T")[0],
        status: "Approved",
        notes: updatedExpense.notes || "",
        attachment_url: updatedExpense.attachment_url || "",
        created_by: updatedExpense.created_by || 1,
      };

      setExpenses((current) =>
        current.map((expense) =>
          expense.id === updatedRecord.id
            ? updatedRecord
            : expense
        )
      );
      setCategories((prev) =>
        Array.from(new Set([...prev, finalCategory]))
      );
      closeModal();
      return;
    }

    const response = await fetch(
      "/api/expenses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      console.error("Failed to save expense");
      return;
    }

    const savedExpense = await response.json();
    const newExpense: ExpenseItem = {
      id: savedExpense.id,
      title: savedExpense.description,
      category: savedExpense.category?.name || finalCategory,
      amount: Number(savedExpense.amount) || 0,
      date: savedExpense.expense_date.split("T")[0],
      status: "Approved",
      notes: savedExpense.notes || "",
      attachment_url: savedExpense.attachment_url || "",
      created_by: savedExpense.created_by || 1,
    };

    setExpenses((current) => [newExpense, ...current]);
    setCategories((prev) =>
      Array.from(new Set([...prev, finalCategory]))
    );
    closeModal();
  };
  const filteredExpenses = expenses.filter(
  (expense) => {
    const matchesSearch =
      expense.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      expense.category
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||

      String(expense.amount)
        .includes(searchTerm) ||

      expense.date
        ?.includes(searchTerm);

    const matchesCategory =
      selectedCategory === "All" ||
      expense.category === selectedCategory;

    const matchesDate =
  !selectedDate ||
  expense.date ===
    selectedDate.toISOString().split("T")[0];
   

    return (
      matchesSearch &&
      matchesCategory &&
      matchesDate
    );
  }
);

  const totalExpenses = filteredExpenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );

  const highestExpense =
    filteredExpenses.length > 0
      ? Math.max(
        ...filteredExpenses.map((e) =>
          Number(e.amount || 0)
        )
      )
      : 0;

  const totalCount = filteredExpenses.length;
  const categoryCount = new Set(
    filteredExpenses.map((expense) => expense.category)
  ).size;

  if (isViewMode && viewExpense) {
    return (
      <div className="min-h-screen bg-[#020817] text-white flex overflow-hidden">
        {/* Glow Effects */}
        <div className="fixed top-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />
        <div className="fixed bottom-[-200px] left-[-100px] w-[400px] h-[400px] bg-indigo-500/20 blur-[140px] rounded-full pointer-events-none" />

        <Sidebar />

        <main className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
              <button
                onClick={() => {
                  setIsViewMode(false);
                  setViewExpense(null);
                }}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
              >
                <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
                <span className="font-medium">Back</span>
              </button>
              <h1 className="text-2xl font-bold text-white tracking-wide">Expense Details</h1>
              <div className="w-16"></div> {/* Spacer for alignment */}
            </div>

            {/* Main Content Card */}
            <div className="bg-[#071028]/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-8">
              
              {/* Expense Information */}
              <div>
                <h2 className="text-lg font-semibold text-slate-300 mb-4 tracking-wider uppercase text-xs">Expense Information</h2>
                <div className="border-t border-dashed border-slate-800 pt-4 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-sm">Expense ID</span>
                    <span className="text-white font-mono font-semibold mt-1">
                      EXP-{viewExpense.id.toString().padStart(3, '0')}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-sm">Title</span>
                    <span className="text-white font-medium mt-1">{viewExpense.title}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-sm">Category</span>
                    <span className="text-white font-medium mt-1">{viewExpense.category}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-sm">Amount</span>
                    <span className="text-emerald-400 font-semibold mt-1 text-lg">
                      ₹{new Intl.NumberFormat('en-IN').format(viewExpense.amount)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-sm">Date</span>
                    <span className="text-white font-medium mt-1">
                      {new Date(viewExpense.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-slate-400 text-sm">Status</span>
                    <span className="mt-1">
                      <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/20">
                        {viewExpense.status || "Approved"}
                      </span>
                    </span>
                  </div>
                
            
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-slate-300 mb-4 tracking-wider uppercase text-xs">Description</h2>
                <div className="border-t border-dashed border-slate-800 pt-4">
                  <p className="text-slate-300 leading-relaxed bg-[#020817]/50 rounded-xl p-4 border border-slate-900">
                    {viewExpense.notes || "No description provided."}
                  </p>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <h2 className="text-lg font-semibold text-slate-300 mb-4 tracking-wider uppercase text-xs">Attachments</h2>
                <div className="border-t border-dashed border-slate-800 pt-4">
                  <div className="flex items-center gap-3 bg-[#020817]/50 rounded-xl p-4 border border-slate-900 group hover:border-blue-500/30 transition cursor-pointer">
                    <div className="p-2 bg-blue-600/10 rounded-lg text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-paperclip"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-200 truncate">
                        {viewExpense.attachment_url ? viewExpense.attachment_url.split('/').pop() : "Invoice.pdf"}
                      </p>
                      <p className="text-xs text-slate-500">PDF Document</p>
                    </div>
                    {viewExpense.attachment_url ? (
                      <a
                        href={viewExpense.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium transition px-3 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-slate-500 text-sm font-medium px-3 py-1 bg-slate-500/10 rounded-lg border border-slate-500/20">
                        Placeholder
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-dashed border-slate-800 pt-6 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setIsViewMode(false);
                    setEditingId(viewExpense.id);
                    setTitle(viewExpense.title);
                    setAmount(viewExpense.amount.toString());
                    setCategory(viewExpense.category);
                    setDate(viewExpense.date);
                    setDescription(viewExpense.notes || "");
                    const index = expenses.findIndex((e) => e.id === viewExpense.id);
                    setEditingIndex(index !== -1 ? index : null);
                    setViewExpense(null);
                    setShowModal(true);
                  }}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 rounded-xl font-medium transition flex items-center gap-2 shadow-lg shadow-yellow-600/10"
                >
                  Edit
                </button>
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this expense?")) {
                      await handleDeleteExpense(viewExpense.id);
                      setViewExpense(null);
                      setIsViewMode(false);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-medium transition flex items-center gap-2 shadow-lg shadow-red-600/10"
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020817] text-white flex overflow-hidden">
      <div className="fixed top-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="fixed bottom-[-200px] left-[-100px] w-[400px] h-[400px] bg-indigo-500/20 blur-[140px] rounded-full pointer-events-none" />

      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-10">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold text-white">Expenses</h1>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-400 text-sm font-semibold">
                  +15.3% this month
                </span>
                <span className="text-slate-400 text-sm">Updated just now</span>
              </div>
              <p className="text-slate-400 mt-2 max-w-2xl">
                Organize expenses, review category spend, and manage cash flow from a single dashboard.
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium transition"
            >
              + Add Expense
            </button>
          </div>

          <div className="grid gap-6 xl:grid-cols-[2fr_420px] mb-8">

  {/* Left Side - Chart */}
  <ExpenseChart expenses={filteredExpenses} />

  {/* Right Side - Summary */}
  <ExpenseStats
    totalExpenses={totalExpenses}
    totalCount={totalCount}
    highestExpense={highestExpense}
    categoryCount={categoryCount}
  />

</div>


          <ExpenseFilters
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  selectedCategory={selectedCategory}
  setSelectedCategory={setSelectedCategory}
  categories={categories}
  selectedDate={selectedDate}
  setSelectedDate={setSelectedDate}
/>

          <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Recent Expenses</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left py-4 text-gray-400">Expense</th>
                    <th className="text-left py-4 text-gray-400">Category</th>
                    <th className="text-left py-4 text-gray-400">Amount</th>
                    <th className="text-left py-4 text-gray-400">Date</th>
                    <th className="text-left py-4 text-gray-400">Status</th>
                    <th className="text-left py-4 text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.map((expense, index) => (
                    <tr key={expense.id} className="border-b border-slate-800">
                      <td className="py-4 text-white">{expense.title}</td>
                      <td className="py-4 text-gray-300">{expense.category}</td>
                      <td className="py-4 text-red-400">₹{expense.amount}</td>
                      <td className="py-4 text-gray-300">{expense.date}</td>
                      <td className="py-4">
                        <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
                          {expense.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
  setIsViewMode(false);
  setEditingIndex(index);
  setEditingId(expense.id);
  setTitle(expense.title);
  setAmount(expense.amount.toString());
  setCategory(expense.category);
  setDate(expense.date);
  setDescription(expense.notes || "");
  setShowModal(true);
}}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-lg"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg"
                          >
                            Delete
                          </button>
                          {/* View Button */}
                          <button
                            onClick={() => handleViewExpense(expense.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg"
                          >
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
              <div className="bg-[#071028] border border-slate-800 rounded-2xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {isViewMode
                      ? "View Expense"
                      : editingIndex !== null
                        ? "Edit Expense"
                        : "Add Expense"}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>
                <form onSubmit={handleAddExpense} className="space-y-4">

                  <input
                    type="text"
                    placeholder="Expense Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isViewMode}
                    className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white disabled:opacity-50"
                  />

                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={isViewMode}
                    className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white disabled:opacity-50"
                  />

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={isViewMode}
                    className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white disabled:opacity-50"
                  >
                    {categories.map((categoryOption) => (
                      <option key={categoryOption} value={categoryOption}>
                        {categoryOption}
                      </option>
                    ))}
                    {!categories.includes("Other") && <option value="Other">Other</option>}
                  </select>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    disabled={isViewMode}
                    className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white disabled:opacity-50"
                  />

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                    rows={3}
                    disabled={isViewMode}
                    className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white disabled:opacity-50"
                  />

                  {category === "Other" && (
                    <input
                      type="text"
                      placeholder="Custom category"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      disabled={isViewMode}
                      className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white disabled:opacity-50"
                    />
                  )}

                  {/* SAVE BUTTON (hide in view mode) */}
                  {!isViewMode && (
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl"
                    >
                      Save Expense
                    </button>
                  )}

                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}