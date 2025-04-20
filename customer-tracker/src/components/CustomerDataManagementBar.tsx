import React, { useRef } from 'react';
import { Customer } from '../types';

interface Props {
  customers: Customer[];
  setCustomers: (c: Customer[]) => void;
}

function toCSV(customers: Customer[]): string {
  if (!customers.length) return '';
  const header = Object.keys(customers[0]);
  const rows = customers.map(c => header.map(k => JSON.stringify((c as any)[k] ?? '')).join(','));
  return header.join(',') + '\n' + rows.join('\n');
}

const CustomerDataManagementBar: React.FC<Props> = ({ customers, setCustomers }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const blob = new Blob([
      JSON.stringify({ type: 'customers', exportedAt: new Date().toISOString(), data: customers }, null, 2)
    ], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const csv = toCSV(customers);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        let parsed: any = reader.result;
        if (file.name.endsWith('.json')) {
          parsed = JSON.parse(parsed);
          const imported = Array.isArray(parsed) ? parsed : (parsed.data ?? []);
          setCustomers(imported);
        } else if (file.name.endsWith('.csv')) {
          const lines = (parsed as string).split(/\r?\n/).filter(Boolean);
          const [header, ...rows] = lines;
          const keys = header.split(',');
          const imported = rows.map(row => {
            const values = row.split(',').map(v => v.replace(/^"|"$/g, ''));
            const obj: any = {};
            keys.forEach((k, i) => { obj[k] = values[i]; });
            return obj;
          });
          setCustomers(imported);
        }
      } catch {
        alert('Invalid or corrupted file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="flex gap-2 mb-4">
      <button onClick={handleExportJSON} className="bg-sky text-white px-3 py-1 rounded border border-sky-dark hover:bg-sky-dark text-xs font-semibold">Export JSON</button>
      <button onClick={handleExportCSV} className="bg-sky text-white px-3 py-1 rounded border border-sky-dark hover:bg-sky-dark text-xs font-semibold">Export CSV</button>
      <button onClick={() => fileInputRef.current?.click()} className="bg-accent text-white px-3 py-1 rounded border border-accent-dark hover:bg-accent-dark text-xs font-semibold">Import</button>
      <input ref={fileInputRef} type="file" accept=".json,.csv" className="hidden" onChange={handleImport} />
    </div>
  );
};

export default CustomerDataManagementBar;
