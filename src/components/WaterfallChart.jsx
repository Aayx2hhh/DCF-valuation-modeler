import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { fmt } from '../dcfUtils';

const TOOLTIP_STYLE = {
  backgroundColor: '#1a1a24', border: '1px solid #3a3a50',
  borderRadius: 8, color: '#eeeef4', fontSize: 12, fontFamily: 'var(--mono)',
};

export default function WaterfallChart({ result }) {
  if (!result) return null;
  const { rows, pvTV, ev } = result;

  const data = [];
  let cumulative = 0;
  for (let i = 0; i < 10; i += 2) {
    const chunk = rows.slice(i, i + 2).reduce((s, r) => s + r.pv, 0);
    data.push({ name: `Yr ${i + 1}–${i + 2}`, value: chunk, start: cumulative, type: 'fcf' });
    cumulative += chunk;
  }
  data.push({ name: 'Terminal PV', value: pvTV, start: cumulative, type: 'tv' });
  cumulative += pvTV;
  data.push({ name: 'Enterprise Value', value: ev, start: 0, type: 'total' });

  const colors = { fcf: 'rgba(124,110,255,0.6)', tv: 'rgba(46,204,138,0.6)', total: 'rgba(245,166,35,0.7)' };

  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: '1.25rem', marginBottom: '1.25rem',
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>EV Bridge — Value Decomposition</div>
      <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: '1rem' }}>
        How each component contributes to total enterprise value
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="name" tick={{ fill: '#7878a0', fontSize: 11, fontFamily: 'DM Mono' }} />
          <YAxis tick={{ fill: '#7878a0', fontSize: 10, fontFamily: 'DM Mono' }} tickFormatter={v => `$${v.toFixed(0)}M`} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v, name, props) => {
              const d = props.payload;
              const actual = d.type === 'total' ? d.value : d.value;
              return [`$${actual.toFixed(0)}M`, d.name];
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={colors[entry.type]} stroke={colors[entry.type].replace('0.6', '0.9').replace('0.7', '0.9')} strokeWidth={1} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
