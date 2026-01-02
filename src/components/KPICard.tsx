interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  color?: string;
}

export default function KPICard({ title, value, unit = '', color = '#FFD700' }: KPICardProps) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: '200px',
        padding: '1.5rem',
        backgroundColor: '#242424',
        border: `2px solid ${color}`,
        borderRadius: '8px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          fontSize: '0.9rem',
          fontWeight: '500',
          color: '#C0C0C0',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: color,
          marginBottom: '0.25rem',
        }}
      >
        {value}
      </div>
      {unit && (
        <div
          style={{
            fontSize: '0.85rem',
            color: '#999',
            marginTop: '0.5rem',
          }}
        >
          {unit}
        </div>
      )}
    </div>
  );
}
