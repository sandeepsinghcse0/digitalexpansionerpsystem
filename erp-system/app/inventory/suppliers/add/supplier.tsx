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
  payment_terms?: string;
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
  const [showModal, setShowModal] = useState(false);
  const [modalErrors, setModalErrors] = useState<string[]>([]);

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

  const validate = (): { isValid: boolean; messages: string[] } => {
    const tempErrors: FormErrors = {};
    const messages: string[] = [];
    let isValid = true;

    // Validate name (required)
    if (!formData.name || !formData.name.trim()) {
      tempErrors.name = "Business name is required.";
      messages.push("Business name is required.");
      isValid = false;
    }

    // Validate email (required & valid format)
    if (!formData.email || !formData.email.trim()) {
      tempErrors.email = "Email address is required.";
      messages.push("Email address is required.");
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        tempErrors.email = "Please enter a valid email address.";
        messages.push("Please enter a valid email address.");
        isValid = false;
      }
    }

    // Validate phone (required & 10 digits)
    if (!formData.phone || !formData.phone.trim()) {
      tempErrors.phone = "Phone number is required.";
      messages.push("Phone number is required.");
      isValid = false;
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        tempErrors.phone = "Phone number must be exactly 10 digits.";
        messages.push("Phone number must be exactly 10 digits.");
        isValid = false;
      }
    }

    // Validate GST Number (optional)
    if (formData.gst_number && typeof formData.gst_number === "string" && formData.gst_number.trim()) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;
      if (!gstRegex.test(formData.gst_number.trim())) {
        tempErrors.gst_number = "Invalid GST format (e.g. 09ABCDE1234F1Z5).";
        messages.push("Invalid GST format (e.g. 09ABCDE1234F1Z5).");
        isValid = false;
      }
    }

    // Validate PAN Number (required & valid format)
    if (!formData.pan_number || !formData.pan_number.trim()) {
      tempErrors.pan_number = "PAN number is required.";
      messages.push("PAN number is required.");
      isValid = false;
    } else {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      if (!panRegex.test(formData.pan_number.trim())) {
        tempErrors.pan_number = "Invalid PAN format (e.g. ABCDF1234E).";
        messages.push("Invalid PAN format (e.g. ABCDF1234E).");
        isValid = false;
      }
    }

    // Validate Payment Terms (required)
    if (!formData.payment_terms || !formData.payment_terms.trim()) {
      tempErrors.payment_terms = "Payment terms are required.";
      messages.push("Payment terms are required.");
      isValid = false;
    }

    setErrors(tempErrors);
    return { isValid, messages };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, messages } = validate();
    if (!isValid) {
      setModalErrors(messages);
      setShowModal(true);
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    const body = {
      tenant_id: 1, // replace with actual tenant id
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: `${formData.countryCode}${formData.phone.trim()}`,
      gst_number: formData.gst_number.trim() || null,
      pan_number: formData.pan_number.trim(),
      payment_terms: formData.payment_terms.trim(),
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          <span>{errors.api}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-b from-[#071028]/80 to-[#040b1e]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
      >
        {/* Form Glow Blobs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          {/* Business Name */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
              <span>Business Name</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Tech Supplies Ltd"
              value={formData.name}
              onChange={handleChange}
              className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                errors.name ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
              }`}
            />
            {errors.name && (
              <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
              <span>Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="e.g. sales@techsupplies.com"
              value={formData.email}
              onChange={handleChange}
              className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                errors.email ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
              }`}
            />
            {errors.email && (
              <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</span>
            )}
          </div>

          {/* Phone Number */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
              <span>Phone Number</span>
            </label>
            <div className="flex gap-2">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="bg-[#020817]/70 backdrop-blur-sm border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-3 py-3 text-white focus:outline-none transition-all duration-200 cursor-pointer font-medium"
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
                className={`flex-1 bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                  errors.phone ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
                }`}
              />
            </div>
            {errors.phone && (
              <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.phone}</span>
            )}
          </div>

          {/* GST Number */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
              <span>GST Number</span>
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="gst_number"
              placeholder="e.g. 09ABCDE1234F1Z5"
              value={formData.gst_number}
              onChange={handleChange}
              className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 uppercase ${
                errors.gst_number ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
              }`}
            />
            {errors.gst_number && (
              <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.gst_number}</span>
            )}
          </div>

          {/* PAN Number */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
              <span>PAN Number</span>
            </label>
            <input
              type="text"
              name="pan_number"
              placeholder="e.g. ABCDF1234E"
              value={formData.pan_number}
              onChange={handleChange}
              className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 uppercase ${
                errors.pan_number ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
              }`}
            />
            {errors.pan_number && (
              <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.pan_number}</span>
            )}
          </div>

          {/* Payment Terms */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2 flex items-center">
              <span>Payment Terms</span>
            </label>
            <input
              type="text"
              name="payment_terms"
              placeholder="e.g. Net 30 Days"
              value={formData.payment_terms}
              onChange={handleChange}
              className={`bg-[#020817]/70 backdrop-blur-sm border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 ${
                errors.payment_terms ? "border-red-500/50 focus:border-red-500" : "border-slate-800 focus:border-blue-500/80"
              }`}
            />
            {errors.payment_terms && (
              <span className="text-red-500 text-xs mt-1.5 font-medium">{errors.payment_terms}</span>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col">
            <label className="text-slate-300 text-sm font-semibold mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-[#020817]/70 backdrop-blur-sm border border-slate-800 focus:border-blue-500/80 focus:ring-2 focus:ring-blue-500/20 rounded-xl px-4 py-3 text-white focus:outline-none transition-all duration-200 cursor-pointer font-medium"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end items-center gap-4 border-t border-slate-800/80 pt-6 mt-8 relative z-10">
          <Link
            href="/inventory/suppliers"
            className="bg-transparent hover:bg-slate-800/40 text-slate-400 hover:text-white px-6 py-3 rounded-xl font-semibold transition border border-slate-850 hover:border-slate-800 disabled:opacity-50 text-center cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 flex items-center justify-center gap-2 min-w-[150px] cursor-pointer"
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

      {/* Validation Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#071028]/95 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Red accent glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-500/10 rounded-full blur-[30px] pointer-events-none" />

            <div className="flex items-center gap-3 text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 animate-bounce">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3 className="text-xl font-bold tracking-wide">Validation Required</h3>
            </div>

            <p className="text-slate-300 text-sm mb-4">
              Please fix the following validation errors before submitting:
            </p>

            <ul className="space-y-2 mb-6">
              {modalErrors.map((error, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-red-400 text-sm bg-red-500/5 px-3 py-2 rounded-lg border border-red-500/10 animate-in slide-in-from-left duration-150" style={{ animationDelay: `${idx * 50}ms` }}>
                  <span className="text-red-500 font-bold mt-0.5">•</span>
                  <span>{error}</span>
                </li>
              ))}
            </ul>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-2.5 rounded-xl transition duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-500/30 cursor-pointer"
              >
                Okay, Let me fix it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}