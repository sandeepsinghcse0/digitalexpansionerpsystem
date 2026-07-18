"use client";

import { useEffect, useState } from "react";

type InvoiceItemData = {
  description?: string | null;
  quantity?: number;
  unit_price?: number;
  subtotal?: number;
  tax_amount?: number;
  total_amount?: number;
  product?: {
    name?: string | null;
  } | null;
  gstrate?: {
    percentage?: number | null;
  } | null;
};

type InvoiceRecord = {
  id: number;
  invoice_number: string;
  customer?: {
    name?: string | null;
  } | null;
  customer_profile?: {
    customer_name?: string | null;
    company_name?: string | null;
    email?: string | null;
    phone?: string | null;
    gst_number?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
  } | null;
  seller_profile?: {
    business_name?: string | null;
    contact_name?: string | null;
    email?: string | null;
    phone?: string | null;
    gst_number?: string | null;
    pan_number?: string | null;
    address?: string | null;
    city?: string | null;
    state?: string | null;
    postal_code?: string | null;
  } | null;
  invoice_date?: string | null;
  due_date?: string | null;
  status?: string | null;
  subtotal?: number | null;
  tax_amount?: number | null;
  total_amount?: number | null;
  penalty_amount?: number | null;
  notes?: string | null;
  terms?: string | null;
  invoiceitem?: InvoiceItemData[] | null;
};

