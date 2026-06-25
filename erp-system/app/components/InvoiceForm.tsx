"use client";

<<<<<<< HEAD
import { useState, useEffect } from "react";
=======
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
>>>>>>> da0a1f7ba57a8f394ac82a2b256b415c730f7c00
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
<<<<<<< HEAD
  const [invoiceNumber, setInvoiceNumber] = useState("");

useEffect(() => {
  setInvoiceNumber(generateUniqueInvoiceNumber());
}, []);
=======
  const [invoiceNumber, setInvoiceNumber] = useState(() => generateUniqueInvoiceNumber());
>>>>>>> da0a1f7ba57a8f394ac82a2b256b415c730f7c00
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

<<<<<<< HEAD
  const subtotal = items.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const taxAmount = items.reduce((sum, item) => sum + item.qty * item.rate * ((item.gstRate ?? 18) / 100), 0);
  const totalAmount = subtotal + taxAmount;
=======
const visibleItems = items.filter((item) => item.description?.trim() || item.rate > 0);
      const subtotal = visibleItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
      const taxAmount = visibleItems.reduce((sum, item) => sum + item.qty * item.rate * ((item.gstRate ?? 18) / 100), 0);
  const totalAmount = subtotal + taxAmount + penaltyAmount;
>>>>>>> da0a1f7ba57a8f394ac82a2b256b415c730f7c00

  const validateInvoiceForm = () => {
    const errors: string[] = [];
    const gstRegex = /^[A-Z0-9]{15}$/;
    const panRegex = /^[A-Z0-9]{10}$/;
<<<<<<< HEAD

    if (sellerDetails.gstNumber && !gstRegex.test(sellerDetails.gstNumber)) {
      errors.push("Seller GST number must be 15 uppercase alphanumeric characters.");
=======

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

  const downloadPDF = async () => {
    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });

      // Try to load Roboto fonts from /fonts and register with jsPDF.
      const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
        let binary = "";
        const bytes = new Uint8Array(buffer);
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(null, Array.prototype.slice.call(bytes.subarray(i, i + chunkSize)));
        }
        return btoa(binary);
      };

      const tryRegisterFont = async (url: string, fileName: string, postscriptName: string, style: string) => {
        try {
          const resp = await fetch(url);
          if (!resp.ok) throw new Error(`Font fetch failed: ${resp.status}`);
          const buff = await resp.arrayBuffer();
          const base64 = arrayBufferToBase64(buff);
          // register with jsPDF using a typed helper to avoid `any`
          const fontDoc = doc as unknown as {
            addFileToVFS(fileName: string, data: string): void;
            addFont(fileName: string, postscriptName: string, style: string): void;
          };
          fontDoc.addFileToVFS(fileName, base64);
          fontDoc.addFont(fileName, postscriptName, style);
          return true;
        } catch {
          return false;
        }
      };

      // Attempt to register regular and bold Roboto. These files should be placed in `public/fonts/`.
      const regularLoaded = await tryRegisterFont('/fonts/Roboto-Regular.ttf', 'Roboto-Regular.ttf', 'Roboto', 'normal');
      await tryRegisterFont('/fonts/Roboto-Bold.ttf', 'Roboto-Bold.ttf', 'Roboto', 'bold');
      if (regularLoaded) {
        // prefer Roboto when available
        doc.setFont('Roboto', 'normal');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const lineHeight = 12;
      let y = margin;

      const preferredFont = (typeof regularLoaded !== 'undefined' && regularLoaded) ? 'Roboto' : 'helvetica';
      const setTextStyle = (size: number, weight: "normal" | "bold" = "normal") => {
        doc.setFont(preferredFont, weight);
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

      setTextStyle(18, "bold");
      doc.text("INVOICE", margin, y);
      y += 28;

      setTextStyle(12, "bold");
      y = addWrappedText(sellerDetails.businessName || "Seller Name", margin, 220, y, 11, "bold");
      y = addWrappedText(sellerDetails.contactName || "Seller Contact", margin, 220, y, 11);
      y = addWrappedText(sellerDetails.email || "", margin, 220, y, 11);
      y = addWrappedText(sellerDetails.phone || "", margin, 220, y, 11);
      y = addWrappedText(
        [sellerDetails.address, sellerDetails.city, sellerDetails.state, sellerDetails.postalCode]
          .filter(Boolean)
          .join(", "),
        margin,
        220,
        y,
        11
      );

      setTextStyle(12, "bold");
      doc.text("Invoice No:", pageWidth - 180, margin);
      setTextStyle(11, "normal");
      doc.text(invoiceNumber, pageWidth - 110, margin);
      setTextStyle(12, "bold");
      doc.text("Invoice Date:", pageWidth - 180, margin + 16);
      setTextStyle(11, "normal");
      doc.text(invoiceDate || "", pageWidth - 110, margin + 16);
      if (status !== "PAID") {
        setTextStyle(12, "bold");
        doc.text("Due Date:", pageWidth - 180, margin + 32);
        setTextStyle(11, "normal");
        doc.text(dueDate || "—", pageWidth - 110, margin + 32);
        setTextStyle(12, "bold");
        doc.text("Status:", pageWidth - 180, margin + 48);
        setTextStyle(11, "normal");
        doc.text(status || "DRAFT", pageWidth - 110, margin + 48);
      } else {
        setTextStyle(12, "bold");
        doc.text("Status:", pageWidth - 180, margin + 32);
        setTextStyle(11, "normal");
        doc.text(status || "DRAFT", pageWidth - 110, margin + 32);
      }

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

      // Start both columns at the same Y and compute their end Y, then continue below the taller column.
      const startY = y;

      let yFrom = startY;
      setTextStyle(11, "bold");
      yFrom = addWrappedText(sellerDetails.businessName || "Seller", billFromX, 260, yFrom, 11, "bold");
      setTextStyle(11, "normal");
      yFrom = addWrappedText(sellerDetails.contactName || "", billFromX, 260, yFrom, 11);
      yFrom = addWrappedText(sellerDetails.email || "", billFromX, 260, yFrom, 11);
      yFrom = addWrappedText(sellerDetails.phone || "", billFromX, 260, yFrom, 11);
      yFrom = addWrappedText(
        [sellerDetails.address, sellerDetails.city, sellerDetails.state, sellerDetails.postalCode]
          .filter(Boolean)
          .join(", "),
        billFromX,
        260,
        yFrom,
        11
      );
      yFrom = addWrappedText(`GST: ${sellerDetails.gstNumber || ""}`, billFromX, 260, yFrom, 11);
      yFrom = addWrappedText(`PAN: ${sellerDetails.panNumber || ""}`, billFromX, 260, yFrom, 11);

      let yTo = startY;
      setTextStyle(11, "bold");
      yTo = addWrappedText(customerName || customerDetails.customerName || "Customer", billToX, 260, yTo, 11, "bold");
      setTextStyle(11, "normal");
      yTo = addWrappedText(customerDetails.companyName || "", billToX, 260, yTo, 11);
      yTo = addWrappedText(customerDetails.email || "", billToX, 260, yTo, 11);
      yTo = addWrappedText(customerDetails.phone || "", billToX, 260, yTo, 11);
      yTo = addWrappedText(
        [customerDetails.address, customerDetails.city, customerDetails.state, customerDetails.postalCode]
          .filter(Boolean)
          .join(", "),
        billToX,
        260,
        yTo,
        11
      );
      yTo = addWrappedText(`GST: ${customerDetails.gstNumber || ""}`, billToX, 260, yTo, 11);
      yTo = addWrappedText(`PAN: ${customerDetails.panNumber || ""}`, billToX, 260, yTo, 11);

      y = Math.max(yFrom, yTo) + 16;
      doc.setDrawColor(180);
      doc.line(margin, y, pageWidth - margin, y);
      y += 8;

      const tableLeft = margin;
      const descWidth = 155;
      const qtyWidth = 35;
      const rateWidth = 70;
      const gstRateWidth = 45;
      const taxableWidth = 70;
      const gstWidth = 70;
      const totalWidth = 70;
      const colQtyRight = tableLeft + descWidth + qtyWidth;
      const colRateRight = colQtyRight + rateWidth;
      const colGstRateRight = colRateRight + gstRateWidth;
      const colTaxableRight = colGstRateRight + taxableWidth;
      const colGstRight = colTaxableRight + gstWidth;
      const colTotalRight = colGstRight + totalWidth;
      const tableRight = colTotalRight;
      const headerHeight = 24;
      const rowHeight = 22;

      // GST breakdown map
      const gstBreakdown: Record<string, { taxable: number; gst: number }> = {};

      const visibleItems = items.filter((item) => item.description?.trim() || item.rate > 0);
      const tableTop = y;
      setTextStyle(10, "bold");
      doc.setFillColor(245, 245, 245);
      doc.rect(tableLeft, tableTop, tableRight - tableLeft, headerHeight, "F");
      doc.setDrawColor(150);
      doc.setLineWidth(0.6);
      doc.rect(tableLeft, tableTop, tableRight - tableLeft, headerHeight, "S");

      doc.text("Description", tableLeft + 4, tableTop + 16);
      doc.text("Qty", colQtyRight - 4, tableTop + 16, { align: "right" });
      doc.text("Rate", colRateRight - 4, tableTop + 16, { align: "right" });
      doc.text("GST%", colGstRateRight - 4, tableTop + 16, { align: "right" });
      doc.text("Taxable", colTaxableRight - 4, tableTop + 16, { align: "right" });
      doc.text("GST", colGstRight - 4, tableTop + 16, { align: "right" });
      doc.text("Total", colTotalRight - 4, tableTop + 16, { align: "right" });

      let currentY = tableTop + headerHeight;
      doc.line(tableLeft, currentY, tableRight, currentY);

      setTextStyle(10, "normal");
      visibleItems.forEach((item) => {
        if (currentY + rowHeight > pageHeight - 140) {
          doc.addPage();
          currentY = margin;
          const newTableTop = currentY;
          doc.setFillColor(245, 245, 245);
          doc.rect(tableLeft, newTableTop, tableRight - tableLeft, headerHeight, "F");
          doc.setDrawColor(150);
          doc.rect(tableLeft, newTableTop, tableRight - tableLeft, headerHeight, "S");
          doc.text("Description", tableLeft + 4, newTableTop + 16);
          doc.text("Qty", colQtyRight - 4, newTableTop + 16, { align: "right" });
          doc.text("Rate", colRateRight - 4, newTableTop + 16, { align: "right" });
          doc.text("GST%", colGstRateRight - 4, newTableTop + 16, { align: "right" });
          doc.text("Taxable", colTaxableRight - 4, newTableTop + 16, { align: "right" });
          doc.text("GST", colGstRight - 4, newTableTop + 16, { align: "right" });
          doc.text("Total", colTotalRight - 4, newTableTop + 16, { align: "right" });
          currentY = newTableTop + headerHeight;
          doc.line(tableLeft, currentY, tableRight, currentY);
        }

        const taxable = item.qty * item.rate;
        const gst = taxable * ((item.gstRate ?? 18) / 100);
        const amount = taxable + gst;

        // accumulate breakdown
        const rateKey = String(item.gstRate ?? 18);
        if (!gstBreakdown[rateKey]) gstBreakdown[rateKey] = { taxable: 0, gst: 0 };
        gstBreakdown[rateKey].taxable += taxable;
        gstBreakdown[rateKey].gst += gst;

        doc.text(item.description || "", tableLeft + 4, currentY + 16);
        doc.text(String(item.qty || 0), colQtyRight - 4, currentY + 16, { align: "right" });
        doc.text(Number(item.rate || 0).toFixed(2), colRateRight - 4, currentY + 16, { align: "right" });
        doc.text(String(item.gstRate ?? 18), colGstRateRight - 4, currentY + 16, { align: "right" });
        doc.text(`Rs ${taxable.toFixed(2)}`, colTaxableRight - 4, currentY + 16, { align: "right" });
        doc.text(`Rs ${gst.toFixed(2)}`, colGstRight - 4, currentY + 16, { align: "right" });
        doc.text(`Rs ${amount.toFixed(2)}`, colTotalRight - 4, currentY + 16, { align: "right" });

        currentY += rowHeight;
        doc.line(tableLeft, currentY, tableRight, currentY);
      });

      const tableBottom = currentY;
      [
        tableLeft,
        tableLeft + descWidth,
        colQtyRight,
        colRateRight,
        colGstRateRight,
        colTaxableRight,
        colGstRight,
        tableRight,
      ].forEach((x) => {
        doc.line(x, tableTop, x, tableBottom);
      });

      y = currentY + 24;

      setTextStyle(11, "normal");
      const summaryX = pageWidth - margin - 20;
      doc.text(`Subtotal: Rs ${subtotal.toFixed(2)}`, summaryX, y, { align: "right" });
      y += 16;
      // print breakdown per GST rate
      Object.keys(gstBreakdown).forEach((rate) => {
        const data = gstBreakdown[rate];
        doc.text(`GST (${rate}%): Rs ${data.gst.toFixed(2)}`, summaryX, y, { align: "right" });
        y += 16;
      });
      y += 8;
      setTextStyle(12, "bold");
      doc.text(`Total: Rs ${totalAmount.toFixed(2)}`, summaryX, y, { align: "right" });
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
>>>>>>> da0a1f7ba57a8f394ac82a2b256b415c730f7c00
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
<<<<<<< HEAD
              className="w-full rounded-xl bg-slate-900 p-3 text-white"
=======
              disabled={status !== "UNPAID" && status !== "OVERDUE"}
              className="w-full rounded-xl bg-slate-900 p-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
>>>>>>> da0a1f7ba57a8f394ac82a2b256b415c730f7c00
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Invoice Status</label>
<<<<<<< HEAD
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full rounded-xl bg-slate-900 p-3 text-white">
              <option value="DRAFT">Draft</option>
=======
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
>>>>>>> da0a1f7ba57a8f394ac82a2b256b415c730f7c00
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
<<<<<<< HEAD
          {isSaving ? "Saving..." : "Save Draft"}
=======
          {isSaving ? "Saving..." : draftId ? "Update Draft" : "Save Draft"}
>>>>>>> da0a1f7ba57a8f394ac82a2b256b415c730f7c00
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
<<<<<<< HEAD
=======
        onEdit={() => setShowPreview(false)}
        onDownloadPDF={downloadPDF}
>>>>>>> da0a1f7ba57a8f394ac82a2b256b415c730f7c00
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