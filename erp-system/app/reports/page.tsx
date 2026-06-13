export default function ReportsPage() {
  const reports = [
    {
      name: "Sales Report",
      generated: "10 Jun 2026",
      status: "Ready",
    },
    {
      name: "Expense Report",
      generated: "09 Jun 2026",
      status: "Ready",
    },
    {
      name: "Inventory Report",
      generated: "08 Jun 2026",
      status: "Processing",
    },
    {
      name: "Customer Report",
      generated: "07 Jun 2026",
      status: "Ready",
    },
  ];

  return (
    <div className="p-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Reports Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            View and generate business reports
          </p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-medium">
          Generate Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Total Reports
          </h3>

          <p className="text-3xl font-bold mt-2">
            48
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Sales Reports
          </h3>

          <p className="text-3xl font-bold mt-2 text-green-400">
            15
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Expense Reports
          </h3>

          <p className="text-3xl font-bold mt-2 text-yellow-400">
            12
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Inventory Reports
          </h3>

          <p className="text-3xl font-bold mt-2 text-blue-400">
            21
          </p>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-[#071028] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4">
                Report Name
              </th>

              <th className="text-left p-4">
                Generated Date
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {reports.map((report, index) => (
              <tr
                key={index}
                className="border-b border-slate-800"
              >
                <td className="p-4">
                  {report.name}
                </td>

                <td className="p-4">
                  {report.generated}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      report.status === "Ready"
                        ? "bg-green-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>

                <td className="p-4">
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg">
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Monthly Revenue
          </h2>

          <div className="text-4xl font-bold text-green-400">
            ₹4,52,000
          </div>

          <p className="text-slate-400 mt-2">
            +18% from last month
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Monthly Expenses
          </h2>

          <div className="text-4xl font-bold text-red-400">
            ₹1,24,000
          </div>

          <p className="text-slate-400 mt-2">
            +6% from last month
          </p>
        </div>
      </div>
    </div>
  );
}