import Sidebar from "../components/Sidebar";

export default function SettingsPage() {
  return (
    <div className="flex bg-[#020817] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10">
        <h1 className="text-4xl font-bold text-white mb-8">
          Settings
        </h1>

        <div className="bg-[#071028] p-8 rounded-2xl">
          <div className="grid grid-cols-2 gap-6">

            <input
              placeholder="Company Name"
              className="bg-slate-900 p-4 rounded-xl text-white"
            />

            <input
              placeholder="GST Number"
              className="bg-slate-900 p-4 rounded-xl text-white"
            />

            <input
              placeholder="Phone"
              className="bg-slate-900 p-4 rounded-xl text-white"
            />

            <input
              placeholder="Email"
              className="bg-slate-900 p-4 rounded-xl text-white"
            />

          </div>

          <button className="bg-blue-600 mt-6 px-6 py-3 rounded-xl text-white">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}