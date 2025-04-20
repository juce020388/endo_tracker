# VisitTableToolbar Component

A toolbar for searching, filtering, sorting, and resetting the customer visits table.

## Props
- `search: string` — Current search query
- `onSearchChange(value: string)` — Handler for search input changes
- `procedureType: string` — Current procedure type filter
- `onProcedureTypeChange(value: string)` — Handler for procedure filter changes
- `paidBy: string` — Current paid by filter
- `onPaidByChange(value: string)` — Handler for paid by filter changes
- `subscription: string` — Current subscription filter
- `onSubscriptionChange(value: string)` — Handler for subscription filter changes
- `sort: string` — Current sort order
- `onSortChange(value: string)` — Handler for sort order changes
- `onReset()` — Handler to reset all filters

## Usage Example
```tsx
<VisitTableToolbar
  search={search}
  onSearchChange={setSearch}
  procedureType={procedureType}
  onProcedureTypeChange={setProcedureType}
  paidBy={paidBy}
  onPaidByChange={setPaidBy}
  subscription={subscription}
  onSubscriptionChange={setSubscription}
  sort={sort}
  onSortChange={setSort}
  onReset={handleReset}
/>
```

## Features
- Multi-row, responsive toolbar
- Search and filter by multiple fields
- Sort visits by date, name, or price
- Reset button to clear all filters
