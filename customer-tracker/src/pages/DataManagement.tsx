import React, { useState } from 'react';
import DataManagementBar from '../components/DataManagementBar';
import { useCustomerVisits } from '../hooks/useCustomerVisits';
import { Customer } from '../types';
import ProcedureTypes from "./ProcedureTypes.tsx";

const DataManagement: React.FC = () => {
  const { visits, setVisits } = useCustomerVisits();
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const raw = localStorage.getItem('customers');
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  });
  const [procedureTypes, setProcedureTypes] = useState<ProcedureTypes[]>(() => {
    try {
      const raw = localStorage.getItem('procedureTypes');
      if (!raw) {
        console.log("Not raw")  ;
        return []
      }
      console.log("JSON.parse(raw)", JSON.parse(raw))
      return JSON.parse(raw);
    } catch {
      console.log("error");
      return [];
    }
  });

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Data Management</h1>
      <div className="grid gap-6">
        {/* Export Section */}
        <section className="bg-white dark:bg-slate-800 rounded-lg shadow border p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-500">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 21V9m0 0l4 4m-4-4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="3" width="16" height="4" rx="2" fill="currentColor" opacity=".1"/></svg>
            </span>
            <h2 className="text-lg font-semibold">Export Data</h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Export all customer visits and customer data as a CSV file for backup or migration.</p>
          <DataManagementBar
            visits={visits}
            setVisits={setVisits}
            customers={customers}
            setCustomers={setCustomers}
            procedureTypes={procedureTypes}
            setProcedureTypes={setProcedureTypes}
            onReset={() => {}}
          />
        </section>
        {/* Reset Section */}
        <section className="bg-white dark:bg-slate-800 rounded-lg shadow border p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-red-500">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity=".2"/><path d="M8 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <h2 className="text-lg font-semibold">Reset Data</h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">This will permanently delete all customer and visit data from your browser. This action cannot be undone!</p>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-semibold w-max"
            onClick={() => setShowResetConfirm(true)}
          >
            Reset All Data
          </button>
          {/* Confirmation Dialog */}
          {showResetConfirm && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 border max-w-xs w-full">
                <h3 className="text-lg font-bold mb-2 text-red-600">Confirm Reset</h3>
                <p className="text-sm mb-4">Are you sure you want to delete all customer and visit data? This cannot be undone.</p>
                <div className="flex gap-2 justify-end">
                  <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600" onClick={() => setShowResetConfirm(false)}>Cancel</button>
                  <button className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 font-semibold" onClick={() => { setVisits([]); setShowResetConfirm(false); }}>Delete All</button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default DataManagement;
