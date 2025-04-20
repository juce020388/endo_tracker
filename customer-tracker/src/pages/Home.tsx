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
  // Customers for export/import
  const [customers] = useState<Customer[]>(() => {
    try {
      const raw = localStorage.getItem('customers');
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Auto-save state
  const [autoSaveInterval, setAutoSaveInterval] = useState<number>(() => {
    const stored = localStorage.getItem('autoSaveInterval');
    return stored ? Number(stored) : 1;
  }); // in minutes, 0 = off
  const [autoSaveNotice, setAutoSaveNotice] = useState<string>('');
  const [showNotice, setShowNotice] = useState<boolean>(false);

  // Persist interval changes
  React.useEffect(() => {
    localStorage.setItem('autoSaveInterval', String(autoSaveInterval));
  }, [autoSaveInterval]);

  // Auto-save effect
  React.useEffect(() => {
    if (!autoSaveInterval) return;
    const interval = setInterval(() => {
      localStorage.setItem('customerVisits', JSON.stringify(visits));
      setAutoSaveNotice(`Auto-saved at ${new Date().toISOString()}`);
      setShowNotice(true);
    }, autoSaveInterval * 60 * 1000);
    return () => clearInterval(interval);
  }, [autoSaveInterval, visits]);

  // Manual save
  const handleManualSave = () => {
    localStorage.setItem('customerVisits', JSON.stringify(visits));
    setAutoSaveNotice(`Saved manually at ${new Date().toISOString()}`);
    setShowNotice(true);
  };

  // Dismiss notice
  const dismissNotice = () => setShowNotice(false);

  // Auto-dismiss toast after 3s
  const autoDismissToast = () => {
    if ((window as any).autoSaveToastTimeout) clearTimeout((window as any).autoSaveToastTimeout);
    (window as any).autoSaveToastTimeout = setTimeout(() => {
      setShowNotice(false);
    }, 3000);
  };

  React.useEffect(() => {
    if (showNotice) autoDismissToast();
    return () => {
      if ((window as any).autoSaveToastTimeout) clearTimeout((window as any).autoSaveToastTimeout);
    };
  }, [showNotice]);

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

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowForm(true);
  };

  const handleSave = (visit: Omit<CustomerVisit, 'id'>) => {
    if (editingId) {
      updateVisit(editingId, visit);
    } else {
      addVisit(visit);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const editingVisit = visits.find(v => v.id === editingId);

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
        <div className="flex items-center justify-end gap-4 mb-2">
          <div className="flex items-center gap-2">
            <label htmlFor="autosave-interval" className="text-sm text-deepteal font-semibold">Auto-save:</label>
            <select
              id="autosave-interval"
              className="border border-sky rounded px-2 py-1 text-sm"
              value={autoSaveInterval}
              onChange={e => setAutoSaveInterval(Number(e.target.value))}
              aria-label="Auto-save interval"
            >
              <option value={0}>Off</option>
              <option value={1}>Every 1 min</option>
              <option value={5}>Every 5 min</option>
              <option value={10}>Every 10 min</option>
            </select>
            <button
              className="ml-2 px-2 py-1 bg-teal text-sand rounded hover:bg-deepteal text-xs border border-sky"
              onClick={handleManualSave}
              type="button"
            >
              Save Now
            </button>
          </div>
          {/* Notification Toast */}
          {showNotice && (
            <div
              className={`fixed left-1/2 bottom-8 z-50 flex items-center px-5 py-3 rounded shadow-lg transition-all duration-300 animate-fadein
                ${autoSaveNotice.includes('manually') ? 'bg-green-600 text-white' : 'bg-sky text-deepteal'}
              `}
              style={{ transform: 'translateX(-50%)', minWidth: 220, maxWidth: '90vw' }}
              onMouseEnter={() => clearTimeout((window as any).autoSaveToastTimeout)}
              onMouseLeave={() => autoDismissToast()}
            >
              <span className="mr-2">
                {autoSaveNotice.includes('manually') ? (
                  <svg width="20" height="20" fill="currentColor" className="inline align-middle"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12v4h3v2h-5V6h2z"/></svg>
                ) : (
                  <svg width="20" height="20" fill="currentColor" className="inline align-middle"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 13H9v-2h2v2zm0-4H9V7h2v4z"/></svg>
                )}
              </span>
              <span className="font-medium text-sm">{autoSaveNotice}</span>
              <button onClick={dismissNotice} className="ml-4 text-xs text-red-100 hover:text-red-300 font-semibold">Dismiss</button>
            </div>
          )}
        </div>

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
