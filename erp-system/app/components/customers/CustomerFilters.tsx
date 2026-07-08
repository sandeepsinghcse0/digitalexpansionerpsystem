"use client";

interface CustomerFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
}

const statuses = ["All", "Active", "Inactive", "Suspended"];

export default function CustomerFilters({
  selectedStatus,
  setSelectedStatus,
}: CustomerFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      <span className="text-sm font-semibold text-slate-400 mr-2 uppercase tracking-wider">
        Filter Status:
      </span>
      <div className="flex flex-wrap gap-2 rounded-2xl bg-slate-950/40 p-1.5 border border-slate-900 backdrop-blur-md">
        {statuses.map((status) => {
          const isActive = selectedStatus === status;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              {status}
            </button>
          );
        })}
      </div>
    </div>
  );
}
