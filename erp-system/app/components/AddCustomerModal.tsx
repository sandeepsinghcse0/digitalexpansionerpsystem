"use client";

import { useEffect, useState } from "react";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  gstNumber: string;
}

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  editingCustomer: Customer | null;
}

const emptyCustomer = {
  id: 0,
  name: "",
  email: "",
  phone: "",
  city: "",
  status: "Active",
  gstNumber: "",
type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (customer: any) => void;
  editingCustomer: any;
};

export default function AddCustomerModal({
  open,
  onClose,
  onSave,
  editingCustomer,
}: AddCustomerModalProps) {
  const [form, setForm] = useState<Customer>(emptyCustomer);

  useEffect(() => {
    if (editingCustomer) {
      setForm(editingCustomer);
    } else {
      setForm(emptyCustomer);
    }
  }, [editingCustomer, open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-[#071028] p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            {editingCustomer ? "Edit Customer" : "Add Customer"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-white"
            placeholder="Customer name"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-white"
            placeholder="Email"
          />
          <input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-white"
            placeholder="Phone"
          />
          <input
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-white"
            placeholder="City"
          />
          <input
            value={form.gstNumber}
            onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-white"
            placeholder="GST Number"
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-700 px-4 py-2 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-[#0f172a] p-6 rounded-xl w-[500px]">
        <h2 className="text-2xl font-bold mb-4">
          Add Customer
        </h2>

        <p>
          Customer form coming
          next.
        </p>

        <button
          onClick={onClose}
          className="mt-4 bg-red-600 px-4 py-2 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}
