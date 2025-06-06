import React, { useEffect, useState } from "react";
import { CustomerVisit, Procedure } from "../types";
import { fetchProcedureTypes } from "../supabase/procedureTypesApi";

interface WeeklySummaryTableProps {
  visits: CustomerVisit[];
}

type Summary = {
  procedureType: Procedure;
  moneyInEnvelope: number;
  myPay: number;
  change: number;
  subscriptions: number;
};

function computeSummary(
  visits: CustomerVisit[],
  procedureTypes: Procedure[],
): Summary[] {
  return procedureTypes.map((procedure) => {
    const filtered = visits.filter(
      (v) => v.procedureType?.name === procedure.name,
    );
    return {
      procedureType: procedure,
      moneyInEnvelope: filtered.reduce((sum, v) => sum + v.price, 0),
      myPay: filtered.reduce((sum, v) => sum + v.myPay, 0),
      change: filtered.reduce((sum, v) => sum + v.changeFromPocket, 0),
      subscriptions: filtered.filter((v) => v.subscription).length,
    };
  });
}

// Helper to get defaultPrice for a procedure type
function getDefaultPriceForType(
  name: string,
  procedureTypes: Procedure[],
): number | undefined {
  const pt = procedureTypes.find((pt) => pt.name === name);
  return pt && typeof pt.defaultPrice === "number"
    ? pt.defaultPrice
    : undefined;
}

