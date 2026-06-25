"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
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
  const [penaltyAmount, setPenaltyAmount] = useState(0);
  const [sellerDetails, setSellerDetails] = useState(emptySellerDetails);
  const [customerDetails, setCustomerDetails] = useState(emptyCustomerDetails);
  const [notes, setNotes] = useState("");
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const searchParams = useSearchParams();
  const loadedDraftIdRef = useRef<string | null>(null);

const visibleItems = items.filter((item) => item.description?.trim() || item.qty > 0 || item.rate > 0);
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
        setInvoiceDate(draft.invoice_date ? new Date(draft.invoice_date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));
        setDueDate(draft.due_date ? new Date(draft.due_date).toISOString().slice(0, 10) : "");
        setStatus(draft.status || "DRAFT");
        setPenaltyAmount(draft.penalty_amount || 0);
        setSellerDetails({ ...emptySellerDetails, ...(draft.seller_details || {}) });
        setCustomerDetails({ ...emptyCustomerDetails, ...(draft.customer_details || {}) });
        setCustomerName(draft.customer_details?.customerName || draft.customer_details?.customer_name || "");
        setNotes(draft.notes || "");
        setItems(
          Array.isArray(draft.items) && draft.items.length
            ? draft.items
            : [
                {
                  description: "",
                  qty: 1,
                  rate: 0,
                  gstRate: 18,
                },
              ]
        );
      })
      .catch((error) => {
        console.error("Failed to load draft:", error);
      });
  }, [searchParams]);

  const downloadPDF = () => {
  if (!showPreview) {
    setShowPreview(true);
    alert("Please click 'Download PDF' from the preview modal.");
  }
};

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const saveUrl = "/api/invoice-drafts";

      const response = await fetch(saveUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: draftId || undefined,
          invoiceNumber,
          invoiceDate,
          dueDate,
          status,
          penaltyAmount,
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

      if (result.draft?.id) {
        setDraftId(String(result.draft.id));
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.set("draftId", String(result.draft.id));
          window.history.replaceState({}, "", url.toString());
        }
      }

      alert("Invoice draft saved successfully");
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
              className="w-full rounded-xl bg-slate-900 p-3 text-white"
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

      {(status === "UNPAID" || status === "OVERDUE") && (
        <div className="rounded-3xl bg-[#071028] p-6">
          <h2 className="mb-4 text-xl font-bold text-white">Payment Details</h2>
          <p className="text-sm text-slate-300 mb-4">
            {status === "UNPAID"
              ? "Due date is enabled only for unpaid invoices."
              : "Overdue invoices require a penalty amount. This penalty is added to the invoice total without GST."
            }
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Penalty Amount</label>
              <input
                type="number"
                min="0"
                value={penaltyAmount}
                onChange={(e) => setPenaltyAmount(Number(e.target.value))}
                placeholder="Enter overdue penalty"
                disabled={status !== "OVERDUE"}
                className="w-full rounded-xl bg-slate-900 p-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        </div>
      )}

      <InvoiceItem items={items} setItems={setItems} />
      <InvoiceSummary items={items} penaltyAmount={penaltyAmount} />

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
{isSaving ? "Saving..." : draftId ? "Update Draft" : "Save Draft"}
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
        <button
          type="button"
          onClick={() => window.location.assign("/invoices/drafts")}
          className="rounded-xl bg-slate-600 px-6 py-3 text-white hover:bg-slate-700"
        >
          View Drafts
        </button>
      </div>

      <InvoicePreview
        open={showPreview}
        onClose={() => setShowPreview(false)}
onEdit={() => setShowPreview(false)}
        onDownloadPDF={downloadPDF}
        customerName={customerName || customerDetails.customerName}
        invoiceNumber={invoiceNumber}
        invoiceDate={invoiceDate}
        dueDate={dueDate}
        status={status}
        penaltyAmount={penaltyAmount}
        notes={notes}
        sellerDetails={sellerDetails}
        customerDetails={customerDetails}
        items={items}
      />
    </div>
  );
}