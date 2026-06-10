"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
export default function ExpensesPage() {
const [showModal, setShowModal] = useState(false);
  return (
    <div className="flex min-h-screen bg-[#020817]">
      <Sidebar />

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
              value: "₹45,000",
            },
            {
              title: "This Month",
              value: "₹12,000",
            },
            {
              title: "Today",
              value: "₹1,200",
            },
            {
              title: "Highest Expense",
              value: "₹5,500",
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
        {/* Recent Expenses Table */}
<div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-xl font-semibold text-white">
      Recent Expenses
    </h2>
  </div>

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
        </tr>
      </thead>

      <tbody>
        <tr className="border-b border-slate-800">
          <td className="py-4 text-white">
            Internet Bill
          </td>

          <td className="py-4 text-gray-300">
            Utilities
          </td>

          <td className="py-4 text-red-400">
            ₹1,200
          </td>

          <td className="py-4 text-gray-300">
            10 Jun 2026
          </td>

          <td className="py-4">
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
              Paid
            </span>
          </td>
        </tr>

        <tr className="border-b border-slate-800">
          <td className="py-4 text-white">
            Google Ads
          </td>

          <td className="py-4 text-gray-300">
            Marketing
          </td>

          <td className="py-4 text-red-400">
            ₹5,000
          </td>

          <td className="py-4 text-gray-300">
            08 Jun 2026
          </td>

          <td className="py-4">
            <span className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-sm">
              Pending
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
{showModal && (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
    <div className="bg-[#071028] border border-slate-800 rounded-2xl p-8 w-full max-w-md">

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Add Expense
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <form className="space-y-4">

        <input
          type="text"
          placeholder="Expense Title"
          className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white"
        />

        <input
          type="number"
          placeholder="Amount"
          className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white"
        />

        <select
          className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white"
        >
          <option>Utilities</option>
          <option>Marketing</option>
          <option>Travel</option>
          <option>Office Supplies</option>
        </select>

        <input
          type="date"
          className="w-full bg-[#020817] border border-slate-700 rounded-xl px-4 py-3 text-white"
        />

        <textarea
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