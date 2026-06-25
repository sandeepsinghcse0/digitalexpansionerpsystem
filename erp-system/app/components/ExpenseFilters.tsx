"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  categories: string[];
  selectedDate: Date | null;
  setSelectedDate: (
    date: Date | null
  ) => void;
};

export default function ExpenseFilters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  selectedDate,
  setSelectedDate,
}: Props) {
  return (
    <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6 mb-8">
      <h2 className="text-xl font-semibold text-white mb-4">
        Filters
      </h2>

      <div className="flex flex-wrap gap-4">

        <input
          type="text"
          placeholder="🔍 Search expenses..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          className="flex-1 min-w-[250px] bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-white"
        />

        <select
  value={selectedCategory}
  onChange={(e) =>
    setSelectedCategory(e.target.value)
  }
  className="bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-white min-w-[220px]"
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

<DatePicker
  selected={selectedDate}
  onChange={(date: Date | null) =>
    setSelectedDate(date)
  }
  dateFormat="dd/MM/yyyy"
  placeholderText="📅 Select Date"
  isClearable
  showMonthDropdown
  showYearDropdown
  scrollableYearDropdown
  yearDropdownItemNumber={50}
  className="bg-[#020817] border border-slate-800 rounded-xl px-4 py-3 text-white"
/>
<button
  onClick={() => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedDate(null);
  }}
  className="bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl px-4 py-3"
>
  Clear Filters
</button>
      </div>
    </div>
  );
}