# Product Requirements Document: Customer Tracker System

## 1. Introduction
This document outlines the requirements for a web application to track customer visits for "Endospera" and "Eco Lifting" procedures. The application will help manage customer details, visit dates, procedure types, financial information, and track subscriptions on a weekly basis.

## 2. Goals
- Provide a digital system to record and manage customer visits for specific beauty/wellness procedures.
- Track key financial details per visit (price, payment method, change, personal pay).
- Summarize weekly performance based on procedure type, including total income, personal pay, change given, and subscription counts.
- Enable easy viewing, creation, editing, and deletion of customer visit records.
- Allow users to export and import their data for backup or transfer in JSON and CSV formats.
- Ensure no data is lost by implementing robust file-based data persistence.

## 3. Scope

### 3.1 In Scope
- User interface to display data organized by month and week.
- Functionality to add, edit, and delete customer visit records.
- Table view for customer visits within each week.
- Summary table for weekly totals per procedure type.
- Data persistence through JSON and CSV file formats.
- Functionality to export all customer data in JSON and CSV formats.
- Functionality to import data from JSON and CSV files.
- Implementation using React, Vite, TypeScript, and Tailwind CSS.
- Data validation and error handling for imports/exports.
- Alerts for unsaved changes.

### 3.2 Out of Scope
- Advanced reporting or analytics beyond the weekly summary.
- Complex filtering or sorting options (basic sorting will be included).
- User authentication and authorization.
- Multi-user collaboration features.
- Integration with external services or APIs.

## 4. User Stories

- As a user, I want to see weeks in a calendar view, where the week starts on Monday and ends on Sunday.
- As a user, I want to see a table listing all customer visits for a specific week.
- As a user, I want to be able to add a new customer visit record for a chosen week.
- As a user, I want to be able to edit the details of an existing customer visit record.
- As a user, I want to be able to delete a customer visit record.
- As a user, I want to enter the following details for each customer visit: Name, Date, Procedure Type, Price, Paid By, Change from my pocket, My pay, and Subscription status.
- As a user, I want to see a summary table at the end of each week's customer list that shows weekly totals for Endospera and Eco Lifting separately.
- As a user, I want the weekly summary table to calculate:
    - Total 'Money in Envelope' (sum of Price) for each procedure type.
    - Total 'My Pay' (sum of My pay) for each procedure type.
    - Total 'Change from my pocket' (sum of Change from my pocket) for each procedure type.
    - Count of 'Subscription' checkboxes checked for each procedure type.
- As a user, I want to be able to export all my customer data to JSON and CSV files.
- As a user, I want to be able to import customer data from JSON and CSV files.
- As a user, I want to be notified if I try to close the application with unsaved changes.
- As a user, I want my data to be persistently stored in files to prevent data loss.

## 5. Functional Requirements

### 5.1 Display View
- The application shall display a view organized by week.
- For each week, a table shall display the customer visits recorded for that week.
- Below the customer visits table for each week, a separate summary table shall be displayed.
- The application shall provide navigation controls to move between weeks and months.

### 5.2 Customer Visit Management
- The system shall allow adding a new customer visit record through a form or modal.
- The system shall allow editing an existing customer visit record.
- The system shall allow deleting an existing customer visit record with confirmation.
- The system shall provide validation to ensure all required fields are completed.

### 5.3 Customer Visit Data
Each customer visit record shall include the following fields:
- Name: Text input (String)
- Phone: Text input (String) - Optional
- Email: Text input (String) - Optional
- Date: Date picker (Date). Should default to a date within the selected week.
- Procedure Type: Select input with options "Endospera" and "Eco Lifting" (String).
- Price: Numeric input (Number). Represents the full price paid by the customer.
- Paid By: Select input with options "Cash" and "Bank Transfer" (String).
- Change from my pocket: Numeric input (Number). Optional, mainly relevant if Paid By is "Cash". Defaults to 0 if left blank or not applicable.
- My pay: Numeric input (Number). Represents the user's personal earning from this visit.
- Subscription: Checkbox (Boolean). Indicates if the customer has a subscription.
- Subscription Start Date: Date picker (Date) - Optional, visible when Subscription is checked.
- Subscription End Date: Date picker (Date) - Optional, visible when Subscription is checked.
- Notes: Text area (String) - Optional, for additional information.

### 5.4 Weekly Summary Calculations
For each week, a summary table shall display totals broken down by 'Procedure Type' (Endospera and Eco Lifting). The calculations are as follows:
- Money in Envelope (Procedure Type): Sum of 'Price' for all visits of this procedure type within the week.
- My Pay (Procedure Type): Sum of 'My pay' for all visits of this procedure type within the week.
- Change from my pocket (Procedure Type): Sum of 'Change from my pocket' for all visits of this procedure type within the week.
- Subscription Count (Procedure Type): Count of visits where 'Subscription' checkbox is checked for this procedure type within the week.

