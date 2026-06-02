"use client";

import { useState } from "react";

type Invoice = {
  id: string;
  client: string;
  amount: number;
  status: string;
  date: string;
};

export default function InvoiceTable() {
  const [search, setSearch] = useState("");

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const [editInvoice, setEditInvoice] = useState<Invoice | null>(null);

  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-001",
      client: "Infosys",
      amount: 12000,
      status: "Paid",
      date: "28 May 2026",
    },
    {
      id: "INV-002",
      client: "TCS",
      amount: 18500,
      status: "Pending",
      date: "27 May 2026",
    },
    {
      id: "INV-003",
      client: "Wipro",
      amount: 9200,
      status: "Overdue",
      date: "25 May 2026",
    },
  ]);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.client.toLowerCase().includes(search.toLowerCase()) ||
      invoice.id.toLowerCase().includes(search.toLowerCase())
  );

  const deleteInvoice = (id: string) => {
    setInvoices((prev) =>
      prev.filter((invoice) => invoice.id !== id)
    );
  };

  const updateStatus = (id: string, status: string) => {
    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === id
          ? { ...invoice, status }
          : invoice
      )
    );
  };

  const saveEdit = () => {
    if (!editInvoice) return;

    setInvoices((prev) =>
      prev.map((invoice) =>
        invoice.id === editInvoice.id
          ? editInvoice
          : invoice
      )
    );

    setEditInvoice(null);
  };

  return (
    <>
      {/* Search */}

      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          placeholder="Search Invoice..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-[#071028] border border-slate-700 text-white px-4 py-3 rounded-xl w-80 outline-none"
        />
      </div>

      {/* Table */}

      <div className="bg-[#071028] rounded-3xl p-8 overflow-x-auto border border-slate-800 shadow-xl">
        <table className="w-full text-lg">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800">
              <th className="text-left py-5">Invoice ID</th>
              <th className="text-left py-5">Client</th>
              <th className="text-left py-5">Amount</th>
              <th className="text-left py-5">Status</th>
              <th className="text-left py-5">Date</th>
              <th className="text-left py-5">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.map((invoice) => (
              <tr
                key={invoice.id}
                className="border-b border-slate-900 text-white"
              >
                <td className="py-6">{invoice.id}</td>

                <td>{invoice.client}</td>

                <td>₹{invoice.amount}</td>

                <td>
                  <select
                    value={invoice.status}
                    onChange={(e) =>
                      updateStatus(
                        invoice.id,
                        e.target.value
                      )
                    }
                    className="bg-slate-800 text-white px-3 py-2 rounded-lg"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </td>

                <td>{invoice.date}</td>

                <td>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setSelectedInvoice(invoice)
                      }
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded-lg"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        setEditInvoice(invoice)
                      }
                      className="bg-yellow-600 hover:bg-yellow-700 px-3 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteInvoice(invoice.id)
                      }
                      className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Modal */}

      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#071028] p-8 rounded-3xl w-[500px] border border-slate-700">
            <h2 className="text-2xl text-white font-bold mb-6">
              Invoice Details
            </h2>

            <p className="text-white mb-3">
              <strong>ID:</strong>{" "}
              {selectedInvoice.id}
            </p>

            <p className="text-white mb-3">
              <strong>Client:</strong>{" "}
              {selectedInvoice.client}
            </p>

            <p className="text-white mb-3">
              <strong>Amount:</strong> ₹
              {selectedInvoice.amount}
            </p>

            <p className="text-white mb-3">
              <strong>Status:</strong>{" "}
              {selectedInvoice.status}
            </p>

            <p className="text-white mb-5">
              <strong>Date:</strong>{" "}
              {selectedInvoice.date}
            </p>

            <button
              onClick={() =>
                setSelectedInvoice(null)
              }
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}

      {editInvoice && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-[#071028] p-8 rounded-3xl w-[500px] border border-slate-700">
            <h2 className="text-2xl text-white font-bold mb-6">
              Edit Invoice
            </h2>

            <input
              type="text"
              value={editInvoice.client}
              onChange={(e) =>
                setEditInvoice({
                  ...editInvoice,
                  client: e.target.value,
                })
              }
              className="w-full bg-slate-800 p-3 rounded-xl text-white mb-4"
            />

            <input
              type="number"
              value={editInvoice.amount}
              onChange={(e) =>
                setEditInvoice({
                  ...editInvoice,
                  amount: Number(e.target.value),
                })
              }
              className="w-full bg-slate-800 p-3 rounded-xl text-white mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={saveEdit}
                className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl text-white"
              >
                Save
              </button>

              <button
                onClick={() =>
                  setEditInvoice(null)
                }
                className="bg-red-600 hover:bg-red-700 px-5 py-3 rounded-xl text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}