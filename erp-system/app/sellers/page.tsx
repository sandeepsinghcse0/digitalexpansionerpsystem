"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

type Seller = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
};

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);

  useEffect(() => {
    fetch("/api/sellers")
      .then((res) => res.json())
      .then(setSellers);
  }, []);

  return (
    <div className="flex bg-[#020817] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-8 text-white">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Seller Management
            </h1>

            <p className="text-slate-400 mt-2">
              Manage product sellers
            </p>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl">
            + Add Seller
          </button>
        </div>

        <div className="bg-[#071028] border border-slate-800 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left p-4">ID</th>
                <th className="text-left p-4">Seller Name</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Phone</th>
              </tr>
            </thead>

            <tbody>
              {sellers.map((seller) => (
                <tr
                  key={seller.id}
                  className="border-b border-slate-800"
                >
                  <td className="p-4">{seller.id}</td>
                  <td className="p-4">{seller.name}</td>
                  <td className="p-4">{seller.email || "-"}</td>
                  <td className="p-4">{seller.phone || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}