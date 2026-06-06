import Sidebar from "../components/Sidebar";

export default function PaymentsPage() {
  return (
    <div className="flex bg-[#020817] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-white mb-8">
          Payments Dashboard
        </h1>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#071028] p-6 rounded-2xl">
            <h3 className="text-slate-400">Total Received</h3>
            <p className="text-3xl text-white font-bold">
              ₹1,24,500
            </p>
          </div>

          <div className="bg-[#071028] p-6 rounded-2xl">
            <h3 className="text-slate-400">Pending</h3>
            <p className="text-3xl text-yellow-400 font-bold">
              ₹18,500
            </p>
          </div>

          <div className="bg-[#071028] p-6 rounded-2xl">
            <h3 className="text-slate-400">Overdue</h3>
            <p className="text-3xl text-red-400 font-bold">
              ₹9,200
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}