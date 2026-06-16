"use client";

type Props = {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    selectedCategory: string;
    setSelectedCategory: (value: string) => void;
    selectedDate: string;
    setSelectedDate: (value: string) => void;
    categories: string[];
};

export default function ExpenseFilters({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedDate,
    setSelectedDate,
    categories,
}: Props) {
    return (
        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
                Filters
            </h2>

            <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center">
                <input
                    type="text"
                    placeholder="🔍 Search expenses..."
                    value={searchTerm}
                    onChange={(e) =>
                        setSearchTerm(e.target.value)
                    }
                    className="min-w-0 flex-1 w-full md:w-auto bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-white"
                />

                <select
                    value={selectedCategory}
                    onChange={(e) =>
                        setSelectedCategory(e.target.value)
                    }
                    className="min-w-0 w-full md:w-56 bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-white"
                >
                    <option value="All">
                        All Categories
                    </option>
                    {categories.map((categoryOption) => (
                      <option
                        key={categoryOption}
                        value={categoryOption}
                      >
                        {categoryOption}
                      </option>
                    ))}
                </select>

                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="min-w-0 w-full md:w-44 bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-white"
                />
            </div>
        </div>
    );
}
