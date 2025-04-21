// Core data structures for Customer Tracker System

export type ProcedureType = "Endospera" | "Eco Lifting";

export interface Procedure {
  name: string;
  defaultPrice?: number;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}

export interface CustomerVisit {
  notes?: string;
  id: string;
  // Legacy: name is kept for backward compatibility, prefer customerId going forward
  name?: string;
  customerId?: string;
  date: string;
  procedureType: ProcedureType;
  price: number;
  paidBy: string;
  changeFromPocket: number;
  myPay: number;
  subscription: boolean;
}
