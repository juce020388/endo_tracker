import React, { useEffect, useState } from "react";
import { Customer, CustomerVisit } from "../types";
import CustomerForm from "../components/CustomerForm";
import CustomerDataManagementBar from "../components/CustomerDataManagementBar";
import { supabase } from "../supabaseClient";

// Supabase CRUD functions
async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, phone, email, notes");
  if (error) {
    console.error("Error fetching customers:", error.message);
    return [];
  }
  return data || [];
}

async function addCustomer(
  fields: Omit<Customer, "id">
): Promise<Customer | null> {
  const { data, error } = await supabase
    .from("customers")
    .insert([{ ...fields }])
    .select()
    .single();
  if (error) {
    console.error("Error adding customer:", error.message);
    return null;
  }
  return data;
}

async function updateCustomer(
  id: string,
  fields: Omit<Customer, "id">
): Promise<Customer | null> {
  const { data, error } = await supabase
    .from("customers")
    .update({ ...fields })
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Error updating customer:", error.message);
    return null;
  }
  return data;
}

async function deleteCustomer(id: string): Promise<boolean> {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) {
    console.error("Error deleting customer:", error.message);
    return false;
  }
  return true;
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [expandedCustomerId, setExpandedCustomerId] = useState<string | null>(
    null
  );
  const [visits, setVisits] = useState<CustomerVisit[]>([]);

  // Fetch customers from Supabase
  useEffect(() => {
    setLoading(true);
    fetchCustomers().then((data) => {
      setCustomers(data);
      setLoading(false);
    });
  }, []);

  // TODO: Integrate visits with Supabase if needed
  useEffect(() => {
    try {
      const raw = localStorage.getItem("customerVisits");
      if (!raw) return;
      setVisits(JSON.parse(raw));
    } catch {
      setVisits([]);
    }
  }, []);

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search)) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditing(customer);
    setShowForm(true);
  };

  const handleSave = async (fields: Omit<Customer, "id">) => {
    if (editing) {
      const updated = await updateCustomer(editing.id, fields);
      if (updated) {
        setCustomers((cs) =>
          cs.map((c) => (c.id === editing.id ? updated : c))
        );
      }
    } else {
      const added = await addCustomer(fields);
      if (added) {
        setCustomers((cs) => [...cs, added]);
      }
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete customer? This cannot be undone.")) {
      const ok = await deleteCustomer(id);
      if (ok) setCustomers((cs) => cs.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <CustomerDataManagementBar
        customers={customers}
      />
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <div className="mb-4 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-2 py-1 w-full md:w-64"
        />
        <button
          className="bg-accent text-white px-3 py-1 rounded"
          onClick={handleAdd}
        >
          + Add Customer
        </button>
      </div>
      {/* Loading indicator */}
      {loading && (
        <div className="mb-8 flex flex-col items-center justify-center animate-fade-in">
          <div className="relative mb-2">
            <div className="w-14 h-14 border-4 border-teal-300 border-t-teal-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-teal-600 opacity-70"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeWidth="2"
                  d="M12 4v4m0 8v4m8-8h-4M4 12H0m17.657-5.657l-2.828 2.828m-8.486 8.486l-2.828 2.828m14.142 0l-2.828-2.828m-8.486-8.486L4.343 6.343"
                />
              </svg>
            </div>
          </div>
          <span className="text-teal-700 font-medium text-base tracking-wide">
            Loading customers...
          </span>
        </div>
      )}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border rounded">
            <thead>
              <tr className="bg-sky/10">
                <th className="px-2 py-1 text-left">Name</th>
                <th className="px-2 py-1 text-left">Phone</th>
                <th className="px-2 py-1 text-left">Email</th>
                <th className="px-2 py-1 text-left">Notes</th>
                <th className="px-2 py-1 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No customers found.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <React.Fragment key={c.id}>
                    <tr className="border-t">
                      <td className="px-2 py-1">{c.name}</td>
                      <td className="px-2 py-1">{c.phone || "-"}</td>
                      <td className="px-2 py-1">{c.email || "-"}</td>
                      <td className="px-2 py-1">{c.notes || "-"}</td>
                      <td className="px-2 py-1">
                        <div className="flex flex-row gap-2 items-center">
                          <button
                            className="text-blue-600 px-1"
                            onClick={() => handleEdit(c)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 px-1"
                            onClick={() => handleDelete(c.id)}
                          >
                            Delete
                          </button>
                          <button
                            className="text-accent px-1 underline text-xs"
                            onClick={() =>
                              setExpandedCustomerId(
                                expandedCustomerId === c.id ? null : c.id
                              )
                            }
                          >
                            {expandedCustomerId === c.id
                              ? "Hide History"
                              : "Show History"}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedCustomerId === c.id && (
                      <tr>
                        <td colSpan={5} className="p-0">
                          <div className="rounded-lg border-2 border-accent shadow-lg bg-white dark:bg-slate-900 my-2 p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="inline-block rounded-full bg-accent text-white w-8 h-8 flex items-center justify-center font-bold text-lg">
                                {c.name ? c.name[0].toUpperCase() : "?"}
                              </span>
                              <span className="font-semibold text-accent text-lg">
                                {c.name}
                              </span>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full text-xs border rounded bg-white dark:bg-slate-800">
                                <thead>
                                  <tr>
                                    <th
                                      className="px-2 py-1 border-b"
                                      title="Date of visit"
                                    >
                                      Date
                                    </th>
                                    <th
                                      className="px-2 py-1 border-b"
                                      title="Procedure type"
                                    >
                                      Procedure
                                    </th>
                                    <th
                                      className="px-2 py-1 border-b"
                                      title="Visit price"
                                    >
                                      Price
                                    </th>
                                    <th
                                      className="px-2 py-1 border-b"
                                      title="Your pay for this visit"
                                    >
                                      My Pay
                                    </th>
                                    <th
                                      className="px-2 py-1 border-b"
                                      title="Change from pocket"
                                    >
                                      Change
                                    </th>
                                    <th
                                      className="px-2 py-1 border-b"
                                      title="Subscription"
                                    >
                                      Sub
                                    </th>
                                    <th
                                      className="px-2 py-1 border-b"
                                      title="Notes"
                                    >
                                      Notes
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {visits.filter((v) => v.customerId === c.id)
                                    .length === 0 ? (
                                    <tr>
                                      <td
                                        colSpan={7}
                                        className="text-xs text-gray-400 text-center"
                                      >
                                        No visits for this customer.
                                      </td>
                                    </tr>
                                  ) : (
                                    visits
                                      .filter((v) => v.customerId === c.id)
                                      .map((v) => (
                                        <tr
                                          key={v.id}
                                          className="odd:bg-sky-100 even:bg-white dark:odd:bg-slate-900 dark:even:bg-slate-800 hover:bg-accent/10 transition-colors"
                                        >
                                          <td className="px-2 py-1">
                                            {v.date.slice(0, 10)}
                                          </td>
                                          <td className="px-2 py-1">
                                            {v.procedureType}
                                          </td>
                                          <td className="px-2 py-1">
                                            {v.price} {v.paidBy}
                                          </td>
                                          <td className="px-2 py-1">
                                            {typeof v.myPay === "number"
                                              ? v.myPay
                                              : "-"}
                                          </td>
                                          <td className="px-2 py-1">
                                            {typeof v.changeFromPocket ===
                                            "number"
                                              ? v.changeFromPocket
                                              : "-"}
                                          </td>
                                          <td className="px-2 py-1 text-center">
                                            {v.subscription ? (
                                              <span
                                                role="img"
                                                aria-label="subscription"
                                                title="Subscription"
                                              >
                                                ⭐
                                              </span>
                                            ) : (
                                              "-"
                                            )}
                                          </td>
                                          <td className="px-2 py-1">
                                            {v.notes || "-"}
                                          </td>
                                        </tr>
                                      ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      {showForm && (
        <CustomerForm
          initial={editing || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Customers;
