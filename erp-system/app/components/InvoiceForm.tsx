"use client";

import { useState, useEffect } from "react";
import InvoiceItem from "./InvoiceItem";
import InvoiceSummary from "./InvoiceSummary";
import InvoicePreview from "./InvoicePreview";

const emptySellerDetails = {
  businessName: "",
  contactName: "",
  email: "",
  phone: "",
  gstNumber: "",
  panNumber: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
};

const emptyCustomerDetails = {
  customerName: "",
  companyName: "",
  email: "",
  phone: "",
  gstNumber: "",
  panNumber: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
};

export default function InvoiceForm() {
  const generateUniqueInvoiceNumber = () => {
    const storageKey = "invoiceNumbers";
    try {
      if (typeof window === "undefined") {
        return String(Math.floor(100000 + Math.random() * 900000));
      }

      const stored = window.localStorage.getItem(storageKey);
      const existingNumbers = stored ? (JSON.parse(stored) as string[]) : [];
      const used = new Set(existingNumbers);
      let candidate = "";
      do {
        candidate = String(Math.floor(100000 + Math.random() * 900000));
      } while (used.has(candidate));

      used.add(candidate);
      window.localStorage.setItem(storageKey, JSON.stringify(Array.from(used)));
      return candidate;
    } catch {
      return String(Math.floor(100000 + Math.random() * 900000));
    }
  };

  const sanitizeGstNumber = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 15);
  const sanitizePanNumber = (value: string) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);

  const [items, setItems] = useState([
    {
      description: "",
      qty: 1,
      rate: 0,
      gstRate: 18,
    },
  ]);
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");

useEffect(() => {
  setInvoiceNumber(generateUniqueInvoiceNumber());
}, []);
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [sellerDetails, setSellerDetails] = useState(emptySellerDetails);
  const [customerDetails, setCustomerDetails] = useState(emptyCustomerDetails);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const taxAmount = items.reduce((sum, item) => sum + item.qty * item.rate * ((item.gstRate ?? 18) / 100), 0);
  const totalAmount = subtotal + taxAmount;

  const validateInvoiceForm = () => {
    const errors: string[] = [];
    const gstRegex = /^[A-Z0-9]{15}$/;
    const panRegex = /^[A-Z0-9]{10}$/;

    if (sellerDetails.gstNumber && !gstRegex.test(sellerDetails.gstNumber)) {
      errors.push("Seller GST number must be 15 uppercase alphanumeric characters.");
    }
    if (customerDetails.gstNumber && !gstRegex.test(customerDetails.gstNumber)) {
      errors.push("Customer GST number must be 15 uppercase alphanumeric characters.");
    }
    if (sellerDetails.panNumber && !panRegex.test(sellerDetails.panNumber)) {
      errors.push("Seller PAN number must be 10 uppercase alphanumeric characters.");
    }
    if (customerDetails.panNumber && !panRegex.test(customerDetails.panNumber)) {
      errors.push("Customer PAN number must be 10 uppercase alphanumeric characters.");
    }
    if (invoiceDate && Number.isNaN(Date.parse(invoiceDate))) {
      errors.push("Invoice date must be a valid date.");
    }
    if (dueDate && Number.isNaN(Date.parse(dueDate))) {
      errors.push("Due date must be a valid date.");
    }
    if (invoiceDate && dueDate && new Date(dueDate) < new Date(invoiceDate)) {
      errors.push("Due date cannot be earlier than the invoice date.");
    }

    return errors;
  };

  const validationErrors = validateInvoiceForm();

