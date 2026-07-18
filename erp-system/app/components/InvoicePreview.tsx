"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

type InvoicePreviewProps = {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDownloadPDF?: () => void;
  customerName: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  status: string;
  penaltyAmount?: number;
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
  onEdit,
  onDownloadPDF,
  customerName,
  invoiceNumber,
  invoiceDate,
  dueDate,
  status,
  penaltyAmount = 0,
  notes,
  sellerDetails,
  customerDetails,
  items,
}: InvoicePreviewProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!open) return null;

  const visibleItems = items.filter(
    (item) =>
      item.description?.trim() || item.qty > 0 || item.rate > 0 || item.gstRate > 0
  );

  const subtotal = visibleItems.reduce((sum, item) => sum + item.qty * item.rate, 0);

  const gstTotal = visibleItems.reduce(
    (sum, item) => sum + item.qty * item.rate * ((item.gstRate ?? 18) / 100),
    0
  );

  const total = subtotal + gstTotal + penaltyAmount;

  const gstBreakdown = visibleItems.reduce<Record<string, { taxable: number; gst: number }>>(
    (acc, item) => {
      const rate = (item.gstRate ?? 18).toFixed(2);
      const taxable = item.qty * item.rate;
      const gst = taxable * ((item.gstRate ?? 18) / 100);

      if (!acc[rate]) {
        acc[rate] = { taxable: 0, gst: 0 };
      }

      acc[rate].taxable += taxable;
      acc[rate].gst += gst;
      return acc;
    },
    {}
  );

  const billToName = customerName || customerDetails.customerName || "Customer";

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

      const canvas = await html2canvas(clonedInvoice, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowHeight: clonedInvoice.scrollHeight,
        windowWidth: 1200,
      });

      document.body.removeChild(tempContainer);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      let heightLeft = pdfHeight - 297;
      let position = 0;

      while (heightLeft > 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= 297;
      }

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div
        id="invoice-preview"
        className="bg-white text-black w-225 max-h-[90vh] overflow-y-auto rounded-2xl p-8 font-sans text-base leading-6"
      >
        {/* Header: Seller Info + Action Buttons */}
        <div className="mb-8 flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {sellerDetails.businessName || "Seller Name"}
            </h1>
            <p className="text-[15px] font-medium text-slate-700">
              {sellerDetails.contactName || "Seller Contact"}
            </p>
            <p className="text-[14px] text-slate-600">{sellerDetails.email}</p>
            <p className="text-[14px] text-slate-600">{sellerDetails.phone}</p>
            <p className="text-[14px] text-slate-600">
              {[sellerDetails.address, sellerDetails.city, sellerDetails.state, sellerDetails.postalCode]
                .filter(Boolean)
                .join(", ")}
            </p>
          </div>

          <div className="flex gap-3">
            {onEdit ? (
              <button
                onClick={onEdit}
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600"
              >
                Edit
              </button>
            ) : null}
            {onDownloadPDF ? (
              <button
                onClick={onDownloadPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Download PDF
              </button>
            ) : null}

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

          {/* Bill From + Invoice Meta */}
          <div className="mb-8 grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-slate-900">Bill From</h2>
              <p className="text-[14px] font-semibold text-slate-800">{sellerDetails.businessName || "Seller"}</p>
              <p className="text-[14px] text-slate-600">{sellerDetails.contactName}</p>
              <p className="text-[14px] text-slate-600">{sellerDetails.email}</p>
              <p className="text-[14px] text-slate-600">{sellerDetails.phone}</p>
              <p className="text-[14px] text-slate-600">{sellerDetails.address}</p>
              <p className="text-[14px] text-slate-600">GST: {sellerDetails.gstNumber || ""}</p>
              <p className="text-[14px] text-slate-600">PAN: {sellerDetails.panNumber || ""}</p>
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

                    <p>{invoiceNumber}</p>
                    <p className="text-sm text-gray-600">Date: {invoiceDate || new Date().toLocaleDateString()}</p>
                    {status !== "PAID" && (
                      <p className="text-sm text-gray-600">Due: {dueDate || "—"}</p>
                    )}
                    <p className="text-sm text-gray-600">Status: {status || "DRAFT"}</p>
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <h2 className="mb-2 text-lg font-semibold uppercase tracking-wide text-slate-900">Bill To</h2>
                <p className="text-[14px] font-semibold text-slate-800">{billToName}</p>
                <p className="text-[14px] text-slate-600">{customerDetails.companyName}</p>
                <p className="text-[14px] text-slate-600">{customerDetails.email}</p>
                <p className="text-[14px] text-slate-600">{customerDetails.phone}</p>
                <p className="text-[14px] text-slate-600">{customerDetails.address}</p>
                <p className="text-[14px] text-slate-600">GST: {customerDetails.gstNumber || ""}</p>
                <p className="text-[14px] text-slate-600">PAN: {customerDetails.panNumber || ""}</p>
              </div>

              {/* Items Table */}
              <table className="w-full border border-slate-300 text-left text-[14px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-3 border">Description</th>
                    <th className="p-3 border">Qty</th>
                    <th className="p-3 border">Rate</th>
                    <th className="p-3 border">GST %</th>
                    <th className="p-3 border">Taxable</th>
                    <th className="p-3 border">GST</th>
                    <th className="p-3 border">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.map((item, index) => {
                    const taxable = item.qty * item.rate;
                    const gst = taxable * ((item.gstRate ?? 18) / 100);
                    const rowTotal = taxable + gst;
                    return (
                      <tr key={index}>
                        <td className="border p-3">{item.description}</td>
                        <td className="border p-3">{item.qty}</td>
                        <td className="border p-3">₹{item.rate.toFixed(2)}</td>
                        <td className="border p-3">{(item.gstRate ?? 18).toFixed(2)}%</td>
                        <td className="border p-3">₹{taxable.toFixed(2)}</td>
                        <td className="border p-3">₹{gst.toFixed(2)}</td>
                        <td className="border p-3">₹{rowTotal.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Summary */}
              <div className="mt-8 flex justify-end">
                <div className="w-75">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>

                  {Object.entries(gstBreakdown).map(([rate, data]) => (
                    <div key={rate} className="mb-2 flex justify-between text-[14px] text-slate-700">
                      <span>GST ({rate}%)</span>
                      <span>₹{data.gst.toFixed(2)}</span>
                    </div>
                  ))}

                  {penaltyAmount > 0 ? (
                    <>
                      <div className="flex justify-between mb-2 text-red-600">
                        <span>Overdue Penalty (No GST)</span>
                        <span>₹{penaltyAmount.toFixed(2)}</span>
                      </div>
                      <hr className="my-2 border-slate-200" />
                    </>
                  ) : (
                    <hr className="my-2 border-slate-200" />
                  )}

                  <div className="flex justify-between font-bold text-2xl">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
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
      </div>
    </div>
  );
}