type Props = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
};

export default function ExpenseFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
}: Props) {
  return (
    <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">
        Filters
      </h2>

      <div className="flex gap-4">
        <input
          type="text"
          placeholder="🔍 Search expenses..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="w-full md:w-80 bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-white"
        />

        <select
          value={selectedCategory}
          onChange={(e) =>
            setSelectedCategory(e.target.value)
          }
          className="bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-white"
        >
          <option value="All">
            All Categories
          </option>
          <option value="Utilities">
            Utilities
          </option>
          <option value="Marketing">
            Marketing
          </option>
          <option value="Travel">
            Travel
          </option>
          <option value="Office Supplies">
            Office Supplies
          </option>
        </select>
      </div>
    </div>
  );
}