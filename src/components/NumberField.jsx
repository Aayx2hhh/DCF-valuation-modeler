import { useState, useEffect } from 'react';

export default function NumberField({ label, prefix, value, min = 0, step = 1, onChange }) {
  const [display, setDisplay] = useState(String(value));

  useEffect(() => {
    // Only sync from outside if not focused
    setDisplay(String(value));
  }, [value]);

  function handleChange(e) {
    const raw = e.target.value;
    setDisplay(raw);
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) onChange(parsed);
  }

  function handleBlur() {
    const parsed = parseFloat(display);
    if (isNaN(parsed)) {
      setDisplay(String(value));
    } else {
      const clamped = min !== undefined ? Math.max(min, parsed) : parsed;
      onChange(clamped);
      setDisplay(String(clamped));
    }
  }

  return (
    <div>
      <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: 6 }}>
        {label}
      </div>
      <div
        style={{
          background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8,
          padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6,
          transition: 'border-color 0.2s',
        }}
        onFocus={e => e.currentTarget.style.borderColor = 'var(--accent)'}
        onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
      >
        {prefix && (
          <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{prefix}</span>
        )}
        <input
          type="text"
          inputMode="decimal"
          value={display}
          onChange={handleChange}
          onFocus={e => e.target.select()}
          onBlur={handleBlur}
          style={{
            background: 'none', border: 'none', outline: 'none',
            color: 'var(--text)', fontFamily: 'var(--mono)', fontSize: 14,
            width: '100%', fontWeight: 500,
          }}
        />
      </div>
    </div>
  );
}
