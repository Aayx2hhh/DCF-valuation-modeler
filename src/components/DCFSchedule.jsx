export default function DCFSchedule({ rows }) {
  if (!rows) return null;

  const lineItems = [
    { label: 'Revenue ($M)',       key: 'rev',      fmt: v => v.toFixed(0) },
    { label: 'EBITDA ($M)',        key: 'ebitda',   fmt: v => v.toFixed(0) },
    { label: 'D&A ($M)',           key: 'da',       fmt: v => v.toFixed(0) },
    { label: 'EBIT ($M)',          key: 'ebit',     fmt: v => v.toFixed(0) },
    { label: 'NOPAT ($M)',         key: 'nopat',    fmt: v => v.toFixed(0) },
    { label: '(-) Capex ($M)',     key: 'capex',    fmt: v => (-v).toFixed(0) },
    { label: '(-) ΔWorking Cap.', key: 'deltaNwc', fmt: v => (-v).toFixed(0) },
    { label: 'Growth Rate',        key: 'gRate',    fmt: v => (v * 100).toFixed(1) + '%' },
  ];

  const th = {
    padding: '8px 10px', textAlign: 'right', color: 'var(--muted)',
    fontWeight: 400, borderBottom: '1px solid var(--border)',
    fontSize: 11, letterSpacing: '0.5px', fontFamily: 'var(--mono)',
    whiteSpace: 'nowrap',
  };
  const td = {
    padding: '7px 10px', textAlign: 'right', fontFamily: 'var(--mono)',
    fontSize: 12, borderBottom: '1px solid rgba(255,255,255,0.04)',
  };

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '1.25rem',
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Full DCF Schedule</div>
      <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: '1rem' }}>
        10-year projection with discount factors
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>
              <th style={{ ...th, textAlign: 'left', minWidth: 140 }}>Line Item</th>
              {rows.map(r => <th key={r.yr} style={th}>Yr {r.yr}</th>)}
            </tr>
          </thead>
          <tbody>
            {lineItems.map(item => (
              <tr key={item.key} style={{ cursor: 'default' }}
                onMouseEnter={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background = 'rgba(255,255,255,0.02)')}
                onMouseLeave={e => Array.from(e.currentTarget.cells).forEach(c => c.style.background = '')}
              >
                <td style={{ ...td, textAlign: 'left', color: 'var(--muted)' }}>{item.label}</td>
                {rows.map(r => <td key={r.yr} style={td}>{item.fmt(r[item.key])}</td>)}
              </tr>
            ))}
            <tr>
              <td style={{ ...td, textAlign: 'left', color: 'var(--accent)', fontWeight: 500, borderTop: '1px solid var(--border)' }}>
                Free Cash Flow ($M)
              </td>
              {rows.map(r => (
                <td key={r.yr} style={{ ...td, color: 'var(--accent)', fontWeight: 500, borderTop: '1px solid var(--border)' }}>
                  {r.fcf.toFixed(0)}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ ...td, textAlign: 'left', color: 'var(--muted)' }}>Discount Factor</td>
              {rows.map(r => <td key={r.yr} style={{ ...td, color: 'var(--muted)' }}>{r.df.toFixed(3)}</td>)}
            </tr>
            <tr>
              <td style={{ ...td, textAlign: 'left', color: 'var(--green)', fontWeight: 600, borderTop: '1px solid var(--border2)' }}>
                PV of FCF ($M)
              </td>
              {rows.map(r => (
                <td key={r.yr} style={{ ...td, color: 'var(--green)', fontWeight: 600, borderTop: '1px solid var(--border2)' }}>
                  {r.pv.toFixed(0)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