const WeeklySummaryTable: React.FC<WeeklySummaryTableProps> = ({ visits }) => {
  const [procedureTypes, setProcedureTypes] = useState<Procedure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchProcedureTypes()
      .then((types) => {
        if (mounted) {
          setProcedureTypes(types);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError("Failed to fetch procedure types");
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <div>Loading summary...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const summary = computeSummary(visits, procedureTypes);
  // Compute total row
  const total = summary.reduce(
    (acc, row) => ({
      procedureType: new Procedure("Total"),
      moneyInEnvelope: acc.moneyInEnvelope + row.moneyInEnvelope,
      myPay: acc.myPay + row.myPay,
      change: acc.change + row.change,
      subscriptions: acc.subscriptions + row.subscriptions,
    }),
    {
      procedureType: new Procedure("Total"),
      moneyInEnvelope: 0,
      myPay: 0,
      change: 0,
      subscriptions: 0,
    },
  );

  // Find min/max for highlighting
  const moneyVals = summary.map((r) => r.moneyInEnvelope);
  const myPayVals = summary.map((r) => r.myPay);
  const changeVals = summary.map((r) => r.change);
  const subsVals = summary.map((r) => r.subscriptions);
  const max = (arr: number[]) => Math.max(...arr);
  const min = (arr: number[]) => Math.min(...arr);

  return (
    <div
      className="border rounded shadow p-4 mb-6 overflow-x-auto"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-bg-form)",
      }}
    >
      <div className="font-semibold mb-2">Weekly Summary</div>
      <table className="min-w-full text-sm table-auto">
        <thead>
          <tr>
            <th
              className="px-2 py-1 border bg-gradient-to-br from-sky-100 to-sky-300"
              style={{ borderColor: "var(--color-border)" }}
              title="Procedure type"
            >
              <span role="img" aria-label="procedure" title="Procedure type">
                🛠️
              </span>{" "}
              Procedure
            </th>
            <th
              className="px-2 py-1 border bg-gradient-to-br from-orange-100 to-orange-300"
              style={{ borderColor: "var(--color-border)" }}
              title="Default price for this procedure type"
            >
              <span role="img" aria-label="default price" title="Default price">
                🏷️
              </span>{" "}
              Default Price
            </th>
            <th
              className="px-2 py-1 border bg-gradient-to-br from-green-100 to-green-300"
              style={{ borderColor: "var(--color-border)" }}
              title="Total money received for this procedure"
            >
              <span
                role="img"
                aria-label="money"
                title="Total money received for this procedure"
              >
                💵
              </span>{" "}
              Money in Envelope
            </th>
            <th
              className="px-2 py-1 border bg-gradient-to-br from-blue-100 to-blue-300"
              style={{ borderColor: "var(--color-border)" }}
              title="Your pay for this procedure"
            >
              <span
                role="img"
                aria-label="pay"
                title="Your pay for this procedure"
              >
                👤
              </span>{" "}
              My Pay
            </th>
            <th
              className="px-2 py-1 border bg-gradient-to-br from-yellow-100 to-yellow-300"
              style={{ borderColor: "var(--color-border)" }}
              title="Change from pocket for this procedure"
            >
              <span
                role="img"
                aria-label="change"
                title="Change from pocket for this procedure"
              >
                💰
              </span>{" "}
              Change
            </th>
            <th
              className="px-2 py-1 border bg-gradient-to-br from-pink-100 to-pink-300"
              style={{ borderColor: "var(--color-border)" }}
              title="Number of subscriptions for this procedure"
            >
              <span
                role="img"
                aria-label="subscriptions"
                title="Number of subscriptions for this procedure"
              >
                ⭐
              </span>{" "}
              Subscriptions
            </th>
          </tr>
        </thead>
        <tbody>
          {summary.map((row, i) => (
            <tr
              key={row.procedureType.name}
              className={
                i % 2 === 0
                  ? "bg-white/80 hover:bg-sky-50 transition"
                  : "bg-sky-50/60 hover:bg-sky-100 transition"
              }
            >
              <td
                className="px-2 py-1 border font-semibold"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span role="img" aria-label="procedure" title="Procedure type">
                  🛠️
                </span>{" "}
                {row.procedureType.name}
              </td>
              <td
                className="px-2 py-1 border text-right"
                style={{ borderColor: "var(--color-border)" }}
              >
                {row.procedureType.name !== "Total" ? (
                  <span>
                    <span
                      role="img"
                      aria-label="default price"
                      title="Default price"
                    >
                      🏷️
                    </span>{" "}
                    {typeof getDefaultPriceForType(
                      row.procedureType.name,
                      procedureTypes,
                    ) === "number" ? (
                      getDefaultPriceForType(
                        row.procedureType.name,
                        procedureTypes,
                      )
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td
                className={`px-2 py-1 border text-right ${
                  row.moneyInEnvelope === max(moneyVals)
                    ? "bg-green-200 font-bold"
                    : row.moneyInEnvelope === min(moneyVals)
                      ? "bg-red-100"
                      : ""
                }`}
                style={{ borderColor: "var(--color-border)" }}
              >
                <span
                  role="img"
                  aria-label="money"
                  title="Total money received for this procedure"
                >
                  💵
                </span>{" "}
                {row.moneyInEnvelope}
              </td>
              <td
                className={`px-2 py-1 border text-right ${
                  row.myPay === max(myPayVals)
                    ? "bg-blue-200 font-bold"
                    : row.myPay === min(myPayVals)
                      ? "bg-red-100"
                      : ""
                }`}
                style={{ borderColor: "var(--color-border)" }}
              >
                <span
                  role="img"
                  aria-label="pay"
                  title="Your pay for this procedure"
                >
                  👤
                </span>{" "}
                {row.myPay}
              </td>
              <td
                className={`px-2 py-1 border text-right ${
                  row.change === max(changeVals)
                    ? "bg-yellow-200 font-bold"
                    : row.change === min(changeVals)
                      ? "bg-red-100"
                      : ""
                }`}
                style={{ borderColor: "var(--color-border)" }}
              >
                <span
                  role="img"
                  aria-label="change"
                  title="Change from pocket for this procedure"
                >
                  💰
                </span>{" "}
                {row.change}
              </td>
              <td
                className={`px-2 py-1 border text-right ${
                  row.subscriptions === max(subsVals) && row.subscriptions > 0
                    ? "bg-pink-200 font-bold"
                    : row.subscriptions === min(subsVals)
                      ? "bg-red-100"
                      : ""
                }`}
                style={{ borderColor: "var(--color-border)" }}
              >
                {row.subscriptions > 0 ? (
                  <span title="Has subscriptions">
                    {row.subscriptions}{" "}
                    <span
                      role="img"
                      aria-label="subscription"
                      title="Number of subscriptions for this procedure"
                    >
                      ⭐
                    </span>
                  </span>
                ) : (
                  row.subscriptions
                )}
              </td>
            </tr>
          ))}
          {/* Total row */}
          <tr className="font-bold bg-gradient-to-r from-sky-300 to-blue-100 border-t-2 border-sky-400">
            <td
              className="px-2 py-1 border"
              style={{ borderColor: "var(--color-border)" }}
            >
              {total.procedureType.name}
            </td>
            <td
              className="px-2 py-1 border"
              style={{ borderColor: "var(--color-border)" }}
            ></td>
            <td
              className="px-2 py-1 border text-right"
              style={{ borderColor: "var(--color-border)" }}
            >
              {total.moneyInEnvelope}
            </td>
            <td
              className="px-2 py-1 border text-right"
              style={{ borderColor: "var(--color-border)" }}
            >
              {total.myPay}
            </td>
            <td
              className="px-2 py-1 border text-right"
              style={{ borderColor: "var(--color-border)" }}
            >
              {total.change}
            </td>
            <td
              className="px-2 py-1 border text-right"
              style={{ borderColor: "var(--color-border)" }}
            >
              {total.subscriptions}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WeeklySummaryTable;
