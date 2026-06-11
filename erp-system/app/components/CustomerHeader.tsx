"use client";

interface CustomerHeaderProps {
  onAddCustomer: () => void;
}

export default function CustomerHeader({ onAddCustomer }: CustomerHeaderProps) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-white">Customers</h1>
        <p className="mt-1 text-sm text-slate-400">
          Manage your customer list and account status.
        </p>
      </div>

      <button
        onClick={onAddCustomer}
        className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-blue-500"
      >
        + Add Customer
      </button>
    </div>
  );
}
