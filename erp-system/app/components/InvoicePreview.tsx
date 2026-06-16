"use client";

type InvoicePreviewProps = {
  open: boolean;
  onClose: () => void;
  onDownloadPDF: () => void;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  notes: string;
  sellerDetails: {
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
    gstNumber: string;
    panNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  customerDetails: {
    customerName: string;
    companyName: string;
    email: string;
    phone: string;
    gstNumber: string;
    panNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: {
    description: string;
    qty: number;
    rate: number;
  }[];
};

export default function InvoicePreview({
  open,
  onClose,
  onDownloadPDF,
  customerName,
  invoiceNumber,
  invoiceDate,
  dueDate,
  status,
  notes,
  sellerDetails,
  customerDetails,
  items,
}: InvoicePreviewProps) {
  if (!open) return null;

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const gst = subtotal * 0.18;
  const total = subtotal + gst;
  const billToName = customerName || customerDetails.customerName || "Customer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        id="invoice-preview"
        className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-8 text-black shadow-2xl"
      >
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {sellerDetails.businessName || "Seller Name"}
            </h1>
            <p className="text-[15px] font-medium text-slate-700">
              {sellerDetails.contactName || "Seller Contact"}
            </p>
            <p className="text-[14px] text-slate-600">{sellerDetails.email}</p>
            <p className="text-[14px] text-slate-600">{sellerDetails.phone}</p>
            <p className="text-[14px] text-slate-600">
              {[sellerDetails.address, sellerDetails.city, sellerDetails.state, sellerDetails.postalCode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={onDownloadPDF}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>

        <div className="mb-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-slate-900">Bill From</h2>
            <p className="text-[14px] font-semibold text-slate-800">{sellerDetails.businessName || "Seller"}</p>
            <p className="text-[14px] text-slate-600">{sellerDetails.contactName}</p>
            <p className="text-[14px] text-slate-600">{sellerDetails.email}</p>
            <p className="text-[14px] text-slate-600">{sellerDetails.phone}</p>
            <p className="text-[14px] text-slate-600">{sellerDetails.address}</p>
            <p className="text-[14px] text-slate-600">GST: {sellerDetails.gstNumber || ""}</p>
            <p className="text-[14px] text-slate-600">PAN: {sellerDetails.panNumber || ""}</p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 md:text-right">
            <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-slate-900">Invoice</h2>
            <p className="text-[14px] text-slate-700">Invoice No: {invoiceNumber}</p>
            <p className="text-[14px] text-slate-700">Invoice Date: {invoiceDate || new Date().toISOString().slice(0, 10)}</p>
            <p className="text-[14px] text-slate-700">Due Date: {dueDate || "—"}</p>
            <p className="text-[14px] text-slate-700">Status: {status?.toUpperCase() || "DRAFT"}</p>
          </div>
        </div>

        <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-slate-900">Bill To</h2>
          <p className="text-[14px] font-semibold text-slate-800">{billToName}</p>
          <p className="text-[14px] text-slate-600">{customerDetails.companyName}</p>
          <p className="text-[14px] text-slate-600">{customerDetails.email}</p>
          <p className="text-[14px] text-slate-600">{customerDetails.phone}</p>
          <p className="text-[14px] text-slate-600">{customerDetails.address}</p>
          <p className="text-[14px] text-slate-600">GST: {customerDetails.gstNumber || ""}</p>
          <p className="text-[14px] text-slate-600">PAN: {customerDetails.panNumber || ""}</p>
        </div>

        <table className="w-full border border-slate-300 text-left text-[14px]">
          <thead>
            <tr className="bg-slate-100 text-slate-900">
              <th className="border border-slate-300 p-3 font-semibold">Description</th>
              <th className="border border-slate-300 p-3 font-semibold">Qty</th>
              <th className="border border-slate-300 p-3 font-semibold">Rate</th>
              <th className="border border-slate-300 p-3 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={`${item.description}-${index}`} className="text-slate-700">
                <td className="border border-slate-300 p-3">{item.description}</td>
                <td className="border border-slate-300 p-3">{item.qty}</td>
                <td className="border border-slate-300 p-3">₹{Number(item.rate || 0).toFixed(2)}</td>
                <td className="border border-slate-300 p-3">₹{(item.qty * item.rate).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-[320px] rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 flex justify-between text-[14px] text-slate-700">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="mb-2 flex justify-between text-[14px] text-slate-700">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-[16px] font-bold text-slate-900">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {notes ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-2 text-[15px] font-semibold text-slate-900">Notes</h3>
            <p className="text-[14px] leading-6 text-slate-700">{notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}