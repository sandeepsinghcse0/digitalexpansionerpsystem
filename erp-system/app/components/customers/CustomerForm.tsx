"use client";

import { useEffect, useState } from "react";
import { Customer } from "./types";

interface CustomerFormProps {
  initialData: Customer | null;
  onSave: (customer: Customer) => void;
  onCancel: () => void;
}

const emptyCustomer: Customer = {
  id: 0,
  name: "",
  email: "",
  phone: "",
  city: "",
  status: "Active",
  gstNumber: "",
};

export default function CustomerForm({
  initialData,
  onSave,
  onCancel,
}: CustomerFormProps) {
  const [form, setForm] = useState<Customer>(emptyCustomer);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm(emptyCustomer);
    }
    setErrors({});
  }, [initialData]);

  // Strip non-digits and cap at 10 characters for phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setForm({ ...form, phone: value });
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: "" }));
      }
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Customer name is required.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address (e.g. name@example.com).";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (form.phone.length !== 10) {
      newErrors.phone = "Phone number must be exactly 10 digits.";
    }

    if (!form.city.trim()) {
      newErrors.city = "City is required.";
    }

    // GST is optional. If entered, check length is 15
    if (form.gstNumber.trim() && form.gstNumber.trim().length !== 15) {
      newErrors.gstNumber = "GST number must be exactly 15 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(form);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name Field */}
      <div>
        <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Customer Name
        </label>
        <input
          id="name"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
          }}
          className={`w-full rounded-xl border bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
            errors.name ? "border-rose-500/50 focus:border-rose-500" : "border-slate-800 focus:border-blue-500"
          }`}
          placeholder="e.g. John Doe Acme Corp"
        />
        {errors.name && <p className="mt-1.5 text-xs text-rose-400">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div>
        <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Email Address
        </label>
        <input
          id="email"
          type="text"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
          }}
          className={`w-full rounded-xl border bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
            errors.email ? "border-rose-500/50 focus:border-rose-500" : "border-slate-800 focus:border-blue-500"
          }`}
          placeholder="e.g. contact@johncompany.com"
        />
        {errors.email && <p className="mt-1.5 text-xs text-rose-400">{errors.email}</p>}
      </div>

      {/* Phone Field */}
      <div>
        <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Phone Number
        </label>
        <input
          id="phone"
          value={form.phone}
          onChange={handlePhoneChange}
          className={`w-full rounded-xl border bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
            errors.phone ? "border-rose-500/50 focus:border-rose-500" : "border-slate-800 focus:border-blue-500"
          }`}
          placeholder="e.g. 9876543210 (10 digits)"
        />
        {errors.phone && <p className="mt-1.5 text-xs text-rose-400">{errors.phone}</p>}
      </div>

      {/* City Field */}
      <div>
        <label htmlFor="city" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          City
        </label>
        <input
          id="city"
          value={form.city}
          onChange={(e) => {
            setForm({ ...form, city: e.target.value });
            if (errors.city) setErrors((prev) => ({ ...prev, city: "" }));
          }}
          className={`w-full rounded-xl border bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
            errors.city ? "border-rose-500/50 focus:border-rose-500" : "border-slate-800 focus:border-blue-500"
          }`}
          placeholder="e.g. Mumbai, New Delhi"
        />
        {errors.city && <p className="mt-1.5 text-xs text-rose-400">{errors.city}</p>}
      </div>

      {/* GST Number (Optional but '*' shown above it) */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="gstNumber" className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            GST Number <span className="text-rose-500 font-bold text-sm">*</span>
          </label>
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Optional</span>
        </div>
        <input
          id="gstNumber"
          value={form.gstNumber}
          onChange={(e) => {
            setForm({ ...form, gstNumber: e.target.value.toUpperCase() });
            if (errors.gstNumber) setErrors((prev) => ({ ...prev, gstNumber: "" }));
          }}
          className={`w-full font-mono rounded-xl border bg-slate-900/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-all focus:ring-2 focus:ring-blue-500/20 ${
            errors.gstNumber ? "border-rose-500/50 focus:border-rose-500" : "border-slate-800 focus:border-blue-500"
          }`}
          placeholder="e.g. 27AAAAA1111A1Z1"
        />
        {errors.gstNumber && <p className="mt-1.5 text-xs text-rose-400">{errors.gstNumber}</p>}
      </div>

      {/* Status Field */}
      <div>
        <label htmlFor="status" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Customer Status
        </label>
        <select
          id="status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-sm text-white outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-900">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-slate-800 bg-transparent px-5 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:from-blue-500 hover:to-indigo-500 cursor-pointer"
        >
          Save Customer
        </button>
      </div>
    </form>
  );
}
