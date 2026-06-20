"use client";

type InvoicePreviewProps = {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDownloadPDF?: () => void;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  penaltyAmount?: number;
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
    gstRate: number;
  }[];
};

export default function InvoicePreview({
  open,
  onClose,
  onEdit,
  onDownloadPDF,
  customerName,
  invoiceNumber,
  invoiceDate,
  dueDate,
  status,
  penaltyAmount = 0,
  notes,
  sellerDetails,
  customerDetails,
  items,
}: InvoicePreviewProps) {
  if (!open) return null;

  const visibleItems = items.filter(
    (item) =>
      item.description?.trim() || item.qty > 0 || item.rate > 0 || item.gstRate > 0
  );

  const subtotal = visibleItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const gst = visibleItems.reduce((sum, item) => sum + item.qty * item.rate * ((item.gstRate ?? 18) / 100), 0);
  const total = subtotal + gst + penaltyAmount;
  const billToName = customerName || customerDetails.customerName || "Customer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        id="invoice-preview"
        className="bg-white text-black w-225 max-h-[90vh] overflow-y-auto rounded-2xl p-8 font-sans text-base leading-6"
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

          <div className="flex gap-3">
            {onEdit ? (
              <button
                onClick={onEdit}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Edit
              </button>
            ) : null}
            {onDownloadPDF ? (
              <button
                onClick={onDownloadPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Download PDF
              </button>
            ) : null}

            <button
              onClick={onClose}
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
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

          <div className="text-right">
            <h2 className="font-bold text-xl">
              Invoice
            </h2>

            <p>{invoiceNumber}</p>
            <p className="text-sm text-gray-600">Date: {invoiceDate || new Date().toLocaleDateString()}</p>
            {status !== "PAID" && (
              <p className="text-sm text-gray-600">Due: {dueDate || "—"}</p>
            )}
            <p className="text-sm text-gray-600">Status: {status || "DRAFT"}</p>
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
            <tr className="bg-slate-100">
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Qty</th>
              <th className="p-3 border">Rate</th>
              <th className="p-3 border">GST %</th>
              <th className="p-3 border">Taxable</th>
              <th className="p-3 border">GST</th>
              <th className="p-3 border">Total</th>
            </tr>
          </thead>
          <tbody>
            {visibleItems.map((item, index) => {
              const taxable = item.qty * item.rate;
              const gst = taxable * ((item.gstRate ?? 18) / 100);
              const rowTotal = taxable + gst;
              return (
                <tr key={index}>
                  <td className="border p-3">{item.description}</td>
                  <td className="border p-3">{item.qty}</td>
                  <td className="border p-3">₹{item.rate.toFixed(2)}</td>
                  <td className="border p-3">{(item.gstRate ?? 18).toFixed(2)}%</td>
                  <td className="border p-3">₹{taxable.toFixed(2)}</td>
                  <td className="border p-3">₹{gst.toFixed(2)}</td>
                  <td className="border p-3">₹{rowTotal.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end">
          <div className="w-75">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="mb-2 flex justify-between text-[14px] text-slate-700">
              <span>GST</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            {penaltyAmount > 0 && (
              <div className="mb-2 flex justify-between text-[14px] text-red-600">
                <span>Overdue Penalty</span>
                <span>₹{penaltyAmount.toFixed(2)}</span>
              </div>
            )}
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