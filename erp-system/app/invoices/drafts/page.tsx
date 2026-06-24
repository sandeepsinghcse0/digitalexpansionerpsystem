import Link from "next/link";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

async function fetchDrafts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || ""}/api/invoice-drafts`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();
  return data?.drafts || [];
}

export default async function InvoiceDraftsPage() {
  const drafts = await fetchDrafts();

  return (
    <div className="flex bg-[#020817] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-12">
        <Navbar />
        <div className="mb-8 flex flex-wrap gap-4">
          <Link href="/invoices/create" className="rounded-2xl bg-green-600 px-6 py-3 text-white hover:bg-green-700">
            Back to Create Invoice
          </Link>
        </div>

        <div className="bg-[#071028] rounded-3xl p-8 border border-slate-800 text-white">
          <h1 className="text-3xl font-bold mb-6">Invoice Drafts</h1>

          {drafts.length === 0 ? (
            <p className="text-slate-300">No drafts found yet.</p>
          ) : (
            <div className="space-y-4">
              {drafts.map((draft: any) => (
                <div key={draft.id} className="rounded-3xl border border-slate-700 bg-slate-900 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-xl font-semibold">Draft #{draft.invoice_number}</p>
                      <p className="text-sm text-slate-400">Status: {draft.status}</p>
                      <p className="text-sm text-slate-400">Updated: {new Date(draft.updated_at).toLocaleString()}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/invoices/create?draftId=${draft.id}`}
                        className="rounded-xl bg-yellow-500 px-4 py-2 text-black hover:bg-yellow-600"
                      >
                        Continue Editing
                      </Link>
                      <Link
                        href={`/api/invoice-drafts?id=${draft.id}`}
                        className="rounded-xl bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      >
                        View Raw
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
