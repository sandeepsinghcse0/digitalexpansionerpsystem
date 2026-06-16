"use client";

type InvoicePreviewProps = {
  open: boolean;
  onClose: () => void;
  onDownloadPDF?: () => void;
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

  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.rate,
    0
  );

  const gst = subtotal * 0.18;

  const total = subtotal + gst;

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div
        id="invoice-preview"
        className="bg-white text-black w-225 max-h-[90vh] overflow-y-auto rounded-2xl p-8"
      >
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              {sellerDetails.businessName || "Seller"}
            </h1>

            <p className="text-gray-600">
              {sellerDetails.businessName || "Seller Name"}
            </p>
          </div>

          <div className="flex gap-3">
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

        <hr className="mb-6" />

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="font-bold text-xl mb-2">
              Bill To
            </h2>

            <p>{customerName}</p>
            <p className="text-sm text-gray-600">{customerDetails.companyName}</p>
            <p className="text-sm text-gray-600">{customerDetails.email}</p>
            <p className="text-sm text-gray-600">{customerDetails.phone}</p>
            <p className="text-sm text-gray-600">{customerDetails.address}</p>
          </div>

          <div className="text-right">
            <h2 className="font-bold text-xl">
              Invoice
            </h2>

            <p>{invoiceNumber}</p>
            <p className="text-sm text-gray-600">Date: {invoiceDate || new Date().toLocaleDateString()}</p>
            <p className="text-sm text-gray-600">Due: {dueDate || "—"}</p>
            <p className="text-sm text-gray-600">Status: {status || "DRAFT"}</p>
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
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>GST (18%)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>

            <hr className="my-2" />

            <div className="flex justify-between font-bold text-2xl">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}