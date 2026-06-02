"use client";

import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import CustomerHeader from "./components/CustomerHeader";
import StatsCards from "./components/StatsCards";
import CustomerTable from "./components/CustomerTable";
import AddCustomerModal from "./components/AddCustomerModel";
import CustomerFilters from "./components/CustomerFilters";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  gstNumber: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [search, setSearch] =
    useState("");

  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState("All");

  const [openModal, setOpenModal] =
    useState(false);

  const [
    editingCustomer,
    setEditingCustomer,
  ] = useState<Customer | null>(
    null
  );

  // Load customers from localStorage
  useEffect(() => {
    const storedCustomers =
      localStorage.getItem(
        "customers"
      );

    if (storedCustomers) {
      setCustomers(
        JSON.parse(
          storedCustomers
        )
      );
    }
  }, []);

  // Save customers to localStorage
  useEffect(() => {
    localStorage.setItem(
      "customers",
      JSON.stringify(customers)
    );
  }, [customers]);

  // Add or Edit customer
  const handleSaveCustomer = (
    customer: Customer
  ) => {
    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === customer.id
            ? customer
            : c
        )
      );
    } else {
      setCustomers((prev) => [
        customer,
        ...prev,
      ]);
    }

    setEditingCustomer(null);
  };

  // Delete customer
  const handleDeleteCustomer = (
    id: number
  ) => {
    const confirmDelete =
      confirm(
        "Delete this customer?"
      );

    if (!confirmDelete)
      return;

    setCustomers((prev) =>
      prev.filter(
        (c) => c.id !== id
      )
    );
  };

  // Edit customer
  const handleEditCustomer = (
    customer: Customer
  ) => {
    setEditingCustomer(
      customer
    );

    setOpenModal(true);
  };

  // Search + filter
  const filteredCustomers =
    customers.filter((c) => {
      const matchesSearch =
        c.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        c.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesStatus =
        selectedStatus ===
          "All" ||
        c.status ===
          selectedStatus;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  return (
    <div className="min-h-screen bg-[#050816] text-white flex overflow-hidden">
      {/* Background glow */}
      <div className="fixed top-[-200px] right-[-100px] w-[500px] h-[500px] bg-blue-600/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="fixed bottom-[-200px] left-[-100px] w-[400px] h-[400px] bg-indigo-500/20 blur-[140px] rounded-full pointer-events-none" />

      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1500px] mx-auto px-10 py-10">
          {/* Search bar */}
          <Topbar
            search={search}
            setSearch={
              setSearch
            }
          />

          {/* Header */}
          <CustomerHeader
            onAddCustomer={() => {
              setEditingCustomer(
                null
              );

              setOpenModal(
                true
              );
            }}
          />

          {/* Stats */}
          <StatsCards
            totalCustomers={
              customers.length
            }
            activeCustomers={
              customers.filter(
                (c) =>
                  c.status ===
                  "Active"
              ).length
            }
          />

          {/* Filters */}
          <CustomerFilters
            selectedStatus={
              selectedStatus
            }
            setSelectedStatus={
              setSelectedStatus
            }
          />

          {/* Table */}
          <CustomerTable
            customers={
              filteredCustomers
            }
            onEdit={
              handleEditCustomer
            }
            onDelete={
              handleDeleteCustomer
            }
          />
        </div>
      </main>

      {/* Modal */}
      <AddCustomerModal
        open={openModal}
        onClose={() =>
          setOpenModal(false)
        }
        onSave={
          handleSaveCustomer
        }
        editingCustomer={
          editingCustomer
        }
      />
    </div>
  );
}