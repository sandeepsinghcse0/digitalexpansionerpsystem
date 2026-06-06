type Props = {
  items: any[];
};

export default function InvoiceSummary({
  items,
}: Props) {
  const subtotal = items.reduce(
    (acc, item) =>
      acc + item.qty * item.rate,
    0
  );

  const gst = subtotal * 0.18;

  const total = subtotal + gst;

  return (
    <div className="bg-[#071028] p-6 rounded-3xl">
      <h2 className="text-xl font-bold text-white mb-4">
        Invoice Summary
      </h2>

      <div className="space-y-3 text-white">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="flex justify-between">
          <span>GST (18%)</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>

        <hr />

        <div className="flex justify-between text-2xl font-bold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}