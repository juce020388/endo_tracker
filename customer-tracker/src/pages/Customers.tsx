import React, { useEffect, useState } from "react";
import { Customer, CustomerVisit } from "../types";
import CustomerForm from "../components/CustomerForm";
import CustomerDataManagementBar from "../components/CustomerDataManagementBar";
import { supabase } from "../supabaseClient";

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
  fields: Omit<Customer, "id">,
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
  fields: Omit<Customer, "id">,
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
    null,
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

  useEffect(() => {
    async function loadCustomerVisits() {
      try {
        const { fetchCustomerVisits } = await import(
          "../supabase/customerVisitsApi.ts"
        );
        const data = await fetchCustomerVisits();
        console.log("Customer visit data", data);
        setVisits(data);
      } catch (e) {
        console.log("Cannot load customer visits:", e);
        setVisits([]);
      }
    }
    loadCustomerVisits();
  }, []);

  const filtered = customers.filter(
    (c) =>
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search)) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase())),
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
          cs.map((c) => (c.id === editing.id ? updated : c)),
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
    <div className="max-w-6xl mx-auto p-4  min-h-screen bg-white rounded-lg shadow-lg">
      <CustomerDataManagementBar customers={customers} />

      <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold mb-6 text-teal-700 border-b pb-3">
          Customer Management
        </h2>

        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-accent focus:border-accent"
            />
          </div>
          <button
            className="bg-accent hover:bg-accent/90 transition-colors text-white px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-md"
            onClick={handleAdd}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Customer
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="mb-8 flex flex-col items-center justify-center animate-fade-in py-16">
            <div className="relative mb-4">
              <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="h-8 w-8 text-accent opacity-70"
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
            <span className="text-accent font-medium text-lg tracking-wide">
              Loading customers...
            </span>
          </div>
        )}

        {!loading && (
          <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <tr>
                  <th className="text-lg font-semibold mb-3 text-gray-700">
                    Name
                  </th>
                  <th className="text-lg font-semibold mb-3 text-gray-700">
                    Phone
                  </th>
                  <th className="text-lg font-semibold mb-3 text-gray-700">
                    Email
                  </th>
                  <th className="text-lg font-semibold mb-3 text-gray-700">
                    Notes
                  </th>
                  <th className="text-lg font-semibold mb-3 text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white  divide-y divide-gray-200 dark:divide-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-gray-500 dark:text-gray-400 font-medium"
                    >
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <React.Fragment key={c.id}>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500">
                          {c.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {c.phone || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {c.email || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {c.notes || "-"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-row gap-3 items-center">
                            <button
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                              onClick={() => handleEdit(c)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-1"
                              onClick={() => handleDelete(c.id)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              Delete
                            </button>
                            <button
                              className="text-accent hover:text-accent/80 dark:text-accent dark:hover:text-accent/90 font-medium flex items-center gap-1"
                              onClick={() =>
                                setExpandedCustomerId(
                                  expandedCustomerId === c.id ? null : c.id,
                                )
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                {expandedCustomerId === c.id ? (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 15l7-7 7 7"
                                  />
                                ) : (
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 9l-7 7-7-7"
                                  />
                                )}
                              </svg>
                              {expandedCustomerId === c.id
                                ? "Hide History"
                                : "Show History"}
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedCustomerId === c.id && (
                        <tr>
                          <td colSpan={5} className="p-0 ">
                            <div className="rounded-lg border border-gray-200 shadow-lg bg-white m-4 p-6">
                              <div className="flex items-center gap-4 mb-4">
                                <button className="rounded-full text-white w-10 h-10 flex items-center justify-center text-xl shadow-md">
                                  {c.name ? c.name[0].toUpperCase() : "?"}
                                </button>
                                <div>
                                  <span className="font-semibold text-accent text-xl">
                                    {c.name}
                                  </span>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {
                                      visits.filter(
                                        (v) => v.customerId === c.id,
                                      ).length
                                    }{" "}
                                    visit(s)
                                  </div>
                                </div>
                              </div>
                              <div className="overflow-x-auto rounded-lg shadow">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                  <thead className="bg-gray-100 dark:bg-slate-800">
                                    <tr>
                                      <th
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        title="Date of visit"
                                      >
                                        Date
                                      </th>
                                      <th
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        title="Procedure type"
                                      >
                                        Procedure
                                      </th>
                                      <th
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        title="Visit price"
                                      >
                                        Price
                                      </th>
                                      <th
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        title="Your pay for this visit"
                                      >
                                        My Pay
                                      </th>
                                      <th
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        title="Change from pocket"
                                      >
                                        Change
                                      </th>
                                      <th
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        title="Subscription"
                                      >
                                        Sub
                                      </th>
                                      <th
                                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                                        title="Notes"
                                      >
                                        Notes
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="bg-white dark:bg-slate-900 divide-y divide-gray-200 dark:divide-gray-700">
                                    {visits.filter((v) => v.customerId === c.id)
                                      .length === 0 ? (
                                      <tr>
                                        <td
                                          colSpan={7}
                                          className="px-4 py-6 text-sm text-gray-500 dark:text-gray-400 text-center"
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
                                            className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                                          >
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                              {v.date.slice(0, 10)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                                              {v.procedureType.name}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                              <span className="font-medium">
                                                {v.price}
                                              </span>
                                              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                                                {v.paidBy}
                                              </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                              {typeof v.myPay === "number" ? (
                                                <span className="font-medium">
                                                  {v.myPay}
                                                </span>
                                              ) : (
                                                "-"
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                              {typeof v.changeFromPocket ===
                                              "number" ? (
                                                <span className="font-medium">
                                                  {v.changeFromPocket}
                                                </span>
                                              ) : (
                                                "-"
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-center">
                                              {v.subscription ? (
                                                <span className="text-yellow-500 dark:text-yellow-400">
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-5 w-5"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                  >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                  </svg>
                                                </span>
                                              ) : (
                                                <span className="text-gray-300 dark:text-gray-700">
                                                  -
                                                </span>
                                              )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
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
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                {editing ? "Edit Customer" : "Add New Customer"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={handleCancel}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <CustomerForm
              initial={editing || undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
