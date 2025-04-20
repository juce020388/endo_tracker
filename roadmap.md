Project Roadmap: Endospera & Eco Lifting Customer Tracker System

## Next Up (Immediate Implementation Focus)
1. **Add documentation for UI components** — Write concise docs for each major UI component, including props and usage examples.
2. **Basic testing (manual or simple automated tests)** — Add at least one manual or automated test for core functionality (e.g., visit creation, editing, deletion).
3. **Design data models optimized for file storage** — Define and document how data will be structured for robust file storage and future migrations.

This roadmap outlines the planned development phases for the customer tracker application using React, Vite, TypeScript, and Tailwind CSS, with emphasis on proper file-based data persistence.
Progress Status as of 2025-04-19

[x] - Phase 1: Project Setup & Basic Structure — Complete
[x] - Phase 2: Data Handling & Basic CRUD — Complete
[x] - Phase 3: Weekly Organization & Summary Calculations — Complete
[~] - Phase 4: Refinement & Styling — In Progress (most styling and UI/UX improvements complete, basic testing and docs not started)
[~] - Phase 5: File-Based Data Persistence — In Progress (JSON/CSV import/export complete, template-based import, persistent settings, and recovery not started)
[] - Future Enhancements — Not started
--------------------------------------------------------------------------------------
Phase 1: Project Setup & Basic Structure
Goal: Set up the development environment and establish the core application structure.

[x] - Initialize Vite project with React and TypeScript template
[x] - Configure Tailwind CSS - Follow #Install Tailwind CSS instructions
[x] - Set up basic routing (if needed, though a single-page app might suffice initially)
[x] - Define core data structures (TypeScript interfaces for Customer Visit)
[x] - Create placeholder components for the main layout (e.g., header, main content area)
[x] - Implement basic month/week navigation components (without data)

Phase 2: Data Handling & Basic CRUD
Goal: Implement the ability to store and manipulate customer visit data, initially in memory.

[x] - Implement in-memory data storage mechanism
[x] - Create component for displaying a single customer visit row in a table
[x] - Create component for the weekly customer visit table
[x] - Create form/modal component for adding/editing customer visits
[x] - Implement functionality to add a new customer visit record
[x] - Implement functionality to display existing customer visit records for a week
[x] - Implement functionality to delete a customer visit record
[x] - Implement functionality to edit a customer visit record
[x] - Integrate the add/edit form with the weekly table view

Phase 3: Weekly Organization & Summary Calculations
Goal: Organize data by week and implement the weekly summary calculations.

[x] - Refine the month/week navigation to correctly identify weeks within a selected month
[x] - Filter/group the customer visit data to display records corresponding to the currently viewed week
[x] - Develop the logic to calculate the weekly totals (Money in Envelope, My Pay, Change, Subscription Count) broken down by Procedure Type
[x] - Create the component for the weekly summary table
[x] - Integrate the summary table below each weekly customer visit table
[x] - Ensure calculations update dynamically as customer visits are added, edited, or deleted

Phase 4: Refinement & Styling
Goal: Improve the user interface and add styling.

[x] - Apply Tailwind CSS for styling throughout the application, making it user-friendly and visually appealing
[x] - Implement responsive design for various screen sizes
[x] - Apply custom color palette globally for consistent branding and UI (2025-04-20)
[x] - Improve notification/toast style for better user feedback (2025-04-20)
[x] - Implement dark/light mode
[x] - Improve form validation and user feedback (e.g., success messages, error handling)
[] - Add documentation for UI components
[x] - Implement Visit Table Toolbar with search, sorting, and filtering capabilities (2025-04-20)
    - Modern multi-row toolbar UI with search, filters, sort, and reset. Responsive and user-friendly.
[x] - Review and refactor code for maintainability and clarity
[] - Basic testing (manual or simple automated tests)  <!-- Not started as of 2025-04-20 -->

Phase 5: File-Based Data Persistence (Priority)
Goal: Implement robust file-based data persistence to ensure data is not lost between sessions.

