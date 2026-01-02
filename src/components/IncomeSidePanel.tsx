import React, { useState, useEffect } from 'react';

interface IncomeSidePanelProps {
  open: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  mode?: 'add' | 'edit';
  initialData?: any;
}

export default function IncomeSidePanel({ open, onClose, onSave, mode = 'add', initialData }: IncomeSidePanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Salary',
    source: '',
    receivedDate: new Date().toISOString().split('T')[0],
    frequency: 'Monthly',
    status: 'Expected',
  });

  // Initialize form data when panel opens or when initialData changes
  useEffect(() => {
    if (open && mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name,
        category: initialData.category,
        source: initialData.source,
        receivedDate: initialData.receivedDate,
        frequency: initialData.frequency,
        status: initialData.status,
      });
    } else if (open && mode === 'add') {
      setFormData({
        name: '',
        category: 'Salary',
        source: '',
        receivedDate: new Date().toISOString().split('T')[0],
        frequency: 'Monthly',
        status: 'Expected',
      });
    }
  }, [open, mode, initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    return formData.name.trim() !== '' && 
           formData.category !== '' && 
           formData.source.trim() !== '' && 
           formData.receivedDate !== '' &&
           formData.frequency !== '';
  };

  const handleSave = () => {
    if (isFormValid()) {
      onSave(formData);
      setFormData({
        name: '',
        category: 'Salary',
        source: '',
        receivedDate: new Date().toISOString().split('T')[0],
        frequency: 'Monthly',
        status: 'Expected',
      });
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      {open && (
        <div
          onClick={handleBackdropClick}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
          }}
        />
      )}
      <div
        onKeyDown={handleKeyDown}
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '400px',
          backgroundColor: '#1a1a1a',
          borderLeft: '1px solid #333',
          boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.5)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
              {mode === 'edit' ? 'Edit Income' : 'Add Income'}
            </h2>
            <button
              onClick={onClose}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#999',
                fontSize: '1.5rem',
                cursor: 'pointer',
                padding: 0,
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label="Close panel"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Empty Content Area */}
        <div
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '1.5rem',
          }}
        >
          {/* Income Name */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                color: '#fff',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              Income Name *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Monthly Salary, Bonus"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Income Category */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="category"
              style={{
                display: 'block',
                color: '#fff',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              Income Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="Salary">Salary</option>
              <option value="Business">Business</option>
              <option value="Freelance">Freelance</option>
              <option value="Passive">Passive</option>
            </select>
          </div>

          {/* Income Source */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="source"
              style={{
                display: 'block',
                color: '#fff',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              Income Source *
            </label>
            <input
              id="source"
              type="text"
              name="source"
              value={formData.source}
              onChange={handleInputChange}
              placeholder="e.g., Employer / Client / Platform"
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Received Date */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="receivedDate"
              style={{
                display: 'block',
                color: '#fff',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              Received Date *
            </label>
            <input
              id="receivedDate"
              type="date"
              name="receivedDate"
              value={formData.receivedDate}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Frequency */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="frequency"
              style={{
                display: 'block',
                color: '#fff',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              Frequency *
            </label>
            <select
              id="frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="One-time">One-time</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>

          {/* Status */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="status"
              style={{
                display: 'block',
                color: '#fff',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              style={{
                width: '100%',
                padding: '0.75rem',
                backgroundColor: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '4px',
                color: '#fff',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                boxSizing: 'border-box',
              }}
            >
              <option value="Expected">Expected</option>
              <option value="Received">Received</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1.5rem',
            borderTop: '1px solid #333',
            display: 'flex',
            gap: '1rem',
            backgroundColor: '#0f0f0f',
          }}
        >
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              backgroundColor: 'transparent',
              border: '1px solid #666',
              borderRadius: '4px',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              backgroundColor: '#FFD700',
              border: 'none',
              borderRadius: '4px',
              color: '#1a1a1a',
              fontSize: '0.95rem',
              fontWeight: '600',
              opacity: isFormValid() ? 1 : 0.5,
              cursor: isFormValid() ? 'pointer' : 'not-allowed',
            }}
            disabled={!isFormValid()}
          >
            {mode === 'edit' ? 'Update Income' : 'Save Income'}
          </button>
        </div>
      </div>
    </>
  );
}
