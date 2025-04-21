import { supabase } from "../supabaseClient";
import { CustomerVisit } from "../types";

// Fetch all visits for a customer
export async function fetchVisitsByCustomer(
  customerId: string,
): Promise<CustomerVisit[]> {
  const { data, error } = await supabase
    .from("customer_visits")
    .select("*")
    .eq("customer_id", customerId)
    .order("date", { ascending: false });
  if (error) {
    console.error("Error fetching visits:", error.message);
    return [];
  }
  return data || [];
}

// Add a new visit
export async function addVisit(
  fields: Omit<CustomerVisit, "id" | "created_at">,
): Promise<CustomerVisit | null> {
  // Map camelCase to snake_case
  const mapped = {
    customer_id: fields.customerId,
    date: fields.date,
    procedure_type: fields.procedureType,
    price: fields.price,
    paid_by: fields.paidBy,
    my_pay: fields.myPay,
    change_from_pocket: fields.changeFromPocket,
    subscription: fields.subscription,
    notes: fields.notes,
  };
  const { data, error } = await supabase
    .from("customer_visits")
    .insert([mapped])
    .select()
    .single();
  if (error) {
    console.error("Error adding visit:", error.message);
    return null;
  }
  return data;
}

// Update an existing visit
export async function updateVisit(
  id: string,
  fields: Omit<CustomerVisit, "id" | "created_at">,
): Promise<CustomerVisit | null> {
  // Map camelCase to snake_case
  const mapped = {
    customer_id: fields.customerId,
    date: fields.date,
    procedure_type: fields.procedureType,
    price: fields.price,
    paid_by: fields.paidBy,
    my_pay: fields.myPay,
    change_from_pocket: fields.changeFromPocket,
    subscription: fields.subscription,
    notes: fields.notes,
  };
  const { data, error } = await supabase
    .from("customer_visits")
    .update(mapped)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("Error updating visit:", error.message);
    return null;
  }
  return data;
}

// Delete a visit
export async function deleteVisit(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("customer_visits")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Error deleting visit:", error.message);
    return false;
  }
  return true;
}
