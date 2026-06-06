"use client";

export default function CustomerDetails() {
  return (
    <div className="bg-[#071028] p-6 rounded-2xl">
      <h2 className="text-white text-2xl font-bold mb-6">
        Customer Details
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          placeholder="Customer Name"
          className="bg-slate-900 p-4 rounded-xl text-white"
        />

        <input
          placeholder="Company Name"
          className="bg-slate-900 p-4 rounded-xl text-white"
        />

        <input
          placeholder="Email"
          className="bg-slate-900 p-4 rounded-xl text-white"
        />

        <input
          placeholder="Phone"
          className="bg-slate-900 p-4 rounded-xl text-white"
        />

        <input
          placeholder="GST Number"
          className="bg-slate-900 p-4 rounded-xl text-white"
        />

        <input
          placeholder="Address"
          className="bg-slate-900 p-4 rounded-xl text-white"
        />
      </div>
    </div>
  );
}