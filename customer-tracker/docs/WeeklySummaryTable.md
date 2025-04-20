# WeeklySummaryTable Component

Displays a summary table of customer visits for the week, grouped by procedure type.

## Props
- `visits: CustomerVisit[]`: Array of visit objects for the week.

## Usage Example
```tsx
<WeeklySummaryTable visits={visitsThisWeek} />
```

## Features
- Groups visits by procedure type (e.g., Endospera, Eco Lifting)
- Shows totals for money in envelope, my pay, change, and subscription count
- Responsive table layout
- Used below the weekly visit table for quick summary
