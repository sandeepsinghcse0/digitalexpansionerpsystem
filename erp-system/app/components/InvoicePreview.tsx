"use client";

type InvoicePreviewProps = {
  open: boolean;
  onClose: () => void;
  onDownloadPDF?: () => void | Promise<void>;
  customerName: string;
  invoiceNumber: string;
  invoiceDate?: string;
  dueDate?: string;
  status?: string;
  notes?: string;
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

  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.rate,
    0
  );

  const gst = subtotal * 0.18;

  const total = subtotal + gst;
  const invoiceDateText = invoiceDate || new Date().toLocaleDateString();
  const dueDateText = dueDate || "—";
  const statusText = status || "DRAFT";
  const sellerAddress = [sellerDetails.address, sellerDetails.city, sellerDetails.state, sellerDetails.postalCode]
    .filter(Boolean)
    .join(", ");
  const customerAddress = [customerDetails.address, customerDetails.city, customerDetails.state, customerDetails.postalCode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div
        id="invoice-preview"
        className="bg-white text-black w-225 max-h-[90vh] overflow-y-auto rounded-2xl p-8"
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              {sellerDetails.businessName || "Seller"}
            </h1>
            <p className="mt-2 text-gray-600">
              {sellerDetails.contactName || "Seller Contact"}
            </p>
            <p className="text-sm text-gray-600">{sellerDetails.email}</p>
            <p className="text-sm text-gray-600">{sellerDetails.phone}</p>
            <p className="text-sm text-gray-600">{sellerAddress}</p>
          </div>

          <div className="text-right">
            <div className="flex justify-end gap-2">
              <button
                onClick={() => onDownloadPDF?.()}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="rounded-lg bg-red-500 px-4 py-2 text-white"
              >
                Close
              </button>
            </div>
            <div className="mt-4 space-y-1 text-sm">
              <p>
                <span className="font-semibold">Invoice No:</span> {invoiceNumber}
              </p>
              <p>
                <span className="font-semibold">Invoice Date:</span> {invoiceDateText}
              </p>
              <p>
                <span className="font-semibold">Due Date:</span> {dueDateText}
              </p>
              <p>
                <span className="font-semibold">Status:</span> {statusText}
              </p>
            </div>
          </div>
        </div>

        <hr className="mb-6" />

        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <h2 className="mb-2 text-xl font-bold">Bill From</h2>
            <p>{sellerDetails.businessName || "Seller"}</p>
            <p className="text-sm text-gray-600">{sellerDetails.contactName}</p>
            <p className="text-sm text-gray-600">{sellerDetails.email}</p>
            <p className="text-sm text-gray-600">{sellerDetails.phone}</p>
            <p className="text-sm text-gray-600">{sellerAddress}</p>
            <p className="text-sm text-gray-600">GST: {sellerDetails.gstNumber}</p>
            <p className="text-sm text-gray-600">PAN: {sellerDetails.panNumber}</p>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-bold">Bill To</h2>
            <p>{customerName}</p>
            <p className="text-sm text-gray-600">{customerDetails.companyName}</p>
            <p className="text-sm text-gray-600">{customerDetails.email}</p>
            <p className="text-sm text-gray-600">{customerDetails.phone}</p>
            <p className="text-sm text-gray-600">{customerAddress}</p>
            <p className="text-sm text-gray-600">GST: {customerDetails.gstNumber}</p>
            <p className="text-sm text-gray-600">PAN: {customerDetails.panNumber}</p>
          </div>
        </div>

        <table className="w-full border">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-3 border">
                Description
              </th>
              <th className="p-3 border">
                Qty
              </th>
              <th className="p-3 border">
                Rate
              </th>
              <th className="p-3 border">
                Amount
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border p-3">
                  {item.description}
                </td>

                <td className="border p-3">
                  {item.qty}
                </td>

                <td className="border p-3">
                  ₹{item.rate}
                </td>

                <td className="border p-3">
                  ₹{item.qty * item.rate}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 flex justify-end">
          <div className="w-75">
            <div className="mb-2 flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="mb-2 flex justify-between">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between text-2xl font-bold">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {notes ? (
          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="mb-2 font-semibold">Notes</h3>
            <p className="text-sm text-gray-700">{notes}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}