import React, { useState } from "react";
import WeekNavigator from "../components/WeekNavigator";
import VisitTable from "../components/VisitTable";
import VisitForm from "../components/VisitForm";
import WeeklySummaryTable from "../components/WeeklySummaryTable";
import { Customer } from "../types";

import VisitTableToolbar from "../components/VisitTableToolbar";
import { addVisit, updateVisit, deleteVisit } from "../supabase/visitsApi";
import { CustomerVisit } from "../types";
import { getMonday, isDateInWeek } from "../utils/dateUtils";

const Home: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>("");
  // Customers fetched from Supabase
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerVisits, setCustomerVisits] = useState<CustomerVisit[]>([]);

  React.useEffect(() => {
    async function loadCustomers() {
      try {
        const { fetchCustomers } = await import("../supabase/customersApi");
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (e) {
        console.log("Cannot load customers:", e);
        setCustomers([]);
      }
    }
    loadCustomers();
  }, []);

  React.useEffect(() => {
    async function loadCustomerVisits() {
      try {
        const { fetchCustomerVisits } = await import(
          "../supabase/customerVisitsApi.ts"
        );
        const data = await fetchCustomerVisits();
        setCustomerVisits(data);
      } catch (e) {
        console.log("Cannot load customer visits:", e);
        setCustomerVisits([]);
      }
    }
    loadCustomerVisits();
  }, []);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingVisit, setEditingVisit] = useState<CustomerVisit | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Week navigation state
  const [currentMonday, setCurrentMonday] = useState(() =>
    getMonday(new Date()),
  );

  // Toolbar state
  const [search, setSearch] = useState("");
  const [procedureType, setProcedureType] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [subscription, setSubscription] = useState("");
  const [sort, setSort] = useState("date-desc");

  // Filtering, searching, and sorting logic
  const visitsThisWeek = customerVisits.filter((v) =>
    isDateInWeek(v.date, currentMonday),
  );
  const filteredVisits = visitsThisWeek
    .filter((v) => {
      const matchesSearch =
        !search ||
        (v.name && v.name.toLowerCase().includes(search.toLowerCase())) ||
        (v.procedureType &&
          v.procedureType.name.toLowerCase().includes(search.toLowerCase())) ||
        (v.paidBy && v.paidBy.toLowerCase().includes(search.toLowerCase()));
      const matchesProcedure =
        !procedureType || v.procedureType === procedureType;
      const matchesPaidBy = !paidBy || v.paidBy === paidBy;
      const matchesSubscription =
        !subscription ||
        (subscription === "yes" ? v.subscription : !v.subscription);
      const matchesCustomer = !customerId || v.customerId === customerId;
      return (
        matchesSearch &&
        matchesProcedure &&
        matchesPaidBy &&
        matchesSubscription &&
        matchesCustomer
      );
    })
    .sort((a, b) => {
      switch (sort) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "name-asc":
          return (a.name ?? "").localeCompare(b.name ?? "");
        case "name-desc":
          return (b.name ?? "").localeCompare(a.name ?? "");
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const handlePrevWeek = () => {
    setCurrentMonday(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7),
    );
  };
  const handleNextWeek = () => {
    setCurrentMonday(
      (prev) =>
        new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7),
    );
  };

  const handleAdd = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (visit: CustomerVisit) => {
    setEditingId(visit.id);
    setShowForm(true);
    setEditingVisit(visit);
  };

  const handleSave = async (visit: Omit<CustomerVisit, "id">) => {
    if (editingId) {
      await updateVisit(editingId, visit);
    } else {
      await addVisit(visit);
    }
    // Refresh visits from Supabase
    const { fetchCustomerVisits } = await import(
      "../supabase/customerVisitsApi.ts"
    );
    const data = await fetchCustomerVisits();
    setCustomerVisits(data);
    setShowForm(false);
    setEditingId(null);
    setEditingVisit(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete visit? This cannot be undone.")) {
      await deleteVisit(id);
      // Refresh visits from Supabase
      const { fetchCustomerVisits } = await import(
        "../supabase/customerVisitsApi.ts"
      );
      const data = await fetchCustomerVisits();
      setCustomerVisits(data);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingVisit(null);
  };

  const handleResetFilters = () => {
    setSearch("");
    setProcedureType("");
    setPaidBy("");
    setSubscription("");
    setSort("date-desc");
    setCustomerId("");
  };

  return (
    <div>
      <WeekNavigator
        currentMonday={currentMonday}
        onPrevWeek={handlePrevWeek}
        onNextWeek={handleNextWeek}
      />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-4 gap-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleAdd}
          >
            Add Visit
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => (window.location.href = "/customers")}
          >
            Add Customer
          </button>
        </div>
        {showForm && (
          <VisitForm
            initial={editingVisit || undefined}
            onSave={handleSave}
            onCancel={handleCancel}
            customers={customers}
          />
        )}
        <VisitTableToolbar
          search={search}
          onSearchChange={setSearch}
          procedureType={procedureType}
          onProcedureTypeChange={setProcedureType}
          paidBy={paidBy}
          onPaidByChange={setPaidBy}
          subscription={subscription}
          onSubscriptionChange={setSubscription}
          sort={sort}
          onSortChange={setSort}
          onReset={handleResetFilters}
          customerId={customerId}
          onCustomerIdChange={setCustomerId}
          customers={customers}
        />
        <VisitTable
          visits={filteredVisits}
          customers={customers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          weekRangeLabel={
            `${currentMonday.getFullYear()}-${String(currentMonday.getMonth() + 1).padStart(2, "0")}-${String(currentMonday.getDate()).padStart(2, "0")} to ` +
            (() => {
              const end = new Date(currentMonday);
              end.setDate(end.getDate() + 6);
              return `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}-${String(end.getDate()).padStart(2, "0")}`;
            })()
          }
        />
        <WeeklySummaryTable visits={visitsThisWeek} />
        <div className="text-gray-600 mt-6">
          Welcome to the Customer Tracker! Start by adding a new visit or
          navigating weeks.
        </div>
      </div>
    </div>
  );
};

export default Home;
