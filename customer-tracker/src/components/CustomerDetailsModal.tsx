import React from "react";
import { Customer, CustomerVisit } from "../types";
import Avatar from "./Avatar";

interface CustomerDetailsModalProps {
  customer: Customer;
  visits: CustomerVisit[];
  onClose: () => void;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  customer,
  visits,
  onClose,
}) => {
  const [noteFilter, setNoteFilter] = React.useState("");
  // Filter visits by notes (case-insensitive)
  const filteredVisits = React.useMemo(() => {
    if (!noteFilter.trim()) return visits;
    return visits.filter((v) =>
      (v.notes || "").toLowerCase().includes(noteFilter.toLowerCase())
    );
  }, [visits, noteFilter]);

  // Highlight matching text in notes
  function highlightMatch(notes?: string, filter?: string) {
    if (!filter || !notes) return notes || "-";
    const idx = notes.toLowerCase().indexOf(filter.toLowerCase());
    if (idx === -1) return notes;
    const before = notes.slice(0, idx);
    const match = notes.slice(idx, idx + filter.length);
    const after = notes.slice(idx + filter.length);
    return (
      <>
        {before}
        <mark className="bg-yellow-200 text-yellow-900 rounded px-0.5">
          {match}
        </mark>
        {after}
      </>
    );
  }

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
          {customer.phone && (
            <div>
              <span className="font-semibold">Phone:</span> {customer.phone}
            </div>
          )}
          {customer.email && (
            <div>
              <span className="font-semibold">Email:</span> {customer.email}
            </div>
          )}
          {customer.notes && (
            <div>
              <span className="font-semibold">Notes:</span> {customer.notes}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-semibold mb-1 text-accent">Visit History</h3>
          {visits.length === 0 ? (
            <div className="text-xs text-gray-400">
              No visits for this customer.
            </div>
          ) : (
            <>
              <div className="mb-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search notes..."
                  className="border rounded px-2 py-1 text-xs w-full focus:ring focus:ring-accent/20"
                  value={noteFilter}
                  onChange={(e) => setNoteFilter(e.target.value)}
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                <table className="min-w-full text-xs border rounded bg-white dark:bg-slate-800">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 border-b" title="Date of visit">
                        Date
                      </th>
                      <th className="px-2 py-1 border-b" title="Procedure type">
                        Procedure
                      </th>
                      <th className="px-2 py-1 border-b" title="Visit price">
                        Price
                      </th>
                      <th
                        className="px-2 py-1 border-b"
                        title="Your pay for this visit"
                      >
                        My Pay
                      </th>
                      <th
                        className="px-2 py-1 border-b"
                        title="Change from pocket"
                      >
                        Change
                      </th>
                      <th className="px-2 py-1 border-b" title="Subscription">
                        Sub
                      </th>
                      <th className="px-2 py-1 border-b" title="Notes">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisits.map((v) => (
                      <tr
                        key={v.id}
                        className="odd:bg-sky-50 even:bg-white dark:odd:bg-slate-900 dark:even:bg-slate-800"
                      >
                        <td className="px-2 py-1">{v.date.slice(0, 10)}</td>
                        <td className="px-2 py-1">{v.procedureType}</td>
                        <td className="px-2 py-1">
                          {v.price} {v.paidBy}
                        </td>
                        <td className="px-2 py-1">
                          {typeof v.myPay === "number" ? v.myPay : "-"}
                        </td>
                        <td className="px-2 py-1">
                          {typeof v.changeFromPocket === "number"
                            ? v.changeFromPocket
                            : "-"}
                        </td>
                        <td className="px-2 py-1 text-center">
                          {v.subscription ? (
                            <span
                              role="img"
                              aria-label="subscription"
                              title="Subscription"
                            >
                              ⭐
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="px-2 py-1">
                          {highlightMatch(v.notes, noteFilter)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailsModal;
