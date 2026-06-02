import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import InvoiceTable from "../components/InvoiceTable";

export default function InvoicePage() {
  return (
    <div className="flex bg-[#020817] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-12">
        <Navbar />

        <StatsCards />

        <InvoiceTable />
      </div>
    </div>
  );
}