import React from "react";
import { CustomerVisit, Procedure } from "../types";
import { Customer } from "../types";

interface DataManagementBarProps {
  visits: CustomerVisit[];
  setVisits: (visits: CustomerVisit[]) => void;
  customers?: Customer[];
  setCustomers?: (customers: Customer[]) => void;
  onReset?: (prevVisits: CustomerVisit[]) => void;
  procedureTypes?: Procedure[];
  setProcedureTypes?: (procedureTypes: Procedure[]) => void;
}

function downloadJSON(
  visits: CustomerVisit[],
  customers?: Customer[],
  procedureTypes?: Procedure[]
) {
  console.log("Downloading - procedureTypes", procedureTypes);

  const exportObj = {
    type: "customer-tracker-data",
    exportedAt: new Date().toISOString(),
    visits,
    customers: customers ?? [],
    procedureTypes: procedureTypes ?? [],
  };
  const blob = new Blob([JSON.stringify(exportObj, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "customer-tracker-data.json";
  a.click();
  URL.revokeObjectURL(url);
}

function uploadFile(
  e: React.ChangeEvent<HTMLInputElement>,
  setVisits: (visits: CustomerVisit[]) => void,
  setCustomers?: (customers: Customer[]) => void,
  setProcedureTypes?: (procedureTypes: Procedure[]) => void
) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      if (file.name.endsWith(".json")) {
        const raw = JSON.parse(reader.result as string);
        if (raw.visits && Array.isArray(raw.visits)) {
          setVisits(raw.visits);
          if (setCustomers && Array.isArray(raw.customers)) {
            setCustomers(raw.customers);
          }
          if (setProcedureTypes && Array.isArray(raw.procedureTypes)) {
            setProcedureTypes(raw.procedureTypes);
          }
        }
      }
    } catch (err) {
      alert("Invalid file format.");
    }
  };
  reader.readAsText(file);
}

const DataManagementBar: React.FC<DataManagementBarProps> = ({
  visits,
  setVisits,
  customers,
  setCustomers,
  procedureTypes,
  setProcedureTypes,
  onReset,
}) => (
  <div className="flex flex-wrap gap-2 mb-4 justify-end items-center">
    <button
      style={{ background: "var(--color-accent)", color: "#fff" }}
      className="px-3 py-1 rounded border"
      onClick={() => downloadJSON(visits, customers, procedureTypes)}
    >
      Export JSON
    </button>
    <label
      style={{
        background: "var(--color-accent)",
        color: "var(--color-accent-dark)",
      }}
      className="px-3 py-1 rounded border cursor-pointer"
    >
      Import
      <input
        type="file"
        accept=".json,.csv"
        style={{ display: "none" }}
        onChange={(e) =>
          uploadFile(e, setVisits, setCustomers, setProcedureTypes)
        }
      />
    </label>
    <button
      style={{ background: "var(--color-error)", color: "#fff" }}
      className="px-3 py-1 rounded border"
      onClick={() => {
        if (window.confirm("Are you sure you want to reset all data?"))
          onReset?.(visits);
      }}
    >
      Reset Data
    </button>
  </div>
);

export default DataManagementBar;
