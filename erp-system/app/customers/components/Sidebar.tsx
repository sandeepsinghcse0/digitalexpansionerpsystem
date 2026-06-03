export default function Sidebar() {
  const menu = [
    "Dashboard",
    "Customers",
    "Invoices",
    "Inventory",
    "Expenses",
    "Reports",
    "Settings",
  ];

  return (
    <aside className="w-[280px] h-screen sticky top-0 border-r border-white/10 bg-white/[0.04] backdrop-blur-3xl p-6 flex flex-col justify-between">
      <div>
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white">
            ERP Pro
          </h1>

          <p className="text-gray-400 text-sm mt-1">
            Premium CRM Dashboard
          </p>
        </div>

        <div className="space-y-3">
          {menu.map((item) => (
            <button
              key={item}
              className={`w-full text-left px-5 py-4 rounded-2xl transition-all duration-300 ${
                item === "Customers"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[28px] bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 p-5">
        <h3 className="font-semibold text-lg">
          Upgrade to Pro 🚀
        </h3>

        <p className="text-gray-400 text-sm mt-2">
          Unlock premium analytics &
          CRM tools.
        </p>

        <button className="mt-5 w-full bg-white text-black py-3 rounded-2xl font-semibold">
          Upgrade
        </button>
      </div>
    </aside>
  );
}