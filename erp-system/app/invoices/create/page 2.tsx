import InvoiceForm from "@/app/components/InvoiceForm";

export default function CreateInvoicePage() {
  return (
    <div className="min-h-screen bg-[#020817] p-10">
      <h1 className="text-4xl font-bold text-white mb-8">
        Create Invoice
      </h1>

      <InvoiceForm />
    </div>
  );
}