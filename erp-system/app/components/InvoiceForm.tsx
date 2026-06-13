"use client";

import { useState } from "react";
import InvoiceItem from "./InvoiceItem";
import InvoiceSummary from "./InvoiceSummary";
import InvoicePreview from "./InvoicePreview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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
  const [items, setItems] = useState([
    {
      description: "",
      qty: 1,
      rate: 0,
    },
  ]);

  const [showPreview, setShowPreview] = useState(false);
  const [invoiceNumber] = useState(`INV-${Date.now()}`);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [sellerDetails, setSellerDetails] = useState(emptySellerDetails);
  const [customerDetails, setCustomerDetails] = useState(emptyCustomerDetails);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const taxAmount = subtotal * 0.18;
  const totalAmount = subtotal + taxAmount;

  const downloadPDF = async () => {
    const invoice = document.getElementById("invoice-preview");

    if (!invoice) {
      alert("Open Preview First");
      return;
    }

    const canvas = await html2canvas(invoice);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = 190;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, pdfWidth, pdfHeight);
    pdf.save(`${invoiceNumber}.pdf`);
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
          <input value={invoiceNumber} readOnly className="rounded-xl bg-slate-900 p-3 text-white" />
          <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className="rounded-xl bg-slate-900 p-3 text-white" />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="rounded-xl bg-slate-900 p-3 text-white" />
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl bg-slate-900 p-3 text-white">
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      <div className="rounded-3xl bg-[#071028] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Seller Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input value={sellerDetails.businessName} onChange={(e) => setSellerDetails({ ...sellerDetails, businessName: e.target.value })} placeholder="Business Name" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.contactName} onChange={(e) => setSellerDetails({ ...sellerDetails, contactName: e.target.value })} placeholder="Contact Name" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input type="email" value={sellerDetails.email} onChange={(e) => setSellerDetails({ ...sellerDetails, email: e.target.value })} placeholder="Email" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.phone} onChange={(e) => setSellerDetails({ ...sellerDetails, phone: e.target.value })} placeholder="Phone" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.gstNumber} onChange={(e) => setSellerDetails({ ...sellerDetails, gstNumber: e.target.value })} placeholder="GST Number" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.panNumber || ""} onChange={(e) => setSellerDetails({ ...sellerDetails, panNumber: e.target.value })} placeholder="PAN Number" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.address} onChange={(e) => setSellerDetails({ ...sellerDetails, address: e.target.value })} placeholder="Address" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.city} onChange={(e) => setSellerDetails({ ...sellerDetails, city: e.target.value })} placeholder="City" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.state} onChange={(e) => setSellerDetails({ ...sellerDetails, state: e.target.value })} placeholder="State" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.postalCode} onChange={(e) => setSellerDetails({ ...sellerDetails, postalCode: e.target.value })} placeholder="Postal Code" className="rounded-xl bg-slate-900 p-4 text-white" />
        </div>
      </div>

      <div className="rounded-3xl bg-[#071028] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Customer Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input value={customerDetails.customerName} onChange={(e) => setCustomerDetails({ ...customerDetails, customerName: e.target.value })} placeholder="Customer Name" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.companyName} onChange={(e) => setCustomerDetails({ ...customerDetails, companyName: e.target.value })} placeholder="Company Name" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input type="email" value={customerDetails.email} onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })} placeholder="Email" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.phone} onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })} placeholder="Phone" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.gstNumber} onChange={(e) => setCustomerDetails({ ...customerDetails, gstNumber: e.target.value })} placeholder="GST Number" className="rounded-xl bg-slate-900 p-4 text-white" />
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

      <div className="flex flex-wrap gap-4">
        <button onClick={handleSave} disabled={isSaving} className="rounded-xl bg-yellow-500 px-6 py-3 text-white hover:bg-yellow-600 disabled:opacity-50">
          {isSaving ? "Saving..." : "Save Draft"}
        </button>
        <button onClick={() => setShowPreview(true)} className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700">
          Generate Invoice
        </button>
        <button onClick={downloadPDF} className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
          Download PDF
        </button>
      </div>

      <InvoicePreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        customerName={customerDetails.customerName}
        invoiceNumber={invoiceNumber}
        sellerDetails={sellerDetails}
        customerDetails={customerDetails}
        items={items}
      />
    </div>
  );
}