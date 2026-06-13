"use client";

import { Search, Filter } from "lucide-react";

export default function ExpenseFilters() {
  return (
    <div className="mb-6">
      <div
        className="
          bg-[#111C44]/80
          backdrop-blur-xl
          border border-blue-500/20
          rounded-3xl
          p-6
          shadow-[0_0_40px_rgba(59,130,246,0.15)]
        "
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300"
            />

            <input
              placeholder="Search expenses..."
              className="
                w-full
                bg-[#0B1437]
                border border-blue-500/20
                rounded-2xl
                pl-11
                pr-4
                py-3
                text-white
                placeholder:text-gray-400
                focus:outline-none
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-500/30
              "
            />
          </div>

          {/* Category */}
          <select
            className="
              bg-[#0B1437]
              border border-blue-500/20
              rounded-2xl
              px-4
              py-3
              text-white
              focus:outline-none
              focus:border-blue-500
            "
          >
            <option>All Categories</option>
            <option>Rent</option>
            <option>Utilities</option>
            <option>Travel</option>
            <option>Marketing</option>
          </select>

          {/* Date */}
          <input
            type="date"
            className="
              bg-[#0B1437]
              border border-blue-500/20
              rounded-2xl
              px-4
              py-3
              text-white
              focus:outline-none
              focus:border-blue-500
            "
          />

          {/* Filter Button */}
          <button
            className="
              flex
              items-center
              justify-center
              gap-2
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              text-white
              font-medium
              py-3
              transition-all
              duration-300
              hover:scale-[1.02]
              hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]
            "
          >
            <Filter size={18} />
            Apply Filter
          </button>
        </div>
      </div>
    </div>
  );
}