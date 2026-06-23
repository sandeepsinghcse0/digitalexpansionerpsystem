"use client";

import { useEffect, MouseEvent } from "react";
import InvoiceDocument, { InvoiceDocumentProps } from "./InvoiceDocument";

type InvoicePreviewProps = InvoiceDocumentProps & {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onDownloadPDF?: () => void;
  dueDate: string;
  status: string;
  notes: string;
};

const StatusBadge = ({ status }: { status: string }) => {
  const currentStatus = (status || "DRAFT").toUpperCase();
  let bg = "bg-slate-100 text-slate-700 border-slate-200";
  let dotBg = "bg-slate-500";

  if (currentStatus === "PAID") {
    bg = "bg-emerald-50 text-emerald-700 border-emerald-200";
    dotBg = "bg-emerald-500 animate-pulse";
  } else if (currentStatus === "UNPAID") {
    bg = "bg-rose-50 text-rose-700 border-rose-200";
    dotBg = "bg-rose-500 animate-pulse";
  } else if (currentStatus === "OVERDUE") {
    bg = "bg-amber-50 text-amber-700 border-amber-200";
    dotBg = "bg-amber-500 animate-pulse";
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotBg}`} />
      {currentStatus}
    </span>
  );
};

export default function InvoicePreview({
  open,
  onClose,
  onDownloadPDF,
  status,
  customerName,
  invoiceNumber,
  invoiceDate,
  penaltyAmount,
  sellerDetails,
  customerDetails,
  items,
  showTransportDetails = false,
}: InvoicePreviewProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const statusText = status || "DRAFT";

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 md:p-6"
    >
      <div className="relative w-full max-w-[860px] max-h-[95vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-white tracking-tight">Invoice Preview</h2>
            <StatusBadge status={statusText} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
              >
                Edit
              </button>
            )}
            {onDownloadPDF && (
              <button
                onClick={onDownloadPDF}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 rounded-xl transition-all"
              >
                Download PDF
              </button>
            )}
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
              aria-label="Close preview"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950 flex justify-center items-start">
          <InvoiceDocument
            id="invoice-preview"
            customerName={customerName}
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
