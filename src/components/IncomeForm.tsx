import React, { useState, useMemo } from 'react';

interface IncomeFormData {
  date: string;
  incomeName: string;
  category: string;
  status: string;
  amount: string;
  frequency: string;
  startDate: string;
  endDate: string;
  taxPercent: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface IncomeFormProps {
  onSubmit?: (data: IncomeFormData) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

export default function IncomeForm({ onSubmit, onClose, isOpen = true }: IncomeFormProps) {
  const [formData, setFormData] = useState<IncomeFormData>({
    date: new Date().toISOString().split('T')[0],
    incomeName: '',
    category: 'Salary',
    status: 'Active',
    amount: '',
    frequency: 'Monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    taxPercent: '0',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  // Calculate tax amounts
  const taxCalculations = useMemo(() => {
    const amount = parseFloat(formData.amount) || 0;
    const taxPercent = parseFloat(formData.taxPercent) || 0;
    const taxAmount = amount * (taxPercent / 100);
    const incomeAfterTax = amount - taxAmount;

    return {
      taxAmount: isNaN(taxAmount) ? 0 : taxAmount,
      incomeAfterTax: isNaN(incomeAfterTax) ? 0 : incomeAfterTax,
    };
  }, [formData.amount, formData.taxPercent]);

  // Validation logic
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    // Income Amount must be > 0
    const amount = parseFloat(formData.amount);
    if (!formData.amount || amount <= 0) {
      newErrors.amount = 'Income Amount must be greater than 0';
    }

    // Tax % must be between 0 and 100
    const taxPercent = parseFloat(formData.taxPercent);
    if (formData.taxPercent && (isNaN(taxPercent) || taxPercent < 0 || taxPercent > 100)) {
      newErrors.taxPercent = 'Tax % must be between 0 and 100';
    }

    // If Frequency is not "One-time", Start Date is required
    if (formData.frequency !== 'One-time' && !formData.startDate) {
      newErrors.startDate = 'Start Date is required for recurring income';
    }

    // If Status is "Ended", End Date is required
    if (formData.status === 'Ended' && !formData.endDate) {
      newErrors.endDate = 'End Date is required when Status is Ended';
    }

    // End Date cannot be earlier than Start Date
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      if (endDate < startDate) {
        newErrors.endDate = 'End Date cannot be earlier than Start Date';
      }
    }

    return newErrors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleReset = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      incomeName: '',
      category: 'Salary',
      status: 'Active',
      amount: '',
      frequency: 'Monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      taxPercent: '0',
    });
    setErrors({});
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.panel}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.title}>Add Income</h2>
          {onClose && (
            <button onClick={onClose} style={styles.closeButton}>
              ✕
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Section 1: Transaction Details */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Transaction Details</h3>

            {/* Date */}
            <div style={styles.formGroup}>
              <label htmlFor="date" style={styles.label}>
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>

            {/* Income Name */}
            <div style={styles.formGroup}>
              <label htmlFor="incomeName" style={styles.label}>
                Income Name
              </label>
              <input
                type="text"
                id="incomeName"
                name="incomeName"
                placeholder="e.g., Monthly Salary"
                value={formData.incomeName}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>

            {/* Category */}
            <div style={styles.formGroup}>
              <label htmlFor="category" style={styles.label}>
                Category
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="Salary">Salary</option>
                <option value="Business">Business</option>
                <option value="Freelance">Freelance</option>
                <option value="Passive">Passive</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Status */}
            <div style={styles.formGroup}>
              <label htmlFor="status" style={styles.label}>
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Ended">Ended</option>
              </select>
            </div>
          </div>

          {/* Section 2: Amount & Frequency */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Amount & Frequency</h3>

            {/* Income Amount */}
            <div style={styles.formGroup}>
              <label htmlFor="amount" style={styles.label}>
                Income Amount
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                placeholder="0.00"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.amount ? styles.inputError : {}),
                }}
              />
              {errors.amount && <div style={styles.errorText}>{errors.amount}</div>}
            </div>

            {/* Frequency */}
            <div style={styles.formGroup}>
              <label htmlFor="frequency" style={styles.label}>
                Frequency
              </label>
              <select
                id="frequency"
                name="frequency"
                value={formData.frequency}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="One-time">One-time</option>
                <option value="Hourly">Hourly</option>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Annual">Annual</option>
              </select>
            </div>

            {/* Start Date */}
            <div style={styles.formGroup}>
              <label htmlFor="startDate" style={styles.label}>
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.startDate ? styles.inputError : {}),
                }}
              />
              {errors.startDate && <div style={styles.errorText}>{errors.startDate}</div>}
            </div>

            {/* End Date */}
            <div style={styles.formGroup}>
              <label htmlFor="endDate" style={styles.label}>
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.endDate ? styles.inputError : {}),
                }}
              />
              {errors.endDate && <div style={styles.errorText}>{errors.endDate}</div>}
            </div>
          </div>

          {/* Section 3: Tax Computation */}
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Tax Computation</h3>

            {/* Tax % */}
            <div style={styles.formGroup}>
              <label htmlFor="taxPercent" style={styles.label}>
                Tax %
              </label>
              <input
                type="number"
                id="taxPercent"
                name="taxPercent"
                placeholder="0"
                step="0.01"
                min="0"
                max="100"
                value={formData.taxPercent}
                onChange={handleInputChange}
                style={{
                  ...styles.input,
                  ...(errors.taxPercent ? styles.inputError : {}),
                }}
              />
              {errors.taxPercent && <div style={styles.errorText}>{errors.taxPercent}</div>}
            </div>

            {/* Tax Amount (Read-only) */}
            <div style={styles.formGroup}>
              <label htmlFor="taxAmount" style={styles.label}>
                Tax Amount
              </label>
              <input
                type="text"
                id="taxAmount"
                value={`$${taxCalculations.taxAmount.toFixed(2)}`}
                readOnly
                style={{...styles.input, ...styles.readOnlyInput}}
              />
            </div>

            {/* Income After Tax (Read-only) */}
            <div style={styles.formGroup}>
              <label htmlFor="incomeAfterTax" style={styles.label}>
                Income After Tax
              </label>
              <input
                type="text"
                id="incomeAfterTax"
                value={`$${taxCalculations.incomeAfterTax.toFixed(2)}`}
                readOnly
                style={{...styles.input, ...styles.readOnlyInput}}
              />
            </div>
          </div>

          {/* Button Group */}
          <div style={styles.buttonGroup}>
            <button type="button" onClick={handleReset} style={styles.resetButton}>
              Reset
            </button>
            <button 
              type="submit" 
              style={{
                ...styles.submitButton,
                ...(Object.keys(errors).length > 0 ? styles.submitButtonDisabled : {})
              }}
              disabled={Object.keys(errors).length > 0}
            >
              Add Income
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 1000,
    overflow: 'auto',
  },
  panel: {
    width: '100%',
    maxWidth: '450px',
    backgroundColor: '#fff',
    height: '100vh',
    overflowY: 'auto',
    boxShadow: '-2px 0 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f9f9f9',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#1a1a1a',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: '#666',
    padding: 0,
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
  },
  form: {
    padding: '1.5rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    margin: '0 0 1rem 0',
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#333',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '2px solid #6c63ff',
    paddingBottom: '0.5rem',
  },
  formGroup: {
    marginBottom: '1.2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#333',
  },
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    width: '100%',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdeaea',
  },
  select: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontFamily: 'inherit',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
    width: '100%',
  },
  readOnlyInput: {
    backgroundColor: '#f5f5f5',
    cursor: 'default',
    color: '#333',
    fontWeight: '500',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '0.8rem',
    marginTop: '0.3rem',
    fontWeight: '500',
  },
  buttonGroup: {
    display: 'flex',
    gap: '1rem',
    marginTop: 'auto',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e0e0e0',
  },
  resetButton: {
    flex: 1,
    padding: '0.75rem',
    border: '2px solid #ddd',
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitButton: {
    flex: 1,
    padding: '0.75rem',
    border: 'none',
    backgroundColor: '#6c63ff',
    color: '#fff',
    borderRadius: '6px',
    fontSize: '0.95rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
};
