import React from "react";

const PlaceholderSummaryTable: React.FC = () => (
  <div className="border rounded bg-white shadow p-4 mb-6">
    <div className="font-semibold mb-2">Weekly Summary (This Week)</div>
    <table className="min-w-full text-sm">
      <thead>
        <tr>
          <th className="px-2 py-1 border">Procedure</th>
          <th className="px-2 py-1 border">Money in Envelope</th>
          <th className="px-2 py-1 border">My Pay</th>
          <th className="px-2 py-1 border">Change</th>
          <th className="px-2 py-1 border">Subscriptions</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="px-2 py-1 border">Endospera</td>
          <td className="px-2 py-1 border">0</td>
          <td className="px-2 py-1 border">0</td>
          <td className="px-2 py-1 border">0</td>
          <td className="px-2 py-1 border">0</td>
        </tr>
        <tr>
          <td className="px-2 py-1 border">Eco Lifting</td>
          <td className="px-2 py-1 border">0</td>
          <td className="px-2 py-1 border">0</td>
          <td className="px-2 py-1 border">0</td>
          <td className="px-2 py-1 border">0</td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default PlaceholderSummaryTable;
