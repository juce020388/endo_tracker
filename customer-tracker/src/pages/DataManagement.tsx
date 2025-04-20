import React, { useState } from 'react';
import DataManagementBar from '../components/DataManagementBar';
import FilePickerBar from '../components/FilePickerBar';
import { useCustomerVisits } from '../hooks/useCustomerVisits';
import { Customer } from '../types';

function getFormattedDateTime(dt: string | null) {
  if (!dt) return 'Never';
  const d = new Date(dt);
  return d.toLocaleString();
}

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
  const [csvDelimiter, setCsvDelimiter] = useState<string>(',');

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Track last import/export time from localStorage
  const [lastImport, setLastImport] = useState<string | null>(() => localStorage.getItem('lastImport'));
  const [lastExport, setLastExport] = useState<string | null>(() => localStorage.getItem('lastExport'));
  // Track history of imports/exports
  const [importHistory, setImportHistory] = useState<string[]>(() => {
    try {
      const arr = localStorage.getItem('importHistory');
      return arr ? JSON.parse(arr) : [];
    } catch { return []; }
  });
  const [exportHistory, setExportHistory] = useState<string[]>(() => {
    try {
      const arr = localStorage.getItem('exportHistory');
      return arr ? JSON.parse(arr) : [];
    } catch { return []; }
  });

  // Handlers to update timestamps and history
  function handleImport() {
    const now = new Date().toISOString();
    localStorage.setItem('lastImport', now);
    setLastImport(now);
    // Update history
    const newHistory = [now, ...importHistory].slice(0, 10);
    localStorage.setItem('importHistory', JSON.stringify(newHistory));
    setImportHistory(newHistory);
  }
  function handleExport() {
    const now = new Date().toISOString();
    localStorage.setItem('lastExport', now);
    setLastExport(now);
    // Update history
    const newHistory = [now, ...exportHistory].slice(0, 10);
    localStorage.setItem('exportHistory', JSON.stringify(newHistory));
    setExportHistory(newHistory);
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Data Management</h1>
      <div className="grid gap-6">
        {/* Import Section */}
        <section className="bg-white dark:bg-slate-800 rounded-lg shadow border p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-500">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 3v12m0 0l-4-4m4 4l4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="17" width="16" height="4" rx="2" fill="currentColor" opacity=".1"/></svg>
            </span>
            <h2 className="text-lg font-semibold">Import Data</h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Import customer visits from a CSV file. Existing data will be merged.</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>Last import:</span>
            <span className="font-mono">{getFormattedDateTime(lastImport)}</span>
          </div>
          {importHistory.length > 0 && (
            <div className="mb-2">
              <div className="text-xs text-gray-500 mb-1">Import history (latest 10):</div>
              <ul className="text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded p-2 max-h-40 overflow-y-auto">
                {importHistory.map((dt, i) => (
                  <li key={i}>{getFormattedDateTime(dt)}</li>
                ))}
              </ul>
            </div>
          )}
          <FilePickerBar visits={visits} setVisits={setVisits} />
        </section>
        {/* Export Section */}
        <section className="bg-white dark:bg-slate-800 rounded-lg shadow border p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-500">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 21V9m0 0l4 4m-4-4l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><rect x="4" y="3" width="16" height="4" rx="2" fill="currentColor" opacity=".1"/></svg>
            </span>
            <h2 className="text-lg font-semibold">Export Data</h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Export all customer visits and customer data as a CSV file for backup or migration.</p>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <span>Last export:</span>
            <span className="font-mono">{getFormattedDateTime(lastExport)}</span>
          </div>
          {exportHistory.length > 0 && (
            <div className="mb-2">
              <div className="text-xs text-gray-500 mb-1">Export history (latest 10):</div>
              <ul className="text-xs font-mono bg-slate-100 dark:bg-slate-700 rounded p-2 max-h-40 overflow-y-auto">
                {exportHistory.map((dt, i) => (
                  <li key={i}>{getFormattedDateTime(dt)}</li>
                ))}
              </ul>
            </div>
          )}
          <DataManagementBar
            visits={visits}
            setVisits={setVisits}
            customers={customers}
            setCustomers={setCustomers}
            csvDelimiter={csvDelimiter}
            onReset={() => {}}
          />
        </section>
        {/* CSV Delimiter Section */}
        <section className="bg-white dark:bg-slate-800 rounded-lg shadow border p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-500">
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity=".2"/><text x="12" y="16" textAnchor="middle" fontSize="14" fill="currentColor">CSV</text></svg>
            </span>
            <h2 className="text-lg font-semibold">CSV Delimiter</h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Choose the delimiter to use when importing or exporting CSV files.</p>
          <select
            id="delimiter-select"
            className="border border-sky rounded px-2 py-1 text-sm w-40"
            value={csvDelimiter}
            onChange={e => setCsvDelimiter(e.target.value)}
          >
            <option value=",">Comma (,)</option>
            <option value=";">Semicolon (;)</option>
            <option value="\t">Tab</option>
            <option value="|">Pipe (|)</option>
          </select>
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
