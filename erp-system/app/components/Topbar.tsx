type Props = {
  search: string;
  setSearch: (value: string) => void;
};

export default function Topbar({
  search,
  setSearch,
}: Props) {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Search customers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-lg bg-[#0f172a] border border-gray-700 text-white"
      />
    </div>
  );
}