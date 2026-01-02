import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NetWorthCard from '../components/NetWorthCard.js';
import AssetsCard from '../components/AssetsCard.js';
import LiabilitiesCard from '../components/LiabilitiesCard.js';
import AssetSidePanel from '../components/AssetSidePanel.js';

interface Asset {
  id: number;
  name: string;
  type: string;
  value: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
  status: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const [assetData, setAssetData] = useState<Asset[]>([
    { id: 1, name: 'Checking Account', type: 'Bank', value: 15000, change: 2500, changePercent: 20, lastUpdated: '2025-12-30', status: 'Active' },
    { id: 2, name: 'Savings Account', type: 'Bank', value: 45000, change: 1200, changePercent: 2.7, lastUpdated: '2025-12-30', status: 'Active' },
    { id: 3, name: 'Investment Portfolio', type: 'Investments', value: 50000, change: -2000, changePercent: -3.8, lastUpdated: '2025-12-29', status: 'Active' },
    { id: 4, name: 'Real Estate', type: 'Property', value: 15000, change: 0, changePercent: 0, lastUpdated: '2025-12-15', status: 'Active' },
  ]);

  const [liabilityData, setLiabilityData] = useState<Asset[]>([
    { id: 1, name: 'Mortgage', type: 'Loan', value: 50000, change: 0, changePercent: 0, lastUpdated: '2025-12-30', status: 'Active' },
    { id: 2, name: 'Credit Card Debt', type: 'Credit Card', value: 15000, change: 500, changePercent: 3.4, lastUpdated: '2025-12-30', status: 'Active' },
    { id: 3, name: 'Car Loan', type: 'Loan', value: 14749.25, change: 250, changePercent: 1.7, lastUpdated: '2025-12-29', status: 'Active' },
  ]);

  // Calculate totals from data
  const assetsValue = assetData.reduce((sum, asset) => sum + asset.value, 0);
  const liabilitiesValue = liabilityData.reduce((sum, liability) => sum + liability.value, 0);
  const netWorthValue = assetsValue - liabilitiesValue;

  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [liabilitySortConfig, setLiabilitySortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({ key: null, direction: 'asc' });
  const [assetsExpanded, setAssetsExpanded] = useState(false);
  const [liabilitiesExpanded, setLiabilitiesExpanded] = useState(true);

  const [currency, setCurrency] = useState('SGD');
  const SGD_TO_PHP = 45; // Conversion rate: 1 SGD = 45 PHP

  const [sidePanel, setSidePanel] = useState(false);
  const [panelMode, setPanelMode] = useState<'add' | 'edit'>('add');
  const [panelType, setPanelType] = useState<'asset' | 'liability'>('asset');
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ id: number; name: string; type: 'asset' | 'liability' } | null>(null);

  const handleSaveAsset = (newAsset: any) => {
    if (panelType === 'liability') {
      // Handle liabilities
      if (panelMode === 'edit' && editingAsset) {
        // Update existing liability
        setLiabilityData(liabilityData.map(l => 
          l.id === editingAsset.id 
            ? {
                ...l,
                name: newAsset.name,
                type: newAsset.type,
                value: parseFloat(newAsset.value),
                lastUpdated: newAsset.valuationDate,
                status: newAsset.status,
              }
            : l
        ));
        setEditingAsset(null);
      } else {
        // Create new liability
        const liability = {
          id: Math.max(...liabilityData.map(l => l.id), 0) + 1,
          name: newAsset.name,
          type: newAsset.type,
          value: parseFloat(newAsset.value),
          change: 0,
          changePercent: 0,
          lastUpdated: newAsset.valuationDate,
          status: newAsset.status,
        };
        setLiabilityData([...liabilityData, liability]);
      }
    } else {
      // Handle assets
      if (panelMode === 'edit' && editingAsset) {
        // Update existing asset
        setAssetData(assetData.map(a => 
          a.id === editingAsset.id 
            ? {
                ...a,
                name: newAsset.name,
                type: newAsset.type,
                value: parseFloat(newAsset.value),
                lastUpdated: newAsset.valuationDate,
                status: newAsset.status,
              }
            : a
        ));
        setEditingAsset(null);
      } else {
        // Create new asset
        const asset = {
          id: Math.max(...assetData.map(a => a.id), 0) + 1,
          name: newAsset.name,
          type: newAsset.type,
          value: parseFloat(newAsset.value),
          change: 0,
          changePercent: 0,
          lastUpdated: newAsset.valuationDate,
          status: newAsset.status,
        };
        setAssetData([...assetData, asset]);
      }
    }
    setSidePanel(false);
  };

