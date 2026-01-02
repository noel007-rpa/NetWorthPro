import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import KPICard from '../components/KPICard';
import IncomeSidePanel from '../components/IncomeSidePanel';
import AllocationSidePanel from '../components/AllocationSidePanel';

interface Income {
  id: number;
  name: string;
  type: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  status: string;
}

interface Subcategory {
  id: number;
  name: string;
  amount: number;
  status: string;
}

interface Allocation {
  id: number;
  category: string;
  amount: number;
  frequency: string;
  startDate: string;
  endDate: string | null;
  status: string;
  subcategories: Subcategory[];
  editingSubcategoryId?: number;
}

export default function CashFlow() {
  const navigate = useNavigate();
  const [totalDistribution] = useState(120000);
  const [incomeExpanded, setIncomeExpanded] = useState(true);
  const [allocationExpanded, setAllocationExpanded] = useState(true);
  const [sidePanel, setSidePanel] = useState(false);
  const [allocationPanel, setAllocationPanel] = useState(false);
  const [panelMode, setPanelMode] = useState<'add' | 'edit'>('add');
  const [panelType, setPanelType] = useState<'allocation' | 'subcategory'>('allocation');
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [editingAllocation, setEditingAllocation] = useState<Allocation | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: number; name: string; type?: 'income' | 'allocation' | 'subcategory'; parentId?: number } | null>(null);
  
  const [incomeData, setIncomeData] = useState([
    { id: 1, name: 'Salary', type: 'Employment', value: 80000, change: 0, changePercent: 0, lastUpdated: '2025-12-30', status: 'Active' },
    { id: 2, name: 'Bonus', type: 'Employment', value: 15000, change: 0, changePercent: 0, lastUpdated: '2025-12-30', status: 'Active' },
    { id: 3, name: 'Investment Returns', type: 'Investment', value: 35000, change: 5000, changePercent: 16.7, lastUpdated: '2025-12-29', status: 'Active' },
    { id: 4, name: 'Rental Income', type: 'Property', value: 20000, change: 0, changePercent: 0, lastUpdated: '2025-12-15', status: 'Active' },
  ]);

  const [allocationData, setAllocationData] = useState([
    { 
      id: 1, 
      category: 'Living', 
      amount: 46000, 
      frequency: 'Monthly', 
      startDate: '2025-01-01', 
      endDate: null, 
      status: 'Active',
      subcategories: [
        { id: 1.1, name: 'Housing', amount: 20000, status: 'Active' },
        { id: 1.2, name: 'Utilities', amount: 3000, status: 'Active' },
        { id: 1.3, name: 'Food', amount: 8000, status: 'Active' },
        { id: 1.4, name: 'Transport', amount: 10000, status: 'Active' },
        { id: 1.5, name: 'Education (core)', amount: 5000, status: 'Active' },
      ]
    },
    { 
      id: 2, 
      category: 'Savings', 
      amount: 40000, 
      frequency: 'Monthly', 
      startDate: '2025-01-01', 
      endDate: null, 
      status: 'Active',
      subcategories: [
        { id: 2.1, name: 'Emergency Fund', amount: 20000, status: 'Active' },
        { id: 2.2, name: 'Goal Savings', amount: 20000, status: 'Active' },
      ]
    },
    { 
      id: 3, 
      category: 'Investments', 
      amount: 15000, 
      frequency: 'Monthly', 
      startDate: '2025-01-01', 
      endDate: null, 
      status: 'Active',
      subcategories: [
        { id: 3.1, name: 'Stocks', amount: 8000, status: 'Active' },
        { id: 3.2, name: 'Bonds', amount: 4000, status: 'Active' },
        { id: 3.3, name: 'Real Estate', amount: 3000, status: 'Active' },
      ]
    },
    { 
      id: 4, 
      category: 'Debt', 
      amount: 5000, 
      frequency: 'Monthly', 
      startDate: '2025-01-01', 
      endDate: null, 
      status: 'Active',
      subcategories: [
        { id: 4.1, name: 'Credit Card', amount: 2000, status: 'Active' },
        { id: 4.2, name: 'Student Loan', amount: 2000, status: 'Active' },
        { id: 4.3, name: 'Personal Loan', amount: 1000, status: 'Active' },
      ]
    },
    { 
      id: 5, 
      category: 'Protection', 
      amount: 2000, 
      frequency: 'Monthly', 
      startDate: '2025-01-01', 
      endDate: null, 
      status: 'Active',
      subcategories: [
        { id: 5.1, name: 'Insurance', amount: 1500, status: 'Active' },
        { id: 5.2, name: 'Medical', amount: 500, status: 'Active' },
      ]
    },
    { 
      id: 6, 
      category: 'Support / Giving', 
      amount: 3000, 
      frequency: 'Monthly', 
      startDate: '2025-01-01', 
      endDate: null, 
      status: 'Active',
      subcategories: [
        { id: 6.1, name: 'Charity', amount: 1500, status: 'Active' },
        { id: 6.2, name: 'Family Support', amount: 1500, status: 'Active' },
      ]
    },
    { 
      id: 7, 
      category: 'Taxes', 
      amount: 4000, 
      frequency: 'Monthly', 
      startDate: '2025-01-01', 
      endDate: null, 
      status: 'Paused',
      subcategories: [
        { id: 7.1, name: 'Income Tax', amount: 2500, status: 'Active' },
        { id: 7.2, name: 'Property Tax', amount: 1000, status: 'Active' },
        { id: 7.3, name: 'Other Taxes', amount: 500, status: 'Active' },
      ]
    },
  ]);

  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({ 1: true, 2: true, 3: false, 4: false, 5: false, 6: false, 7: false });
  const [incomeSort, setIncomeSort] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [allocationSort, setAllocationSort] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [columnWidths, setColumnWidths] = useState({
    incomeName: 200,
    type: 120,
    currentValue: 150,
    changeMoM: 180,
    lastUpdated: 140,
    status: 120,
  });
  const [allocationColumnWidths, setAllocationColumnWidths] = useState({
    category: 150,
    amount: 120,
    frequency: 120,
    startDate: 140,
    endDate: 140,
    status: 100,
  });

  // Calculate total income from income data
  const totalIncome = incomeData.reduce((sum, item) => sum + item.value, 0);

  const handleSaveIncome = (newIncome: any) => {
    if (panelMode === 'edit' && editingIncome) {
      // Update existing income
      setIncomeData(incomeData.map(i => 
        i.id === editingIncome.id 
          ? {
              ...i,
              name: newIncome.name,
              type: newIncome.type,
              value: parseFloat(newIncome.value),
              lastUpdated: newIncome.valuationDate,
              status: newIncome.status,
            }
          : i
      ));
      setEditingIncome(null);
    } else {
      // Create new income
      const income = {
        id: Math.max(...incomeData.map(i => i.id), 0) + 1,
        name: newIncome.name,
        type: newIncome.type,
        value: parseFloat(newIncome.value),
        change: 0,
        changePercent: 0,
        lastUpdated: newIncome.valuationDate,
        status: newIncome.status,
      };
      setIncomeData([...incomeData, income]);
    }
    setSidePanel(false);
    setPanelMode('add');
    setEditingIncome(null);
  };

  const handleSaveAllocation = (newAllocation: any) => {
    if (panelType === 'subcategory' && editingAllocation) {
      // Add or update subcategory
      setAllocationData(allocationData.map(a =>
        a.id === editingAllocation.id
          ? {
              ...a,
              subcategories: panelMode === 'edit' && editingAllocation.editingSubcategoryId
                ? a.subcategories.map(sub =>
                    sub.id === editingAllocation.editingSubcategoryId
                      ? { ...sub, name: newAllocation.name, amount: newAllocation.amount, status: newAllocation.status }
                      : sub
                  )
                : [
                    ...a.subcategories,
                    {
                      id: Math.max(...(a.subcategories?.map(s => parseFloat(s.id?.toString()) || 0) || [0]), 0) + 0.1,
                      name: newAllocation.name,
                      amount: newAllocation.amount,
                      status: newAllocation.status,
                    },
                  ],
            }
          : a
      ));
      setEditingAllocation(null);
    } else if (panelMode === 'edit' && editingAllocation) {
      // Update existing allocation
      setAllocationData(allocationData.map(a =>
        a.id === editingAllocation.id
          ? {
              ...a,
              category: newAllocation.category,
              amount: newAllocation.amount,
              frequency: newAllocation.frequency,
              startDate: newAllocation.startDate,
              endDate: newAllocation.endDate || null,
              status: newAllocation.status,
            }
          : a
      ));
      setEditingAllocation(null);
    } else {
      // Create new allocation
      const allocation = {
        id: Math.max(...allocationData.map(a => a.id), 0) + 1,
        category: newAllocation.category,
        amount: newAllocation.amount,
        frequency: newAllocation.frequency,
        startDate: newAllocation.startDate,
        endDate: newAllocation.endDate || null,
        status: newAllocation.status,
        subcategories: [],
      };
      setAllocationData([...allocationData, allocation]);
    }
    setAllocationPanel(false);
    setPanelMode('add');
    setEditingAllocation(null);
  };

  const netSurplus = totalIncome - totalDistribution;
  const distributionRate = ((totalDistribution / totalIncome) * 100).toFixed(2);

  const handleIncomeSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (incomeSort.key === key && incomeSort.direction === 'asc') {
      direction = 'desc';
    }
    setIncomeSort({ key, direction });
  };

  const getSortedIncome = () => {
    let sorted = [...incomeData];
    if (incomeSort.key) {
      sorted.sort((a, b) => {
        const aValue = a[incomeSort.key as keyof Income];
        const bValue = b[incomeSort.key as keyof Income];

        if (typeof aValue === 'string') {
          return incomeSort.direction === 'asc' ? aValue.localeCompare(bValue as string) : (bValue as string).localeCompare(aValue);
        }
        return incomeSort.direction === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      });
    }
    return sorted;
  };

  const handleAllocationSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (allocationSort.key === key && allocationSort.direction === 'asc') {
      direction = 'desc';
    }
    setAllocationSort({ key, direction });
  };

  const getSortedAllocations = () => {
    let sorted = [...allocationData];
    if (allocationSort.key) {
      const sortKey = allocationSort.key;
      sorted.sort((a, b) => {
        const aValue = (a as Record<string, any>)[sortKey];
        const bValue = (b as Record<string, any>)[sortKey];

        if (typeof aValue === 'string') {
          return allocationSort.direction === 'asc' ? aValue.localeCompare(bValue as string) : (bValue as string).localeCompare(aValue);
        }
        return allocationSort.direction === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      });
    }
    return sorted;
  };

  const handleMouseDown = (column: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startWidth = columnWidths[column as keyof typeof columnWidths];

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setColumnWidths(prev => ({ ...prev, [column]: Math.max(80, newWidth) }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleAllocationMouseDown = (column: string) => (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX;
    const startWidth = allocationColumnWidths[column as keyof typeof allocationColumnWidths];

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      setAllocationColumnWidths(prev => ({ ...prev, [column]: Math.max(80, newWidth) }));
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#1a1a1a', color: '#FFD700', fontFamily: '"Noto Serif Display", serif', fontStretch: 'extra-condensed' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#FFD700',
              border: '1px solid #FFD700',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              fontFamily: 'inherit',
            }}
          >
            Back to Dashboard
          </button>
        </div>
        <h1>Cash Flow</h1>
        
        {/* KPI Cards */}
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <KPICard 
            title="Total Income" 
            value={`$${(totalIncome / 1000).toFixed(1)}K`}
            color="#00AA00"
          />
          <KPICard 
            title="Total Allocation" 
            value={`$${(totalDistribution / 1000).toFixed(1)}K`}
            color="#FFD700"
          />
          <KPICard 
            title={netSurplus >= 0 ? "Net Surplus" : "Net Deficit"} 
            value={`$${(Math.abs(netSurplus) / 1000).toFixed(1)}K`}
            color={netSurplus >= 0 ? "#00AA00" : "#FF4444"}
          />
          <KPICard 
            title="Distribution Rate" 
            value={distributionRate}
            unit="%"
            color="#C0C0C0"
          />
        </div>

        {/* Income Section */}
        <div style={{ marginTop: '3rem' }}>
          {/* Income Header with Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: incomeExpanded ? '1.5rem' : 0 }}>
            <button
              onClick={() => setIncomeExpanded(!incomeExpanded)}
              aria-expanded={incomeExpanded}
              aria-controls="income-content"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.25rem',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '0.5rem 0',
                marginLeft: '10px',
              }}
            >
              <span style={{ transform: incomeExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                ▼
              </span>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                {incomeExpanded ? 'Hide' : 'Show'} Income
              </h2>
            </button>
            {incomeExpanded && (
              <button 
                onClick={() => {
                  setPanelMode('add');
                  setSidePanel(true);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#fff',
                  border: '1px solid #fff',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.95rem',
                  marginRight: '10px'
                }}
              >
                + Add income
              </button>
            )}
          </div>

          {/* Income Content - Collapsible */}
          <div
            id="income-content"
            style={{
              maxHeight: incomeExpanded ? '2000px' : '0',
              opacity: incomeExpanded ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease, opacity 0.3s ease',
              marginBottom: incomeExpanded ? '3rem' : 0,
            }}
          >
            <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #333' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0f0f0f' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1a1a1a', borderBottom: '2px solid #FFD700' }}>
                    <th onClick={() => handleIncomeSort('name')} style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.incomeName, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      Income Name {incomeSort.key === 'name' && (incomeSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleMouseDown('incomeName')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th onClick={() => handleIncomeSort('type')} style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.type, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      Type {incomeSort.key === 'type' && (incomeSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleMouseDown('type')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th onClick={() => handleIncomeSort('value')} style={{ padding: '1rem', textAlign: 'right', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.currentValue, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      Current Value {incomeSort.key === 'value' && (incomeSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleMouseDown('currentValue')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th onClick={() => handleIncomeSort('change')} style={{ padding: '1rem', textAlign: 'right', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.changeMoM, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      Change (MoM) {incomeSort.key === 'change' && (incomeSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleMouseDown('changeMoM')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th onClick={() => handleIncomeSort('lastUpdated')} style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.lastUpdated, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      Last Updated {incomeSort.key === 'lastUpdated' && (incomeSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleMouseDown('lastUpdated')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th onClick={() => handleIncomeSort('status')} style={{ padding: '1rem', textAlign: 'center', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.status, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      Status {incomeSort.key === 'status' && (incomeSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleMouseDown('status')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: '120px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedIncome().map((income, index) => (
                    <tr key={income.id} style={{ borderBottom: '1px solid #333', backgroundColor: index % 2 === 0 ? '#0f0f0f' : '#1a1a1a' }}>
                      <td style={{ padding: '1rem', color: '#e0e0e0', width: columnWidths.incomeName, overflow: 'hidden', textOverflow: 'ellipsis' }}>{income.name}</td>
                      <td style={{ padding: '1rem', color: '#b0b0b0', width: columnWidths.type, overflow: 'hidden', textOverflow: 'ellipsis' }}>{income.type}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: '#00AA00', width: columnWidths.currentValue, overflow: 'hidden', textOverflow: 'ellipsis' }}>${income.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td style={{ padding: '1rem', textAlign: 'right', color: income.change >= 0 ? '#00AA00' : '#FF4444', width: columnWidths.changeMoM, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {income.change >= 0 ? '+' : ''}{income.change.toLocaleString('en-US')} ({income.changePercent >= 0 ? '+' : ''}{income.changePercent}%)
                      </td>
                      <td style={{ padding: '1rem', color: '#b0b0b0', width: columnWidths.lastUpdated, overflow: 'hidden', textOverflow: 'ellipsis' }}>{income.lastUpdated}</td>
                      <td style={{ padding: '1rem', textAlign: 'center', width: columnWidths.status, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span style={{ padding: '0.25rem 0.75rem', backgroundColor: income.status === 'Active' ? 'rgba(0, 170, 0, 0.2)' : 'rgba(255, 68, 68, 0.2)', color: income.status === 'Active' ? '#00AA00' : '#FF4444', borderRadius: '4px', fontSize: '0.85rem' }}>
                          {income.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', width: '120px' }}>
                        <button
                          onClick={() => {
                            setEditingIncome(income);
                            setPanelMode('edit');
                            setSidePanel(true);
                          }}
                          style={{
                            padding: '0.4rem 0.8rem',
                            backgroundColor: '#FFD700',
                            color: '#1a1a1a',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            marginRight: '0.5rem',
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirmation({ id: income.id, name: income.name })}
                          style={{
                            padding: '0.4rem 0.8rem',
                            backgroundColor: '#FF4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Allocation Section */}
        <div style={{ marginTop: '3rem' }}>
          {/* Allocation Header with Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: allocationExpanded ? '1.5rem' : 0 }}>
            <button
              onClick={() => setAllocationExpanded(!allocationExpanded)}
              aria-expanded={allocationExpanded}
              aria-controls="allocation-content"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.25rem',
                fontWeight: '600',
                cursor: 'pointer',
                padding: '0.5rem 0',
                marginLeft: '10px',
              }}
            >
              <span style={{ transform: allocationExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                ▼
              </span>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                {allocationExpanded ? 'Hide' : 'Show'} Cash Allocation List
              </h2>
            </button>
            {allocationExpanded && (
              <button
                onClick={() => {
                  setEditingAllocation(null);
                  setPanelMode('add');
                  setPanelType('allocation');
                  setAllocationPanel(true);
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: 'transparent',
                  color: '#FFD700',
                  border: '1px solid #FFD700',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                }}
              >
                + Add Allocation
              </button>
            )}
          </div>

          {/* Allocation Content */}
          <div
            id="allocation-content"
            style={{
              maxHeight: allocationExpanded ? '1000px' : '0',
              opacity: allocationExpanded ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease, opacity 0.3s ease',
            }}
          >
            <div style={{ overflowX: 'auto', marginBottom: '1.5rem', borderRadius: '4px', border: '1px solid #333' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#242424' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #FFD700', backgroundColor: '#0f0f0f' }}>
                    <th onClick={() => handleAllocationSort('category')} style={{ padding: '1rem', textAlign: 'left', color: '#FFD700', fontSize: '0.95rem', fontWeight: 600, width: allocationColumnWidths.category, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      Category {allocationSort.key === 'category' && (allocationSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleAllocationMouseDown('category')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th onClick={() => handleAllocationSort('amount')} style={{ padding: '1rem', textAlign: 'right', color: '#FFD700', fontSize: '0.95rem', fontWeight: 600, width: allocationColumnWidths.amount, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      Amount {allocationSort.key === 'amount' && (allocationSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleAllocationMouseDown('amount')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th onClick={() => handleAllocationSort('frequency')} style={{ padding: '1rem', textAlign: 'center', color: '#FFD700', fontSize: '0.95rem', fontWeight: 600, width: allocationColumnWidths.frequency, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      Frequency {allocationSort.key === 'frequency' && (allocationSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleAllocationMouseDown('frequency')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th onClick={() => handleAllocationSort('startDate')} style={{ padding: '1rem', textAlign: 'center', color: '#FFD700', fontSize: '0.95rem', fontWeight: 600, width: allocationColumnWidths.startDate, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      Start Date {allocationSort.key === 'startDate' && (allocationSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleAllocationMouseDown('startDate')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th onClick={() => handleAllocationSort('endDate')} style={{ padding: '1rem', textAlign: 'center', color: '#FFD700', fontSize: '0.95rem', fontWeight: 600, width: allocationColumnWidths.endDate, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      End Date {allocationSort.key === 'endDate' && (allocationSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleAllocationMouseDown('endDate')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th onClick={() => handleAllocationSort('status')} style={{ padding: '1rem', textAlign: 'center', color: '#FFD700', fontSize: '0.95rem', fontWeight: 600, width: allocationColumnWidths.status, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                      Status {allocationSort.key === 'status' && (allocationSort.direction === 'asc' ? '▲' : '▼')}
                      <div onMouseDown={handleAllocationMouseDown('status')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', color: '#FFD700', fontSize: '0.95rem', fontWeight: 600, width: '120px' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getSortedAllocations().map((allocation, index) => (
                    <React.Fragment key={allocation.id}>
                      <tr style={{ borderBottom: '1px solid #333', backgroundColor: index % 2 === 0 ? '#0f0f0f' : '#1a1a1a' }}>
                        <td style={{ padding: '1rem', color: '#e0e0e0', width: allocationColumnWidths.category, overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button
                            onClick={() => setExpandedCategories(prev => ({ ...prev, [allocation.id]: !prev[allocation.id] }))}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#FFD700',
                              cursor: 'pointer',
                              fontSize: '0.9rem',
                              padding: '0',
                              minWidth: '20px',
                            }}
                            aria-expanded={expandedCategories[allocation.id]}
                          >
                            {expandedCategories[allocation.id] ? '▼' : '▶'}
                          </button>
                          {allocation.category}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'right', color: '#00AA00', width: allocationColumnWidths.amount, overflow: 'hidden', textOverflow: 'ellipsis' }}>${allocation.amount.toLocaleString('en-US')}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#b0b0b0', width: allocationColumnWidths.frequency, overflow: 'hidden', textOverflow: 'ellipsis' }}>{allocation.frequency}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#b0b0b0', width: allocationColumnWidths.startDate, overflow: 'hidden', textOverflow: 'ellipsis' }}>{allocation.startDate}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#b0b0b0', width: allocationColumnWidths.endDate, overflow: 'hidden', textOverflow: 'ellipsis' }}>{allocation.endDate || 'Ongoing'}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: allocation.status === 'Active' ? '#00AA00' : '#FFB700', width: allocationColumnWidths.status, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {allocation.status}
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center', width: '120px' }}>
                          <button
                            onClick={() => {
                              setEditingAllocation(allocation);
                              setPanelMode('edit');
                              setPanelType('allocation');
                              setAllocationPanel(true);
                            }}
                            style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: '#FFD700',
                              color: '#1a1a1a',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                              marginRight: '0.5rem',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirmation({ id: allocation.id, name: allocation.category, type: 'allocation' })}
                            style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: '#FF4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: '600',
                            }}
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => {
                              setEditingAllocation(allocation);
                              setPanelMode('add');
                              setPanelType('subcategory');
                              setAllocationPanel(true);
                            }}
                            style={{
                              padding: '0.4rem 0.8rem',
                              backgroundColor: '#00AA00',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              marginLeft: '0.5rem',
                            }}
                          >
                            + Sub
                          </button>
                        </td>
                      </tr>
                      {expandedCategories[allocation.id] && allocation.subcategories && allocation.subcategories.map((sub) => (
                        <tr key={`${allocation.id}-${sub.id}`} style={{ borderBottom: '1px solid #333', backgroundColor: '#0a0a0a', opacity: 0.85 }}>
                          <td style={{ padding: '0.8rem 1rem 0.8rem 3rem', color: '#c0c0c0', width: allocationColumnWidths.category, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }}>
                            {sub.name}
                          </td>
                          <td style={{ padding: '0.8rem 1rem', textAlign: 'right', color: '#90EE90', width: allocationColumnWidths.amount, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }}>
                            ${sub.amount.toLocaleString('en-US')}
                          </td>
                          <td style={{ padding: '0.8rem 1rem', textAlign: 'center', color: '#b0b0b0', width: allocationColumnWidths.frequency, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }}>
                            —
                          </td>
                          <td style={{ padding: '0.8rem 1rem', textAlign: 'center', color: '#b0b0b0', width: allocationColumnWidths.startDate, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }}>
                            —
                          </td>
                          <td style={{ padding: '0.8rem 1rem', textAlign: 'center', color: '#b0b0b0', width: allocationColumnWidths.endDate, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }}>
                            —
                          </td>
                          <td style={{ padding: '0.8rem 1rem', textAlign: 'center', color: sub.status === 'Active' ? '#00AA00' : '#FFB700', width: allocationColumnWidths.status, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '0.9rem' }}>
                            {sub.status}
                          </td>
                          <td style={{ padding: '0.8rem 1rem', textAlign: 'center', width: '120px' }}>
                            <button
                              onClick={() => {
                                setEditingAllocation({ ...allocation, editingSubcategoryId: sub.id });
                                setPanelMode('edit');
                                setPanelType('subcategory');
                                setAllocationPanel(true);
                              }}
                              style={{
                                padding: '0.3rem 0.6rem',
                                backgroundColor: '#FFD700',
                                color: '#1a1a1a',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                marginRight: '0.3rem',
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteConfirmation({ id: sub.id, name: sub.name, type: 'subcategory', parentId: allocation.id })}
                              style={{
                                padding: '0.3rem 0.6rem',
                                backgroundColor: '#FF4444',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <IncomeSidePanel 
          open={sidePanel} 
          onClose={() => setSidePanel(false)}
          onSave={handleSaveIncome}
          mode={panelMode}
          initialData={editingIncome}
        />

        <AllocationSidePanel
          open={allocationPanel}
          onClose={() => setAllocationPanel(false)}
          onSave={handleSaveAllocation}
          mode={panelMode}
          panelType={panelType}
          initialData={editingAllocation}
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirmation && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1001,
          }}>
            <div style={{
              backgroundColor: '#242424',
              border: '1px solid #FFD700',
              borderRadius: '8px',
              padding: '2rem',
              maxWidth: '400px',
              color: '#fff',
            }}>
              <h2 style={{ color: '#FFD700', marginBottom: '1rem', fontSize: '1.3rem' }}>Confirm Delete</h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '0.95rem', color: '#ddd' }}>
                Are you sure you want to delete <strong>"{deleteConfirmation.name}"</strong>? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#333',
                    color: '#fff',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (deleteConfirmation.type === 'allocation') {
                      setAllocationData(allocationData.filter(a => a.id !== deleteConfirmation.id));
                    } else if (deleteConfirmation.type === 'subcategory') {
                      setAllocationData(allocationData.map(a =>
                        a.id === deleteConfirmation.parentId
                          ? { ...a, subcategories: a.subcategories.filter(s => s.id !== deleteConfirmation.id) }
                          : a
                      ));
                    } else {
                      setIncomeData(incomeData.filter(i => i.id !== deleteConfirmation.id));
                    }
                    setDeleteConfirmation(null);
                  }}
                  style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#FF4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    fontFamily: 'inherit',
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
