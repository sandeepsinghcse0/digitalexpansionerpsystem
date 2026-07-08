"use client";

import { Customer } from "./types";
import CustomerForm from "./CustomerForm";

interface CustomerAddEditModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  editingCustomer: Customer | null;
}

export default function CustomerAddEditModal({
  open,
  onClose,
  onSave,
  editingCustomer,
}: CustomerAddEditModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-[#071028]/95 p-6 md:p-8 shadow-2xl backdrop-blur-lg scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
        {/* Decorative background glow inside modal */}
        <div className="absolute right-0 top-0 -z-10 h-32 w-32 rounded-full bg-blue-500/10 blur-2xl" />
        <div className="absolute left-0 bottom-0 -z-10 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-350 bg-clip-text text-transparent">
            {editingCustomer ? "Edit Customer Details" : "Add New Customer"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-xl border border-slate-900 bg-slate-950/40 p-2 text-slate-400 transition hover:border-slate-800 hover:text-white cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <CustomerForm
          initialData={editingCustomer}
          onSave={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
}