const downloadPDF = () => {
  if (!showPreview) {
    setShowPreview(true);
    alert("Please click 'Download PDF' from the preview modal.");
  }
};

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          invoiceNumber,
          invoiceDate,
          dueDate,
          status,
          sellerDetails,
          customerDetails,
          subtotal,
          taxAmount,
          totalAmount,
          items,
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save invoice");
      }

      alert("Invoice saved successfully");
    } catch (error) {
      console.error(error);
      alert(error instanceof Error ? error.message : "Unable to save invoice");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#071028] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Invoice Information</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Invoice Number</label>
            <input value={invoiceNumber} readOnly className="w-full rounded-xl bg-slate-900 p-3 text-white" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Invoice Date</label>
            <input
              type="date"
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
              placeholder="Select invoice date"
              className="w-full rounded-xl bg-slate-900 p-3 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              placeholder="Select due date"
              className="w-full rounded-xl bg-slate-900 p-3 text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Invoice Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl bg-slate-900 p-3 text-white">
              <option value="DRAFT">Draft</option>
              <option value="SENT">Sent</option>
              <option value="PAID">Paid</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-[#071028] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Seller Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input value={sellerDetails.businessName} onChange={(e) => setSellerDetails({ ...sellerDetails, businessName: e.target.value })} placeholder="Business Name" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.contactName} onChange={(e) => setSellerDetails({ ...sellerDetails, contactName: e.target.value })} placeholder="Contact Name" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input type="email" value={sellerDetails.email} onChange={(e) => setSellerDetails({ ...sellerDetails, email: e.target.value })} placeholder="Email" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.phone} onChange={(e) => setSellerDetails({ ...sellerDetails, phone: e.target.value })} placeholder="Phone" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.gstNumber} onChange={(e) => setSellerDetails({ ...sellerDetails, gstNumber: sanitizeGstNumber(e.target.value) })} placeholder="GST Number (15 chars)" maxLength={15} pattern="[A-Z0-9]{15}" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.panNumber || ""} onChange={(e) => setSellerDetails({ ...sellerDetails, panNumber: sanitizePanNumber(e.target.value) })} placeholder="PAN Number (10 chars)" maxLength={10} pattern="[A-Z0-9]{10}" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.address} onChange={(e) => setSellerDetails({ ...sellerDetails, address: e.target.value })} placeholder="Address" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.city} onChange={(e) => setSellerDetails({ ...sellerDetails, city: e.target.value })} placeholder="City" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.state} onChange={(e) => setSellerDetails({ ...sellerDetails, state: e.target.value })} placeholder="State" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.postalCode} onChange={(e) => setSellerDetails({ ...sellerDetails, postalCode: e.target.value })} placeholder="Postal Code" className="rounded-xl bg-slate-900 p-4 text-white" />
        </div>
      </div>

      <div className="rounded-3xl bg-[#071028] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Customer Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            value={customerName}
            onChange={(e) => {
              const value = e.target.value;
              setCustomerName(value);
              setCustomerDetails((prev) => ({ ...prev, customerName: value }));
            }}
            placeholder="Customer Name"
            className="rounded-xl bg-slate-900 p-4 text-white"
          />
          <input value={customerDetails.companyName} onChange={(e) => setCustomerDetails({ ...customerDetails, companyName: e.target.value })} placeholder="Company Name" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input type="email" value={customerDetails.email} onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })} placeholder="Email" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.phone} onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })} placeholder="Phone" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.gstNumber} onChange={(e) => setCustomerDetails({ ...customerDetails, gstNumber: sanitizeGstNumber(e.target.value) })} placeholder="GST Number (15 chars)" maxLength={15} pattern="[A-Z0-9]{15}" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.panNumber || ""} onChange={(e) => setCustomerDetails({ ...customerDetails, panNumber: sanitizePanNumber(e.target.value) })} placeholder="PAN Number (10 chars)" maxLength={10} pattern="[A-Z0-9]{10}" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.address} onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })} placeholder="Address" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.city} onChange={(e) => setCustomerDetails({ ...customerDetails, city: e.target.value })} placeholder="City" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.state} onChange={(e) => setCustomerDetails({ ...customerDetails, state: e.target.value })} placeholder="State" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.postalCode} onChange={(e) => setCustomerDetails({ ...customerDetails, postalCode: e.target.value })} placeholder="Postal Code" className="rounded-xl bg-slate-900 p-4 text-white" />
        </div>
      </div>

      <div className="rounded-3xl bg-[#071028] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Notes</h2>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Optional notes" className="w-full rounded-xl bg-slate-900 p-4 text-white" />
      </div>

      <InvoiceItem items={items} setItems={setItems} />
      <InvoiceSummary items={items} />

      {validationErrors.length > 0 ? (
        <div className="rounded-3xl border border-red-400 bg-red-950/20 p-4 text-sm text-red-200">
          <div className="font-semibold text-red-100 mb-2">Please fix the following issues before saving:</div>
          <ul className="list-disc space-y-1 pl-5">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving || validationErrors.length > 0}
          className="rounded-xl bg-yellow-500 px-6 py-3 text-white hover:bg-yellow-600 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Draft"}
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700"
        >
          Generate Invoice
        </button>
        <button
          onClick={downloadPDF}
          className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>

      <InvoicePreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        customerName={customerName || customerDetails.customerName}
        invoiceNumber={invoiceNumber}
        invoiceDate={invoiceDate}
        dueDate={dueDate}
        status={status}
        notes={notes}
        sellerDetails={sellerDetails}
        customerDetails={customerDetails}
        items={items}
      />
    </div>
  );
}