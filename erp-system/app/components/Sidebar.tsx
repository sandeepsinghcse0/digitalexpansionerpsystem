"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  BarChart3,
  Wallet,
  Truck,
  PlusCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const [inventoryOpen, setInventoryOpen] = useState(
    pathname.startsWith("/inventory")
  );

  const menuItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Expenses",
      href: "/expenses",
      icon: Wallet,
    },
    {
      name: "Customers",
      href: "/customers",
      icon: Users,
    },
    {
      name: "Invoices",
      href: "/invoices",
      icon: FileText,
    },
    {
      name: "Reports",
      href: "/reports",
      icon: BarChart3,
    },
  ];

  return (
    <aside className="w-[330px] min-h-screen bg-[#071028] border-r border-slate-800 p-8">
      {/* Logo */}
      <div className="mb-14">
        <h1 className="text-3xl font-bold text-white">
          Digital Expansion
        </h1>

        <p className="text-slate-400 text-base mt-2">
          ERP Management System
        </p>
      </div>

      {/* Main Navigation */}
      <div className="space-y-3">
        {menuItems.map((item) => {
          const Icon = item.icon;

          const active =
            pathname === item.href ||
            pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
                active
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}

        {/* Inventory Dropdown */}
        <div>
          <button
            onClick={() =>
              setInventoryOpen(!inventoryOpen)
            }
            className={`w-full flex items-center justify-between px-5 py-4 rounded-xl text-base font-medium transition-all duration-200 ${
              pathname.startsWith("/inventory")
                ? "bg-blue-600 text-white shadow-lg"
                : "text-slate-300 hover:text-white hover:bg-slate-800"
            }`}
          >
            <div className="flex items-center gap-4">
              <Package size={20} />
              <span>Inventory</span>
            </div>

            {inventoryOpen ? (
              <ChevronDown size={18} />
            ) : (
              <ChevronRight size={18} />
            )}
          </button>

          {inventoryOpen && (
            <div className="ml-8 mt-3 border-l border-slate-700 pl-5 space-y-2">

              <Link
                href="/inventory"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  pathname === "/inventory"
                    ? "bg-blue-500 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Package size={16} />
                Products
              </Link>

              <Link
                href="/inventory/suppliers"
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all ${
                  pathname.startsWith(
                    "/inventory/suppliers"
                  )
                    ? "bg-blue-500 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Truck size={16} />
                Suppliers
              </Link>

            </div>
          )}
        </div>
      </div>
    </aside>
  );
}