[] - Design data models optimized for file storage <!-- Not started as of 2025-04-20 -->
[x] - Implement JSON file export functionality:
[x] - Create a utility service for converting application data to JSON format
[x] - Implement "Save" and "Save As" functionality with file picker
[x] - Add auto-save feature with configurable interval and "Save Now" option (2025-04-20)
[x] - Implement JSON file import functionality:
[x] - Create utility service for validating and parsing JSON files
[x] - Build UI for file selection and import
[x] - Add data validation and error handling for imports
[x] - Implement CSV export functionality:
[x] - Create utilities for converting data to CSV format
[x] - Add export options for visits, customers, and summary reports
[x] - Implement CSV import functionality:
[x] - Create utilities for parsing and validating CSV data
[] - Build template-based import system with field mapping <!-- Not started as of 2025-04-20 -->
[] - Add persistent application settings: <!-- Not started as of 2025-04-20 -->
[] - Store last opened file path
[] - Remember UI preferences (dark/light mode, column visibility)
[] - Auto-save configuration
[] - Data recovery features: <!-- Not started as of 2025-04-20 -->
[] - Implement auto-backup on save (keep previous versions)
[] - Create emergency data recovery from localStorage if available

Future Enhancements (Post V1)
Data Management Improvements

[] - Multi-file project support (different data files for different business units)
[] - Cloud backup integration (e.g., Google Drive, Dropbox)
[] - Data migration tools for version updates
[] - Batch operations for data manipulation
[] - Data integrity checks and repair tools

Customer Management Module

[] - Create a separate section/view to manage individual customers
[] - Store and manage customer contact information (name, phone, email)
[] - Data privacy controls and GDPR compliance features
[] - View a history of visits for a specific customer
[] - Add notes or specific preferences for each customer
[] - Customer segmentation and tagging

Procedure Type Management

[] - Allow users to define and manage the list of procedure types
[] - Associate default pricing or calculations with procedure types
[] - Track procedure inventory and supplies
[] - Procedure performance metrics (popularity, profitability)

Subscription Tracking Enhancements

[] - Enhanced tracking of subscription start/end dates
[] - Reminders for upcoming subscription renewals
[] - Subscription package management
[] - Ability to link multiple visits to a single subscription package
[] - Subscription revenue forecasting

Reporting and Analytics

[] - Visualizations (charts/graphs) for trends in income, procedure types, etc.
[] - Reports on customer retention or frequency of visits
[] - Export reports to PDF format
[] - Custom report builder
[] - Scheduled report generation and delivery

Calendar and Scheduling

[] - A visual calendar display showing booked appointments or visits
[] - Ability to add visits directly from the calendar interface
[] - Schedule management and conflict detection
[] - Appointment reminders (email/SMS integration)
[] - Staff scheduling and availability management

Business Operations

[] - Expense tracking for supplies, rent, etc.
[] - Include expenses in overall financial summaries
[] - Simple invoicing system
[] - Basic accounting reports
[] - Tax preparation helpers

UI/UX Enhancements

[] - Allow users to customize labels, categories, and fields
[] - User-configurable theme customization
[] - Dashboard with key metrics and shortcuts
[] - Keyboard shortcuts for power users
[] - Accessibility improvements

Integration Capabilities

[] - Integration with calendar applications (Google Calendar, Outlook)
[] - Payment processor integration
[] - Email marketing platform integration
[] - Customer feedback collection tools
[] - Simple website booking widget

This roadmap provides a phased approach with clear emphasis on file-based data persistence to ensure no data is lost between application sessions. Actual timelines may vary based on development speed and priorities.

#Install Tailwind CSS instructions
1. Install Tailwind CSS 
    Install tailwindcss and @tailwindcss/vite via npm.
    npm install tailwindcss @tailwindcss/vite

2. Configure the Vite plugin:
   Add the @tailwindcss/vite plugin to your Vite configuration.
   vite.config.ts:
   import { defineConfig } from 'vite'
   import tailwindcss from '@tailwindcss/vite'
    
   export default defineConfig({
   plugins: [
         tailwindcss(),
     ],
   })
3. Import Tailwind CSS
   Add an @import to your CSS file that imports Tailwind CSS.
   @import "tailwindcss";