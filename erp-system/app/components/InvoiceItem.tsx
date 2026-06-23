"use client";

export type InvoiceItemType = {
  description: string;
  qty: number;
  rate: number;
  gstRate: number;
  hsnSac?: string;
  unit?: string;
};

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
        gstRate: 18,
        hsnSac: "",
        unit: "NOS",
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

      {/* Column Headings */}
      <div className="grid grid-cols-12 gap-3 mb-3 text-sm font-semibold text-gray-300">
        <div className="col-span-4">Item Name</div>
        <div className="col-span-2">HSN / SAC</div>
        <div className="col-span-1 text-center">Qty</div>
        <div className="col-span-1 text-center">Unit</div>
        <div className="col-span-1.5 text-right">Price (₹)</div>
        <div className="col-span-1 text-right">GST %</div>
        <div className="col-span-1 text-right">Amount</div>
        <div className="col-span-0.5 text-center">Action</div>
      </div>

      {items.map((item, index) => (
        <div
          key={index}
          className="grid grid-cols-12 gap-3 mb-4 items-center"
        >
          <input
            type="text"
            placeholder="Item Description"
            className="col-span-4 p-3 bg-slate-900 rounded-xl text-white text-sm"
            value={item.description}
            onChange={(e) =>
              updateItem(
                index,
                "description",
                e.target.value
              )
            }
          />

          {/* HSN / SAC */}
          <input
            type="text"
            placeholder="HSN/SAC"
            className="col-span-2 p-3 bg-slate-900 rounded-xl text-white text-sm"
            value={item.hsnSac || ""}
            onChange={(e) =>
              updateItem(
                index,
                "hsnSac",
                e.target.value
              )
            }
          />

          <input
            type="number"
            min="1"
            className="col-span-1 p-3 bg-slate-900 rounded-xl text-white text-sm text-center"
            value={item.qty}
            onChange={(e) =>
              updateItem(
                index,
                "qty",
                Number(e.target.value)
              )
            }
          />

          {/* Unit */}
          <input
            type="text"
            placeholder="Unit"
            className="col-span-1 p-3 bg-slate-900 rounded-xl text-white text-sm text-center"
            value={item.unit || "NOS"}
            onChange={(e) =>
              updateItem(
                index,
                "unit",
                e.target.value
              )
            }
          />

          <input
            type="number"
            min="0"
            className="col-span-1.5 p-3 bg-slate-900 rounded-xl text-white text-sm text-right"
            value={item.rate}
            onChange={(e) =>
              updateItem(
                index,
                "rate",
                Number(e.target.value)
              )
            }
          />

          {/* GST Rate */}
          <input
            type="number"
            min="0"
            className="col-span-1 p-3 bg-slate-900 rounded-xl text-white text-sm text-right"
            value={item.gstRate}
            onChange={(e) =>
              updateItem(
                index,
                "gstRate",
                Number(e.target.value)
              )
            }
          />

          {/* Amount */}
          <div className="col-span-1 p-3 bg-slate-900 rounded-xl text-white text-sm text-right">
            ₹{(item.qty * item.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>

          <button
            onClick={() => removeItem(index)}
            className="col-span-0.5 p-2 bg-red-600 hover:bg-red-700 rounded-xl text-white text-xs flex justify-center items-center"
            title="Delete Item"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}