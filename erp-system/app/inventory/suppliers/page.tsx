"use client";

import Link from "next/link";

export default function SuppliersPage() {
  const suppliers = [
    {
      id: 1,
      name: "ABC Electronics",
      email: "abc@gmail.com",
      phone: "+91 9876543210",
      status: "Active",
    },
    {
      id: 2,
      name: "Tech Distributors",
      email: "tech@gmail.com",
      phone: "+91 9876543211",
      status: "Active",
    },
  ];

  return (
    <div className="p-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Supplier Management
          </h1>

          <p className="text-slate-400 mt-2">
            Manage suppliers
          </p>
        </div>

        <Link
          href="/inventory/suppliers/add"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-medium"
        >
          + Add Supplier
        </Link>
      </div>

      {/* Inventory Tabs */}
      <div className="flex gap-4 mb-8">
        <Link
          href="/inventory"
          className="bg-[#071028] border border-slate-800 px-5 py-3 rounded-xl font-medium hover:bg-slate-800"
        >
          Products
        </Link>

        <Link
          href="/inventory/suppliers"
          className="bg-blue-600 px-5 py-3 rounded-xl font-medium"
        >
          Suppliers
        </Link>
      </div>

      {/* Supplier Table */}
      <div className="bg-[#071028] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Phone</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr
                key={supplier.id}
                className="border-b border-slate-800"
              >
                <td className="p-4">
                  {supplier.id}
                </td>

                <td className="p-4">
                  {supplier.name}
                </td>

                <td className="p-4">
                  {supplier.email}
                </td>

                <td className="p-4">
                  {supplier.phone}
                </td>

                <td className="p-4">
                  <span className="bg-green-600 px-3 py-1 rounded-full text-sm">
                    {supplier.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}