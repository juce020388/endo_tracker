# UI Components Documentation

This document provides a comprehensive overview of the main UI components in the `customer-tracker/src/components` directory, including their purpose, prop types, usage examples, design notes, and advanced details.

---

## Layout.tsx
- **Purpose:** Provides the main page layout, including header (with app name and dark mode toggle), footer, and content area. Integrates the dark/light mode toggle.
- **Props:**
  - `children: React.ReactNode` – Content to be rendered inside the layout.
- **Usage Example:**
  ```tsx
  <Layout>
    <HomePage />
  </Layout>
  ```
- **Design Notes:** Applies global background and text color variables. Header and footer use accent colors.
- **Advanced Details:**
  - **Prop Table:**
    | Prop Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | children | React.ReactNode | Yes | Content to be rendered inside the layout. |
  - **Event/Callback Explanations:** None
  - **Advanced Usage Notes:** To customize the layout, you can override the default styles by providing a custom `className` prop.
  - **Tips for Customization:** Use the `className` prop to add custom styles to the layout. For example, you can add a custom background image or change the font family.

---

## MonthNavigator.tsx
- **Purpose:** Allows users to navigate between months. Displays the current month and provides next/previous controls.
- **Props:** _(none)_
- **Usage Example:**
  ```tsx
  <MonthNavigator />
  ```
- **Design Notes:** Uses Tailwind for layout and coloring. Intended for placement at the top of the main page.
- **Advanced Details:**
  - **Prop Table:** None
  - **Event/Callback Explanations:** None
  - **Advanced Usage Notes:** To customize the month navigator, you can override the default styles by providing a custom `className` prop.
  - **Tips for Customization:** Use the `className` prop to add custom styles to the month navigator. For example, you can change the font size or add custom icons.

---

## WeekNavigator.tsx
- **Purpose:** Allows users to navigate between weeks within the selected month. Displays the current week range and provides next/previous controls.
- **Props:**
  - `currentMonday: Date` – The first day of the week to display.
  - `onPrevWeek: () => void` – Handler for previous week navigation.
  - `onNextWeek: () => void` – Handler for next week navigation.
- **Usage Example:**
  ```tsx
  <WeekNavigator
    currentMonday={currentMonday}
    onPrevWeek={handlePrevWeek}
    onNextWeek={handleNextWeek}
  />
  ```
- **Design Notes:** Responsive and styled for clarity.
- **Advanced Details:**
  - **Prop Table:**
    | Prop Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | currentMonday | Date | Yes | The first day of the week to display. |
    | onPrevWeek | () => void | Yes | Handler for previous week navigation. |
    | onNextWeek | () => void | Yes | Handler for next week navigation. |
  - **Event/Callback Explanations:**
    - `onPrevWeek`: Called when the user navigates to the previous week.
    - `onNextWeek`: Called when the user navigates to the next week.
  - **Advanced Usage Notes:** To customize the week navigator, you can override the default styles by providing a custom `className` prop.
  - **Tips for Customization:** Use the `className` prop to add custom styles to the week navigator. For example, you can change the font size or add custom icons.

---

## VisitTable.tsx
- **Purpose:** Displays a table of customer visits for the selected week. Supports editing and deleting visits.
- **Props:**
  - `visits: CustomerVisit[]` – Array of visit data to display.
  - `onEdit: (id: string) => void` – Called when the Edit button is clicked for a row.
  - `onDelete: (id: string) => void` – Called when the Delete button is clicked for a row.
- **Usage Example:**
  ```tsx
  <VisitTable visits={visits} onEdit={editVisit} onDelete={deleteVisit} />
  ```
- **Design Notes:**
  - Responsive table, uses custom color variables for styling.
  - Shows a message when no visits are present.
