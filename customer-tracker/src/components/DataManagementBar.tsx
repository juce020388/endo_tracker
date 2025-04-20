import React from 'react';
import { CustomerVisit } from '../types';

import { Customer } from '../types';

interface DataManagementBarProps {
  visits: CustomerVisit[];
  setVisits: (visits: CustomerVisit[]) => void;
  customers?: Customer[];
  setCustomers?: (customers: Customer[]) => void;
  onReset?: (prevVisits: CustomerVisit[]) => void;
  csvDelimiter?: string;
}

function downloadJSON(visits: CustomerVisit[], customers?: Customer[]) {
  // Add a type marker and pretty print
  const exportObj = {
    type: 'customer-tracker-data',
    exportedAt: new Date().toISOString(),
    visits,
    customers: customers ?? [],
  };
  const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'customer-tracker-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

function downloadCSV(visits: CustomerVisit[], delimiter: string = ',') {
  if (!visits || visits.length === 0) {
    alert('No data to export.');
    return;
  }
  // Convert "\t" to actual tab
  const delim = delimiter === '\\t' || delimiter === '\t' ? '\t' : delimiter;
  const headers = Object.keys(visits[0]);
  const rows = visits.map(v => headers.map(h => JSON.stringify((v as any)[h] ?? '')).join(delim));
  const csv = [headers.join(delim), ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'customer-visits.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function uploadFile(e: React.ChangeEvent<HTMLInputElement>, setVisits: (visits: CustomerVisit[]) => void, delimiter: string = ',', setCustomers?: (customers: Customer[]) => void) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      if (file.name.endsWith('.json')) {
        const raw = JSON.parse(reader.result as string);
        // New format: { visits, customers }
        if (raw.visits && Array.isArray(raw.visits)) {
          setVisits(raw.visits);
          if (setCustomers && Array.isArray(raw.customers)) setCustomers(raw.customers);
        } else {
          // Legacy: { data: visits[] }
          const visits = Array.isArray(raw) ? raw : (raw.data ?? []);
          setVisits(visits);
        }
      } else if (file.name.endsWith('.csv')) {
        const text = reader.result as string;
        const [headerLine, ...lines] = text.split(/\r?\n/).filter(Boolean);
        const headers = headerLine.split(delimiter);
        const visits = lines.map(line => {
          const values = line.split(delimiter).map(v => v.replace(/^"|"$/g, ''));
          const obj: any = {};
          headers.forEach((h, i) => { obj[h] = values[i]; });
          // Convert types as needed
          obj.price = Number(obj.price);
          obj.changeFromPocket = Number(obj.changeFromPocket);
          obj.myPay = Number(obj.myPay);
          obj.subscription = obj.subscription === 'true' || obj.subscription === true;
          return obj;
        });
        setVisits(visits);
      }
    } catch (err) {
      alert('Invalid file format.');
    }
  };
  reader.readAsText(file);
} 

const DataManagementBar: React.FC<DataManagementBarProps> = ({ visits, setVisits, customers, setCustomers, onReset, csvDelimiter = ',' }) => (
  <div className="flex flex-wrap gap-2 mb-4 justify-end items-center">
    <button style={{ background: 'var(--color-accent)', color: '#fff' }} className="px-3 py-1 rounded border" onClick={() => downloadJSON(visits, customers)}>
      Export JSON
    </button>
    <button style={{ background: 'var(--color-accent)', color: '#fff' }} className="px-3 py-1 rounded border" onClick={() => downloadCSV(visits, csvDelimiter)}>
      Export CSV
    </button>
    <label style={{ background: 'var(--color-accent)', color: 'var(--color-accent-dark)' }} className="px-3 py-1 rounded border cursor-pointer">
      Import
      <input type="file" accept=".json,.csv" style={{ display: 'none' }} onChange={e => uploadFile(e, setVisits, csvDelimiter, setCustomers)} />
    </label>
    <button style={{ background: 'var(--color-error)', color: '#fff' }} className="px-3 py-1 rounded border" onClick={() => {
      if (window.confirm('Are you sure you want to reset all data?')) onReset?.(visits);
    }}>
      Reset Data
    </button>
  </div>
);

export default DataManagementBar;
