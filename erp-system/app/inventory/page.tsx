"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
};

type Supplier = {
  id: number;
  name: string;
};

type InventoryItem = {
  id: number;
  quantity_available: number;
  product: {
    id: number;
    sku: string;
    name: string;
    description: string | null;
    cost_price: number;
    selling_price: number;
    status: string;
    category?: Category | null;
    supplier?: Supplier | null;
    unitofmeasure?: {
      id: number;
      name: string;
      symbol: string;
    } | null;
  };
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Dropdown lists
  const [categories, setCategories] = useState<Category[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Edit Modal State
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCostPrice, setEditCostPrice] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editSupplierId, setEditSupplierId] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/inventory")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch inventory");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setInventory(data);
        } else {
          console.error("Invalid data format received from API:", data);
          setInventory([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setInventory([]);
        setLoading(false);
      });

    // Fetch categories and suppliers
    fetch("/api/inventory/metadata")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch metadata");
        return res.json();
      })
      .then((data) => {
        setCategories(data.categories || []);
        setSuppliers(data.suppliers || []);
      })
      .catch((err) => console.error("Failed to load metadata", err));
  }, []);

  const handleEditClick = (item: InventoryItem) => {
    setSelectedItem(item);
    setEditName(item.product.name);
    setEditStock(item.quantity_available.toString());
    setEditPrice(item.product.selling_price.toString());
    setEditCostPrice(item.product.cost_price.toString());
    setEditCategoryId(item.product.category?.id?.toString() || "");
    setEditSupplierId(item.product.supplier?.id?.toString() || "");
    setEditStatus(item.product.status);
    setEditError(null);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    const stock = parseInt(editStock, 10);
    const price = parseFloat(editPrice);
    const cost = parseFloat(editCostPrice);

    if (!editName.trim()) {
      setEditError("Product name is required.");
      return;
    }
    if (isNaN(stock) || stock < 0) {
      setEditError("Stock quantity must be a non-negative integer.");
      return;
    }
    if (isNaN(cost) || cost <= 0) {
      setEditError("Cost price must be greater than 0.");
      return;
    }
    if (isNaN(price) || price <= 0) {
      setEditError("Selling price must be greater than 0.");
      return;
    }

    setSaving(true);
    setEditError(null);

    try {
      const res = await fetch(`/api/inventory/${selectedItem.product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName.trim(),
          category_id: editCategoryId ? parseInt(editCategoryId, 10) : null,
          supplier_id: editSupplierId ? parseInt(editSupplierId, 10) : null,
          cost_price: cost,
          selling_price: price,
          status: editStatus,
          quantity_available: stock,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update product details");
      }

      const updatedProduct = data.product;

      // Update state locally
      setInventory((prev) =>
        prev.map((item) => {
          if (item.id === selectedItem.id) {
            return {
              ...item,
              quantity_available: stock,
              product: {
                ...item.product,
                name: updatedProduct.name,
                cost_price: updatedProduct.cost_price,
                selling_price: updatedProduct.selling_price,
                status: updatedProduct.status,
                category: updatedProduct.productcategory ? {
                  id: updatedProduct.productcategory.id,
                  name: updatedProduct.productcategory.name
                } : null,
                supplier: updatedProduct.supplier ? {
                  id: updatedProduct.supplier.id,
                  name: updatedProduct.supplier.name
                } : null,
              },
            };
          }
          return item;
        })
      );

      setIsEditModalOpen(false);
      setSelectedItem(null);
    } catch (err: any) {
      console.error(err);
      setEditError(err.message || "Failed to update product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const totalProducts = inventory.length;

  const inStock = inventory.filter(
    (item) => item.quantity_available > 10
  ).length;

  const lowStock = inventory.filter(
    (item) =>
      item.quantity_available > 0 &&
      item.quantity_available <= 10
  ).length;

  const outOfStock = inventory.filter(
    (item) => item.quantity_available === 0
  ).length;

  return (
    <div className="p-8 text-white relative min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
            Inventory Management
          </h1>

          <p className="text-slate-400 mt-2">
            Manage products and stock levels
          </p>
        </div>

        <Link
          href="/inventory/add"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
        >
          + Add Product
        </Link>
      </div>

      {/* Inventory Tabs */}
      <div className="flex gap-2 p-1.5 bg-[#071028]/60 backdrop-blur-md border border-slate-800/80 rounded-2xl w-fit mb-8 shadow-inner">
        <Link
          href="/inventory"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md shadow-blue-500/10 text-sm"
        >
          Products
        </Link>

        <Link
          href="/inventory/suppliers"
          className="text-slate-400 hover:text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-slate-800/40 text-sm"
        >
          Suppliers
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="relative overflow-hidden bg-gradient-to-b from-[#091535]/80 to-[#071028]/80 border border-slate-800 hover:border-blue-500/30 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-500/30 via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-slate-400 text-sm font-medium tracking-wide">
            Total Products
          </h3>

          <p className="text-3xl font-extrabold mt-2 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
            {totalProducts}
          </p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-b from-[#091535]/80 to-[#071028]/80 border border-slate-800 hover:border-green-500/30 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-green-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-slate-400 text-sm font-medium tracking-wide">
            In Stock
          </h3>

          <p className="text-3xl font-extrabold mt-2 bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
            {inStock}
          </p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-b from-[#091535]/80 to-[#071028]/80 border border-slate-800 hover:border-yellow-500/30 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-yellow-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-slate-400 text-sm font-medium tracking-wide">
            Low Stock
          </h3>

          <p className="text-3xl font-extrabold mt-2 bg-gradient-to-r from-yellow-400 to-amber-300 bg-clip-text text-transparent">
            {lowStock}
          </p>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-b from-[#091535]/80 to-[#071028]/80 border border-slate-800 hover:border-red-500/30 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 group">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <h3 className="text-slate-400 text-sm font-medium tracking-wide">
            Out Of Stock
          </h3>

          <p className="text-3xl font-extrabold mt-2 bg-gradient-to-r from-red-400 to-rose-300 bg-clip-text text-transparent">
            {outOfStock}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gradient-to-b from-[#071028]/80 to-[#040b1e]/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0c1938]/40">
              <th className="text-left p-4 text-slate-300 font-semibold">ID</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Product</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Category</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Stock</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Price</th>
              <th className="text-left p-4 text-slate-300 font-semibold">Status</th>
              <th className="text-right p-4 pr-8 text-slate-300 font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center p-12 text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading products...</span>
                  </div>
                </td>
              </tr>
            ) : inventory.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-12 text-slate-400">
                  <p className="font-medium text-slate-300">No products found</p>
                </td>
              </tr>
            ) : (
              inventory.map((item) => {
                let status = "In Stock";

                if (item.quantity_available === 0) {
                  status = "Out Of Stock";
                } else if (
                  item.quantity_available <= 10
                ) {
                  status = "Low Stock";
                }

                return (
                  <tr
                    key={item.id}
                    className="border-b border-slate-800 hover:bg-[#0c1836]/40 transition duration-150"
                  >
                    <td className="p-4 font-mono text-slate-400 text-sm">
                      {item.product.id}
                    </td>

                    <td className="p-4 font-medium text-white">
                      {item.product.name}
                    </td>

                    <td className="p-4 text-slate-300">
                      {item.product.category?.name ||
                        "N/A"}
                    </td>

                    <td className="p-4 text-slate-300">
                      {item.quantity_available}
                    </td>

                    <td className="p-4 text-slate-300">
                      ₹{item.product.selling_price.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          status === "In Stock"
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : status === "Low Stock"
                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {status}
                      </span>
                    </td>

                    <td className="p-4 text-right pr-8">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all shadow-md hover:shadow-blue-500/15"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {isEditModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#071028]/95 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 md:p-8 max-w-xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh]">
            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-extrabold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
                  Edit Product Details
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  Update stock levels, price, and status for this product.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {editError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-xs flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Editable Fields Section */}
              <div className="bg-[#0b1633]/50 border border-blue-500/10 rounded-2xl p-4 md:p-6 space-y-4">
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">Editable Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Product Name */}
                  <div className="flex flex-col md:col-span-2">
                    <label className="text-slate-300 text-xs font-semibold mb-2">Product Name *</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-[#020817] border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Stock */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 text-xs font-semibold mb-2">Stock (Quantity Available) *</label>
                    <input
                      type="number"
                      min="0"
                      value={editStock}
                      onChange={(e) => setEditStock(e.target.value)}
                      className="bg-[#020817] border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Status */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 text-xs font-semibold mb-2">Status *</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="bg-[#020817] border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-all duration-200 cursor-pointer"
                      required
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="DISCONTINUED">DISCONTINUED</option>
                    </select>
                  </div>

                  {/* Cost Price */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 text-xs font-semibold mb-2">Cost Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editCostPrice}
                      onChange={(e) => setEditCostPrice(e.target.value)}
                      className="bg-[#020817] border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 text-xs font-semibold mb-2">Selling Price (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="bg-[#020817] border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 text-xs font-semibold mb-2">Category</label>
                    <select
                      value={editCategoryId}
                      onChange={(e) => setEditCategoryId(e.target.value)}
                      className="bg-[#020817] border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Supplier */}
                  <div className="flex flex-col">
                    <label className="text-slate-300 text-xs font-semibold mb-2">Supplier</label>
                    <select
                      value={editSupplierId}
                      onChange={(e) => setEditSupplierId(e.target.value)}
                      className="bg-[#020817] border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-all duration-200 cursor-pointer"
                    >
                      <option value="">Select Supplier</option>
                      {suppliers.map((sup) => (
                        <option key={sup.id} value={sup.id}>
                          {sup.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Read Only Fields Section */}
              <div className="bg-[#0c1836]/20 border border-slate-800/80 rounded-2xl p-4 md:p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Read-Only Details</h3>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs md:text-sm">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Product ID</span>
                    <span className="text-slate-300 font-mono">{selectedItem.product.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">SKU</span>
                    <span className="text-slate-300 font-mono">{selectedItem.product.sku}</span>
                  </div>
                  {selectedItem.product.description && (
                    <div className="col-span-2">
                      <span className="text-slate-500 block mb-0.5">Description</span>
                      <span className="text-slate-400 text-xs block bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/50">{selectedItem.product.description}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-slate-500 block mb-0.5">Unit of Measure</span>
                    <span className="text-slate-300">
                      {selectedItem.product.unitofmeasure 
                        ? `${selectedItem.product.unitofmeasure.name} (${selectedItem.product.unitofmeasure.symbol})`
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={saving}
                  className="bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white px-5 py-2.5 rounded-xl font-semibold transition border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[100px] text-sm"
                >
                  {saving ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}