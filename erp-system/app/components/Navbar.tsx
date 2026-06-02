export default function Navbar() {
  return (
    <div className="flex justify-between items-center mb-12">
      <div>
        <h1 className="text-5xl font-bold text-white">
          Invoice Dashboard
        </h1>

        <p className="text-slate-400 mt-3 text-lg">
          Manage your invoices and payments
        </p>
      </div>

      <button className="bg-blue-600 hover:bg-blue-700 px-7 py-4 rounded-2xl text-white text-lg font-medium shadow-lg transition">
        + Create Invoice
      </button>
    </div>
  );
}