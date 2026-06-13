"use client";

import { useState } from "react";
import InvoiceItem from "./InvoiceItem";
import InvoiceSummary from "./InvoiceSummary";
import InvoicePreview from "./InvoicePreview";
import jsPDF from "jspdf";

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
  const [invoiceNumber] = useState(() => `INV-${Date.now()}`);
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

  const downloadPDF = () => {
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const lineHeight = 12;
      let y = margin;

      const setTextStyle = (size: number, weight: "normal" | "bold" = "normal") => {
        doc.setFont("helvetica", weight);
        doc.setFontSize(size);
      };

      const addWrappedText = (
        text: string,
        x: number,
        maxWidth: number,
        startY: number,
        size = 10,
        weight: "normal" | "bold" = "normal"
      ) => {
        setTextStyle(size, weight);
        const lines = doc.splitTextToSize(text || "", maxWidth);
        doc.text(lines, x, startY);
        return startY + lines.length * (size >= 11 ? 12 : lineHeight);
      };

      setTextStyle(24, "bold");
      doc.text("INVOICE", margin, y);
      y += 28;

      setTextStyle(10, "bold");
      y = addWrappedText(sellerDetails.businessName || "Seller Name", margin, 220, y, 10, "bold");
      y = addWrappedText(sellerDetails.contactName || "Seller Contact", margin, 220, y, 10);
      y = addWrappedText(sellerDetails.email || "", margin, 220, y, 10);
      y = addWrappedText(sellerDetails.phone || "", margin, 220, y, 10);
      y = addWrappedText(
        [sellerDetails.address, sellerDetails.city, sellerDetails.state, sellerDetails.postalCode]
          .filter(Boolean)
          .join(", "),
        margin,
        220,
        y,
        10
      );

      setTextStyle(10, "bold");
      doc.text("Invoice No:", pageWidth - 180, margin);
      setTextStyle(10, "normal");
      doc.text(invoiceNumber, pageWidth - 110, margin);
      setTextStyle(10, "bold");
      doc.text("Invoice Date:", pageWidth - 180, margin + 16);
      setTextStyle(10, "normal");
      doc.text(invoiceDate || "", pageWidth - 110, margin + 16);
      setTextStyle(10, "bold");
      doc.text("Due Date:", pageWidth - 180, margin + 32);
      setTextStyle(10, "normal");
      doc.text(dueDate || "—", pageWidth - 110, margin + 32);
      setTextStyle(10, "bold");
      doc.text("Status:", pageWidth - 180, margin + 48);
      setTextStyle(10, "normal");
      doc.text(status || "DRAFT", pageWidth - 110, margin + 48);

      y = Math.max(y + 16, margin + 90);
      doc.setDrawColor(180);
      doc.line(margin, y, pageWidth - margin, y);
      y += 16;

      const billFromX = margin;
      const billToX = pageWidth / 2 + 10;
      setTextStyle(12, "bold");
      doc.text("Bill From", billFromX, y);
      doc.text("Bill To", billToX, y);
      y += 14;

      setTextStyle(10, "normal");
      y = addWrappedText(sellerDetails.businessName || "Seller", billFromX, 220, y, 10, "bold");
      y = addWrappedText(sellerDetails.contactName || "", billFromX, 220, y, 10);
      y = addWrappedText(sellerDetails.email || "", billFromX, 220, y, 10);
      y = addWrappedText(sellerDetails.phone || "", billFromX, 220, y, 10);
      y = addWrappedText(
        [sellerDetails.address, sellerDetails.city, sellerDetails.state, sellerDetails.postalCode]
          .filter(Boolean)
          .join(", "),
        billFromX,
        220,
        y,
        10
      );
      y = addWrappedText(`GST: ${sellerDetails.gstNumber || ""}`, billFromX, 220, y, 10);
      y = addWrappedText(`PAN: ${sellerDetails.panNumber || ""}`, billFromX, 220, y, 10);

      let yTo = y - 12 * 6;
      yTo = addWrappedText(customerDetails.customerName || "Customer", billToX, 220, yTo, 10, "bold");
      yTo = addWrappedText(customerDetails.companyName || "", billToX, 220, yTo, 10);
      yTo = addWrappedText(customerDetails.email || "", billToX, 220, yTo, 10);
      yTo = addWrappedText(customerDetails.phone || "", billToX, 220, yTo, 10);
      yTo = addWrappedText(
        [customerDetails.address, customerDetails.city, customerDetails.state, customerDetails.postalCode]
          .filter(Boolean)
          .join(", "),
        billToX,
        220,
        yTo,
        10
      );
      yTo = addWrappedText(`GST: ${customerDetails.gstNumber || ""}`, billToX, 220, yTo, 10);
      yTo = addWrappedText(`PAN: ${customerDetails.panNumber || ""}`, billToX, 220, yTo, 10);

      y = Math.max(y, yTo) + 16;
      doc.setDrawColor(180);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      const col1 = margin;
      const col2 = 290;
      const col3 = 390;
      const col4 = 470;
      const rowHeight = 20;

      setTextStyle(10, "bold");
      doc.text("Description", col1, y);
      doc.text("Qty", col2, y);
      doc.text("Rate", col3, y);
      doc.text("Amount", col4, y);
      y += rowHeight;
      doc.setDrawColor(200);
      doc.line(margin, y - 8, pageWidth - margin, y - 8);

      setTextStyle(9, "normal");
      items.forEach((item) => {
        if (y > pageHeight - 140) {
          doc.addPage();
          y = margin + 24;
        }
        const amount = item.qty * item.rate;
        doc.text(item.description || "", col1, y);
        doc.text(String(item.qty || 0), col2, y);
        doc.text(`₹${Number(item.rate || 0).toFixed(2)}`, col3, y);
        doc.text(`₹${amount.toFixed(2)}`, col4, y);
        y += rowHeight;
      });

      doc.setDrawColor(180);
      doc.line(margin, y, pageWidth - margin, y);
      y += 24;

      setTextStyle(10, "normal");
      const summaryX = pageWidth - 170;
      doc.text(`Subtotal: ₹${subtotal.toFixed(2)}`, summaryX, y);
      y += 16;
      doc.text(`GST (18%): ₹${taxAmount.toFixed(2)}`, summaryX, y);
      y += 24;
      setTextStyle(11, "bold");
      doc.text(`Total: ₹${totalAmount.toFixed(2)}`, summaryX, y);
      y += 24;

      if (notes) {
        setTextStyle(11, "bold");
        doc.text("Notes:", margin, y);
        y += 14;
        setTextStyle(10, "normal");
        const noteLines = doc.splitTextToSize(notes, pageWidth - margin * 2);
        doc.text(noteLines, margin, y);
      }

      doc.save(`${invoiceNumber}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Unable to generate PDF right now.");
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
        onDownloadPDF={downloadPDF}
        customerName={customerDetails.customerName}
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