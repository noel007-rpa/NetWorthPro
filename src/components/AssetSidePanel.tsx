import React, { useState, useEffect } from 'react';

interface AssetSidePanelProps {
  open: boolean;
  onClose: () => void;
  onSave: (formData: any) => void;
  mode?: 'add' | 'edit';
  panelType?: 'asset' | 'liability';
  initialData?: any;
}

export default function AssetSidePanel({ open, onClose, onSave, mode = 'add', panelType = 'asset', initialData }: AssetSidePanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: panelType === 'liability' ? 'Mortgage' : 'Bank',
    value: '0',
    valuationDate: new Date().toISOString().split('T')[0],
    status: 'Active',
  });

  // Initialize form data when panel opens or when initialData changes
  useEffect(() => {
    if (open && mode === 'edit' && initialData) {
      setFormData({
        name: initialData.name,
        type: initialData.type,
        value: initialData.value.toString(),
        valuationDate: initialData.lastUpdated,
        status: initialData.status,
      });
    } else if (open && mode === 'add') {
      setFormData({
        name: '',
        type: panelType === 'liability' ? 'Mortgage' : 'Bank',
        value: '0',
        valuationDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      });
    }
  }, [open, mode, initialData, panelType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    setFormData((prev: any) => ({ ...prev, value }));
  };

  const isFormValid = () => {
    const valueNum = parseFloat(formData.value);
    return formData.name.trim() !== '' && 
           formData.type !== '' && 
           (formData.value !== '' && !isNaN(valueNum)) && 
           formData.valuationDate !== '';
  };

  const handleSave = () => {
    if (isFormValid()) {
      onSave(formData);
      setFormData({
        name: '',
        type: panelType === 'liability' ? 'Mortgage' : 'Bank',
        value: '0',
        valuationDate: new Date().toISOString().split('T')[0],
        status: 'Active',
      });
    }
  };
  if (!open) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 40 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 40,
        }}
      />

      {/* Side Panel */}
      <div
        style={{
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          width: '400px',
          backgroundColor: '#242424',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.3)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #333' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: '#fff', margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
              {mode === 'edit' ? `Edit ${panelType === 'liability' ? 'Liability' : 'Asset'}` : `Add ${panelType === 'liability' ? 'Liability' : 'Asset'}`}
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
          {/* Asset/Liability Name */}
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
              {panelType === 'liability' ? 'Liability' : 'Asset'} Name *
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder={panelType === 'liability' ? 'e.g., Mortgage' : 'e.g., Savings Account'}
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

          {/* Asset/Liability Type */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="type"
              style={{
                display: 'block',
                color: '#fff',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              {panelType === 'liability' ? 'Liability Type' : 'Asset Type'} *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
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
              {panelType === 'liability' ? (
                <>
                  <option value="Mortgage">Mortgage</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Car Loan">Car Loan</option>
                  <option value="Student Loan">Student Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Business Loan">Business Loan</option>
                  <option value="Other">Other</option>
                </>
              ) : (
                <>
                  <option value="Cash">Cash</option>
                  <option value="Bank">Bank</option>
                  <option value="Investments">Investments</option>
                  <option value="Property">Property</option>
                  <option value="Vehicle">Vehicle</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </>
              )}
            </select>
          </div>

          {/* Current Value */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="value"
              style={{
                display: 'block',
                color: '#fff',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              Current Value *
            </label>
            <input
              id="value"
              type="text"
              name="value"
              value={formData.value}
              onChange={handleCurrencyChange}
              placeholder="0.00"
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

          {/* Valuation Date */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="valuationDate"
              style={{
                display: 'block',
                color: '#fff',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              Valuation Date *
            </label>
            <input
              id="valuationDate"
              type="date"
              name="valuationDate"
              value={formData.valuationDate}
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
              {panelType === 'liability' ? (
                <>
                  <option value="Active">Active</option>
                  <option value="Paid Off">Paid Off</option>
                  <option value="Deferred">Deferred</option>
                  <option value="Archived">Archived</option>
                </>
              ) : (
                <>
                  <option value="Active">Active</option>
                  <option value="Hidden">Hidden</option>
                  <option value="Sold">Sold</option>
                  <option value="Archived">Archived</option>
                </>
              )}
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
            backgroundColor: '#1a1a1a',
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
              fontWeight: '500',
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
            {mode === 'edit' ? `Update ${panelType === 'liability' ? 'Liability' : 'Asset'}` : `Save ${panelType === 'liability' ? 'Liability' : 'Asset'}`}
          </button>
        </div>
      </div>
    </div>
  );
}
