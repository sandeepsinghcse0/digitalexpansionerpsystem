"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type InventoryItem = {
  id: number;
  quantity_available: number;
  product: {
    id: number;
    name: string;
    selling_price: number;
    category?: {
      name: string;
    } | null;
  };
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

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

        <Link
          href="/inventory/add"
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-medium"
        >
          + Add Product
        </Link>
      </div>

      {/* Inventory Tabs */}
      <div className="flex gap-4 mb-8">
        <Link
          href="/inventory"
          className="bg-blue-600 px-5 py-3 rounded-xl font-medium"
        >
          Products
        </Link>

        <Link
          href="/inventory/suppliers"
          className="bg-[#071028] border border-slate-800 px-5 py-3 rounded-xl font-medium hover:bg-slate-800"
        >
          Suppliers
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Total Products
          </h3>

          <p className="text-3xl font-bold mt-2">
            {totalProducts}
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            In Stock
          </h3>

          <p className="text-3xl font-bold mt-2 text-green-400">
            {inStock}
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Low Stock
          </h3>

          <p className="text-3xl font-bold mt-2 text-yellow-400">
            {lowStock}
          </p>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl p-6">
          <h3 className="text-slate-400 text-sm">
            Out Of Stock
          </h3>

          <p className="text-3xl font-bold mt-2 text-red-400">
            {outOfStock}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#071028] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-800">
              <th className="text-left p-4">ID</th>
              <th className="text-left p-4">Product</th>
              <th className="text-left p-4">Category</th>
              <th className="text-left p-4">Stock</th>
              <th className="text-left p-4">Price</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-8"
                >
                  Loading...
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
                    className="border-b border-slate-800"
                  >
                    <td className="p-4">
                      {item.product.id}
                    </td>

                    <td className="p-4">
                      {item.product.name}
                    </td>

                    <td className="p-4">
                      {item.product.category?.name ||
                        "N/A"}
                    </td>

                    <td className="p-4">
                      {item.quantity_available}
                    </td>

                    <td className="p-4">
                      ₹
                      {item.product.selling_price.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          status === "In Stock"
                            ? "bg-green-600"
                            : status === "Low Stock"
                            ? "bg-yellow-600"
                            : "bg-red-600"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}