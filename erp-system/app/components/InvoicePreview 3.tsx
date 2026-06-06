"use client";

type InvoicePreviewProps = {
  open: boolean;
  onClose: () => void;
  customerName: string;
  invoiceNumber: string;
  items: {
    description: string;
    qty: number;
    rate: number;
  }[];
};

export default function InvoicePreview({
  open,
  onClose,
  customerName,
  invoiceNumber,
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
        className="bg-white text-black w-[900px] max-h-[90vh] overflow-y-auto rounded-2xl p-8"
      >
        <div className="flex justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              DIGITAL EXPANSION
            </h1>

            <p className="text-gray-600">
              Professional IT Solutions
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>

        <hr className="mb-6" />

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="font-bold text-xl mb-2">
              Bill To
            </h2>

            <p>{customerName}</p>
          </div>

          <div className="text-right">
            <h2 className="font-bold text-xl">
              Invoice
            </h2>

            <p>{invoiceNumber}</p>

            <p>
              {new Date().toLocaleDateString()}
            </p>
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
          <div className="w-[300px]">
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