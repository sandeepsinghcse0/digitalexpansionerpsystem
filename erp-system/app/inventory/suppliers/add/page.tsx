"use client";

import Link from "next/link";
import AddSupplierForm from "./supplier";

export default function AddSupplierPage() {
  return (
    <div className="p-8 text-white relative min-h-screen">
      {/* Header Container */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/inventory/suppliers"
          className="inline-flex items-center text-slate-400 hover:text-white transition gap-2 group mb-4 text-sm font-medium"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Suppliers</span>
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
          Add New Supplier
        </h1>
        <p className="text-slate-400 mt-2">
          Register a new supplier to associate with inventory items.
        </p>
      </div>

      <AddSupplierForm />
    </div>
  );
}
