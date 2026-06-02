type Props = {
  selectedStatus: string;
  setSelectedStatus: (
    value: string
  ) => void;
};

export default function CustomerFilters({
  selectedStatus,
  setSelectedStatus,
}: Props) {
  return (
    <div className="flex gap-4 mb-8 flex-wrap">
      <button
        onClick={() =>
          setSelectedStatus("All")
        }
        className={`px-5 py-3 rounded-2xl transition-all ${
          selectedStatus ===
          "All"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            : "bg-white/5 border border-white/10 text-gray-400"
        }`}
      >
        All Customers
      </button>

      <button
        onClick={() =>
          setSelectedStatus(
            "Active"
          )
        }
        className={`px-5 py-3 rounded-2xl transition-all ${
          selectedStatus ===
          "Active"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            : "bg-white/5 border border-white/10 text-gray-400"
        }`}
      >
        Active
      </button>

      <button
        onClick={() =>
          setSelectedStatus(
            "Premium"
          )
        }
        className={`px-5 py-3 rounded-2xl transition-all ${
          selectedStatus ===
          "Premium"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            : "bg-white/5 border border-white/10 text-gray-400"
        }`}
      >
        Premium
      </button>

      <button
        onClick={() =>
          setSelectedStatus(
            "Inactive"
          )
        }
        className={`px-5 py-3 rounded-2xl transition-all ${
          selectedStatus ===
          "Inactive"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
            : "bg-white/5 border border-white/10 text-gray-400"
        }`}
      >
        Inactive
      </button>
    </div>
  );
}