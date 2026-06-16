"use client";

interface CustomerFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
}

const statuses = ["All", "Active", "Pending", "Inactive"];
export default function CustomerFilters({
  selectedStatus,
  setSelectedStatus,
}: CustomerFiltersProps) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-3">
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => setSelectedStatus(status)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${selectedStatus === status
            ? "bg-blue-600 text-white"
            : "bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
