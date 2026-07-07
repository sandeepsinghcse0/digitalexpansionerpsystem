"use client";

import { Pencil, Trash2, Mail, Phone, MapPin, FileText } from "lucide-react";
import { Customer } from "./types";

interface CustomerTableProps {
  customers: Customer[];
  onEdit: (customer: Customer) => void;
  onDelete: (id: number) => void;
}

export default function CustomerTable({
  customers,
  onEdit,
  onDelete,
}: CustomerTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case "Inactive":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "Suspended":
        return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border border-slate-500/20";
    }
  };

  return (
    <div className="overflow-hidden border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-2xl shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-950/60 text-slate-400">
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Customer Details</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Contact Info</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">City</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">GST Details</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                  No customers found matching search criteria.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="text-slate-350 transition-colors duration-150 hover:bg-slate-900/30"
                >
                  <td className="p-4">
                    <div className="font-semibold text-white text-sm">
                      {customer.name}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col gap-1 text-xs">
                      {customer.email && (
                        <div className="flex items-center gap-1.5 text-slate-350">
                          <Mail size={12} className="text-slate-500" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-1.5 text-slate-350">
                          <Phone size={12} className="text-slate-500" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-300">
                      <MapPin size={14} className="text-slate-500" />
                      <span>{customer.city || "N/A"}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-sm">
                      <FileText size={14} className="text-slate-500" />
                      <span className="font-mono text-xs text-slate-300">
                        {customer.gstNumber || "N/A"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide ${getStatusBadge(customer.status)}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(customer)}
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-amber-400 transition hover:border-amber-500/30 hover:bg-slate-800 hover:text-amber-300 cursor-pointer"
                        title="Edit Customer"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(customer.id)}
                        className="rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-rose-400 transition hover:border-rose-500/30 hover:bg-slate-800 hover:text-rose-350 cursor-pointer"
                        title="Delete Customer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
