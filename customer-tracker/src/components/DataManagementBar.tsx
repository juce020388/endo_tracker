import React from "react";
import { CustomerVisit, Procedure } from "../types";
import { Customer } from "../types";

interface DataManagementBarProps {
  visits: CustomerVisit[];
  customers?: Customer[];
  procedureTypes?: Procedure[];
}

function downloadJSON(
  visits: CustomerVisit[],
  customers?: Customer[],
  procedureTypes?: Procedure[],
) {
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

const DataManagementBar: React.FC<DataManagementBarProps> = ({
  visits,
  customers,
  procedureTypes,
}) => (
  <div className="flex flex-wrap gap-2 mb-4 justify-end items-center">
    <button
      style={{ background: "var(--color-accent)", color: "#fff" }}
      className="px-3 py-1 rounded border"
      onClick={() => downloadJSON(visits, customers, procedureTypes)}
    >
      Export JSON
    </button>
  </div>
);

export default DataManagementBar;
