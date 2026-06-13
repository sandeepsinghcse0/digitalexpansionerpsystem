"use client";

import { useState } from "react";
import CustomerDetails from "./CustomerDetails";
import InvoiceItem from "./InvoiceItem";
import InvoiceSummary from "./InvoiceSummary";
import InvoicePreview from "./InvoicePreview";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function InvoiceForm() {
  const [items, setItems] = useState([
    {
      description: "",
      qty: 1,
      rate: 0,
    },
  ]);

  const [showPreview, setShowPreview] = useState(false);

  const [customerName, setCustomerName] = useState("");

  const [invoiceNumber] = useState(
    `INV-${Date.now()}`
  );

  const downloadPDF = async () => {
    const invoice = document.getElementById(
      "invoice-preview"
    );

    if (!invoice) {
      alert("Open Preview First");
      return;
    }

    const canvas = await html2canvas(invoice);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 190;

    const pdfHeight =
      (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      10,
      10,
      pdfWidth,
      pdfHeight
    );

    pdf.save(`${invoiceNumber}.pdf`);
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
        customerName={customerName}
        invoiceNumber={invoiceNumber}
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