import React, { useState } from 'react';
import { Customer } from '../types';
import CustomerForm from '../components/CustomerForm';
import CustomerDataManagementBar from '../components/CustomerDataManagementBar';

const LOCAL_KEY = 'customers';

function loadCustomers(): Customer[] {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveCustomers(customers: Customer[]) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(customers));
}

function randomId() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

const Customers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>(() => loadCustomers());
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);

  const filtered = customers.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) ||
      (c.phone && c.phone.includes(search)) ||
      (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditing(customer);
    setShowForm(true);
  };

  const handleSave = (fields: Omit<Customer, 'id'>) => {
    if (editing) {
      setCustomers(cs => {
        const updated = cs.map(c => c.id === editing.id ? { ...c, ...fields } : c);
        saveCustomers(updated);
        return updated;
      });
    } else {
      setCustomers(cs => {
        const updated = [...cs, { ...fields, id: randomId() }];
        saveCustomers(updated);
        return updated;
      });
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
  };

  // Sync customers to localStorage on change
  React.useEffect(() => {
    saveCustomers(customers);
  }, [customers]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <CustomerDataManagementBar customers={customers} setCustomers={setCustomers} />
      <h1 className="text-2xl font-bold mb-4">Customers</h1>
      <div className="mb-4 flex gap-2 items-center">
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border rounded px-2 py-1 w-full md:w-64"
        />
        <button className="bg-accent text-white px-3 py-1 rounded" onClick={handleAdd}>
          + Add Customer
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border rounded">
          <thead>
            <tr className="bg-sky/10">
              <th className="px-2 py-1 text-left">Name</th>
              <th className="px-2 py-1 text-left">Phone</th>
              <th className="px-2 py-1 text-left">Email</th>
              <th className="px-2 py-1 text-left">Notes</th>
              <th className="px-2 py-1 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-4 text-gray-500">No customers found.</td></tr>
            ) : (
              filtered.map(c => (
                <tr key={c.id} className="border-t">
                  <td className="px-2 py-1">{c.name}</td>
                  <td className="px-2 py-1">{c.phone || '-'}</td>
                  <td className="px-2 py-1">{c.email || '-'}</td>
                  <td className="px-2 py-1">{c.notes || '-'}</td>
                  <td className="px-2 py-1">
                    <button className="text-blue-600 px-1" onClick={() => handleEdit(c)}>Edit</button>
                    <button className="text-red-600 px-1" onClick={() => {
                      if (window.confirm(`Delete customer '${c.name}'? This cannot be undone.`)) {
                        setCustomers(cs => {
                          const updated = cs.filter(x => x.id !== c.id);
                          saveCustomers(updated);
                          return updated;
                        });
                      }
                    }}>Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showForm && (
        <CustomerForm
          initial={editing || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default Customers;
