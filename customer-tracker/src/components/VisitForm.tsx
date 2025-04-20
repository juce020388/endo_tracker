import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CustomerVisit, Customer } from '../types';

interface VisitFormProps {
  initial?: Partial<CustomerVisit>;
  onSave: (visit: Omit<CustomerVisit, 'id'>) => void;
  onCancel: () => void;
  customers: Customer[];
}

const defaultForm: Omit<CustomerVisit, 'id'> = {
  name: '',
  date: '',
  procedureType: 'Endospera',
  price: 0,
  paidBy: '',
  changeFromPocket: 0,
  myPay: 0,
  subscription: false,
};

const VisitForm: React.FC<VisitFormProps> = ({ initial, onSave, onCancel, customers }) => {
  const [form, setForm] = useState<Omit<CustomerVisit, 'id'>>({ ...defaultForm, ...initial });
  const initialDate = initial && typeof initial.date === 'string' ? new Date(initial.date) : new Date();
  const [dateValue, setDateValue] = useState<Date | null>(initialDate);

  // Ensure form.date is set on mount if not editing
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      date: initialDate ? initialDate.toISOString() : '',
    }));
    setDateValue(initialDate);
    // eslint-disable-next-line
  }, []);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(fields = form) {
    const errors: Record<string, string> = {};
    if (!fields.customerId?.trim()) errors.customerId = 'Customer is required.';
    if (!fields.date) errors.date = 'Date & Time is required.';
    if (!fields.procedureType) errors.procedureType = 'Procedure type is required.';
    const priceNum = Number(fields.price);
    if (fields.price === undefined || fields.price === null || isNaN(priceNum)) {
      errors.price = 'Price is required.';
    } else if (priceNum < 0) {
      errors.price = 'Price cannot be negative.';
    }
    if (!fields.paidBy) errors.paidBy = 'Paid By is required.';
    const changeNum = Number(fields.changeFromPocket);
    if (fields.changeFromPocket !== undefined && !isNaN(changeNum) && changeNum < 0) {
      errors.changeFromPocket = 'Change cannot be negative.';
    }
    const payNum = Number(fields.myPay);
    if (fields.myPay !== undefined && !isNaN(payNum) && payNum < 0) {
      errors.myPay = 'My Pay cannot be negative.';
    }
    return errors;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value, type } = e.target;
    // Special handling for customerId: auto-fill name for legacy support
    if (name === 'customerId') {
      const selectedCustomer = customers.find(c => c.id === value);
      setForm(prev => ({
        ...prev,
        customerId: value,
        name: selectedCustomer ? selectedCustomer.name : '', // legacy support
      }));
      setFormErrors(prevErrors => {
        const next = { ...prevErrors };
        delete next.customerId;
        delete next.name;
        return next;
      });
      return;
    }
    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: type === 'checkbox' && e.target instanceof HTMLInputElement
          ? e.target.checked
          : type === 'number'
            ? Number(value)
            : value,
      };
      setFormErrors((prevErrors) => {
        const next = { ...prevErrors };
        delete next[name];
        return next;
      });
      return updated;
    });
  }

  function handleDateChange(date: Date | null) {
    setDateValue(date);
    setForm((prev) => {
      const updated = {
        ...prev,
        date: date ? date.toISOString() : '',
      };
      setFormErrors((prevErrors) => {
        const next = { ...prevErrors };
        delete next.date;
        return next;
      });
      return updated;
    });
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name } = e.target;
    const errors = validate({ ...form, [name]: form[name as keyof typeof form] });
    setFormErrors((prev) => {
      const next = { ...prev };
      if (errors[name]) next[name] = errors[name]!;
      else delete next[name];
      return next;
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate();
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setSubmitError('Please fix the errors in the form.');
      return;
    }
    setSubmitError(null);
    onSave(form);
  }

  
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white border border-sky rounded shadow mb-6">
      {submitError && (
        <div className="text-red-600 font-semibold mb-2">{submitError}</div>
      )}
      <div className="flex flex-col mb-2">
        <label className="font-semibold text-xs mb-1 text-deepteal">Customer *</label>
        <select
          name="customerId"
          value={form.customerId || ''}
          onChange={handleChange}
          onBlur={handleBlur as any}
          required
          className={`border p-2 rounded focus:ring-2 focus:ring-teal ${formErrors.customerId ? 'border-red-500' : 'border-sky'}`}
        >
          <option value="">Select customer...</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name}{c.phone ? ` (${c.phone})` : ''}</option>
          ))}
        </select>
        {formErrors.customerId && <span className="text-xs text-red-600 mt-1">{formErrors.customerId}</span>}
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <label className="flex flex-col flex-1 text-deepteal font-semibold text-xs gap-1">
          Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Name"
            className={`border p-2 rounded focus:ring-2 focus:ring-teal ${formErrors.name ? 'border-red-500' : 'border-sky'}`}
          />
          {formErrors.name && <span className="text-xs text-red-600 mt-1">{formErrors.name}</span>}
        </label>
        <label className="flex flex-col flex-1 text-deepteal font-semibold text-xs gap-1">
          Date & Time
          <DatePicker
            selected={dateValue || new Date()}
            onChange={handleDateChange}
            onBlur={handleBlur as any}
            showTimeInput={true}
            timeInputLabel="Time:"
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="yyyy-MM-dd HH:mm"
            wrapperClassName="w-full"
            className={`border p-2 rounded w-full focus:ring-2 focus:ring-teal ${formErrors.date ? 'border-red-500' : 'border-sky'}`}
            placeholderText="Select date and time"
            required
          />
          {formErrors.date && <span className="text-xs text-red-600 mt-1">{formErrors.date}</span>}
        </label>
        <label className="flex flex-col flex-1 text-deepteal font-semibold text-xs gap-1">
          Procedure Type
          <select
            name="procedureType"
            value={form.procedureType}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`border p-2 rounded focus:ring-2 focus:ring-teal ${formErrors.procedureType ? 'border-red-500' : 'border-sky'}`}
          >
            <option value="Endospera">Endospera</option>
            <option value="Eco Lifting">Eco Lifting</option>
          </select>
          {formErrors.procedureType && <span className="text-xs text-red-600 mt-1">{formErrors.procedureType}</span>}
        </label>
        <label className="flex flex-col flex-1 text-deepteal font-semibold text-xs gap-1">
          Price
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            placeholder="Price"
            className={`border p-2 rounded focus:ring-2 focus:ring-teal ${formErrors.price ? 'border-red-500' : 'border-sky'}`}
          />
          {formErrors.price && <span className="text-xs text-red-600 mt-1">{formErrors.price}</span>}
        </label>
        <label className="flex flex-col flex-1 text-deepteal font-semibold text-xs gap-1">
          Paid By
          <select
            name="paidBy"
            value={form.paidBy}
            onChange={handleChange}
            onBlur={handleBlur}
            required
            className={`border p-2 rounded focus:ring-2 focus:ring-teal ${formErrors.paidBy ? 'border-red-500' : 'border-sky'}`}
          >
            <option value="">Select...</option>
            <option value="Cash">Cash</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Online">Online</option>
            <option value="Gift Card">Gift Card</option>
            <option value="Other">Other</option>
          </select>
          {formErrors.paidBy && <span className="text-xs text-red-600 mt-1">{formErrors.paidBy}</span>}
        </label>
        <label className="flex flex-col flex-1 text-deepteal font-semibold text-xs gap-1">
          Change
          <input
            name="changeFromPocket"
            type="number"
            value={form.changeFromPocket}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Change"
            className={`border p-2 rounded focus:ring-2 focus:ring-teal ${formErrors.changeFromPocket ? 'border-red-500' : 'border-sky'}`}
          />
          {formErrors.changeFromPocket && <span className="text-xs text-red-600 mt-1">{formErrors.changeFromPocket}</span>}
        </label>
        <label className="flex flex-col flex-1 text-deepteal font-semibold text-xs gap-1">
          My Pay
          <input
            name="myPay"
            type="number"
            value={form.myPay}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="My Pay"
            className={`border p-2 rounded focus:ring-2 focus:ring-teal ${formErrors.myPay ? 'border-red-500' : 'border-sky'}`}
          />
          {formErrors.myPay && <span className="text-xs text-red-600 mt-1">{formErrors.myPay}</span>}
        </label>
        <label className="flex items-center space-x-2 text-deepteal font-semibold text-xs">
          <input name="subscription" type="checkbox" checked={form.subscription} onChange={handleChange} />
          <span>Subscription</span>
        </label>
      </div>
      <div className="flex gap-2 sm:flex-row flex-col">
        {/* On mobile, buttons are full width */}
        <button type="submit" style={{ background: 'var(--color-accent)', color: '#fff', border: '1px solid var(--color-border)' }} className="px-4 py-2 rounded w-full sm:w-auto hover:bg-[var(--color-accent-dark)]">Save</button>
        <button type="button" onClick={onCancel} style={{ background: 'var(--color-accent)', color: 'var(--color-accent-dark)', border: '1px solid var(--color-border)' }} className="px-4 py-2 rounded w-full sm:w-auto hover:bg-[var(--color-accent-dark)] hover:text-[#fff]">Cancel</button>
      </div>
    </form>
  );
};

export default VisitForm;
