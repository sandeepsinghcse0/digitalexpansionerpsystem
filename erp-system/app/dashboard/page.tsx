export default function DashboardPage() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">
        ERP Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Customers</h2>
          <p className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Products</h2>
          <p className="text-3xl font-bold">0</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Sales</h2>
          <p className="text-3xl font-bold">₹0</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-gray-500">Expenses</h2>
          <p className="text-3xl font-bold">₹0</p>
        </div>
      </div>
    </div>
  );
}