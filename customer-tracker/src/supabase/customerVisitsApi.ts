import { CustomerVisit, Procedure } from "../types.ts";
import { supabase } from "../supabaseClient.ts";
import { fetchProcedureTypes } from "./procedureTypesApi";

export async function fetchCustomerVisits(): Promise<CustomerVisit[]> {
  const { data, error } = await supabase
    .from("customer_visits")
    .select(
      "id, customerId:customer_id, date, procedureType:procedure_type, price, paidBy:paid_by, myPay:my_pay, changeFromPocket:change_from_pocket, subscription, notes, created_at",
    );
  if (error) {
    console.error("Error fetching customer visits:", error.message);
    return [];
  }
  const procedureTypes = await fetchProcedureTypes();
  return (data || []).map((row) => {
    let procObj: Procedure;
    const matchedProcedure = procedureTypes.find(
      (procedure) => procedure.name === row.procedureType,
    );
    if (matchedProcedure) {
      procObj = matchedProcedure;
    } else {
      procObj = new Procedure(row.procedureType || "Unknown");
    }

    return {
      id: row.id,
      customerId: row.customerId,
      date: row.date,
      procedureType: procObj,
      price: row.price,
      paidBy: row.paidBy,
      myPay: row.myPay,
      changeFromPocket: row.changeFromPocket,
      subscription: row.subscription,
      notes: row.notes,
    };
  });
}
