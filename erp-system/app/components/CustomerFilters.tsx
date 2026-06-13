"use client";

interface CustomerFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
}

const statuses = ["All", "Active", "Pending", "Inactive"];
type Props = {
  selectedStatus: string;
  setSelectedStatus: (
    status: string
  ) => void;
};

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
          className={`rounded-full px-4 py-2 text-sm font-medium transition ${
            selectedStatus === status
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
}: Props) {
  return (
    <div className="mb-6">
      <select
        value={selectedStatus}
        onChange={(e) =>
          setSelectedStatus(
            e.target.value
          )
        }
        className="bg-[#0f172a] border border-gray-700 p-2 rounded"
      >
        <option>All</option>
        <option>Active</option>
        <option>Inactive</option>
      </select>
    </div>
  );
}
