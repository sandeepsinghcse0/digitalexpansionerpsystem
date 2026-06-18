"use client";

import { useEffect, useState } from "react";

export default function SupplierStats() {
  const [total, setTotal] = useState(0);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function fetchSuppliers() {
      try {
        const res = await fetch('/api/suppliers');
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        setTotal(Array.isArray(data) ? data.length : 0);
        const activeCount = Array.isArray(data)
          ? data.filter((s: any) => s.status === 'ACTIVE').length
          : 0;
        setActive(activeCount);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchSuppliers();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <p className="text-slate-400">Loading suppliers...</p>;

  return (
    <div className="mb-6 grid grid-cols-2 gap-4">
      <div className="rounded-3xl border border-slate-800 bg-[#071028] p-6">
        <p className="text-sm text-slate-400">Total Suppliers</p>
        <p className="mt-3 text-2xl font-bold text-white">{total}</p>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-[#071028] p-6">
        <p className="text-sm text-slate-400">Active Suppliers</p>
        <p className="mt-3 text-2xl font-bold text-white">{active}</p>
      </div>
    </div>
  );
}