### 5.5 Data Persistence
- All data shall be saved and loaded from JSON or CSV files.
- The system shall provide a "Save" option to store data to the current file.
- The system shall provide a "Save As" option to store data to a new file.
- The system shall detect unsaved changes and prompt the user to save before closing.
- The system shall maintain the file path of the last opened file to facilitate easy saving.

### 5.6 Data Export/Import
- The system shall provide a mechanism to export all stored customer visit data as JSON or CSV files.
- The system shall provide a mechanism to import customer visit data from JSON or CSV files.
- The import process shall validate the imported data for correctness and completeness.
- The import process shall handle potential data conflicts or errors gracefully (e.g., option to overwrite, merge, or skip).
- The system shall provide appropriate error messages for invalid import files.

## 6. Technical Requirements

### 6.1 Development Stack
- Frontend Framework: React with TypeScript
- Build Tool: Vite
- Styling: Tailwind CSS
- Date Handling: Use a reliable date library (e.g., date-fns)

### 6.2 Data Handling
- State Management: React Context API for application state
- Data Format Standards:
    - Date format: YYYY-MM-DD
    - Time format: 24-hour format
    - Currency: Numbers with 2 decimal places
- File Handling:
    - JSON format for complete data export/import
    - CSV format for tabular data export/import
    - File system access via browser APIs

### 6.3 UI/UX Requirements
- Responsive design that works on desktop and tablet devices
- Clear visual hierarchy and intuitive navigation
- Consistent styling with Tailwind CSS
- Accessibility considerations for forms and interactive elements
- Appropriate feedback for user actions (success/error messages)

### 6.4 Development Process
- The developer shall strictly follow the roadmap.md document to guide the implementation process.
- Each completed feature must be marked in the roadmap.md file using the [x] syntax (e.g., changing "- [ ] Feature name" to "- [x] Feature name").
- Regular updates to the roadmap.md file are required to track implementation progress.
- Proper code organization with separation of concerns.
- Type safety through consistent use of TypeScript interfaces.
- Component reusability and modularity.

## 7. User Interface Mockup (Conceptual)

```
+------------------------------------------------------------+
| Customer Tracker                           [Save] [Open]    |
+------------------------------------------------------------+
| Month: April 2025   < Prev | Week 16 (Apr 14-20) | Next >  |
+------------------------------------------------------------+
| [+ Add Customer Visit] [Export JSON] [Export CSV]          |
+------------------------------------------------------------+
| Visits for Week 16                                         |
+------------------------------------------------------------+
| Name | Date     | Procedure | Price | Paid By | Change | My Pay | Sub | Actions |
|------|----------|-----------|-------|---------|--------|--------|-----|---------|
| Anna | 04/15/25 | Endospera | $120  | Cash    | $10    | $50    | Yes | Edit/Del|
| John | 04/16/25 | Eco Lift  | $150  | Bank    | $0     | $75    | No  | Edit/Del|
| ...  | ...      | ...       | ...   | ...     | ...    | ...    | ... | ...     |
+------------------------------------------------------------+
| Week 16 Summary                                            |
+------------------------------------------------------------+
| Procedure Type | Money in Envelope | My Pay | Change | Sub Count |
|----------------|-------------------|--------|--------|-----------|
| Endospera      | $240              | $100   | $15    | 1         |
| Eco Lifting    | $450              | $225   | $0     | 0         |
+------------------------------------------------------------+
```

## 8. Future Considerations (Out of Scope for V1)

- Advanced reporting (monthly, annual summaries, trends)
- Customer management module with detailed profiles
- Integration with calendar applications
- Advanced filtering, sorting, and searching capabilities
- Data visualization with charts and graphs
- Customizable procedure types beyond the initial two options
- Multi-device synchronization
- Backup scheduling and automated data recovery
- Customer communication features (appointment reminders)
- Financial reporting for tax purposes
- Multi-language support

## 9. Acceptance Criteria

The application will be considered complete when:

1. Users can navigate between weeks and view customer visits for each week.
2. Users can add, edit, and delete customer visits with all required fields.
3. Weekly summary calculations correctly display totals by procedure type.
4. Data can be successfully exported to and imported from JSON and CSV files.
5. Data persistence is reliable with proper save/load functionality.
6. The UI is responsive and follows the Tailwind CSS styling guidelines.
7. Error handling and data validation are in place for all user interactions.
8. Unsaved changes are detected and users are prompted to save.