- **Advanced Details:**
  - **Prop Table:**
    | Prop Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | visits | CustomerVisit[] | Yes | Array of visit data to display. |
    | onEdit | (id: string) => void | Yes | Called when the Edit button is clicked for a row. |
    | onDelete | (id: string) => void | Yes | Called when the Delete button is clicked for a row. |
  - **Event/Callback Explanations:**
    - `onEdit`: Called when the user clicks the Edit button for a row.
    - `onDelete`: Called when the user clicks the Delete button for a row.
  - **Advanced Usage Notes:** To customize the visit table, you can override the default styles by providing a custom `className` prop.
  - **Tips for Customization:** Use the `className` prop to add custom styles to the visit table. For example, you can change the font size or add custom icons.

---

## WeeklySummaryTable.tsx
- **Purpose:** Shows a summary of weekly totals, broken down by procedure type (e.g., Money in Envelope, My Pay, Change, Subscription Count).
- **Props:**
  - `visits: CustomerVisit[]` – Array of visit data for summary calculations.
- **Usage Example:**
  ```tsx
  <WeeklySummaryTable visits={visits} />
  ```
- **Design Notes:** Table summarizes by procedure type; styled for clarity.
- **Advanced Details:**
  - **Prop Table:**
    | Prop Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | visits | CustomerVisit[] | Yes | Array of visit data for summary calculations. |
  - **Event/Callback Explanations:** None
  - **Advanced Usage Notes:** To customize the weekly summary table, you can override the default styles by providing a custom `className` prop.
  - **Tips for Customization:** Use the `className` prop to add custom styles to the weekly summary table. For example, you can change the font size or add custom icons.

---

## VisitForm.tsx
- **Purpose:** Modal/form for adding or editing a customer visit. Handles validation, error messages, and form state.
- **Props:**
  - `initial?: Partial<CustomerVisit>` – Initial values for editing (optional).
  - `onSave: (visit: Omit<CustomerVisit, 'id'>) => void` – Handler for form submission.
  - `onCancel: () => void` – Handler for form cancellation.
- **Usage Example:**
  ```tsx
  <VisitForm
    initial={editingVisit}
    onSave={saveVisit}
    onCancel={closeForm}
  />
  ```
- **Design Notes:**
  - Validates required fields (name, date, procedure type, price, paid by).
  - Shows error messages inline.
  - Uses a date picker and styled inputs.
- **Advanced Details:**
  - **Prop Table:**
    | Prop Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | initial | Partial<CustomerVisit> | No | Initial values for editing (optional). |
    | onSave | (visit: Omit<CustomerVisit, 'id'>) => void | Yes | Handler for form submission. |
    | onCancel | () => void | Yes | Handler for form cancellation. |
  - **Event/Callback Explanations:**
    - `onSave`: Called when the user submits the form.
    - `onCancel`: Called when the user cancels the form.
  - **Advanced Usage Notes:** To customize the visit form, you can override the default styles by providing a custom `className` prop.
  - **Tips for Customization:** Use the `className` prop to add custom styles to the visit form. For example, you can change the font size or add custom icons.

---

## DataManagementBar.tsx
- **Purpose:** Provides controls for data management, including reset, export, and import of visits.
- **Props:**
  - `visits: CustomerVisit[]` – Current visits data.
  - `setVisits: (visits: CustomerVisit[]) => void` – Setter for visits data.
  - `onReset?: (prevVisits: CustomerVisit[]) => void` – Handler for reset action (optional).
  - `csvDelimiter?: string` – Delimiter for CSV export/import (optional).
- **Usage Example:**
  ```tsx
  <DataManagementBar visits={visits} setVisits={setVisits} onReset={resetVisits} />
  ```
- **Design Notes:**
  - Handles JSON and CSV export/import.
  - Confirms before resetting data.
- **Advanced Details:**
  - **Prop Table:**
    | Prop Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | visits | CustomerVisit[] | Yes | Current visits data. |
    | setVisits | (visits: CustomerVisit[]) => void | Yes | Setter for visits data. |
    | onReset | (prevVisits: CustomerVisit[]) => void | No | Handler for reset action (optional). |
    | csvDelimiter | string | No | Delimiter for CSV export/import (optional). |
  - **Event/Callback Explanations:**
    - `onReset`: Called when the user resets the data.
  - **Advanced Usage Notes:** To customize the data management bar, you can override the default styles by providing a custom `className` prop.
  - **Tips for Customization:** Use the `className` prop to add custom styles to the data management bar. For example, you can change the font size or add custom icons.

