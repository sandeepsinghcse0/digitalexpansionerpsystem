type Props = {
  selectedStatus: string;
  setSelectedStatus: (
    status: string
  ) => void;
};

export default function CustomerFilters({
  selectedStatus,
  setSelectedStatus,
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