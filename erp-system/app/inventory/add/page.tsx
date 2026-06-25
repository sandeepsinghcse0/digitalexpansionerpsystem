"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
};

type Unit = {
  id: number;
  name: string;
  symbol: string;
};

type GstRate = {
  id: number;
  name: string;
  percentage: number;
};

type Supplier = {
  id: number;
  name: string;
};

type FormErrors = {
  sku?: string;
  name?: string;
  unit_id?: string;
  cost_price?: string;
  selling_price?: string;
  gst_rate_id?: string;
  quantity_in_stock?: string;
  reorder_level?: string;
  category_id?: string;
  api?: string;
};

export default function AddProductPage() {
  const router = useRouter();

  // Dropdown States
  const [categories, setCategories] = useState<Category[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [gstRates, setGstRates] = useState<GstRate[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Page Load State
  const [loadingMetadata, setLoadingMetadata] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [sku, setSku] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantityInStock, setQuantityInStock] = useState("0");
  const [reorderLevel, setReorderLevel] = useState("0");
  const [gstRateId, setGstRateId] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  // Validation Errors State
  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch Metadata on Load
  useEffect(() => {
    fetch("/api/inventory/metadata")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load metadata");
        return res.json();
      })
      .then((data) => {
        setCategories(data.categories || []);
        setUnits(data.units || []);
        setGstRates(data.gstRates || []);
        setSuppliers(data.suppliers || []);

        // Set default selections if data is present
        if (data.units && data.units.length > 0) {
          setUnitId(data.units[0].id.toString());
        }
        if (data.gstRates && data.gstRates.length > 0) {
          // Select 18% or first rate as default
          const defaultRate = data.gstRates.find((r: GstRate) => r.percentage === 18) || data.gstRates[0];
          setGstRateId(defaultRate.id.toString());
        }
        setLoadingMetadata(false);
      })
      .catch((err) => {
        console.error("Metadata load error:", err);
        setErrors((prev) => ({ ...prev, api: "Failed to load form dropdown values. Please refresh the page." }));
        setLoadingMetadata(false);
      });
  }, []);

  // Form Validation
  const validateForm = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    if (!sku.trim()) {
      tempErrors.sku = "SKU is required.";
      isValid = false;
    }
    if (!name.trim()) {
      tempErrors.name = "Product name is required.";
      isValid = false;
    }
    if (!unitId) {
      tempErrors.unit_id = "Please select a unit of measure.";
      isValid = false;
    }
    if (!gstRateId) {
      tempErrors.gst_rate_id = "Please select a GST rate.";
      isValid = false;
    }

    // Custom Category Validation
    if (categoryId === "other" && !customCategory.trim()) {
      tempErrors.category_id = "Custom category name is required.";
      isValid = false;
    }

    // Cost Price Validation
    const cost = parseFloat(costPrice);
    if (costPrice.trim() === "" || Number.isNaN(cost)) {
      tempErrors.cost_price = "Cost price is required.";
      isValid = false;
    } else if (cost <= 0) {
      tempErrors.cost_price = "Cost price must be greater than 0.";
      isValid = false;
    }

    // Selling Price Validation
    const sell = parseFloat(sellingPrice);
    if (sellingPrice.trim() === "" || Number.isNaN(sell)) {
      tempErrors.selling_price = "Selling price is required.";
      isValid = false;
    } else if (sell <= 0) {
      tempErrors.selling_price = "Selling price must be greater than 0.";
      isValid = false;
    }

    // Quantity Validation
    const qty = parseInt(quantityInStock, 10);
    if (quantityInStock.trim() === "" || Number.isNaN(qty)) {
      tempErrors.quantity_in_stock = "Quantity in stock is required.";
      isValid = false;
    } else if (qty < 0) {
      tempErrors.quantity_in_stock = "Quantity cannot be negative.";
      isValid = false;
    }

    // Reorder Level Validation
    const reorder = parseInt(reorderLevel, 10);
    if (reorderLevel.trim() === "" || Number.isNaN(reorder)) {
      tempErrors.reorder_level = "Reorder level is required.";
      isValid = false;
    } else if (reorder < 0) {
      tempErrors.reorder_level = "Reorder level cannot be negative.";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setErrors({});

    const payload = {
      sku: sku.trim(),
      name: name.trim(),
      description: description.trim() || null,
      category_id: categoryId === "other" ? "other" : (categoryId ? parseInt(categoryId, 10) : null),
      custom_category: categoryId === "other" ? customCategory.trim() : null,
      supplier_id: supplierId ? parseInt(supplierId, 10) : null,
      unit_id: parseInt(unitId, 10),
      cost_price: parseFloat(costPrice),
      selling_price: parseFloat(sellingPrice),
      quantity_in_stock: parseInt(quantityInStock, 10),
      reorder_level: parseInt(reorderLevel, 10),
      gst_rate_id: parseInt(gstRateId, 10),
      status,
    };

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      // Success - redirect to inventory table
      router.push("/inventory");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setErrors((prev) => ({ ...prev, api: err.message || "Something went wrong while saving the product." }));
      setSubmitting(false);
    }
  };

  return (
    <div className="p-8 text-white relative min-h-screen">
      {/* Premium background glow elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header Container */}
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/inventory"
          className="inline-flex items-center text-slate-400 hover:text-white transition gap-2 group mb-4 text-sm font-medium"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>Back to Products</span>
        </Link>
        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
          Add New Product
        </h1>
        <p className="text-slate-400 mt-2">
          Create a new product in the catalog and initialize its stock level.
        </p>
      </div>

      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto">
        {errors.api && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <span>{errors.api}</span>
          </div>
        )}

        {loadingMetadata ? (
          <div className="bg-gradient-to-b from-[#071028]/80 to-[#040b1e]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-12 flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium animate-pulse">Loading form configurations...</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-gradient-to-b from-[#071028]/80 to-[#040b1e]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
          >
            {/* Form Glow Blobs */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 relative z-10">
              {/* Product Name */}
              <div className="flex flex-col">
                <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
                  <span>Product Name</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Mouse"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.name ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
                    }`}
                />
                {errors.name && (
                  <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</span>
                )}
              </div>

              {/* SKU */}
              <div className="flex flex-col">
                <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
                  <span>SKU (Stock Keeping Unit)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. WM-102-BL"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.sku ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
                    }`}
                />
                {errors.sku && (
                  <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.sku}</span>
                )}
              </div>

              {/* Description (Full Width Span) */}
              <div className="flex flex-col md:col-span-2">
                <label className="text-slate-300 text-sm font-semibold mb-2">Description</label>
                <textarea
                  placeholder="Add a detailed product description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="bg-[#020817]/70 backdrop-blur-sm border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none transition-all duration-200 resize-none"
                />
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-col">
                <label className="text-slate-300 text-sm font-semibold mb-2">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="bg-[#020817]/70 backdrop-blur-sm border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-200 cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {categories
                    .filter((cat) => cat.name !== "Others")
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Custom Category Input (shown when Category is Other) */}
              {categoryId === "other" && (
                <div className="flex flex-col">
                  <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
                    <span>Custom Category</span>
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="custom category"
                    placeholder="Category add"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.category_id ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
                      }`}
                  />
                  {errors.category_id && (
                    <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.category_id}</span>
                  )}
                </div>
              )}

              {/* Supplier Dropdown */}
              <div className="flex flex-col">
                <label className="text-slate-300 text-sm font-semibold mb-2">Supplier</label>
                <select
                  value={supplierId}
                  onChange={(e) => setSupplierId(e.target.value)}
                  className="bg-[#020817]/70 backdrop-blur-sm border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-200 cursor-pointer"
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((sup) => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Unit of Measure Dropdown */}
              <div className="flex flex-col">
                <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
                  <span>Unit of Measure</span>
                </label>
                <select
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                  className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer ${errors.unit_id ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
                    }`}
                >
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.symbol})
                    </option>
                  ))}
                </select>
                {errors.unit_id && (
                  <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.unit_id}</span>
                )}
              </div>

              {/* GST Rate Dropdown */}
              <div className="flex flex-col">
                <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
                  <span>GST Rate</span>
                </label>
                <select
                  value={gstRateId}
                  onChange={(e) => setGstRateId(e.target.value)}
                  className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 cursor-pointer ${errors.gst_rate_id ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
                    }`}
                >
                  {gstRates.map((rate) => (
                    <option key={rate.id} value={rate.id}>
                      {rate.name}
                    </option>
                  ))}
                </select>
                {errors.gst_rate_id && (
                  <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.gst_rate_id}</span>
                )}
              </div>

              {/* Cost Price */}
              <div className="flex flex-col">
                <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
                  <span>Cost Price (₹)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={costPrice}
                  onChange={(e) => setCostPrice(e.target.value)}
                  className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.cost_price ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
                    }`}
                />
                {errors.cost_price && (
                  <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.cost_price}</span>
                )}
              </div>

              {/* Selling Price */}
              <div className="flex flex-col">
                <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
                  <span>Selling Price (₹)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(e.target.value)}
                  className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.selling_price ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
                    }`}
                />
                {errors.selling_price && (
                  <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.selling_price}</span>
                )}
              </div>

              {/* Quantity in Stock */}
              <div className="flex flex-col">
                <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
                  <span>Quantity in Stock</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={quantityInStock}
                  onChange={(e) => setQuantityInStock(e.target.value)}
                  className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.quantity_in_stock ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
                    }`}
                />
                {errors.quantity_in_stock && (
                  <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.quantity_in_stock}</span>
                )}
              </div>

              {/* Reorder Level */}
              <div className="flex flex-col">
                <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
                  <span>Reorder Level</span>
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={reorderLevel}
                  onChange={(e) => setReorderLevel(e.target.value)}
                  className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${errors.reorder_level ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
                    }`}
                />
                {errors.reorder_level && (
                  <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.reorder_level}</span>
                )}
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <label className="text-slate-300 text-sm font-semibold mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-[#020817]/70 backdrop-blur-sm border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-200 cursor-pointer"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                  <option value="DISCONTINUED">DISCONTINUED</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end items-center gap-4 border-t border-slate-800/80 pt-6 mt-8 relative z-10">
              <button
                type="button"
                onClick={() => router.push("/inventory")}
                disabled={submitting}
                className="bg-transparent hover:bg-slate-800/40 text-slate-400 hover:text-white px-6 py-3 rounded-xl font-semibold transition border border-slate-850 hover:border-slate-800 disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[140px] cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Add Product</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
