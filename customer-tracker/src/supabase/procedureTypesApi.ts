import { Procedure } from "../types";
import { supabase } from "../supabaseClient";

export async function fetchProcedureTypes(): Promise<Procedure[]> {
  const { data, error } = await supabase
    .from("procedure_types")
    .select("name, defaultPrice:default_price, description");
  if (error) {
    console.error("Error fetching procedure types:", error.message);
    return [];
  }
  return data || [];
}
