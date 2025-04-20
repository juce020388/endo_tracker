import React from 'react';

import { Customer } from '../types';

interface VisitTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  procedureType: string;
  onProcedureTypeChange: (value: string) => void;
  paidBy: string;
  onPaidByChange: (value: string) => void;
  subscription: string;
  onSubscriptionChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  onReset: () => void;
  customerId: string;
  onCustomerIdChange: (value: string) => void;
  customers: Customer[];
}

const VisitTableToolbar: React.FC<VisitTableToolbarProps> = ({
  search,
  onSearchChange,
  procedureType,
  onProcedureTypeChange,
  paidBy,
  onPaidByChange,
  subscription,
  onSubscriptionChange,
  sort,
  onSortChange,
  onReset,
  customerId,
  onCustomerIdChange,
  customers
}) => {
  return (
    <div className="mb-4 bg-sky/10 p-3 rounded border border-sky">
      {/* Row 1: Search Input */}
      <div className="mb-2">
        <label className="flex items-center w-full bg-white dark:bg-slate-800 border rounded px-2 py-1 focus-within:ring-2 focus-within:ring-accent">
          <span className="mr-2 text-accent" aria-hidden>🔍</span>
          <input
            type="text"
            placeholder="Search by name, procedure, or paid by…"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            className="w-full bg-transparent outline-none text-sm"
            aria-label="Search visits"
          />
        </label>
      </div>
      {/* Row 2: Filters in grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-1 gap-y-1 mb-1">
        {/* Customer Filter */}
        <label className="flex items-center gap-1">
          <span className="text-xs font-semibold">Customer</span>
          <select value={customerId} onChange={e => onCustomerIdChange(e.target.value)} className="bg-white dark:bg-slate-800 border rounded px-2 py-1 text-sm">
            <option value="">All</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.name}{c.phone ? ` (${c.phone})` : ''}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-1">
          <span className="text-xs font-semibold">Procedure</span>
          <select value={procedureType} onChange={e => onProcedureTypeChange(e.target.value)} className="bg-white dark:bg-slate-800 border rounded px-2 py-1 text-sm">
            <option value="">All</option>
            <option value="Endospera">Endospera</option>
            <option value="Eco Lifting">Eco Lifting</option>
          </select>
        </label>
        {/* Paid By Filter */}
        <label className="flex items-center gap-1">
          <span className="text-xs font-semibold">Paid By</span>
          <select value={paidBy} onChange={e => onPaidByChange(e.target.value)} className="bg-white dark:bg-slate-800 border rounded px-2 py-1 text-sm">
            <option value="">All</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Online">Online</option>
            <option value="Gift Card">Gift Card</option>
            <option value="Other">Other</option>
          </select>
        </label>
        {/* Subscription Filter */}
        <label className="flex items-center gap-1">
          <span className="text-xs font-semibold">Subscription</span>
          <select value={subscription} onChange={e => onSubscriptionChange(e.target.value)} className="bg-white dark:bg-slate-800 border rounded px-2 py-1 text-sm">
            <option value="">All</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </label>
        {/* Sort Selector */}
        <label className="flex items-center gap-1">
          <span className="text-xs font-semibold">Sort by</span>
          <select value={sort} onChange={e => onSortChange(e.target.value)} className="bg-white dark:bg-slate-800 border rounded px-2 py-1 text-sm">
            <option value="date-desc">Date (Newest)</option>
            <option value="date-asc">Date (Oldest)</option>
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-desc">Price (High)</option>
            <option value="price-asc">Price (Low)</option>
          </select>
        </label>
      </div>
      {/* Row 3: Reset Button */}
      <div className="flex justify-end">
        <button type="button" onClick={onReset} className="bg-accent text-white px-3 py-1 rounded border border-accent-dark hover:bg-accent-dark text-xs font-semibold">
          Reset Filters
        </button>
      </div>
    </div>
  );
};

export default VisitTableToolbar;
