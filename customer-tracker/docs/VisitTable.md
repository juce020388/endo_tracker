# VisitTable Component

Displays a table of customer visits for the selected week.

## Props
- `visits: CustomerVisit[]`: Array of visit objects to display.
- `onEdit(id: string)`: Called when the user clicks the Edit button for a visit.
- `onDelete(id: string)`: Called when the user clicks the Delete button for a visit.

## Usage Example
```tsx
<VisitTable
  visits={visitsThisWeek}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## Features
- Responsive table layout with scroll for overflow
- Action buttons for editing and deleting visits
- Shows a placeholder message if there are no visits
- Uses custom date formatting for display
