"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import CustomerHeader from "../components/CustomerHeader";
import CustomerStats from "../components/customers/CustomerStats";
import CustomerFilters from "../components/customers/CustomerFilters";
import CustomerTable from "../components/customers/CustomerTable";
import CustomerAddEditModal from "../components/customers/CustomerAddEditModal";
import { Customer } from "../components/customers/types";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [openModal, setOpenModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  // Load customers from database
  const loadCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/auth/customers");
      if (!res.ok) throw new Error("Failed to load customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("Error loading customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Add or Edit customer in the database
  const handleSaveCustomer = async (customer: Customer) => {
    try {
      const isEdit = customer.id > 0;
      const url = isEdit
        ? `/api/auth/customers/${customer.id}`
        : "/api/auth/customers";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customer),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save customer");
      }

      const savedCustomer = await response.json();

      if (isEdit) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === savedCustomer.id ? savedCustomer : c))
        );
      } else {
        setCustomers((prev) => [savedCustomer, ...prev]);
      }

      setOpenModal(false);
      setEditingCustomer(null);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to save customer");
    }
  };

  // Delete customer
  const handleDeleteCustomer = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/auth/customers/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete customer");
      }

      setCustomers((prev) => prev.filter((c) => c.id !== id));
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to delete customer");
    }
  };

  // Trigger Edit Customer modal
  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    setOpenModal(true);
  };

  // Effective Search + Filter logic
  const filteredCustomers = customers.filter((c) => {
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query) ||
      c.gstNumber.toLowerCase().includes(query);

    const matchesStatus =
      selectedStatus === "All" ||
      c.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden">
      {/* Background glow visual elements */}
      <div className="fixed top-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-200px] left-[-100px] w-[400px] h-[400px] bg-indigo-500/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main dashboard space */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1500px] mx-auto px-6 py-8 md:px-10 md:py-10">
          {/* Topbar Search */}
          <Topbar search={search} setSearch={setSearch} />

          {/* Header section with add button */}
          <CustomerHeader
            onAddCustomer={() => {
              setEditingCustomer(null);
              setOpenModal(true);
            }}
          />

          {/* Dynamic statistics summary cards */}
          <CustomerStats customers={customers} />

          {/* Table filters */}
          <CustomerFilters
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />

          {/* Customer list table */}
          {loading ? (
            <div className="rounded-2xl border border-slate-900 bg-slate-950/20 p-12 text-center text-slate-400 backdrop-blur-md">
              Loading customer directory...
            </div>
          ) : (
            <CustomerTable
              customers={filteredCustomers}
              onEdit={handleEditCustomer}
              onDelete={handleDeleteCustomer}
            />
          )}
        </div>
      </main>

      {/* Add / Edit customer dialog modal */}
      <CustomerAddEditModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingCustomer(null);
        }}
        onSave={handleSaveCustomer}
        editingCustomer={editingCustomer}
      />
    </div>
  );
}