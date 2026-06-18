"use client";

import { Pencil, Trash2 } from "lucide-react";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  gstNumber: string;
};

type CustomerTableProps = {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
};

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  return (
    <div className="overflow-x-auto bg-[#0f172a] rounded-xl">
      <table className="w-full min-w-160 border-collapse">
        <thead>
          <tr className="border-b border-gray-700 bg-slate-900 text-slate-300">
            <th className="p-4 text-left text-sm">Name</th>
            <th className="p-4 text-left text-sm">Email</th>
            <th className="p-4 text-left text-sm">Phone</th>
            <th className="p-4 text-left text-sm">City</th>
            <th className="p-4 text-left text-sm">Status</th>
            <th className="p-4 text-left text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                No customers found.
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id} className="border-b border-gray-800 text-slate-200 hover:bg-slate-900">
                <td className="p-4 font-medium text-white">{customer.name}</td>
                <td className="p-4">{customer.email}</td>
                <td className="p-4">{customer.phone}</td>
                <td className="p-4">{customer.city}</td>
                <td className="p-4">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
                    {customer.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(customer)}
                    className="rounded-lg bg-yellow-600 px-3 py-1 text-sm font-medium text-slate-950 hover:bg-yellow-500"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(customer.id)}
                    className="rounded-lg bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

