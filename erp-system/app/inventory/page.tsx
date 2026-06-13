export default function InventoryPage() {
  const inventory = [
    {
      id: "INV-001",
      product: "Laptop",
      category: "Electronics",
      stock: 25,
      price: "₹55,000",
      status: "In Stock",
    },
    {
      id: "INV-002",
      product: "Keyboard",
      category: "Accessories",
      stock: 12,
      price: "₹1,500",
      status: "Low Stock",
    },
    {
      id: "INV-003",
      product: "Monitor",
      category: "Electronics",
      stock: 0,
      price: "₹12,000",
      status: "Out of Stock",
    },
  ];

  return (
    <div className="p-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            Inventory Management
          </h1>

          <p className="text-slate-400 mt-2">
            Manage products and stock levels
          </p>
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-medium">
          + Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Total Products
          </h3>
          <p className="text-3xl font-bold mt-2">
            145
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            In Stock
          </h3>
          <p className="text-3xl font-bold mt-2 text-green-400">
            120
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Low Stock
          </h3>
          <p className="text-3xl font-bold mt-2 text-yellow-400">
            18
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Out of Stock
          </h3>
          <p className="text-3xl font-bold mt-2 text-red-400">
            7
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search Product..."
          className="bg-[#071028] border border-slate-700 rounded-xl px-4 py-3 w-full md:w-96 outline-none"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-[#071028] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4">
                Product ID
              </th>
              <th className="text-left p-4">
                Product
              </th>
              <th className="text-left p-4">
                Category
              </th>
              <th className="text-left p-4">
                Stock
              </th>
              <th className="text-left p-4">
                Price
              </th>
              <th className="text-left p-4">
                Status
              </th>
              <th className="text-left p-4">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {inventory.map((item) => (
              <tr
                key={item.id}
                className="border-b border-slate-800"
              >
                <td className="p-4">{item.id}</td>

                <td className="p-4">{item.product}</td>

                <td className="p-4">{item.category}</td>

                <td className="p-4">{item.stock}</td>

                <td className="p-4">{item.price}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      item.status === "In Stock"
                        ? "bg-green-600"
                        : item.status === "Low Stock"
                        ? "bg-yellow-600"
                        : "bg-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="bg-blue-600 px-3 py-1 rounded">
                      View
                    </button>

                    <button className="bg-yellow-600 px-3 py-1 rounded">
                      Edit
                    </button>

                    <button className="bg-red-600 px-3 py-1 rounded">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}