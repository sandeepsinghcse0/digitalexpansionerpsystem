import { Suspense } from "react";
import InvoiceForm from "../../components/InvoiceForm";

export default function CreateInvoicePage() {
  return (
    <div className="min-h-screen bg-[#020817] p-10">
      <h1 className="text-4xl font-bold text-white mb-8">
        Create Invoice
      </h1>

      <Suspense fallback={<div className="text-white">Loading invoice form...</div>}>
        <InvoiceForm />
      </Suspense>
    </div>
  );
}