interface NetWorthCardProps {
  value: number;
  currencySymbol?: string;
}

export default function NetWorthCard({ value, currencySymbol = '$' }: NetWorthCardProps) {
  const isPositive = value >= 0;
  const valueColor = isPositive ? '#FFD700' : '#FF4444';

  return (
    <div
      style={{
        border: '2px solid #FFD700',
        borderRadius: '8px',
        padding: '2rem',
        backgroundColor: '#242424',
        width: '350px',
      }}
    >
      <h2 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '17px', fontWeight: '500' }}>
        Net Worth
      </h2>
      <div
        style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: valueColor,
          fontFamily: '"Noto Serif Display", serif',
          fontStretch: 'extra-condensed',
        }}
      >
        {currencySymbol}{value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
}
