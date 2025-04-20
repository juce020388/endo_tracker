import React from 'react';
import { CustomerVisit, ProcedureType } from '../types';

interface WeeklySummaryTableProps {
  visits: CustomerVisit[];
}

type Summary = {
  procedureType: ProcedureType;
  moneyInEnvelope: number;
  myPay: number;
  change: number;
  subscriptions: number;
};

function computeSummary(visits: CustomerVisit[]): Summary[] {
  const types: ProcedureType[] = ['Endospera', 'Eco Lifting'];
  return types.map((procedureType) => {
    const filtered = visits.filter(v => v.procedureType === procedureType);
    return {
      procedureType,
      moneyInEnvelope: filtered.reduce((sum, v) => sum + v.price, 0),
      myPay: filtered.reduce((sum, v) => sum + v.myPay, 0),
      change: filtered.reduce((sum, v) => sum + v.changeFromPocket, 0),
      subscriptions: filtered.filter(v => v.subscription).length,
    };
  });
}

const WeeklySummaryTable: React.FC<WeeklySummaryTableProps> = ({ visits }) => {
  const summary = computeSummary(visits);
  // Compute total row (sum Endospera + Eco Lifting)
  const total = summary.reduce((acc, row) => ({
    procedureType: 'Total' as ProcedureType,
    moneyInEnvelope: acc.moneyInEnvelope + row.moneyInEnvelope,
    myPay: acc.myPay + row.myPay,
    change: acc.change + row.change,
    subscriptions: acc.subscriptions + row.subscriptions,
  }), { procedureType: 'Total' as ProcedureType, moneyInEnvelope: 0, myPay: 0, change: 0, subscriptions: 0 });

  return (
    <div className="border rounded shadow p-4 mb-6 overflow-x-auto" style={{ borderColor: 'var(--color-border)', background: 'var(--color-bg-form)' }}>
      <div className="font-semibold mb-2">Weekly Summary</div>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-accent)', color: 'var(--color-accent-dark)' }}>Procedure</th>
            <th className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-accent)', color: 'var(--color-accent-dark)' }}>Money in Envelope</th>
            <th className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-accent)', color: 'var(--color-accent-dark)' }}>My Pay</th>
            <th className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-accent)', color: 'var(--color-accent-dark)' }}>Change</th>
            <th className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-accent)', color: 'var(--color-accent-dark)' }}>Subscriptions</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row) => (
            <tr key={row.procedureType}>
              <td className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)' }}>{row.procedureType}</td>
              <td className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)' }}>{row.moneyInEnvelope}</td>
              <td className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)' }}>{row.myPay}</td>
              <td className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)' }}>{row.change}</td>
              <td className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)' }}>{row.subscriptions}</td>
            </tr>
          ))}
          {/* Total row */}
          <tr className="font-bold bg-sky/10">
            <td className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)' }}>Total</td>
            <td className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)' }}>{total.moneyInEnvelope}</td>
            <td className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)' }}>{total.myPay}</td>
            <td className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)' }}>{total.change}</td>
            <td className="px-2 py-1 border" style={{ borderColor: 'var(--color-border)' }}>{total.subscriptions}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeeklySummaryTable;
