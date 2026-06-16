"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddSupplierForm() {
  const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  countryCode: "+91",
  gst_number: "",
  pan_number: "",
  payment_terms: "",
  status: "ACTIVE",
});;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const countryCodes = [
    "+91", "+1", "+44", "+61", "+81",
    "+86", "+49", "+33", "+39", "+7",
    "+971", "+974", "+966", "+92", "+880",
    "+94", "+65", "+60", "+62", "+82",
    "+64", "+55", "+27", "+34", "+46"
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const router = useRouter();

  const validateForm = async () => {
  const gstRegex =
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{3}$/;

  const panRegex =
    /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  const phoneRegex =
    /^[0-9]{10}$/;

  if (!formData.name.trim()) {
    alert("Supplier Name is required");
    return;
  }

  if (!phoneRegex.test(formData.phone)) {
    alert("Phone Number must be 10 digits");
    return;
  }

  if (
    formData.gst_number &&
    !gstRegex.test(formData.gst_number)
  ) {
    alert("Invalid GST Number");
    return;
  }

  if (
    formData.pan_number &&
    !panRegex.test(formData.pan_number)
  ) {
    alert("Invalid PAN Number");
    return;
  }

  setIsSubmitting(true);

  try {
    const body = {
      tenant_id: 1, // replace with actual tenant id
      name: formData.name,
      email: formData.email,
      phone: `${formData.countryCode}${formData.phone}`,
      gst_number: formData.gst_number,
      pan_number: formData.pan_number,
      payment_terms: formData.payment_terms,
      status: formData.status,
    };

    const res = await fetch("/api/suppliers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error);
    }

    setFormData({
      name: "",
      email: "",
      countryCode: "+91",
      phone: "",
      gst_number: "",
      pan_number: "",
      payment_terms: "",
      status: "ACTIVE",
    });

    router.push("/inventory/suppliers");
    router.refresh();

  } catch (error) {
    console.error(error);
    alert("Failed to create supplier");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <div className="bg-[#071028] border border-slate-800 rounded-2xl p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">
        Add Supplier
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label>Business Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            className="w-full mt-2 p-3 bg-slate-900 rounded-xl"
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            className="w-full mt-2 p-3 bg-slate-900 rounded-xl"
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Phone Number</label>

          <div className="flex gap-2 mt-2">
            <select
              name="countryCode"
              value={formData.countryCode}
              className="bg-slate-900 rounded-xl px-3"
              onChange={handleChange}
            >
              {countryCodes.map((code) => (
                <option key={code}>{code}</option>
              ))}
            </select>

            <input
              type="text"
              name="phone"
              maxLength={10}
              value={formData.phone}
              className="flex-1 p-3 bg-slate-900 rounded-xl"
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label>GST Number</label>
          <input 
          type="text"
          name="gst_number"
          value={formData.gst_number}
          className="w-full mt-2 p-3 bg-slate-900 rounded-xl uppercase"
          onChange={handleChange}
          />
        </div>

        <div>
          <label>PAN Number</label>
          <input
          type="text"
          name="pan_number"
          value={formData.pan_number}
          className="w-full mt-2 p-3 bg-slate-900 rounded-xl uppercase"
          onChange={handleChange}
          />
        </div>

        <div>
          <label>Payment Terms</label>
          
          <input
          type="text"
          name="payment_terms"
          value={formData.payment_terms}
          className="w-full mt-2 p-3 bg-slate-900 rounded-xl"
          onChange={handleChange}
          placeholder="Net 30 Days"
          />
        </div>

        <div>
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            className="w-full mt-2 p-3 bg-slate-900 rounded-xl"
            onChange={handleChange}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        
    </div>

      <button
        onClick={validateForm}
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className={`mt-8 px-6 py-3 rounded-xl font-medium ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Supplier'}
      </button>
    </div>
  );
}