---

## FilePickerBar.tsx
- **Purpose:** UI for selecting and importing/exporting files (JSON/CSV). Integrates with file system dialogs.
- **Props:**
  - `visits: CustomerVisit[]` – Current visits data.
  - `setVisits: (visits: CustomerVisit[]) => void` – Setter for visits data.
  - `defaultFilename?: string` – Default filename for saving (optional).
- **Usage Example:**
  ```tsx
  <FilePickerBar visits={visits} setVisits={setVisits} />
  ```
- **Design Notes:**
  - Uses File System Access API if available for direct save.
  - Fallbacks to download for unsupported browsers.
- **Advanced Details:**
  - **Prop Table:**
    | Prop Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | visits | CustomerVisit[] | Yes | Current visits data. |
    | setVisits | (visits: CustomerVisit[]) => void | Yes | Setter for visits data. |
    | defaultFilename | string | No | Default filename for saving (optional). |
  - **Event/Callback Explanations:** None
  - **Advanced Usage Notes:** To customize the file picker bar, you can override the default styles by providing a custom `className` prop.
  - **Tips for Customization:** Use the `className` prop to add custom styles to the file picker bar. For example, you can change the font size or add custom icons.

---

## UndoSnackbar.tsx
- **Purpose:** Snackbar notification for undoing destructive actions (e.g., reset visits).
- **Props:**
  - `open: boolean` – Whether the snackbar is visible.
  - `onUndo: () => void` – Handler for undo action.
  - `onClose: () => void` – Handler for closing the snackbar.
  - `duration?: number` – Duration in ms before auto-close (optional, default 5000).
- **Usage Example:**
  ```tsx
  <UndoSnackbar open={showSnackbar} onUndo={undoReset} onClose={closeSnackbar} />
  ```
- **Design Notes:**
  - Auto-closes after a timeout.
  - Fixed position at bottom of the screen.
- **Advanced Details:**
  - **Prop Table:**
    | Prop Name | Type | Required | Description |
    | --- | --- | --- | --- |
    | open | boolean | Yes | Whether the snackbar is visible. |
    | onUndo | () => void | Yes | Handler for undo action. |
    | onClose | () => void | Yes | Handler for closing the snackbar. |
    | duration | number | No | Duration in ms before auto-close (optional, default 5000). |
  - **Event/Callback Explanations:**
    - `onUndo`: Called when the user clicks the undo button.
    - `onClose`: Called when the user closes the snackbar.
  - **Advanced Usage Notes:** To customize the undo snackbar, you can override the default styles by providing a custom `className` prop.
  - **Tips for Customization:** Use the `className` prop to add custom styles to the undo snackbar. For example, you can change the font size or add custom icons.

---

## PlaceholderVisitTable.tsx / PlaceholderSummaryTable.tsx
- **Purpose:** Displayed when there is no visit or summary data. Used for empty state visuals.
- **Props:** _(none)_
- **Usage Example:**
  ```tsx
  <PlaceholderVisitTable />
  <PlaceholderSummaryTable />
  ```
- **Design Notes:** Simple visual placeholders for empty states.
- **Advanced Details:**
  - **Prop Table:** None
  - **Event/Callback Explanations:** None
  - **Advanced Usage Notes:** To customize the placeholder tables, you can override the default styles by providing a custom `className` prop.
  - **Tips for Customization:** Use the `className` prop to add custom styles to the placeholder tables. For example, you can change the font size or add custom icons.

---

**General Notes:**
- All components use Tailwind CSS classes and custom CSS variables for styling.
- Components are designed to be responsive and theme-aware (light/dark mode).
- For further details, see the prop types and inline comments in each component file.
