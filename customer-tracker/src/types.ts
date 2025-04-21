// Core data structures for Customer Tracker System

export class Procedure {
  name: string;
  defaultPrice?: number;
  description?: string;

  constructor(name: string, defaultPrice?: number, description?: string) {
    this.name = name;
    this.defaultPrice = defaultPrice;
    this.description = description;
  }
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
  name?: string;
  customerId?: string;
  date: string;
  procedureType: Procedure;
  price: number;
  paidBy: string;
  changeFromPocket: number;
  myPay: number;
  subscription: boolean;
}
