import React from 'react';

const PlaceholderVisitTable: React.FC = () => (
  <div className="border rounded bg-white shadow p-4 mb-6">
    <div className="font-semibold mb-2">Customer Visits (This Week)</div>
    <table className="min-w-full text-sm">
      <thead>
        <tr>
          <th className="px-2 py-1 border">Name</th>
          <th className="px-2 py-1 border">Date</th>
          <th className="px-2 py-1 border">Procedure</th>
          <th className="px-2 py-1 border">Price</th>
          <th className="px-2 py-1 border">Paid By</th>
          <th className="px-2 py-1 border">Change</th>
          <th className="px-2 py-1 border">My Pay</th>
          <th className="px-2 py-1 border">Subscription</th>
          <th className="px-2 py-1 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-2 py-1 border" colSpan={9}>
            <span className="text-gray-400">No visits yet. Add your first record!</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default PlaceholderVisitTable;
