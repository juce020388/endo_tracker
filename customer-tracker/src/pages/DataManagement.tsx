import React, { useEffect, useState } from "react";
import DataManagementBar from "../components/DataManagementBar";
import { Customer, CustomerVisit, Procedure } from "../types";
import { fetchProcedureTypes } from "../supabase/procedureTypesApi.ts";
import { fetchCustomers } from "../supabase/customersApi.ts";
import { fetchCustomerVisits } from "../supabase/customerVisitsApi.ts";

const DataManagement: React.FC = () => {
  const [customerVisits, setCustomerVisits] = useState<CustomerVisit[]>([]);
  const [loadingCustomerVisits, setLoadingCustomerVisits] = useState(true);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [procedureTypes, setProcedureTypes] = useState<Procedure[]>([]);
  const [loadingProcedures, setLoadingProcedures] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoadingCustomerVisits(true);
    fetchCustomerVisits()
      .then((visits) => {
        if (mounted) {
          setCustomerVisits(visits);
          setLoadingCustomerVisits(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setLoadingCustomerVisits(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoadingCustomers(true);
    fetchCustomers()
      .then((customers) => {
        if (mounted) {
          setCustomers(customers);
          setLoadingCustomers(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setLoadingCustomers(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoadingProcedures(true);
    fetchProcedureTypes()
      .then((types) => {
        if (mounted) {
          setProcedureTypes(types);
          setLoadingProcedures(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setLoadingProcedures(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (loadingCustomers || loadingCustomerVisits || loadingProcedures) {
    return <div>Loading data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Data Management</h1>
      <div className="grid gap-6">
        {/* Export Section */}
        <section className="bg-white dark:bg-slate-800 rounded-lg shadow border p-5 flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-500">
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
                <path
                  d="M12 21V9m0 0l4 4m-4-4l-4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <rect
                  x="4"
                  y="3"
                  width="16"
                  height="4"
                  rx="2"
                  fill="currentColor"
                  opacity=".1"
                />
              </svg>
            </span>
            <h2 className="text-lg font-semibold">Export Data</h2>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
            Export all customer visits and customer data as a CSV file for
            backup or migration.
          </p>
          <DataManagementBar
            visits={customerVisits}
            customers={customers}
            procedureTypes={procedureTypes}
          />
        </section>
      </div>
    </div>
  );
};

export default DataManagement;
