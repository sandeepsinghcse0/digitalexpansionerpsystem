"use client";

type InvoiceItemType = {
  description: string;
  qty: number;
  rate: number;
};

type Props = {
  items: InvoiceItemType[];
  setItems: React.Dispatch<
    React.SetStateAction<InvoiceItemType[]>
  >;
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

  const updateItem = (
    index: number,
    field: keyof InvoiceItemType,
    value: string | number
  ) => {
    const updated = [...items];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setItems(updated);
  };

  return (
    <div className="bg-[#071028] p-6 rounded-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white">
          Invoice Items
        </h2>

        <button
          onClick={addItem}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white"
        >
          + Add Item
        </button>
      </div>

      {/* Column Headings */}
      <div className="grid grid-cols-5 gap-4 mb-3 text-sm font-semibold text-gray-300">
        <div>Item Name</div>
        <div>Quantity</div>
        <div>Price (₹)</div>
        <div>Amount</div>
        <div>Action</div>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-5 gap-4 mb-4"
        >
          {/* Item Name */}
          <input
            type="text"
            placeholder="Enter Item Name"
            className="p-3 bg-slate-900 rounded-xl text-white"
            value={item.description}
            onChange={(e) =>
              updateItem(
                index,
                "description",
                e.target.value
              )
            }
          />

          {/* Quantity */}
          <input
            type="number"
            min="1"
            className="p-3 bg-slate-900 rounded-xl text-white"
            value={item.qty}
            onChange={(e) =>
              updateItem(
                index,
                "qty",
                Number(e.target.value)
              )
            }
          />

          {/* Price */}
          <input
            type="number"
            min="0"
            className="p-3 bg-slate-900 rounded-xl text-white"
            value={item.rate}
            onChange={(e) =>
              updateItem(
                index,
                "rate",
                Number(e.target.value)
              )
            }
          />

          {/* Amount */}
          <div className="p-3 bg-slate-900 rounded-xl text-white flex items-center">
            ₹{(item.qty * item.rate).toLocaleString()}
          </div>

          {/* Delete */}
          <button
            onClick={() => removeItem(index)}
            className="bg-red-600 hover:bg-red-700 rounded-xl text-white"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}