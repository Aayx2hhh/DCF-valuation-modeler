export default function SliderField({ label, id, min, max, value, step = 1, onChange }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)',
        marginBottom: 6, display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{label}</span>
      </div>
      <div style={{
        background: 'var(--surface2)', border: '1px solid var(--border)',
        borderRadius: 8, padding: '10px 14px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{label}</span>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 15, fontWeight: 500, color: 'var(--text)' }}>
            {value}%
          </span>
        </div>
        <input
          type="range"
          id={id}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
        />
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--label)',
          display: 'flex', justifyContent: 'space-between', marginTop: 4,
        }}>
          <span>{min}%</span>
          <span>{max}%</span>
        </div>
      </div>
    </div>
  );
}
