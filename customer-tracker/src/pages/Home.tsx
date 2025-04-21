import React, { useState } from 'react';
import WeekNavigator from '../components/WeekNavigator';
import VisitTable from '../components/VisitTable';
import VisitForm from '../components/VisitForm';
import WeeklySummaryTable from '../components/WeeklySummaryTable';
import { Customer } from '../types';

import UndoSnackbar from '../components/UndoSnackbar';
import VisitTableToolbar from '../components/VisitTableToolbar';
import { useCustomerVisits } from '../hooks/useCustomerVisits';
import { CustomerVisit } from '../types';
import { getMonday, isDateInWeek } from '../utils/dateUtils';

const Home: React.FC = () => {
  const { visits, addVisit, updateVisit, deleteVisit, setVisits } = useCustomerVisits();
  const [undoOpen, setUndoOpen] = useState(false);
  const [prevVisits] = useState<CustomerVisit[] | null>(null);
  const [customerId, setCustomerId] = useState<string>('');
  // Customers fetched from Supabase
  const [customers, setCustomers] = useState<Customer[]>([]);
  React.useEffect(() => {
    async function loadCustomers() {
      try {
        const { fetchCustomers } = await import('../supabase/customersApi');
        const data = await fetchCustomers();
        setCustomers(data);
      } catch (e) {
        console.log("Cannot load customers:", e);
        setCustomers([]);
      }
    }
    loadCustomers();
  }, []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingVisit, setEditingVisit] = useState<CustomerVisit | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Week navigation state
  const [currentMonday, setCurrentMonday] = useState(() => getMonday(new Date()));
  console.log("All visits", visits);
  console.log("Current monday", currentMonday);

  // Toolbar state
  const [search, setSearch] = useState('');
  const [procedureType, setProcedureType] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [subscription, setSubscription] = useState('');
  const [sort, setSort] = useState('date-desc');

  // Filtering, searching, and sorting logic
  const visitsThisWeek = visits.filter(v => isDateInWeek(v.date, currentMonday));
  const filteredVisits = visitsThisWeek.filter(v => {
    const matchesSearch =
        !search ||
        (v.name && v.name.toLowerCase().includes(search.toLowerCase())) ||
        (v.procedureType && v.procedureType.toLowerCase().includes(search.toLowerCase())) ||
        (v.paidBy && v.paidBy.toLowerCase().includes(search.toLowerCase()));
    const matchesProcedure = !procedureType || v.procedureType === procedureType;
    const matchesPaidBy = !paidBy || v.paidBy === paidBy;
    const matchesSubscription = !subscription || (subscription === 'yes' ? v.subscription : !v.subscription);
    const matchesCustomer = !customerId || v.customerId === customerId;
    return matchesSearch && matchesProcedure && matchesPaidBy && matchesSubscription && matchesCustomer;
  })
      .sort((a, b) => {
        switch (sort) {
          case 'date-asc':
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          case 'date-desc':
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          case 'name-asc':
            return (a.name ?? '').localeCompare(b.name ?? '');
          case 'name-desc':
            return (b.name ?? '').localeCompare(a.name ?? '');
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          default:
            return 0;
        }
      });

  const handlePrevWeek = () => {
    setCurrentMonday(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
  };
  const handleNextWeek = () => {
    setCurrentMonday(prev => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
  };

  const handleAdd = () => {
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (visit: CustomerVisit) => {
    setEditingId(visit.id);
    setShowForm(true);
    setEditingVisit(visit);
  }

  const handleSave = (visit: Omit<CustomerVisit, 'id'>) => {
    if (editingId) {
      updateVisit(editingId, visit);
    } else {
      addVisit(visit);
    }
    setShowForm(false);
    setEditingId(null);
    setEditingVisit(null);
  }

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setEditingVisit(null);
  }

  const handleResetFilters = () => {
    setSearch('');
    setProcedureType('');
    setPaidBy('');
    setSubscription('');
    setSort('date-desc');
    setCustomerId('');
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
            <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={handleAdd}>Add Visit</button>
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded"
                onClick={() => window.location.href = '/customers'}
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
              onDelete={deleteVisit}
              weekRangeLabel={
                  `${currentMonday.getFullYear()}-${String(currentMonday.getMonth()+1).padStart(2,'0')}-${String(currentMonday.getDate()).padStart(2,'0')} to ` +
                  (() => {
                    const end = new Date(currentMonday);
                    end.setDate(end.getDate() + 6);
                    return `${end.getFullYear()}-${String(end.getMonth()+1).padStart(2,'0')}-${String(end.getDate()).padStart(2,'0')}`;
                  })()
              }
          />
          <WeeklySummaryTable visits={visitsThisWeek} />
          <div className="text-gray-600 mt-6">Welcome to the Customer Tracker! Start by adding a new visit or navigating weeks.</div>
          <UndoSnackbar
              open={undoOpen}
              onUndo={() => {
                if (prevVisits) setVisits(prevVisits);
                setUndoOpen(false);
              }}
              onClose={() => setUndoOpen(false)}
              duration={5000}
          />
        </div>
      </div>
  );
};

export default Home;
