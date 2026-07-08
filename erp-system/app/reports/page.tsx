"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportStats {
  revenue: number;
  expenses: number;
  profit: number;
  invoices: number;
  customers: number;
  inventory: number;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStats>({
    revenue: 0,
    expenses: 0,
    profit: 0,
    invoices: 0,
    customers: 0,
    inventory: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports");

      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }

      const data = await response.json();

      setStats({
        revenue: data.revenue || 0,
        expenses: data.expenses || 0,
        profit: data.profit || 0,
        invoices: data.invoices || 0,
        customers: data.customers || 0,
        inventory: data.inventory || 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("ERP BUSINESS REPORT", 14, 20);

    doc.setFontSize(11);
    doc.text(
      `Generated On: ${new Date().toLocaleString()}`,
      14,
      30
    );

    autoTable(doc, {
      startY: 40,
      head: [["Metric", "Value"]],
      body: [
        ["Revenue", `₹${stats.revenue.toLocaleString()}`],
        ["Expenses", `₹${stats.expenses.toLocaleString()}`],
        ["Profit", `₹${stats.profit.toLocaleString()}`],
        ["Invoices", stats.invoices],
        ["Customers", stats.customers],
        ["Inventory Items", stats.inventory],
      ],
    });

    doc.save(`ERP_Report_${Date.now()}.pdf`);
  };

  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading Reports...
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold">
            Reports Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Business Analytics & Reports
          </p>
        </div>

        <button
          onClick={generateReport}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-medium transition-all"
        >
          Generate Report
        </button>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">Revenue</p>

          <h2 className="text-5xl font-bold text-green-400 mt-2">
            ₹{stats.revenue.toLocaleString()}
          </h2>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">Expenses</p>

          <h2 className="text-5xl font-bold text-red-400 mt-2">
            ₹{stats.expenses.toLocaleString()}
          </h2>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">Profit</p>

          <h2 className="text-5xl font-bold text-blue-400 mt-2">
            ₹{stats.profit.toLocaleString()}
          </h2>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Total Invoices
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.invoices}
          </h2>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Total Customers
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.customers}
          </h2>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <p className="text-slate-400">
            Inventory Items
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {stats.inventory}
          </h2>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-[#071028] border border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-semibold">
            Reports
          </h2>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4">
                Report Name
              </th>

              <th className="text-left p-4">
                Generated
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="p-4">
                ERP Business Report
              </td>

              <td className="p-4">
                {new Date().toLocaleDateString()}
              </td>

              <td className="p-4">
                <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                  Ready
                </span>
              </td>

              <td className="p-4">
                <button
                  onClick={generateReport}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}