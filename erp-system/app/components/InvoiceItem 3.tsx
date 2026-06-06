"use client";

type Props = {
  items: any[];
  setItems: any;
};

export default function InvoiceItem({
  items,
  setItems,
}: Props) {
  const addItem = () => {
    setItems([
      ...items,
      {
        description: "",
        qty: 1,
        rate: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  return (
    <div className="bg-[#071028] p-6 rounded-3xl">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-bold text-white">
          Invoice Items
        </h2>

        <button
          onClick={addItem}
          className="bg-blue-600 px-4 py-2 rounded-xl text-white"
        >
          + Add Item
        </button>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 mb-4"
        >
          <input
            placeholder="Description"
            className="p-3 bg-slate-900 rounded-xl"
            value={item.description}
            onChange={(e) => {
              const updated = [...items];
              updated[index].description =
                e.target.value;
              setItems(updated);
            }}
          />

          <input
            type="number"
            placeholder="Qty"
            className="p-3 bg-slate-900 rounded-xl"
            value={item.qty}
            onChange={(e) => {
              const updated = [...items];
              updated[index].qty =
                Number(e.target.value);
              setItems(updated);
            }}
          />

          <input
            type="number"
            placeholder="Rate"
            className="p-3 bg-slate-900 rounded-xl"
            value={item.rate}
            onChange={(e) => {
              const updated = [...items];
              updated[index].rate =
                Number(e.target.value);
              setItems(updated);
            }}
          />

          <div className="p-3 bg-slate-900 rounded-xl text-white">
            ₹{item.qty * item.rate}
          </div>

          <button
            onClick={() => removeItem(index)}
            className="bg-red-600 rounded-xl text-white"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}