import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LineChart, Legend,
} from 'recharts';

const TOOLTIP_STYLE = {
  backgroundColor: '#1a1a24', border: '1px solid #3a3a50',
  borderRadius: 8, color: '#eeeef4', fontSize: 12, fontFamily: 'var(--mono)',
};

export default function CashFlowCharts({ rows }) {
  if (!rows) return null;

  const data = rows.map(r => ({
    name: `Yr ${r.yr}`,
    revenue: parseFloat(r.rev.toFixed(1)),
    nomFCF: parseFloat(r.fcf.toFixed(1)),
    pvFCF:  parseFloat(r.pv.toFixed(1)),
    ebitdaMargin: parseFloat((r.ebitda / r.rev * 100).toFixed(1)),
    fcfMargin:    parseFloat((r.fcf   / r.rev * 100).toFixed(1)),
  }));

  return (
    <>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '1.25rem', marginBottom: '1.25rem',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Free Cash Flow Projection</div>
        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: '1rem' }}>
          10-year FCF with revenue overlay — nominal values
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(124,110,255,0.6)', display: 'inline-block' }} />
            PV of FCF
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(46,204,138,0.5)', display: 'inline-block' }} />
            Nominal FCF
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 24, height: 2, background: '#7878a0', display: 'inline-block' }} />
            Revenue
          </span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fill: '#4a4a68', fontSize: 11, fontFamily: 'DM Mono' }} />
            <YAxis yAxisId="left"  tick={{ fill: '#7878a0', fontSize: 10, fontFamily: 'DM Mono' }} tickFormatter={v => `$${v}M`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#4a4a68', fontSize: 10, fontFamily: 'DM Mono' }} tickFormatter={v => `$${v}M`} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, name) => [`$${v}M`, name]} />
            <Bar yAxisId="left" dataKey="pvFCF"  name="PV of FCF"    fill="rgba(124,110,255,0.25)" stroke="rgba(124,110,255,0.6)"  strokeWidth={1} radius={[4,4,0,0]} />
            <Bar yAxisId="left" dataKey="nomFCF" name="Nominal FCF"  fill="rgba(46,204,138,0.18)"  stroke="rgba(46,204,138,0.5)"   strokeWidth={1} radius={[4,4,0,0]} />
            <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue" stroke="#7878a0" strokeWidth={1.5} strokeDasharray="4 3" dot={{ r: 2, fill: '#7878a0' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '1.25rem', marginBottom: '1.25rem',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>FCF Margin & EBITDA Margin Trend</div>
        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: '1rem' }}>
          Operating leverage over projection period
        </div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 24, height: 2, background: '#f5a623', display: 'inline-block' }} />
            EBITDA Margin
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 24, height: 2, background: '#2ecc8a', display: 'inline-block', borderTop: '2px dashed #2ecc8a' }} />
            FCF Margin
          </span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="name" tick={{ fill: '#4a4a68', fontSize: 11, fontFamily: 'DM Mono' }} />
            <YAxis tick={{ fill: '#7878a0', fontSize: 10, fontFamily: 'DM Mono' }} tickFormatter={v => `${v}%`} />
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(v, name) => [`${v}%`, name]} />
            <Line type="monotone" dataKey="ebitdaMargin" name="EBITDA Margin" stroke="#f5a623" strokeWidth={2} dot={{ r: 3, fill: '#f5a623' }} />
            <Line type="monotone" dataKey="fcfMargin"    name="FCF Margin"    stroke="#2ecc8a" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3, fill: '#2ecc8a' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
