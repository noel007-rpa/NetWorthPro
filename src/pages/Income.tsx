import { useState } from 'react';
import IncomeForm from '../components/IncomeForm.js';

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

export default function Income() {
  const [isFormOpen, setIsFormOpen] = useState(true);

  const handleFormSubmit = (data: IncomeFormData) => {
    console.log('Income data submitted:', data);
    // TODO: Handle form submission logic here
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#1a1a1a', color: '#fff' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1>Income Page</h1>
        <p>This is a blank income page.</p>

        <button
          onClick={() => setIsFormOpen(true)}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6c63ff',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            marginTop: '1rem',
          }}
        >
          Open Form
        </button>
      </div>

      <IncomeForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