export default function InvoiceTable() {
  const [search, setSearch] = useState("");
  const [invoices, setInvoices] = useState<InvoiceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceRecord | null>(null);
  const [editInvoice, setEditInvoice] = useState<InvoiceRecord | null>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const response = await fetch("/api/invoices");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load invoices");
        }

        setInvoices(data.invoices || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load invoices");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  const filteredInvoices = invoices.filter((invoice) => {
    const haystack = `${invoice.invoice_number || ""} ${invoice.customer?.name || invoice.customer_profile?.customer_name || ""} ${invoice.status || ""}`.toLowerCase();
    return haystack.includes(search.toLowerCase());
  });

  const deleteInvoice = (id: number) => {
    setInvoices((prev) => prev.filter((invoice) => invoice.id !== id));
  };

  const updateStatus = async (invoice: InvoiceRecord, status: string) => {
    try {
      const response = await fetch("/api/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invoice.id, status }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update invoice");
      }

      setInvoices((prev) => prev.map((item) => (item.id === invoice.id ? { ...item, status: data.invoice.status } : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update invoice");
    }
  };

  const saveEdit = async () => {
    if (!editInvoice) return;

    try {
      const response = await fetch("/api/invoices", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editInvoice.id,
          status: editInvoice.status,
          notes: editInvoice.notes,
          dueDate: editInvoice.due_date,
          penaltyAmount: editInvoice.penalty_amount,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update invoice");
      }

      setInvoices((prev) => prev.map((invoice) => (invoice.id === editInvoice.id ? { ...invoice, ...data.invoice } : invoice)));
      setEditInvoice(null);
      setSelectedInvoice(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update invoice");
    }
  };

  const formatAmount = (value?: number | null) => `₹${Number(value || 0).toFixed(2)}`;
  const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString() : "—");

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search Invoice..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-80 rounded-xl border border-slate-700 bg-[#071028] px-4 py-3 text-white outline-none"
        />
      </div>

      {error ? <div className="mb-4 rounded-xl border border-red-700 bg-red-950/40 p-3 text-sm text-red-200">{error}</div> : null}

      <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-[#071028] p-8 shadow-xl">
        {loading ? (
          <div className="py-6 text-center text-slate-300">Loading invoices...</div>
        ) : filteredInvoices.length === 0 ? (
          <div className="py-6 text-center text-slate-300">No invoices found.</div>
        ) : (
          <table className="w-full text-lg">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="py-5 text-left">Invoice ID</th>
                <th className="py-5 text-left">Client</th>
                <th className="py-5 text-left">Amount</th>
                <th className="py-5 text-left">Status</th>
                <th className="py-5 text-left">Date</th>
                <th className="py-5 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-slate-900 text-white">
                  <td className="py-6">{invoice.invoice_number}</td>
                  <td>{invoice.customer?.name || invoice.customer_profile?.customer_name || invoice.customer_profile?.company_name || "Guest Customer"}</td>
                  <td>{formatAmount(invoice.total_amount)}</td>
                  <td>
                    <select
                      value={invoice.status || "DRAFT"}
                      onChange={(e) => updateStatus(invoice, e.target.value)}
                      className="rounded-lg bg-slate-800 px-3 py-2 text-white"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="UNPAID">Unpaid</option>
                      <option value="SENT">Sent</option>
                      <option value="PAID">Paid</option>
                      <option value="OVERDUE">Overdue</option>
                    </select>
                  </td>
                  <td>{formatDate(invoice.invoice_date)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button onClick={() => { setMode("view"); setSelectedInvoice(invoice); }} className="rounded-lg bg-blue-600 px-3 py-2 hover:bg-blue-700">
                        View
                      </button>
                      <button onClick={() => { setMode("edit"); setEditInvoice(invoice); }} className="rounded-lg bg-yellow-600 px-3 py-2 hover:bg-yellow-700">
                        Edit
                      </button>
                      <button onClick={() => deleteInvoice(invoice.id)} className="rounded-lg bg-red-600 px-3 py-2 hover:bg-red-700">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedInvoice && !editInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-700 bg-[#071028] p-8 text-white">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">Invoice Details</h2>
                <p className="mt-1 text-sm text-slate-400">{selectedInvoice.invoice_number}</p>
              </div>
              <button onClick={() => setSelectedInvoice(null)} className="rounded-lg bg-slate-800 px-4 py-2 text-white">Close</button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p><span className="text-slate-400">Customer:</span> {selectedInvoice.customer?.name || selectedInvoice.customer_profile?.customer_name || "Guest Customer"}</p>
                <p><span className="text-slate-400">Company:</span> {selectedInvoice.customer_profile?.company_name || "—"}</p>
                <p><span className="text-slate-400">Email:</span> {selectedInvoice.customer_profile?.email || "—"}</p>
                <p><span className="text-slate-400">Phone:</span> {selectedInvoice.customer_profile?.phone || "—"}</p>
                <p><span className="text-slate-400">Address:</span> {selectedInvoice.customer_profile?.address || "—"}</p>
              </div>

              <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <p><span className="text-slate-400">Invoice Date:</span> {formatDate(selectedInvoice.invoice_date)}</p>
                <p><span className="text-slate-400">Due Date:</span> {formatDate(selectedInvoice.due_date)}</p>
                <p><span className="text-slate-400">Status:</span> {selectedInvoice.status || "DRAFT"}</p>
                <p><span className="text-slate-400">Subtotal:</span> {formatAmount(selectedInvoice.subtotal)}</p>
                <p><span className="text-slate-400">Tax:</span> {formatAmount(selectedInvoice.tax_amount)}</p>
                <p><span className="text-slate-400">Total:</span> {formatAmount(selectedInvoice.total_amount)}</p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="mb-2 font-semibold">Items</h3>
              {selectedInvoice.invoiceitem && selectedInvoice.invoiceitem.length > 0 ? (
                <div className="space-y-2">
                  {selectedInvoice.invoiceitem.map((item, index) => (
                    <div key={`${selectedInvoice.id}-${index}`} className="flex items-center justify-between rounded-lg bg-slate-800/70 px-3 py-2 text-sm">
                      <span>{item.product?.name || item.description || `Item ${index + 1}`}</span>
                      <span>{formatAmount(item.total_amount)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400">No items found.</p>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
              <h3 className="mb-2 font-semibold">Notes</h3>
              <p className="text-sm text-slate-300">{selectedInvoice.notes || "No notes added."}</p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setMode("edit"); setEditInvoice(selectedInvoice); }} className="rounded-lg bg-yellow-600 px-4 py-2 hover:bg-yellow-700">Edit</button>
            </div>
          </div>
        </div>
      )}

      {editInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-700 bg-[#071028] p-8 text-white">
            <h2 className="mb-6 text-2xl font-bold">Edit Invoice</h2>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm text-slate-400">Status</label>
                <select value={editInvoice.status || "DRAFT"} onChange={(e) => setEditInvoice({ ...editInvoice, status: e.target.value })} className="w-full rounded-xl bg-slate-800 p-3 text-white">
                  <option value="DRAFT">Draft</option>
                  <option value="UNPAID">Unpaid</option>
                  <option value="SENT">Sent</option>
                  <option value="PAID">Paid</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-400">Due Date</label>
                <input type="date" value={editInvoice.due_date ? editInvoice.due_date.slice(0, 10) : ""} onChange={(e) => setEditInvoice({ ...editInvoice, due_date: e.target.value })} className="w-full rounded-xl bg-slate-800 p-3 text-white" />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-400">Penalty Amount</label>
                <input type="number" min="0" value={editInvoice.penalty_amount || 0} onChange={(e) => setEditInvoice({ ...editInvoice, penalty_amount: Number(e.target.value) })} className="w-full rounded-xl bg-slate-800 p-3 text-white" />
              </div>

              <div>
                <label className="mb-1 block text-sm text-slate-400">Notes</label>
                <textarea rows={4} value={editInvoice.notes || ""} onChange={(e) => setEditInvoice({ ...editInvoice, notes: e.target.value })} className="w-full rounded-xl bg-slate-800 p-3 text-white" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => { setEditInvoice(null); setSelectedInvoice(null); }} className="rounded-lg bg-slate-700 px-4 py-2 hover:bg-slate-600">Cancel</button>
              <button onClick={saveEdit} className="rounded-lg bg-green-600 px-4 py-2 hover:bg-green-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}