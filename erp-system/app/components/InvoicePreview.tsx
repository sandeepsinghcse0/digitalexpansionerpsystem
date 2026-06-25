"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type InvoicePreviewProps = {
  open: boolean;
  onClose: () => void;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  notes: string;
  sellerDetails: {
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
    gstNumber: string;
    panNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  customerDetails: {
    customerName: string;
    companyName: string;
    email: string;
    phone: string;
    gstNumber: string;
    panNumber: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: {
    description: string;
    qty: number;
    rate: number;
    gstRate: number;
  }[];
};

export default function InvoicePreview({
  open,
  onClose,
  customerName,
  invoiceNumber,
  invoiceDate,
  dueDate,
  status,
  sellerDetails,
  customerDetails,
  items,
}: InvoicePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!open) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + item.qty * item.rate,
    0
  );

  const gstTotal = items.reduce(
    (sum, item) =>
      sum +
      item.qty *
        item.rate *
        ((item.gstRate ?? 18) / 100),
    0
  );

  const total = subtotal + gstTotal;

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    
    setIsDownloading(true);
    try {
      const invoiceElement = document.getElementById("invoice-preview");

      if (!invoiceElement) {
        alert("Invoice preview element not found");
        return;
      }

      // Create a clone of the invoice
      const clonedInvoice = invoiceElement.cloneNode(true) as HTMLElement;
      
      // Create a temporary container
      const tempContainer = document.createElement("div");
      tempContainer.style.position = "fixed";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.width = "1200px";
      tempContainer.style.backgroundColor = "#ffffff";
      tempContainer.style.zIndex = "-1";
      
      tempContainer.appendChild(clonedInvoice);
      document.body.appendChild(tempContainer);

      // Wait for the DOM to render
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Generate canvas from the cloned element
      const canvas = await html2canvas(clonedInvoice, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowHeight: clonedInvoice.scrollHeight,
        windowWidth: 1200,
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Convert canvas to image data
      const imgData = canvas.toDataURL("image/png");

      // Create PDF with proper dimensions
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      // Handle multi-page PDFs
      let heightLeft = pdfHeight - 297; // A4 height is 297mm
      let position = 0;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= 297;
      }

      // Save and download the PDF
      pdf.save(`Invoice-${invoiceNumber}.pdf`);
      alert("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF Download Error:", error);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

 return (
  <div className="fixed inset-0 bg-black/70 overflow-auto z-50 p-6">
    <div
      id="invoice-preview"
      className="bg-white text-black w-[1200px] mx-auto border border-black text-[12px]"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start p-4 border-b border-black">
        <div>
          <h1 className="text-4xl font-bold text-indigo-900">
            {sellerDetails.businessName || "DIGITAL EXPANSION"}
          </h1>

          <div className="bg-teal-600 text-white px-3 py-2 mt-2 font-semibold">
            Manufacturing & Supply of Precision Press Tool & Room Component
          </div>

          <div className="mt-3 leading-6">
            <p>{sellerDetails.address}</p>
            <p>
              {sellerDetails.city}, {sellerDetails.state}
            </p>
          </div>
        </div>

        <div className="text-right">
          <img
            src="/logo.png"
            alt="logo"
            className="w-24 ml-auto mb-3"
          />

          <p>Tel : {sellerDetails.phone}</p>
          <p>Web : {sellerDetails.email}</p>

          {isDownloading ? (
            <button
              disabled
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed"
            >
              Downloading...
            </button>
          ) : (
            <button
              onClick={handleDownloadPDF}
              className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
          )}

          <button
            onClick={onClose}
            className="mt-3 ml-2 bg-red-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>

      {/* PAN + TITLE */}
      <div className="grid grid-cols-3 border-b border-black">
        <div className="p-2 border-r border-black font-bold">
          PAN : {sellerDetails.panNumber}
        </div>

        <div className="p-2 border-r border-black text-center font-bold text-2xl">
          TAX INVOICE
        </div>

        <div className="p-2 text-center font-bold">
          ORIGINAL FOR RECIPIENT
        </div>
      </div>

      {/* CUSTOMER + INVOICE */}
      <div className="grid grid-cols-2 border-b border-black">
        <div className="border-r border-black">
          <div className="font-bold text-center border-b border-black p-2">
            Customer Detail
          </div>

          <div className="p-3 space-y-2">
            <p>
              <b>M/S :</b> {customerName}
            </p>

            <p>
              <b>Address :</b> {customerDetails.address}
            </p>

            <p>
              <b>Phone :</b> {customerDetails.phone}
            </p>

            <p>
              <b>GSTIN :</b> {customerDetails.gstNumber}
            </p>

            <p>
              <b>Place Of Supply :</b> {customerDetails.state}
            </p>
          </div>
        </div>

        <div>
          <div className="p-3 space-y-2">
            <div className="flex justify-between">
              <span>Invoice No</span>
              <span>{invoiceNumber}</span>
            </div>

            <div className="flex justify-between">
              <span>Invoice Date</span>
              <span>{invoiceDate}</span>
            </div>

            <div className="flex justify-between">
              <span>Status</span>
              <span>{status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-black p-2">Sr.</th>
            <th className="border border-black p-2">
              Product / Service
            </th>
            <th className="border border-black p-2">
              Qty
            </th>
            <th className="border border-black p-2">
              Rate
            </th>
            <th className="border border-black p-2">
              Taxable
            </th>
            <th className="border border-black p-2">
              GST %
            </th>
            <th className="border border-black p-2">
              GST Amt
            </th>
            <th className="border border-black p-2">
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item, index) => {
            const taxable = item.qty * item.rate;
            const gst =
              taxable * ((item.gstRate ?? 18) / 100);
            const rowTotal = taxable + gst;

            return (
              <tr key={index}>
                <td className="border border-black p-2 text-center">
                  {index + 1}
                </td>

                <td className="border border-black p-2">
                  {item.description}
                </td>

                <td className="border border-black p-2 text-center">
                  {item.qty}
                </td>

                <td className="border border-black p-2 text-right">
                  ₹{item.rate.toFixed(2)}
                </td>

                <td className="border border-black p-2 text-right">
                  ₹{taxable.toFixed(2)}
                </td>

                <td className="border border-black p-2 text-center">
                  {item.gstRate}%
                </td>

                <td className="border border-black p-2 text-right">
                  ₹{gst.toFixed(2)}
                </td>

                <td className="border border-black p-2 text-right">
                  ₹{rowTotal.toFixed(2)}
                </td>
              </tr>
            );
          })}

          <tr>
            <td
              colSpan={8}
              className="border border-black h-[300px]"
            ></td>
          </tr>
        </tbody>
      </table>

      {/* TOTALS */}
      <div className="grid grid-cols-2 border-t border-black">
        <div className="border-r border-black p-4">
          <h3 className="font-bold mb-2">
            Total In Words
          </h3>

          <p>
            Rupees {total.toFixed(2)} Only
          </p>
        </div>

        <div className="p-4">
          <div className="flex justify-between">
            <span>Taxable Amount</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mt-2">
            <span>Total GST</span>
            <span>₹{gstTotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mt-3 pt-3 border-t font-bold text-xl">
            <span>Total Amount After Tax</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* BANK */}
      <div className="grid grid-cols-2 border-t border-black">
        <div className="border-r border-black p-4">
          <h3 className="font-bold mb-3">
            Bank Details
          </h3>

          <p>Name : ICICI</p>
          <p>Branch : Surat</p>
          <p>Account Number : XXXXXXXX</p>
          <p>IFSC : XXXXXXXX</p>
        </div>

        <div className="p-4 text-center">
          <img
            src="/qr.svg"
            alt="qr"
            className="w-40 mx-auto"
          />

          <p className="font-semibold mt-2">
            Pay using UPI
          </p>
        </div>
      </div>

      {/* TERMS */}
      <div className="border-t border-black p-4">
        <h3 className="font-bold mb-2">
          Terms and Conditions
        </h3>

        <p>Goods once sold will not be taken back.</p>
        <p>Subject to local jurisdiction.</p>
      </div>

      {/* SIGNATURE */}
      <div className="grid grid-cols-2 border-t border-black">
        <div className="p-4">
          Customer Signature
        </div>

        <div className="p-4 text-right">
          Authorised Signature
        </div>
      </div>
    </div>
  </div>
);
}