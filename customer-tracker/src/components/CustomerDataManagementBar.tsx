import React from "react";
import { Customer } from "../types";

const PROCEDURE_TYPES_KEY = "procedureTypes";
const VISITS_KEY = "customerVisits";

interface Props {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
}

const CustomerDataManagementBar: React.FC<Props> = ({ customers }) => {
  // Export JSON
  const handleExportJSON = () => {
    let procedureTypes: any[] = [];
    try {
      const raw = localStorage.getItem(PROCEDURE_TYPES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) procedureTypes = parsed;
      }
    } catch {
      procedureTypes = [];
    }
    const visits = JSON.parse(localStorage.getItem(VISITS_KEY) || "[]");
    const blob = new Blob(
      [
        JSON.stringify(
          {
            type: "endo-tracker-data",
            exportedAt: new Date().toISOString(),
            customers,
            visits,
            procedureTypes: procedureTypes || [],
          },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "endo_tracker_export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={handleExportJSON}
        className="bg-sky text-white px-3 py-1 rounded border border-sky-dark hover:bg-sky-dark text-xs font-semibold"
      >
        Export JSON
      </button>
    </div>
  );
};

export default CustomerDataManagementBar;
