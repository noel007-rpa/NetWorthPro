interface AssetsCardProps {
  value: number;
  currencySymbol?: string;
}

export default function AssetsCard({ value, currencySymbol = '$' }: AssetsCardProps) {
  return (
    <div
      style={{
        border: '2px solid #00AA00',
        borderRadius: '8px',
        padding: '2rem',
        backgroundColor: '#242424',
        width: '300px',
      }}
    >
      <h2 style={{ margin: '0 0 1rem 0', color: '#fff', fontSize: '17px', fontWeight: '500' }}>
        Assets
      </h2>
      <div
        style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#00AA00',
          fontFamily: '"Noto Serif Display", serif',
          fontStretch: 'extra-condensed',
        }}
      >
        {currencySymbol}{value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
}
