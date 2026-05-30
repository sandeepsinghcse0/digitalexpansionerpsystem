"use client";

import {
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

const stats = [
  {
    title: "Revenue",
    value: "₹1,24,500",
    icon: DollarSign,
  },
  {
    title: "Invoices",
    value: "28",
    icon: FileText,
  },
  {
    title: "Pending",
    value: "5",
    icon: AlertTriangle,
  },
  {
    title: "Paid",
    value: "23",
    icon: CheckCircle,
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-10">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="bg-[#071028] p-8 rounded-3xl border border-slate-800 shadow-xl"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-slate-400 text-lg">
                {item.title}
              </h2>

              <Icon className="text-blue-400" size={24} />
            </div>

            <p className="text-4xl font-bold text-white mt-6">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}