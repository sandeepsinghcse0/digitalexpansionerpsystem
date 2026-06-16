"use client";

import { Pencil, Trash2 } from "lucide-react";

interface Customer {
type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  gstNumber: string;
}

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}
};

type Props = {
  customers: Customer[];
  onEdit: (
    customer: Customer
  ) => void;
  onDelete: (
    id: number
  ) => void;
};

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#071028]">
      <table className="min-w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/70 text-slate-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Phone</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
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
              <tr key={customer.id} className="border-t border-slate-800">
                <td className="px-4 py-3 font-medium text-white">{customer.name}</td>
                <td className="px-4 py-3">{customer.email}</td>
                <td className="px-4 py-3">{customer.phone}</td>
                <td className="px-4 py-3">{customer.city}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-200">
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(customer)}
                      className="rounded-lg bg-slate-800 p-2 text-slate-300 hover:text-white"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(customer.id)}
                      className="rounded-lg bg-slate-800 p-2 text-red-400 hover:text-red-300"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
}: Props) {
  return (
    <div className="overflow-x-auto bg-[#0f172a] rounded-xl">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-4 text-left">
              Name
            </th>
            <th className="p-4 text-left">
              Email
            </th>
            <th className="p-4 text-left">
              Phone
            </th>
            <th className="p-4 text-left">
              Status
            </th>
            <th className="p-4 text-left">
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {customers.map(
            (customer) => (
              <tr
                key={customer.id}
                className="border-b border-gray-800"
              >
                <td className="p-4">
                  {customer.name}
                </td>

                <td className="p-4">
                  {customer.email}
                </td>

                <td className="p-4">
                  {customer.phone}
                </td>

                <td className="p-4">
                  {customer.status}
                </td>

                <td className="p-4 flex gap-2">
                  <button
                    onClick={() =>
                      onEdit(
                        customer
                      )
                    }
                    className="bg-yellow-600 px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      onDelete(
                        customer.id
                      )
                    }
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
}
