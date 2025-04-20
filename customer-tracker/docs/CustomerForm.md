# CustomerForm Component

Displays a modal form for adding or editing a customer.

## Props
- `initial?: Partial<Customer>`: Initial values for the form fields (for editing).
- `onSave(customer: Omit<Customer, 'id'>)`: Called when the form is submitted successfully.
- `onCancel()`: Called when the user cancels or closes the form.

## Usage Example
```tsx
<CustomerForm
  initial={customer}
  onSave={handleSave}
  onCancel={handleCancel}
/>
```

## Features
- Validates required fields (name, email format)
- Shows inline error messages
- Accessible modal with keyboard focus
- Responsive layout
