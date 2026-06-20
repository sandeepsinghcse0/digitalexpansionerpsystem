"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type FormErrors = {
  name?: string;
  email?: string;
  phone?: string;
  gst_number?: string;
  pan_number?: string;
  api?: string;
};

export default function AddSupplierForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryCode: "+91",
    gst_number: "",
    pan_number: "",
    payment_terms: "",
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryCodes = [
    "+91", "+1", "+44", "+61", "+81",
    "+86", "+49", "+33", "+39", "+7",
    "+971", "+974", "+966", "+92", "+880",
    "+94", "+65", "+60", "+62", "+82",
    "+64", "+55", "+27", "+34", "+46"
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    let value = e.target.value;
    
    // Automatically capitalize GST & PAN input values
    if (e.target.name === "gst_number" || e.target.name === "pan_number") {
      value = value.toUpperCase();
    }

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const validate = (): boolean => {
    const tempErrors: FormErrors = {};
    let isValid = true;

    // Validate name (required)
    if (!formData.name.trim()) {
      tempErrors.name = "Business name is required.";
      isValid = false;
    }

    // Validate phone (optional, but if provided must be 10 digits)
    if (formData.phone.trim()) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        tempErrors.phone = "Phone number must be exactly 10 digits.";
        isValid = false;
      }
    }

    // Validate email (optional, but if provided must match pattern)
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        tempErrors.email = "Please enter a valid email address.";
        isValid = false;
      }
    }

    // Validate GST Number (optional)
    if (formData.gst_number.trim()) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;
      if (!gstRegex.test(formData.gst_number.trim())) {
        tempErrors.gst_number = "Invalid GST format (e.g. 09ABCDE1234F1Z5).";
        isValid = false;
      }
    }

    // Validate PAN Number (optional)
    if (formData.pan_number.trim()) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formData.pan_number.trim())) {
        tempErrors.pan_number = "Invalid PAN format (e.g. ABCDF1234E).";
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    const body = {
      tenant_id: 1, // replace with actual tenant id
      name: formData.name.trim(),
      email: formData.email.trim() || null,
      phone: formData.phone.trim() ? `${formData.countryCode}${formData.phone.trim()}` : null,
      gst_number: formData.gst_number.trim() || null,
      pan_number: formData.pan_number.trim() || null,
      payment_terms: formData.payment_terms.trim() || null,
      status: formData.status,
    };

    try {
      const res = await fetch("/api/suppliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create supplier");
      }

      router.push("/inventory/suppliers");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        api: error.message || "An unexpected error occurred while saving the supplier.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* Background glow elements */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-600/10 rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Top Banner API Error */}
      {errors.api && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <span>{errors.api}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-[#071028]/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Name */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
              <span>Business Name</span>
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Tech Supplies Ltd"
              value={formData.name}
              onChange={handleChange}
              className={`bg-[#020817] border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                errors.name ? "border-red-500/50" : "border-slate-800 focus:border-blue-500/80"
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="e.g. sales@techsupplies.com"
              value={formData.email}
              onChange={handleChange}
              className={`bg-[#020817] border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                errors.email ? "border-red-500/50" : "border-slate-800 focus:border-blue-500/80"
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</span>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2">Phone Number</label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="bg-[#020817] border border-slate-800 rounded-xl px-3 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer font-medium"
              >
                {countryCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>

              <input
                type="text"
                name="phone"
                maxLength={10}
                placeholder="10-digit number"
                value={formData.phone}
                onChange={handleChange}
                className={`flex-1 bg-[#020817] border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all ${
                  errors.phone ? "border-red-500/50" : "border-slate-800 focus:border-blue-500/80"
                }`}
              />
            </div>
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</span>
            )}
          </div>

          {/* GST Number */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2">GST Number</label>
            <input
              type="text"
              name="gst_number"
              placeholder="e.g. 09ABCDE1234F1Z5"
              value={formData.gst_number}
              onChange={handleChange}
              className={`bg-[#020817] border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase ${
                errors.gst_number ? "border-red-500/50" : "border-slate-800 focus:border-blue-500/80"
              }`}
            />
            {errors.gst_number && (
              <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.gst_number}</span>
            )}
          </div>

          {/* PAN Number */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2">PAN Number</label>
            <input
              type="text"
              name="pan_number"
              placeholder="e.g. ABCDF1234E"
              value={formData.pan_number}
              onChange={handleChange}
              className={`bg-[#020817] border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all uppercase ${
                errors.pan_number ? "border-red-500/50" : "border-slate-800 focus:border-blue-500/80"
              }`}
            />
            {errors.pan_number && (
              <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.pan_number}</span>
            )}
          </div>

          {/* Payment Terms */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2">Payment Terms</label>
            <input
              type="text"
              name="payment_terms"
              placeholder="e.g. Net 30 Days"
              value={formData.payment_terms}
              onChange={handleChange}
              className="bg-[#020817] border border-slate-800 focus:border-blue-500/80 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-[#020817] border border-slate-800 focus:border-blue-500/80 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer font-medium"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 border-t border-slate-800/80 pt-6 mt-8">
          <Link
            href="/inventory/suppliers"
            className="bg-transparent hover:bg-slate-800 text-slate-400 hover:text-white px-6 py-3 rounded-xl font-semibold transition border border-slate-800 hover:border-slate-700 disabled:opacity-50 text-center"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[150px]"
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving...</span>
              </>
            ) : (
              <span>Submit Supplier</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}