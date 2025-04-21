import { Customer } from "../types";
import { supabase } from "../supabaseClient";

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, name, phone, email, notes");
  if (error) {
    console.error("Error fetching customers:", error.message);
    return [];
  }
  return data || [];
}
