"use client";

import { useState } from "react";
import CustomerDetails from "./CustomerDetails";
import InvoiceItem from "./InvoiceItem";
import InvoiceSummary from "./InvoiceSummary";
import InvoicePreview from "./InvoicePreview";
import jsPDF from "jspdf";

export default function InvoiceForm() {
  const [items, setItems] = useState([
    {
      description: "",
      qty: 1,
      rate: 0,
      gstRate: 18,
    },
  ]);

  const [showPreview, setShowPreview] = useState(false);

  const [customerName, setCustomerName] = useState("");

  const [invoiceNumber] = useState(() => `INV-${Date.now()}`);
  const [invoiceDate] = useState(new Date().toISOString().slice(0, 10));
  const [dueDate] = useState("");
  const [status] = useState("Draft");
  const [notes] = useState("");

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

      const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
      const gst = subtotal * 0.18;
      const total = subtotal + gst;

      setTextStyle(24, "bold");
      doc.text("INVOICE", margin, y);
      y += 28;

      setTextStyle(10, "bold");
      y = addWrappedText("Digital Expansion", margin, 220, y, 10, "bold");
      y = addWrappedText("Seller", margin, 220, y, 10);
      y = addWrappedText("billing@digitalexpansion.com", margin, 220, y, 10);
      y = addWrappedText("+91 98765 43210", margin, 220, y, 10);
      y = addWrappedText("12, MG Road, Bengaluru, Karnataka, 560001", margin, 220, y, 10);

      setTextStyle(10, "bold");
      doc.text("Invoice No:", pageWidth - 180, margin);
      setTextStyle(10, "normal");
      doc.text(invoiceNumber, pageWidth - 110, margin);
      setTextStyle(10, "bold");
      doc.text("Invoice Date:", pageWidth - 180, margin + 16);
      setTextStyle(10, "normal");
      doc.text(new Date().toISOString().slice(0, 10), pageWidth - 110, margin + 16);
      setTextStyle(10, "bold");
      doc.text("Status:", pageWidth - 180, margin + 32);
      setTextStyle(10, "normal");
      doc.text(status, pageWidth - 110, margin + 32);

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
      y = addWrappedText("Digital Expansion", billFromX, 220, y, 10, "bold");
      y = addWrappedText("Seller", billFromX, 220, y, 10);
      y = addWrappedText("billing@digitalexpansion.com", billFromX, 220, y, 10);
      y = addWrappedText("+91 98765 43210", billFromX, 220, y, 10);
      y = addWrappedText("12, MG Road, Bengaluru, Karnataka, 560001", billFromX, 220, y, 10);

      let yTo = y - 12 * 5;
      yTo = addWrappedText(customerName || "Customer", billToX, 220, yTo, 10, "bold");
      yTo = addWrappedText("", billToX, 220, yTo, 10);
      yTo = addWrappedText("", billToX, 220, yTo, 10);
      yTo = addWrappedText("", billToX, 220, yTo, 10);
      yTo = addWrappedText("", billToX, 220, yTo, 10);

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
      doc.text(`GST (18%): ₹${gst.toFixed(2)}`, summaryX, y);
      y += 24;
      setTextStyle(11, "bold");
      doc.text(`Total: ₹${total.toFixed(2)}`, summaryX, y);

      doc.save(`${invoiceNumber}.pdf`);
    } catch (error) {
      console.error(error);
      alert("Unable to generate PDF right now.");
    }
  };

  return (
    <div className="space-y-6">

      {/* Invoice Information */}

      <div className="bg-[#071028] p-6 rounded-3xl">
        <h2 className="text-white text-xl font-bold mb-4">
          Invoice Information
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            value={invoiceNumber}
            readOnly
            className="p-3 bg-slate-900 rounded-xl text-white"
          />

          <input
            type="date"
            className="p-3 bg-slate-900 rounded-xl text-white"
          />

          <input
            type="date"
            className="p-3 bg-slate-900 rounded-xl text-white"
          />

          <select
            className="p-3 bg-slate-900 rounded-xl text-white"
          >
            <option>Draft</option>
            <option>Pending</option>
            <option>Paid</option>
          </select>

        </div>
      </div>

      {/* Customer Details */}

      <div className="bg-[#071028] p-6 rounded-3xl">

        <h2 className="text-white text-xl font-bold mb-4">
          Customer Details
        </h2>

        <input
          type="text"
          placeholder="Customer Name"
          value={customerName}
          onChange={(e) =>
            setCustomerName(e.target.value)
          }
          className="w-full p-4 bg-slate-900 rounded-xl text-white mb-4"
        />

        <CustomerDetails />

      </div>

      {/* Invoice Items */}

      <InvoiceItem
        items={items}
        setItems={setItems}
      />

      {/* Invoice Summary */}

      <InvoiceSummary
        items={items}
      />

      {/* Buttons */}

      <div className="flex gap-4">

        <button
          className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-xl text-white"
        >
          Save Draft
        </button>

        <button
          onClick={() => setShowPreview(true)}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-xl text-white"
        >
          Generate Invoice
        </button>

        <button
          onClick={downloadPDF}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-white"
        >
          Download PDF
        </button>

      </div>

      {/* Invoice Preview Modal */}

      <InvoicePreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
        onDownloadPDF={downloadPDF}
        customerName={customerName}
        invoiceNumber={invoiceNumber}
        invoiceDate={invoiceDate}
        dueDate={dueDate}
        status={status}
        notes={notes}
        sellerDetails={{
          businessName: "Digital Expansion",
          contactName: "Seller",
          email: "billing@digitalexpansion.com",
          phone: "+91 98765 43210",
          gstNumber: "27ABCDE1234F1Z5",
          panNumber: "ABCDE1234F",
          address: "12, MG Road",
          city: "Bengaluru",
          state: "Karnataka",
          postalCode: "560001",
        }}
        customerDetails={{
          customerName,
          companyName: "",
          email: "",
          phone: "",
          gstNumber: "",
          panNumber: "",
          address: "",
          city: "",
          state: "",
          postalCode: "",
        }}
        items={items}
      />

    </div>
  );
}