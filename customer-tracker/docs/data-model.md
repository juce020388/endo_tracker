# Data Model Design for File-Based Persistence

_Last updated: 2025-04-20_

## Overview
The data model is designed for robust file-based storage, easy migration, and future extensibility for the Customer Tracker System.

## Top-Level Structure
```jsonc
{
  "customers": [Customer, ...],
  "visits": [CustomerVisit, ...],
  "settings": { /* user preferences, last file, etc. */ },
  "version": "1.0.0"
}
```

- **customers**: Array of Customer objects
- **visits**: Array of CustomerVisit objects
- **settings**: (optional) App settings for persistence
- **version**: Data schema version for migration

---

## Customer
```ts
export interface Customer {
  id: string;           // UUID or unique string
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
}
```

## CustomerVisit
```ts
export interface CustomerVisit {
  id: string;           // UUID or unique string
  // Legacy: name is kept for backward compatibility, prefer customerId going forward
  name?: string;
  customerId?: string;  // Foreign key to Customer.id
  date: string;         // ISO8601 format (YYYY-MM-DD or full ISO string)
  procedureType: ProcedureType;
  price: number;
  paidBy: string;
  changeFromPocket: number;
  myPay: number;
  subscription: boolean;
}
```

## ProcedureType
```ts
export type ProcedureType = 'Endospera' | 'Eco Lifting';
```

---

## Settings (optional, for future)
```ts
export interface AppSettings {
  lastOpenedFile?: string;
  theme?: 'light' | 'dark';
  columnVisibility?: Record<string, boolean>;
  autoSaveInterval?: number;
}
```

---

## Versioning
- Always include a `version` field at the root for migration support.
- Example: `"version": "1.0.0"`

## Example File
```json
{
  "version": "1.0.0",
  "customers": [
    { "id": "c1", "name": "Alice" }
  ],
  "visits": [
    { "id": "v1", "customerId": "c1", "date": "2025-04-20", "procedureType": "Endospera", "price": 100, "paidBy": "Cash", "changeFromPocket": 0, "myPay": 80, "subscription": false }
  ],
  "settings": {
    "theme": "dark",
    "autoSaveInterval": 2
  }
}
```

## Migration & Extensibility Guidelines
- Use new fields only at the end of objects, or as optional fields.
- Never remove or rename existing fields without a migration step.
- Keep legacy fields (e.g., `name` in CustomerVisit) for backward compatibility.
- Use the `version` field to handle data migrations in future releases.

---

**This model is ready for implementation and future-proofing.**
