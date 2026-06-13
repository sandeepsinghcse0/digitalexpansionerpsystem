import {
  Wallet,
  Receipt,
  TrendingUp,
} from "lucide-react";

export default function ExpenseStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

      {/* Total Expenses */}
      <div
        className="
          relative
          overflow-hidden
          bg-[#111C44]/80
          backdrop-blur-xl
          border border-blue-500/20
          rounded-3xl
          p-6
          text-white
          shadow-[0_0_35px_rgba(59,130,246,0.15)]
        "
      >
        <div className="absolute top-0 right-0 h-24 w-24 bg-blue-500/20 blur-3xl" />

        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">
              Total Expenses
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ₹1,24,500
            </h2>

            <p className="text-green-400 text-sm mt-2">
              +12.5% from last month
            </p>
          </div>

          <div
            className="
              h-14 w-14
              rounded-2xl
              bg-blue-500/20
              flex items-center justify-center
            "
          >
            <Receipt
              size={28}
              className="text-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Monthly Expense */}
      <div
        className="
          relative
          overflow-hidden
          bg-[#111C44]/80
          backdrop-blur-xl
          border border-blue-500/20
          rounded-3xl
          p-6
          text-white
          shadow-[0_0_35px_rgba(59,130,246,0.15)]
        "
      >
        <div className="absolute top-0 right-0 h-24 w-24 bg-green-500/20 blur-3xl" />

        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">
              This Month
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ₹45,000
            </h2>

            <p className="text-green-400 text-sm mt-2">
              +8.4% growth
            </p>
          </div>

          <div
            className="
              h-14 w-14
              rounded-2xl
              bg-green-500/20
              flex items-center justify-center
            "
          >
            <Wallet
              size={28}
              className="text-green-400"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div
        className="
          relative
          overflow-hidden
          bg-[#111C44]/80
          backdrop-blur-xl
          border border-blue-500/20
          rounded-3xl
          p-6
          text-white
          shadow-[0_0_35px_rgba(59,130,246,0.15)]
        "
      >
        <div className="absolute top-0 right-0 h-24 w-24 bg-purple-500/20 blur-3xl" />

        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-sm">
              Categories
            </p>

            <h2 className="text-3xl font-bold mt-2">
              12
            </h2>

            <p className="text-blue-400 text-sm mt-2">
              Active Categories
            </p>
          </div>

          <div
            className="
              h-14 w-14
              rounded-2xl
              bg-purple-500/20
              flex items-center justify-center
            "
          >
            <TrendingUp
              size={28}
              className="text-purple-400"
            />
          </div>
        </div>
      </div>

    </div>
  );
}