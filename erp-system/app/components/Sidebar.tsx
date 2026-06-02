"use client";

import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const router = useRouter();

  return (
    <div className="w-72 min-h-screen bg-[#071028] border-r border-slate-800 p-8">
      <h1 className="text-3xl font-bold text-white mb-14">
        Digital Expansion
      </h1>

      <div className="space-y-5">

        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-4 text-slate-300 hover:text-white text-lg"
        >
          <LayoutDashboard size={22} />
          Dashboard
        </button>

        <button
          onClick={() => router.push("/invoices")}
          className="flex items-center gap-4 text-white bg-blue-600 px-5 py-4 rounded-2xl w-full text-lg font-medium shadow-lg"
        >
          <FileText size={22} />
          Invoice
        </button>

        <button
          className="flex items-center gap-4 text-slate-300 hover:text-white text-lg"
        >
          <CreditCard size={22} />
          Payments
        </button>

        <button
          className="flex items-center gap-4 text-slate-300 hover:text-white text-lg"
        >
          <Settings size={22} />
          Settings
        </button>

      </div>
    </div>
  );
}