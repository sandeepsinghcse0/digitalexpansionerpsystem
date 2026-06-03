"use client";

import { useEffect, useState } from "react";

type Customer = {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: string;
  gstNumber: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (customer: Customer) => void;
  editingCustomer: Customer | null;
};

export default function AddCustomerModal({
  open,
  onClose,
  onSave,
  editingCustomer,
}: Props) {
  const [formData, setFormData] =
    useState<Customer>({
      id: Date.now(),
      name: "",
      email: "",
      phone: "",
      city: "",
      status: "Active",
      gstNumber: "",
    });

  useEffect(() => {
    if (editingCustomer) {
      setFormData(editingCustomer);
    } else {
      setFormData({
        id: Date.now(),
        name: "",
        email: "",
        phone: "",
        city: "",
        status: "Active",
        gstNumber: "",
      });
    }
  }, [editingCustomer, open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (
      !formData.name.trim() ||
      !formData.phone.trim()
    ) {
      alert(
        "Name and Phone are required"
      );
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md px-4">
      <div className="relative w-full max-w-3xl rounded-[40px] border border-white/10 bg-[#0c1222] p-8 shadow-[0_0_80px_rgba(59,130,246,0.15)]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-2xl text-gray-400 hover:text-white"
        >
          ✕
        </button>

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-5xl font-bold text-white">
            {editingCustomer
              ? "Edit Customer"
              : "Add Customer"}
          </h2>

          <p className="text-gray-400 mt-2 text-lg">
            Manage customer
            information
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Name"
            value={formData.name}
            onChange={(value) =>
              setFormData({
                ...formData,
                name: value,
              })
            }
          />

          <Input
            label="Email"
            value={formData.email}
            onChange={(value) =>
              setFormData({
                ...formData,
                email: value,
              })
            }
          />

          <Input
            label="Phone"
            value={formData.phone}
            onChange={(value) =>
              setFormData({
                ...formData,
                phone: value,
              })
            }
          />

          <Input
            label="City"
            value={formData.city}
            onChange={(value) =>
              setFormData({
                ...formData,
                city: value,
              })
            }
          />

          <Input
            label="GST Number"
            value={
              formData.gstNumber
            }
            onChange={(value) =>
              setFormData({
                ...formData,
                gstNumber:
                  value,
              })
            }
          />

          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Status
            </label>

            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status:
                    e.target.value,
                })
              }
              className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-white outline-none"
            >
              <option value="Active">
                Active
              </option>

              <option value="Premium">
                Premium
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-4 rounded-2xl border border-white/10 hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 font-semibold hover:scale-105 transition-all"
          >
            {editingCustomer
              ? "Update Customer"
              : "Save Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChange: (
    value: string
  ) => void;
};

function Input({
  label,
  value,
  onChange,
}: InputProps) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-2">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-white outline-none focus:border-blue-500"
      />
    </div>
  );
}