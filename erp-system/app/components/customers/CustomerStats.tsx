"use client";

import { Users, CheckCircle, Ban, AlertTriangle } from "lucide-react";
import { Customer } from "./types";

interface CustomerStatsProps {
  customers: Customer[];
}

export default function CustomerStats({ customers }: CustomerStatsProps) {
  const total = customers.length;
  const active = customers.filter((c) => c.status === "Active").length;
  const inactive = customers.filter((c) => c.status === "Inactive").length;
  const suspended = customers.filter((c) => c.status === "Suspended").length;

  const stats = [
    {
      title: "Total Customers",
      value: total,
      icon: Users,
      color: "from-blue-600/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
      bgHover: "hover:border-blue-500/50 hover:shadow-blue-500/10",
    },
    {
      title: "Active Customers",
      value: active,
      icon: CheckCircle,
      color: "from-emerald-600/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
      bgHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    },
    {
      title: "Inactive Customers",
      value: inactive,
      icon: AlertTriangle,
      color: "from-amber-600/20 to-yellow-500/20 border-amber-500/30 text-amber-400",
      bgHover: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    },
    {
      title: "Suspended Customers",
      value: suspended,
      icon: Ban,
      color: "from-rose-600/20 to-red-500/20 border-rose-500/30 text-rose-400",
      bgHover: "hover:border-rose-500/50 hover:shadow-rose-500/10",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-2xl border bg-slate-950/40 p-6 backdrop-blur-md shadow-xl transition-all duration-300 ${item.color} ${item.bgHover}`}
          >
            {/* Glow design element */}
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-current opacity-10 blur-xl transition-all duration-500 group-hover:scale-150" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                {item.title}
              </span>
              <div className="rounded-xl bg-slate-900/80 p-2.5">
                <Icon size={20} />
              </div>
            </div>
            
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {item.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
