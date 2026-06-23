"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Supplier = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  status: string;
};

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/suppliers")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch suppliers");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setSuppliers(data);
        } else {
          console.error("Invalid data format received:", data);
          setSuppliers([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load suppliers. Please try again later.");
        setLoading(false);
      });
  }, []);

  const handleStatusChange = async (supplierId: number, newStatus: string) => {
    try {
      setError(null);
      const res = await fetch(`/api/suppliers/${supplierId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update supplier status");
      }

      setSuppliers((prev) =>
        prev.map((sup) =>
          sup.id === supplierId ? { ...sup, status: newStatus } : sup
        )
      );
      setEditingSupplierId(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update supplier status. Please try again.");
    }
  };

  const handleDeleteClick = async (supplierId: number) => {
    if (!window.confirm("Are you sure you want to delete this supplier and all their associated records?")) {
      return;
    }

    try {
      setError(null);
      const res = await fetch(`/api/suppliers/${supplierId}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete supplier");
      }

      setSuppliers((prev) => prev.filter((sup) => sup.id !== supplierId));
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to delete supplier. Please try again.");
    }
  };

  return (
    <div className="p-8 text-white relative min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
            Supplier Management
          </h1>
          <p className="text-slate-400 mt-2">
            View and manage your product suppliers
          </p>
        </div>

        <Link
          href="/inventory/suppliers/add"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
        >
          + Add Supplier
        </Link>
      </div>

      {/* Inventory Tabs */}
      <div className="flex gap-2 p-1.5 bg-[#071028]/60 backdrop-blur-md border border-slate-800/80 rounded-2xl w-fit mb-8 shadow-inner">
        <Link
          href="/inventory"
          className="text-slate-400 hover:text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-slate-800/40 text-sm"
        >
          Products
        </Link>

        <Link
          href="/inventory/suppliers"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md shadow-blue-500/10 text-sm"
        >
          Suppliers
        </Link>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{error}</span>
        </div>
      )}

      {/* Supplier Table */}
      <div className="bg-gradient-to-b from-[#071028]/80 to-[#040b1e]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0c1938]/40">
              <th className="text-left p-4 text-slate-300 font-semibold">ID</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Name</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Email</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Phone</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Status & Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center p-12 text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading suppliers...</span>
                  </div>
                </td>
              </tr>
            ) : suppliers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center p-12 text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <p className="font-medium text-slate-300">No suppliers found</p>
                    <Link
                      href="/inventory/suppliers/add"
                      className="bg-slate-850 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm transition font-medium border border-slate-700"
                    >
                      Create First Supplier
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              suppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-b border-slate-800 hover:bg-[#0c1836]/40 transition duration-150"
                >
                  <td className="p-4 font-mono text-slate-400 text-sm">
                    {supplier.id}
                  </td>

                  <td className="p-4 font-medium text-white">
                    {supplier.name}
                  </td>

                  <td className="p-4 text-slate-300">
                    {supplier.email || "N/A"}
                  </td>

                  <td className="p-4 text-slate-300">
                    {supplier.phone || "N/A"}
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {editingSupplierId === supplier.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={supplier.status}
                            onChange={(e) => handleStatusChange(supplier.id, e.target.value)}
                            className={`bg-[#020817] border rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition ${
                              supplier.status === "ACTIVE"
                                ? "text-green-400 border-green-500/30"
                                : supplier.status === "INACTIVE"
                                ? "text-yellow-400 border-yellow-500/30"
                                : "text-red-400 border-red-500/30"
                            }`}
                          >
                            <option value="ACTIVE" className="text-green-400 bg-[#020817]">ACTIVE</option>
                            <option value="INACTIVE" className="text-yellow-400 bg-[#020817]">INACTIVE</option>
                            <option value="SUSPENDED" className="text-red-400 bg-[#020817]">SUSPENDED</option>
                          </select>
                          <button
                            onClick={() => setEditingSupplierId(null)}
                            className="bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white px-2 py-1 rounded-lg text-xs font-medium border border-slate-800 hover:border-slate-700 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              supplier.status === "ACTIVE"
                                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                : supplier.status === "INACTIVE"
                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                : "bg-red-500/10 text-red-400 border border-red-500/20"
                            }`}
                          >
                            {supplier.status}
                          </span>
                          
                          <button
                            onClick={() => setEditingSupplierId(supplier.id)}
                            className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 hover:from-blue-600/20 hover:to-indigo-600/20 text-blue-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-blue-500/20 hover:border-blue-500/30 cursor-pointer"
                          >
                            Edit
                          </button>
                          
                          <button
                            onClick={() => handleDeleteClick(supplier.id)}
                            className="bg-gradient-to-r from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition border border-red-500/20 hover:border-red-500/30 cursor-pointer"
                          >
                            Delete
                          </button>
                        </>
                      )}
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