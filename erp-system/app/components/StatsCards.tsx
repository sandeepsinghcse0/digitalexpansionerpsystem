"use client";

import {
  Users,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface StatsCardsProps {
  totalCustomers?: number;
  activeCustomers?: number;
}

export default function StatsCards({
  totalCustomers = 0,
  activeCustomers = 0,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Total Customers",
      value: totalCustomers.toString(),
      icon: Users,
    },
    {
      title: "Active Customers",
      value: activeCustomers.toString(),
      icon: CheckCircle,
    },
    {
      title: "Pending Review",
      value: "0",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className="rounded-3xl border border-slate-800 bg-[#071028] p-8 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-slate-400">
                {item.title}
              </h2>

              <Icon className="text-blue-400" size={24} />
            </div>

            <p className="mt-6 text-4xl font-bold text-white">
              {item.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}