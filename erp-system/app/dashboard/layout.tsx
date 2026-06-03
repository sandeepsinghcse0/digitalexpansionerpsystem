export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">ERP System</h2>

        <nav className="space-y-3">
          <a href="/dashboard" className="block">📊 Dashboard</a>
          <a href="/customers" className="block">👥 Customers</a>
          <a href="/inventory" className="block">📦 Inventory</a>
          <a href="/invoices" className="block">🧾 Invoices</a>
          <a href="/expenses" className="block">💰 Expenses</a>
          <a href="/reports" className="block">📈 Reports</a>
        </nav>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}