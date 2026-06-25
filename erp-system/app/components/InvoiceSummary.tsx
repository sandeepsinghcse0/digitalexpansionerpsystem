type Props = {
  items: any[];
  penaltyAmount?: number;
};

export default function InvoiceSummary({
  items,
  penaltyAmount = 0,
}: Props) {
  const visibleItems = items.filter(
    (item) =>
      item.description?.trim() || item.qty > 0 || item.rate > 0 || item.gstRate > 0
  );

  const subtotal = visibleItems.reduce(
    (acc, item) => acc + item.qty * item.rate,
    0
  );

  const gst = visibleItems.reduce(
    (acc, item) => acc + item.qty * item.rate * ((item.gstRate ?? 18) / 100),
    0
  );

  const total = subtotal + gst + penaltyAmount;

  return (
    <div className="bg-[#071028] p-6 rounded-3xl">
      <h2 className="text-xl font-bold text-white mb-4">
        Invoice Summary
      </h2>

      <div className="space-y-3 text-white">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between">
          <span>GST</span>
          <span>₹{gst.toFixed(2)}</span>
        </div>

        {penaltyAmount > 0 && (
          <div className="flex justify-between text-red-300">
            <span>Overdue Penalty (No GST)</span>
            <span>₹{penaltyAmount.toFixed(2)}</span>
          </div>
        )}

        <hr className="border-slate-600" />

        <div className="flex justify-between text-2xl font-bold">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}