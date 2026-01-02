import React, { useState, useEffect } from 'react';

interface AllocationSidePanelProps {
  open: boolean;
  onClose: () => void;
  onSave: (allocation: any) => void;
  mode: 'add' | 'edit';
  panelType: 'allocation' | 'subcategory';
  initialData?: any;
}

export default function AllocationSidePanel({
  open,
  onClose,
  onSave,
  mode,
  panelType,
  initialData,
}: AllocationSidePanelProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    amount: '0',
    frequency: 'Monthly',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    status: 'Active',
  });

  const categories = ['Living', 'Savings', 'Investments', 'Debt', 'Protection', 'Support / Giving', 'Taxes'];
  const frequencies = ['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly', 'Annual', 'One-time'];

  useEffect(() => {
    if (panelType === 'subcategory') {
      if (mode === 'edit' && initialData && initialData.editingSubcategoryId) {
        // Find the subcategory being edited
        const editingSubcategory = initialData.subcategories?.find(
          (sub: any) => sub.id === initialData.editingSubcategoryId
        );
        
        if (editingSubcategory) {
          setFormData({
            name: editingSubcategory.name || '',
            category: initialData.category || '',
            amount: editingSubcategory.amount?.toString() || '0',
            frequency: 'Monthly',
            startDate: new Date().toISOString().split('T')[0],
            endDate: '',
            status: editingSubcategory.status || 'Active',
          });
        }
      } else {
        setFormData({
          name: '',
          category: initialData?.category || '',
          amount: '0',
          frequency: 'Monthly',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          status: 'Active',
        });
      }
    } else {
      if (mode === 'edit' && initialData) {
        setFormData({
          name: '',
          category: initialData.category || '',
          amount: initialData.amount?.toString() || '0',
          frequency: initialData.frequency || 'Monthly',
          startDate: initialData.startDate || new Date().toISOString().split('T')[0],
          endDate: initialData.endDate || '',
          status: initialData.status || 'Active',
        });
      } else {
        setFormData({
          name: '',
          category: '',
          amount: '0',
          frequency: 'Monthly',
          startDate: new Date().toISOString().split('T')[0],
          endDate: '',
          status: 'Active',
        });
      }
    }
  }, [mode, initialData, open, panelType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    if (panelType === 'subcategory') {
      return formData.name.trim() !== '' && 
             parseFloat(formData.amount) > 0;
    } else {
      return formData.category.trim() !== '' && 
             parseFloat(formData.amount) > 0 && 
             formData.startDate !== '' &&
             formData.frequency !== '';
    }
  };

  const handleSave = () => {
    if (!isFormValid()) return;

    const allocation = {
      id: mode === 'edit' && initialData ? initialData.id : Math.random(),
      category: formData.category,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      status: formData.status,
      subcategories: initialData?.subcategories || [],
    };

    onSave(allocation);
    setFormData({
      name: '',
      category: '',
      amount: '0',
      frequency: 'Monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'Active',
    });
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

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
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '400px',
          backgroundColor: '#242424',
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.3)',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          color: '#fff',
          fontFamily: 'inherit',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid #333',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#0f0f0f',
          }}
        >
          <h2 style={{ margin: 0, color: '#FFD700', fontSize: '1.3rem' }}>
            {mode === 'add' ? 'Add' : 'Edit'} {panelType === 'allocation' ? 'Allocation' : 'Subcategory'}
          </h2>
          <button
            onClick={onClose}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              color: '#FFD700',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0',
            }}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
          {panelType === 'subcategory' && (
            <>
              {/* Subcategory Name */}
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
                  Subcategory Name * ({formData.category})
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Housing, Utilities, Food"
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
            </>
          )}
          {panelType === 'allocation' && (
            <>
              {/* Category */}
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
                  Category *
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
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Amount */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label
              htmlFor="amount"
              style={{
                display: 'block',
                color: '#fff',
                marginBottom: '0.5rem',
                fontSize: '0.95rem',
                fontWeight: '500',
              }}
            >
              Amount *
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
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

          {panelType === 'allocation' && (
            <>
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
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {panelType === 'allocation' && (
            <>
              {/* Start Date */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="startDate"
                  style={{
                    display: 'block',
                    color: '#fff',
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                  }}
                >
                  Start Date *
                </label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
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

              {/* End Date */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label
                  htmlFor="endDate"
                  style={{
                    display: 'block',
                    color: '#fff',
                    marginBottom: '0.5rem',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                  }}
                >
                  End Date (Optional)
                </label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
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
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </>
          )}
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
              padding: '0.8rem',
              backgroundColor: '#333',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: '600',
              fontFamily: 'inherit',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid()}
            style={{
              flex: 1,
              padding: '0.8rem',
              backgroundColor: isFormValid() ? '#FFD700' : '#666',
              color: isFormValid() ? '#1a1a1a' : '#999',
              border: 'none',
              borderRadius: '4px',
              cursor: isFormValid() ? 'pointer' : 'not-allowed',
              fontSize: '0.95rem',
              fontWeight: '600',
              fontFamily: 'inherit',
              opacity: isFormValid() ? 1 : 0.5,
            }}
          >
            Save {panelType === 'allocation' ? 'Allocation' : 'Subcategory'}
          </button>
        </div>
      </div>
    </>
  );
}
