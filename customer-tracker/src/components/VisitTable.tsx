import React, { useState } from "react";
import { CustomerVisit, Customer } from "../types";
import CustomerDetailsModal from "./CustomerDetailsModal";
import Avatar from "./Avatar";
import { formatDateYYYYDDMMWithHHmm } from "../utils/dateUtils.ts";

interface VisitTableProps {
  visits: CustomerVisit[];
  customers: Customer[];
  onEdit: (visit: CustomerVisit) => void;
  onDelete: (id: string) => void;
  weekRangeLabel: string;
}

const VisitTable: React.FC<VisitTableProps> = ({
  visits,
  customers,
  onEdit,
  onDelete,
  weekRangeLabel,
}) => {
  const [modalCustomer, setModalCustomer] = useState<Customer | null>(null);
  const handleCustomerClick = (customer: Customer | undefined | null) => {
    setModalCustomer(customer ?? null);
  };
  return (
    <div
      className="border rounded shadow p-4 mb-6 overflow-x-auto"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-bg-form)",
      }}
    >
      <div className="font-semibold mb-2">
        Customer Visits ({weekRangeLabel})
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th
              className="px-2 py-1 border"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-accent)",
                color: "var(--color-accent-dark)",
              }}
            >
              Name
            </th>
            <th
              className="px-2 py-1 border"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-accent)",
                color: "var(--color-accent-dark)",
              }}
            >
              Date
            </th>
            <th
              className="px-2 py-1 border"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-accent)",
                color: "var(--color-accent-dark)",
              }}
            >
              Procedure
            </th>
            <th
              className="px-2 py-1 border"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-accent)",
                color: "var(--color-accent-dark)",
              }}
            >
              Price
            </th>
            <th
              className="px-2 py-1 border hidden sm:table-cell"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-accent)",
                color: "var(--color-accent-dark)",
              }}
            >
              Paid By
            </th>
            <th
              className="px-2 py-1 border hidden sm:table-cell"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-accent)",
                color: "var(--color-accent-dark)",
              }}
            >
              Change
            </th>
            <th
              className="px-2 py-1 border hidden sm:table-cell"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-accent)",
                color: "var(--color-accent-dark)",
              }}
            >
              My Pay
            </th>
            <th
              className="px-2 py-1 border hidden sm:table-cell"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-accent)",
                color: "var(--color-accent-dark)",
              }}
            >
              Subscription
            </th>
            <th
              className="px-2 py-1 border"
              style={{
                borderColor: "var(--color-border)",
                background: "var(--color-accent)",
                color: "var(--color-accent-dark)",
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {visits.length === 0 ? (
            <tr>
              <td
                className="px-2 py-1 border text-gray-400"
                colSpan={9}
                style={{ borderColor: "var(--color-border)" }}
              >
                No visits yet. Add your first record!
              </td>
            </tr>
          ) : (
            visits.map((visit) => {
              const customer = customers.find((c) => c.id === visit.customerId);
              const displayName = customer ? customer.name : visit.name || "";
              const tooltip = customer
                ? `${customer.name}${
                    customer.phone ? " | " + customer.phone : ""
                  }${customer.email ? " | " + customer.email : ""}`
                : "";
              return (
                <tr
                  key={visit.id}
                  className={
                    visit.subscription ? "bg-yellow-100 dark:bg-yellow-900" : ""
                  }
                >
                  <td
                    className="px-2 py-1 border underline text-accent cursor-pointer hover:text-accent-dark flex items-center gap-2"
                    style={{ borderColor: "var(--color-border)" }}
                    title={tooltip}
                    onClick={() => handleCustomerClick(customer)}
                  >
                    <Avatar name={displayName} size={28} />
                    {displayName}
                  </td>
                  <td
                    className="px-2 py-1 border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {formatDateYYYYDDMMWithHHmm(new Date(visit.date), false)}
                  </td>
                  <td
                    className="px-2 py-1 border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {visit.procedureType}
                  </td>
                  <td
                    className="px-2 py-1 border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {visit.price}
                  </td>
                  <td
                    className="px-2 py-1 border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {visit.paidBy}
                  </td>
                  <td
                    className="px-2 py-1 border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {visit.changeFromPocket}
                  </td>
                  <td
                    className="px-2 py-1 border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {visit.myPay}
                  </td>
                  <td
                    className="px-2 py-1 border"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    {visit.subscription ? "Yes" : "No"}
                  </td>
                  <td
                    className="px-2 py-1 border border-sky"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <button
                      className="bg-teal text-sand px-2 py-1 rounded mr-2 hover:bg-deepteal hover:text-sand"
                      onClick={() => onEdit(visit)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-teal text-sand px-2 py-1 rounded hover:bg-deepteal hover:text-sand"
                      style={{
                        background: "var(--color-error)",
                        color: "#fff",
                      }}
                      onClick={() => onDelete(visit.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {modalCustomer && (
        <CustomerDetailsModal
          customer={modalCustomer}
          visits={visits.filter((v) => v.customerId === modalCustomer.id)}
          onClose={() => setModalCustomer(null)}
        />
      )}
    </div>
  );
};

export default VisitTable;
