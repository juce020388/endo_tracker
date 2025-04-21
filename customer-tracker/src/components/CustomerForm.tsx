import React, { useState, useEffect } from "react";
import { Customer } from "../types";

interface CustomerFormProps {
  initial?: Partial<Customer>;
  onSave: (customer: Omit<Customer, "id">) => void;
  onCancel: () => void;
}

const validateEmail = (email: string) => {
  // Simple email regex
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
};

const CustomerForm: React.FC<CustomerFormProps> = ({
  initial,
  onSave,
  onCancel,
}) => {
  const [fields, setFields] = useState<Omit<Customer, "id">>({
    name: "",
    phone: "",
    email: "",
    notes: "",
    ...initial,
  });
  const [errors, setErrors] = useState<{ [k: string]: string }>({});

  useEffect(() => {
    setFields((f) => ({ ...f, ...initial }));
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    setErrors((errs) => ({ ...errs }));
  };

  const validate = () => {
    const errs: { [k: string]: string } = {};
    if (!fields.name?.trim()) errs.name = "Name is required.";
    if (fields.email && !validateEmail(fields.email))
      errs.email = "Invalid email.";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave(fields);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 p-6 rounded shadow-lg w-full max-w-md relative animate-fadein"
      >
        <h2 className="text-xl font-bold mb-4">
          {initial ? "Edit Customer" : "Add Customer"}
        </h2>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Name *</label>
          <input
            name="name"
            value={fields.name}
            onChange={handleChange}
            className={`w-full border rounded px-2 py-1 ${
              errors.name ? "border-red-500" : "border-sky"
            } focus:ring-2 focus:ring-accent`}
            required
            autoFocus
          />
          {errors.name && (
            <div className="text-xs text-red-600 mt-1">{errors.name}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Phone</label>
          <input
            name="phone"
            value={fields.phone}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 border-sky focus:ring-2 focus:ring-accent"
            type="tel"
          />
        </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            name="email"
            value={fields.email}
            onChange={handleChange}
            className={`w-full border rounded px-2 py-1 ${
              errors.email ? "border-red-500" : "border-sky"
            } focus:ring-2 focus:ring-accent`}
            type="email"
          />
          {errors.email && (
            <div className="text-xs text-red-600 mt-1">{errors.email}</div>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Notes</label>
          <textarea
            name="notes"
            value={fields.notes}
            onChange={handleChange}
            className="w-full border rounded px-2 py-1 border-sky focus:ring-2 focus:ring-accent min-h-[60px]"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 rounded border border-gray-400 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-1 rounded bg-accent text-white font-semibold hover:bg-accent-dark"
          >
            {initial ? "Save" : "Add"}
          </button>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-2 right-2 text-xl text-gray-400 hover:text-red-500"
          aria-label="Close"
        >
          &times;
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
