"use client";

import { Search } from "lucide-react";

interface TopbarProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function Topbar({ search, setSearch }: TopbarProps) {
  return (
    <div className="mb-8 flex items-center justify-between gap-4">
      <div className="relative w-full max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 py-3 pl-10 pr-4 text-sm text-slate-200 outline-none ring-0 placeholder:text-slate-500"
        />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300">
        Customer Directory
      </div>
    </div>
  );
}