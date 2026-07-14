
import { prisma } from "@/lib/db/prisma";
import Link from "next/link";

export default async function DashboardPage() {

  const totalCustomers = await prisma.customer.count();

  const totalInvoices = await prisma.invoice.count();

  const revenue = await prisma.invoice.aggregate({
    _sum: {
      total_amount: true,
    },
  });

  const paidInvoices = await prisma.invoice.count({
    where: {
      status: "PAID" as any,
    },
  });

  const recentCustomers = await prisma.customer.findMany({
    take: 5,
    orderBy: {
      created_at: "desc",
    },
  });

  const latestInvoices = await prisma.invoice.findMany({
    take: 5,
    orderBy: {
      created_at: "desc",
    },
    include: {
      customer: true,
    },
  });

  const stats = [
    {
      title: "Customers",
      value: totalCustomers,
      icon: "👥",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Invoices",
      value: totalInvoices,
      icon: "🧾",
      color: "from-purple-500 to-indigo-500",
    },
    {
      title: "Revenue",
      value: `₹${revenue._sum.total_amount || 0}`,
      icon: "💰",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Paid",
      value: paidInvoices,
      icon: "✅",
      color: "from-yellow-500 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#050816] text-white p-8">
      {/* Welcome Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Welcome Back 👋
        </h1>

        <p className="text-slate-400 mt-2">
          {"Here's what's happening in your business today."}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((item) => (
          <div
            key={item.title}
            className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6"
          >
            <div
              className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${item.color} opacity-20 blur-3xl`}
            />

            <div className="relative">
              <div className="text-3xl mb-3">
                {item.icon}
              </div>

              <h3 className="text-slate-400 text-sm">
                {item.title}
              </h3>

              <p className="text-4xl font-bold mt-2">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            href="/inventory/suppliers/add"
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-blue-500 transition"
          >
            👥 Add Customer
          </Link>

          <Link
            href="/inventory/add"
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-purple-500 transition"
          >
            📦 Add Product
          </Link>

          <Link
            href="/dashboard/invoices"
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-green-500 transition"
          >
            🧾 Create Invoice
          </Link>

          <Link
            href="/dashboard/expenses"
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-red-500 transition"
          >
            💳 Add Expense
          </Link>
        </div>
      </div>

      {/* Analytics Placeholder */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Revenue Analytics
          </h2>

          <div className="space-y-3">
            <div className="space-y-3">
              {latestInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="border-b border-slate-800 pb-2"
                >
                  <p className="font-medium">
                    {invoice.invoice_number}
                  </p>

                  <p className="text-sm text-slate-400">
                    {invoice.customer.name}
                  </p>

                  <p className="text-green-400">
                    ₹{invoice.total_amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">
            Recent Activity
          </h2>

          <div className="space-y-3">
            <div className="space-y-3">
              {recentCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="border-b border-slate-800 pb-2"
                >
                  <p className="text-white">
                    {customer.name}
                  </p>

                  <p className="text-xs text-slate-500">
                    New customer added
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}