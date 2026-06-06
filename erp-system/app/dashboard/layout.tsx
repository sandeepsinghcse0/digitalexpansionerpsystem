import Sidebar from "../components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050816]">
      <Sidebar />

      <main className="flex-1 bg-[#050816] overflow-y-auto">
        {children}
      </main>
    </div>
  );
}