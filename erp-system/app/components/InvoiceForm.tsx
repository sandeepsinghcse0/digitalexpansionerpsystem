"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceDocument from "./InvoiceDocument";
import InvoiceItem, { InvoiceItemType } from "./InvoiceItem";
import InvoicePreview from "./InvoicePreview";
import InvoiceSummary from "./InvoiceSummary";

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
  web: "",
  bankName: "",
  bankBranch: "",
  bankAccountNumber: "",
  bankIfsc: "",
  bankUpiId: "",
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
  placeOfSupply: "",
  ewayBillNo: "",
  transport: "",
  transportId: "",
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

  const [items, setItems] = useState<InvoiceItemType[]>([
    {
      description: "",
      qty: 1,
      rate: 0,
      gstRate: 18,
      hsnSac: "",
      unit: "NOS",
    },
  ]);

  const [showPreview, setShowPreview] = useState(false);
  const [showTransportDetails, setShowTransportDetails] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState(() => generateUniqueInvoiceNumber());
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [sellerDetails, setSellerDetails] = useState(emptySellerDetails);
  const [customerDetails, setCustomerDetails] = useState(emptyCustomerDetails);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const searchParams = useSearchParams();
  const loadedDraftIdRef = useRef<string | null>(null);
  const printSourceRef = useRef<HTMLDivElement>(null);

  const visibleItems = items.filter((item) => item.description?.trim() || item.rate > 0);
  const subtotal = visibleItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const taxAmount = visibleItems.reduce((sum, item) => sum + item.qty * item.rate * ((item.gstRate ?? 18) / 100), 0);
  const totalAmount = subtotal + taxAmount + penaltyAmount;

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
    if (invoiceDate && Number.isNaN(Date.parse(invoiceDate))) {
      errors.push("Invoice date must be a valid date.");
    }
    if (dueDate && Number.isNaN(Date.parse(dueDate))) {
      errors.push("Due date must be a valid date.");
    }
    if (invoiceDate && dueDate && new Date(dueDate) < new Date(invoiceDate)) {
      errors.push("Due date cannot be earlier than the invoice date.");
    }

    if (status === "UNPAID" && !dueDate) {
      errors.push("Due date is required for unpaid invoices.");
    }

    if (status === "OVERDUE") {
      if (!dueDate) {
        errors.push("Due date is required for overdue invoices.");
      }
      if (penaltyAmount <= 0) {
        errors.push("Overdue invoices must include a penalty amount.");
      }
    }

    return errors;
  };

  const validationErrors = validateInvoiceForm();

  useEffect(() => {
    const draftIdFromUrl = searchParams?.get("draftId");
    if (!draftIdFromUrl || loadedDraftIdRef.current === draftIdFromUrl) {
      return;
    }

    loadedDraftIdRef.current = draftIdFromUrl;
    setDraftId(draftIdFromUrl);

    fetch(`/api/invoice-drafts?id=${encodeURIComponent(draftIdFromUrl)}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Failed to load draft");
        }
        return response.json();
      })
      .then((data) => {
        if (!data?.success || !data.invoiceDraft) {
          return;
        }

        const draft = data.invoiceDraft;
        setInvoiceNumber(draft.invoice_number || generateUniqueInvoiceNumber());
        setInvoiceDate(draft.invoice_date ? new Date(draft.invoice_date).toISOString().slice(0, 10) : "");
        setDueDate(draft.due_date ? new Date(draft.due_date).toISOString().slice(0, 10) : "");
        setStatus(draft.status || "DRAFT");
        setPenaltyAmount(draft.penalty_amount || 0);
        setSellerDetails({ ...emptySellerDetails, ...(draft.seller_details || {}) });
        setCustomerDetails({ ...emptyCustomerDetails, ...(draft.customer_details || {}) });
        setCustomerName(draft.customer_details?.customerName || draft.customer_details?.companyName || "");
        setNotes(draft.notes || "");
        const loadedCustomer = { ...emptyCustomerDetails, ...(draft.customer_details || {}) };
        setShowTransportDetails(
          !!(loadedCustomer.transport || loadedCustomer.transportId || loadedCustomer.ewayBillNo)
        );
        setItems(
          Array.isArray(draft.items) && draft.items.length
            ? draft.items
            : [
              {
                description: "",
                qty: 1,
                rate: 0,
                gstRate: 18,
                hsnSac: "",
                unit: "NOS",
              },
            ]
        );
      })
      .catch((error) => {
        console.error("Failed to load draft:", error);
      });
  }, [searchParams]);

  const downloadPDF = async () => {
    const element = printSourceRef.current;
    if (!element) {
      alert("Unable to generate PDF right now.");
      return;
    }

    try {
      const images = element.querySelectorAll("img");
      await Promise.all(
        Array.from(images).map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }
              img.onload = () => resolve();
              img.onerror = () => resolve();
            })
        )
      );

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
      pdf.save(`${invoiceNumber || "invoice"}.pdf`);
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Invoice Number</label>
            <input value={invoiceNumber} readOnly className="w-full rounded-xl bg-slate-900 p-3 text-white font-mono" />
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
              disabled={status !== "UNPAID" && status !== "OVERDUE"}
              className="w-full rounded-xl bg-slate-900 p-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Invoice Status</label>
            <select
              value={status}
              onChange={(e) => {
                const nextStatus = e.target.value;
                setStatus(nextStatus);
                if (nextStatus !== "OVERDUE") {
                  setPenaltyAmount(0);
                }
              }}
              className="w-full rounded-xl bg-slate-900 p-3 text-white font-semibold"
            >
              <option value="DRAFT">Draft</option>
              <option value="UNPAID">Unpaid</option>
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
          <input value={sellerDetails.contactName} onChange={(e) => setSellerDetails({ ...sellerDetails, contactName: e.target.value })} placeholder="Slogan / Business Type" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input type="email" value={sellerDetails.email} onChange={(e) => setSellerDetails({ ...sellerDetails, email: e.target.value })} placeholder="Email" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.phone} onChange={(e) => setSellerDetails({ ...sellerDetails, phone: e.target.value })} placeholder="Phone" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.gstNumber} onChange={(e) => setSellerDetails({ ...sellerDetails, gstNumber: sanitizeGstNumber(e.target.value) })} placeholder="GST Number (15 chars)" maxLength={15} pattern="[A-Z0-9]{15}" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.panNumber || ""} onChange={(e) => setSellerDetails({ ...sellerDetails, panNumber: sanitizePanNumber(e.target.value) })} placeholder="PAN Number (10 chars)" maxLength={10} pattern="[A-Z0-9]{10}" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.web || ""} onChange={(e) => setSellerDetails({ ...sellerDetails, web: e.target.value })} placeholder="Website Address" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.address} onChange={(e) => setSellerDetails({ ...sellerDetails, address: e.target.value })} placeholder="Address Line" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.city} onChange={(e) => setSellerDetails({ ...sellerDetails, city: e.target.value })} placeholder="City" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.state} onChange={(e) => setSellerDetails({ ...sellerDetails, state: e.target.value })} placeholder="State" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.postalCode} onChange={(e) => setSellerDetails({ ...sellerDetails, postalCode: e.target.value })} placeholder="Postal Code" className="rounded-xl bg-slate-900 p-4 text-white" />
        </div>
      </div>

      <div className="rounded-3xl bg-[#071028] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Bank Details</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input value={sellerDetails.bankName || ""} onChange={(e) => setSellerDetails({ ...sellerDetails, bankName: e.target.value })} placeholder="Bank Name" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.bankBranch || ""} onChange={(e) => setSellerDetails({ ...sellerDetails, bankBranch: e.target.value })} placeholder="Branch Name" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.bankAccountNumber || ""} onChange={(e) => setSellerDetails({ ...sellerDetails, bankAccountNumber: e.target.value })} placeholder="Account Number" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.bankIfsc || ""} onChange={(e) => setSellerDetails({ ...sellerDetails, bankIfsc: e.target.value })} placeholder="IFSC Code" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={sellerDetails.bankUpiId || ""} onChange={(e) => setSellerDetails({ ...sellerDetails, bankUpiId: e.target.value })} placeholder="UPI ID (for QR Code)" className="rounded-xl bg-slate-900 p-4 text-white" />
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
            className="rounded-xl bg-slate-900 p-4 text-white font-semibold"
          />
          <input value={customerDetails.companyName} onChange={(e) => setCustomerDetails({ ...customerDetails, companyName: e.target.value })} placeholder="Company Name" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input type="email" value={customerDetails.email} onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })} placeholder="Email" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.phone} onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })} placeholder="Phone" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.gstNumber} onChange={(e) => setCustomerDetails({ ...customerDetails, gstNumber: sanitizeGstNumber(e.target.value) })} placeholder="GST Number (15 chars)" maxLength={15} pattern="[A-Z0-9]{15}" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.panNumber || ""} onChange={(e) => setCustomerDetails({ ...customerDetails, panNumber: sanitizePanNumber(e.target.value) })} placeholder="PAN Number (10 chars)" maxLength={10} pattern="[A-Z0-9]{10}" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.placeOfSupply || ""} onChange={(e) => setCustomerDetails({ ...customerDetails, placeOfSupply: e.target.value })} placeholder="Place of Supply (e.g. Kerala ( 32 ))" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.address} onChange={(e) => setCustomerDetails({ ...customerDetails, address: e.target.value })} placeholder="Address Line" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.city} onChange={(e) => setCustomerDetails({ ...customerDetails, city: e.target.value })} placeholder="City" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.state} onChange={(e) => setCustomerDetails({ ...customerDetails, state: e.target.value })} placeholder="State" className="rounded-xl bg-slate-900 p-4 text-white" />
          <input value={customerDetails.postalCode} onChange={(e) => setCustomerDetails({ ...customerDetails, postalCode: e.target.value })} placeholder="Postal Code" className="rounded-xl bg-slate-900 p-4 text-white" />
        </div>
      </div>

      <div className="rounded-3xl bg-[#071028] p-6">
        <label className="mb-4 flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={showTransportDetails}
            onChange={(e) => setShowTransportDetails(e.target.checked)}
            className="h-4 w-4 rounded border-slate-600 bg-slate-900 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-xl font-bold text-white">Transport Details</span>
        </label>

        {showTransportDetails && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              value={customerDetails.transport || ""}
              onChange={(e) => setCustomerDetails({ ...customerDetails, transport: e.target.value })}
              placeholder="Transport Agency Name"
              className="rounded-xl bg-slate-900 p-4 text-white"
            />
            <input
              value={customerDetails.transportId || ""}
              onChange={(e) => setCustomerDetails({ ...customerDetails, transportId: e.target.value })}
              placeholder="Transport ID"
              className="rounded-xl bg-slate-900 p-4 text-white"
            />
            <input
              value={customerDetails.ewayBillNo || ""}
              onChange={(e) => setCustomerDetails({ ...customerDetails, ewayBillNo: e.target.value })}
              placeholder="E-Way Bill Number"
              className="rounded-xl bg-slate-900 p-4 text-white md:col-span-2"
            />
          </div>
        )}
      </div>

      <div className="rounded-3xl bg-[#071028] p-6">
        <h2 className="mb-4 text-xl font-bold text-white">Notes</h2>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Optional notes" className="w-full rounded-xl bg-slate-900 p-4 text-white" />
      </div>

      <InvoiceItem items={items} setItems={setItems} />
      <InvoiceSummary items={items} />

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleSave}
          disabled={isSaving || validationErrors.length > 0}
          className="rounded-xl bg-yellow-500 px-6 py-3 text-white hover:bg-yellow-600 disabled:opacity-50 font-bold transition-all"
        >
          {isSaving ? "Saving..." : draftId ? "Update Draft" : "Save Draft"}
        </button>
        <button
          onClick={() => setShowPreview(true)}
          className="rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-700 font-bold transition-all"
        >
          Generate Invoice
        </button>
        <button
          onClick={downloadPDF}
          className="rounded-xl bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 font-bold transition-all"
        >
          Download PDF
        </button>
        <button
          type="button"
          onClick={() => window.location.assign("/invoices/drafts")}
          className="rounded-xl bg-slate-600 px-6 py-3 text-white hover:bg-slate-700 font-bold transition-all"
        >
          View Drafts
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
        showTransportDetails={showTransportDetails}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[-9999px] top-0 z-[-1]"
      >
        <div ref={printSourceRef}>
          <InvoiceDocument
            customerName={customerName || customerDetails.customerName}
            invoiceNumber={invoiceNumber}
            invoiceDate={invoiceDate}
            penaltyAmount={penaltyAmount}
            sellerDetails={sellerDetails}
            customerDetails={customerDetails}
            items={items}
            showTransportDetails={showTransportDetails}
          />
        </div>
      </div>
    </div>
  );
}