import Sidebar from "../components/Sidebar";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#050816] relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-600/10 to-transparent blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-tl from-indigo-500/10 to-transparent blur-[120px] pointer-events-none" />

      <Sidebar />

      <main className="flex-1 bg-[#050816] overflow-y-auto relative z-10">
        {children}
      </main>
    </div>
  );
}
