export default function CreateInvoicePage() {
  return (
    <div className="min-h-screen bg-[#020817] text-white p-10">
      <h1 className="text-4xl font-bold mb-8">
        Create Invoice
      </h1>

      <form className="space-y-6 max-w-xl">
        <input
          type="text"
          placeholder="Client Name"
          className="w-full p-4 bg-slate-900 rounded-xl"
        />

        <input
          type="number"
          placeholder="Amount"
          className="w-full p-4 bg-slate-900 rounded-xl"
        />

        <button
          type="submit"
          className="bg-blue-600 px-6 py-3 rounded-xl"
        >
          Save Invoice
        </button>
      </form>
    </div>
  );
}