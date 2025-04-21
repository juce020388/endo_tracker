import React, { useState } from "react";
import { CustomerVisit } from "../types";
import { v4 as uuidv4 } from "uuid";

export function useCustomerVisits(initialVisits: CustomerVisit[] = []) {
  const STORAGE_KEY = "customerVisits";
  const [visits, setVisits] = useState<CustomerVisit[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialVisits;
      }
    }
    return initialVisits;
  });

  // Persist to localStorage whenever visits change
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
  }, [visits]);

  function addVisit(visit: Omit<CustomerVisit, "id">) {
    setVisits((prev) => [...prev, { ...visit, id: uuidv4() }]);
  }

  function updateVisit(id: string, updated: Partial<CustomerVisit>) {
    setVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, ...updated } : v))
    );
  }

  function deleteVisit(id: string) {
    setVisits((prev) => prev.filter((v) => v.id !== id));
  }

  return { visits, addVisit, updateVisit, deleteVisit, setVisits };
}
