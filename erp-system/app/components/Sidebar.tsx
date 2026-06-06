"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
LayoutDashboard,
FileText,
CreditCard,
Users,
Package,
BarChart3,
} from "lucide-react";

export default function Sidebar() {
const pathname = usePathname();

const menuItems = [
{
name: "Dashboard",
href: "/dashboard",
icon: LayoutDashboard,
},
{
name: "Customers",
href: "/dashboard/customers",
icon: Users,
},
{
name: "Inventory",
href: "/dashboard/inventory",
icon: Package,
},
{
name: "Invoices",
href: "/dashboard/invoices",
icon: FileText,
},
{
name: "Expenses",
href: "/dashboard/expenses",
icon: CreditCard,
},
{
name: "Reports",
href: "/dashboard/reports",
icon: BarChart3,
},
];

return ( <aside className="w-[280px] min-h-screen bg-[#071028] border-r border-slate-800 p-8">
  {/* Logo */}
  <div className="mb-16">
    <h1 className="text-2xl font-bold text-white">
      Digital Expansion
    </h1>

    <p className="text-slate-400 text-sm mt-1">
      ERP Management System
    </p>
  </div>

  {/* Navigation */}
  <div className="space-y-4">
    {menuItems.map((item) => {
      const Icon = item.icon;

      const active =
        pathname === item.href ||
        pathname.startsWith(item.href + "/");

      return (
        <Link
          key={item.name}
          href={item.href}
          className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-lg font-medium transition-all duration-200 ${
            active
              ? "bg-blue-600 text-white shadow-lg"
              : "text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Icon size={22} />
          <span>{item.name}</span>
        </Link>
      );
    })}
  </div>

  {/* Bottom Section */}
  <div className="absolute bottom-8 left-8 right-8">
    <div className="border-t border-slate-800 pt-6">
      <button className="w-full text-left text-slate-400 hover:text-white transition">
        ⚙️ Settings
      </button>

      <button className="w-full text-left text-red-400 hover:text-red-300 transition mt-4">
        🚪 Logout
      </button>
    </div>
  </div>
</aside>

);
}
