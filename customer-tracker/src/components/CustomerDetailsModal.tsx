import React from 'react';
import { Customer, CustomerVisit } from '../types';
import Avatar from './Avatar';

interface CustomerDetailsModalProps {
  customer: Customer;
  visits: CustomerVisit[];
  onClose: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({ customer, visits, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-lg w-full p-6 relative border border-sky">
        <button
          className="absolute top-2 right-2 text-2xl text-gray-400 hover:text-red-500"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Avatar name={customer.name} size={48} />
          <h2 className="text-xl font-bold text-accent">{customer.name}</h2>
        </div>
        <div className="mb-4 text-sm text-gray-700 dark:text-gray-200">
          {customer.phone && <div><span className="font-semibold">Phone:</span> {customer.phone}</div>}
          {customer.email && <div><span className="font-semibold">Email:</span> {customer.email}</div>}
          {customer.notes && <div><span className="font-semibold">Notes:</span> {customer.notes}</div>}
        </div>
        <div>
          <h3 className="font-semibold mb-1 text-accent">Visits</h3>
          {visits.length === 0 ? (
            <div className="text-xs text-gray-400">No visits for this customer.</div>
          ) : (
            <ul className="max-h-40 overflow-y-auto text-xs divide-y divide-gray-200 dark:divide-gray-700">
              {visits.map(v => (
                <li key={v.id} className="py-1 flex justify-between items-center">
                  <span>{v.date.slice(0, 10)} | {v.procedureType}</span>
                  <span className="font-semibold">{v.price} {v.paidBy}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
