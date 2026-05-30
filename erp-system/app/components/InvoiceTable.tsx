export default function InvoiceTable() {
  const invoices = [
    {
      id: "INV-001",
      client: "Infosys",
      amount: "₹12,000",
      status: "Paid",
      date: "28 May 2026",
    },
    {
      id: "INV-002",
      client: "TCS",
      amount: "₹18,500",
      status: "Pending",
      date: "27 May 2026",
    },
    {
      id: "INV-003",
      client: "Wipro",
      amount: "₹9,200",
      status: "Overdue",
      date: "25 May 2026",
    },
  ];

  return (
    <div className="bg-[#071028] rounded-3xl p-8 overflow-x-auto border border-slate-800 shadow-xl">
      <table className="w-full text-lg">
        <thead>
          <tr className="text-slate-400 border-b border-slate-800">
            <th className="text-left py-5">Invoice ID</th>
            <th className="text-left py-5">Client</th>
            <th className="text-left py-5">Amount</th>
            <th className="text-left py-5">Status</th>
            <th className="text-left py-5">Date</th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((invoice, index) => (
            <tr
              key={index}
              className="border-b border-slate-900 text-white"
            >
              <td className="py-6">{invoice.id}</td>
              <td>{invoice.client}</td>
              <td>{invoice.amount}</td>

              <td>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    invoice.status === "Paid"
                      ? "bg-green-500/20 text-green-400"
                      : invoice.status === "Pending"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {invoice.status}
                </span>
              </td>

              <td className="text-slate-300">{invoice.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}