  const [columnWidths, setColumnWidths] = useState({
    assetName: 200,
    type: 120,
    currentValue: 150,
    changeMoM: 180,
    lastUpdated: 140,
    status: 120,
  });

  const handleAssetSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleLiabilitySort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (liabilitySortConfig.key === key && liabilitySortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setLiabilitySortConfig({ key, direction });
  };

  const getSortedAssets = () => {
    let sorted = [...assetData];
    if (sortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = a[sortConfig.key as unknown as keyof Asset];
        const bValue = b[sortConfig.key as unknown as keyof Asset];

        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc' ? aValue.localeCompare(bValue as string) : (bValue as string).localeCompare(aValue);
        }
        return sortConfig.direction === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      });
    }
    return sorted;
  };

  const getSortedLiabilities = () => {
    let sorted = [...liabilityData];
    if (liabilitySortConfig.key) {
      sorted.sort((a, b) => {
        const aValue = a[liabilitySortConfig.key as unknown as keyof Asset];
        const bValue = b[liabilitySortConfig.key as unknown as keyof Asset];

        if (typeof aValue === 'string') {
          return liabilitySortConfig.direction === 'asc' ? aValue.localeCompare(bValue as string) : (bValue as string).localeCompare(aValue);
        }
        return liabilitySortConfig.direction === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
      });
    }
    return sorted;
  };

  const convertValue = (value: number) => {
    if (currency === 'PHP') {
      return value * SGD_TO_PHP;
    }
    return value;
  };

  const getCurrencySymbol = () => currency === 'SGD' ? '$' : '₱';

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

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: '#1a1a1a', color: '#FFD700', fontFamily: '"Noto Serif Display", serif', fontStretch: 'extra-condensed' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '1rem' }}>
          <div style={{ color: '#FFD700', fontSize: '16px' }}>
            {today}
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => navigate('/cashflow')}
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
                height: '32px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              Cash Flow
            </button>
            <div style={{ color: '#C0C0C0', fontSize: '12px' }}>
              (1 SGD = 45 PHP)
            </div>
            <div style={{ display: 'flex', gap: '2px', backgroundColor: '#242424', borderRadius: '6px', padding: '0.25rem', border: '1px solid #C0C0C0' }}>
            <button 
              onClick={() => setCurrency('SGD')}
              style={{
                padding: '1px 0.95rem',
                backgroundColor: currency === 'SGD' ? '#C0C0C0' : 'transparent',
                color: currency === 'SGD' ? '#1a1a1a' : '#C0C0C0',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: currency === 'SGD' ? '600' : '400',
                fontSize: '0.9rem'
              }}
            >
              SGD ($)
            </button>
            <button 
              onClick={() => setCurrency('PHP')}
              style={{
                padding: '1px 0.95rem',
                backgroundColor: currency === 'PHP' ? '#C0C0C0' : 'transparent',
                color: currency === 'PHP' ? '#1a1a1a' : '#C0C0C0',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: currency === 'PHP' ? '600' : '400',
                fontSize: '0.9rem'
              }}
            >
              PHP (₱)
            </button>
            </div>
          </div>
        </div>
        <h1>Net Worth</h1>
        <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <NetWorthCard value={convertValue(netWorthValue)} currencySymbol={getCurrencySymbol()} />
          <AssetsCard value={convertValue(assetsValue)} currencySymbol={getCurrencySymbol()} />
          <LiabilitiesCard value={convertValue(liabilitiesValue)} currencySymbol={getCurrencySymbol()} />
        </div>

        {/* Assets Table */}
        {/* Assets Section */}
        <div style={{ marginTop: '3rem' }}>
          {/* Assets Header with Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: assetsExpanded ? '1.5rem' : 0 }}>
            <button
              onClick={() => setAssetsExpanded(!assetsExpanded)}
              aria-expanded={assetsExpanded}
              aria-controls="assets-content"
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
              <span style={{ transform: assetsExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                ▼
              </span>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                {assetsExpanded ? 'Hide' : 'Show'} Assets
              </h2>
            </button>
            {assetsExpanded && (
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
                + Add asset
              </button>
            )}
          </div>

          {/* Assets Content - Collapsible */}
          <div
            id="assets-content"
            style={{
              maxHeight: assetsExpanded ? '2000px' : '0',
              opacity: assetsExpanded ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease, opacity 0.3s ease',
              marginBottom: assetsExpanded ? '3rem' : 0,
            }}
          >
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #333' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0f0f0f' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1a1a', borderBottom: '2px solid #FFD700' }}>
                  <th onClick={() => handleAssetSort('name')} style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.assetName, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Asset Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('assetName')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th onClick={() => handleAssetSort('type')} style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.type, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('type')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th onClick={() => handleAssetSort('value')} style={{ padding: '1rem', textAlign: 'right', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.currentValue, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Current Value {sortConfig.key === 'value' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('currentValue')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th onClick={() => handleAssetSort('change')} style={{ padding: '1rem', textAlign: 'right', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.changeMoM, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Change (MoM) {sortConfig.key === 'change' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('changeMoM')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th onClick={() => handleAssetSort('lastUpdated')} style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.lastUpdated, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Last Updated {sortConfig.key === 'lastUpdated' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('lastUpdated')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th onClick={() => handleAssetSort('status')} style={{ padding: '1rem', textAlign: 'center', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.status, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('status')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: '120px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedAssets().map((asset, index) => (
                  <tr key={asset.id} style={{ borderBottom: '1px solid #333', backgroundColor: index % 2 === 0 ? '#0f0f0f' : '#1a1a1a' }}>
                    <td style={{ padding: '1rem', color: '#e0e0e0', width: columnWidths.assetName, overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.name}</td>
                    <td style={{ padding: '1rem', color: '#b0b0b0', width: columnWidths.type, overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.type}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: '#FFD700', width: columnWidths.currentValue, overflow: 'hidden', textOverflow: 'ellipsis' }}>{getCurrencySymbol()}{convertValue(asset.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: asset.change >= 0 ? '#00AA00' : '#FF4444', width: columnWidths.changeMoM, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {asset.change >= 0 ? '+' : ''}{convertValue(asset.change).toLocaleString('en-US')} ({asset.changePercent >= 0 ? '+' : ''}{asset.changePercent}%)
                    </td>
                    <td style={{ padding: '1rem', color: '#b0b0b0', width: columnWidths.lastUpdated, overflow: 'hidden', textOverflow: 'ellipsis' }}>{asset.lastUpdated}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', width: columnWidths.status, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ padding: '0.25rem 0.75rem', backgroundColor: asset.status === 'Active' ? 'rgba(0, 170, 0, 0.2)' : 'rgba(255, 68, 68, 0.2)', color: asset.status === 'Active' ? '#00AA00' : '#FF4444', borderRadius: '4px', fontSize: '0.85rem' }}>
                        {asset.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', width: '120px' }}>
                      <button
                        onClick={() => {
                          setEditingAsset(asset);
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
                        onClick={() => setDeleteConfirmation({ id: asset.id, name: asset.name, type: 'asset' })}
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

        {/* Liabilities Section */}
        <div style={{ marginTop: '3rem' }}>
          {/* Liabilities Header with Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: liabilitiesExpanded ? '1.5rem' : 0 }}>
            <button
              onClick={() => setLiabilitiesExpanded(!liabilitiesExpanded)}
              aria-expanded={liabilitiesExpanded}
              aria-controls="liabilities-content"
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
              <span style={{ transform: liabilitiesExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
                ▼
              </span>
              <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
                {liabilitiesExpanded ? 'Hide' : 'Show'} Liabilities
              </h2>
            </button>
            {liabilitiesExpanded && (
              <button 
                onClick={() => {
                  setPanelMode('add');
                  setPanelType('liability');
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
                + Add liability
              </button>
            )}
          </div>

          {/* Liabilities Content - Collapsible */}
          <div
            id="liabilities-content"
            style={{
              maxHeight: liabilitiesExpanded ? '2000px' : '0',
              opacity: liabilitiesExpanded ? 1 : 0,
              overflow: 'hidden',
              transition: 'max-height 0.3s ease, opacity 0.3s ease',
              marginBottom: liabilitiesExpanded ? '3rem' : 0,
            }}
          >
          <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #333' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#0f0f0f' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a1a1a', borderBottom: '2px solid #FFD700' }}>
                  <th onClick={() => handleLiabilitySort('name')} style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.assetName, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Liability Name {liabilitySortConfig.key === 'name' && (liabilitySortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('assetName')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th onClick={() => handleLiabilitySort('type')} style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.type, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Type {liabilitySortConfig.key === 'type' && (liabilitySortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('type')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th onClick={() => handleLiabilitySort('value')} style={{ padding: '1rem', textAlign: 'right', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.currentValue, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Current Value {liabilitySortConfig.key === 'value' && (liabilitySortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('currentValue')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th onClick={() => handleLiabilitySort('change')} style={{ padding: '1rem', textAlign: 'right', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.changeMoM, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Change (MoM) {liabilitySortConfig.key === 'change' && (liabilitySortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('changeMoM')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th onClick={() => handleLiabilitySort('lastUpdated')} style={{ padding: '1rem', textAlign: 'left', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.lastUpdated, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Last Updated {liabilitySortConfig.key === 'lastUpdated' && (liabilitySortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('lastUpdated')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th onClick={() => handleLiabilitySort('status')} style={{ padding: '1rem', textAlign: 'center', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: columnWidths.status, position: 'relative', userSelect: 'none', cursor: 'pointer' }}>
                    Status {liabilitySortConfig.key === 'status' && (liabilitySortConfig.direction === 'asc' ? '▲' : '▼')}
                    <div onMouseDown={handleMouseDown('status')} style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: '8px', cursor: 'col-resize' }} />
                  </th>
                  <th style={{ padding: '1rem', textAlign: 'center', color: '#fff', fontSize: '0.95rem', fontWeight: 600, width: '120px' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {getSortedLiabilities().map((liability, index) => (
                  <tr key={liability.id} style={{ borderBottom: '1px solid #333', backgroundColor: index % 2 === 0 ? '#0f0f0f' : '#1a1a1a' }}>
                    <td style={{ padding: '1rem', color: '#e0e0e0', width: columnWidths.assetName, overflow: 'hidden', textOverflow: 'ellipsis' }}>{liability.name}</td>
                    <td style={{ padding: '1rem', color: '#b0b0b0', width: columnWidths.type, overflow: 'hidden', textOverflow: 'ellipsis' }}>{liability.type}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: '#FFD700', width: columnWidths.currentValue, overflow: 'hidden', textOverflow: 'ellipsis' }}>{getCurrencySymbol()}{convertValue(liability.value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td style={{ padding: '1rem', textAlign: 'right', color: liability.change >= 0 ? '#FF4444' : '#00AA00', width: columnWidths.changeMoM, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {liability.change >= 0 ? '+' : ''}{convertValue(liability.change).toLocaleString('en-US')} ({liability.changePercent >= 0 ? '+' : ''}{liability.changePercent}%)
                    </td>
                    <td style={{ padding: '1rem', color: '#b0b0b0', width: columnWidths.lastUpdated, overflow: 'hidden', textOverflow: 'ellipsis' }}>{liability.lastUpdated}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', width: columnWidths.status, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <span style={{ padding: '0.25rem 0.75rem', backgroundColor: liability.status === 'Active' ? 'rgba(0, 170, 0, 0.2)' : 'rgba(255, 68, 68, 0.2)', color: liability.status === 'Active' ? '#00AA00' : '#FF4444', borderRadius: '4px', fontSize: '0.85rem' }}>
                        {liability.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', textAlign: 'center', width: '120px' }}>
                      <button
                        onClick={() => {
                          setEditingAsset(liability);
                          setPanelMode('edit');
                          setPanelType('liability');
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
                        onClick={() => setDeleteConfirmation({ id: liability.id, name: liability.name, type: 'liability' })}
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

        <AssetSidePanel 
          open={sidePanel} 
          onClose={() => setSidePanel(false)}
          onSave={handleSaveAsset}
          mode={panelMode}
          panelType={panelType}
          initialData={editingAsset}
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
                    if (deleteConfirmation.type === 'asset') {
                      setAssetData(assetData.filter(a => a.id !== deleteConfirmation.id));
                    } else {
                      setLiabilityData(liabilityData.filter(l => l.id !== deleteConfirmation.id));
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
