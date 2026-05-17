import { fmt, fmtPct, fmtMult } from '../dcfUtils';

function MetricCard({ label, value, sub, valueColor = 'var(--text)', showBar, barPct }) {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '12px 14px',
    }}>
      <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--mono)', color: valueColor }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', marginTop: 3, color: 'var(--amber)' }}>
          {sub}
        </div>
      )}
      {showBar && (
        <div style={{ height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden', marginTop: 6 }}>
          <div style={{
            height: '100%', borderRadius: 3,
            background: 'linear-gradient(90deg, var(--accent), var(--green))',
            width: `${Math.min(100, barPct)}%`, transition: 'width 0.5s ease',
          }} />
        </div>
      )}
    </div>
  );
}

export default function MetricsGrid({ result, rev0 }) {
  if (!result) return null;
  const { rows, npvFCF, pvTV, ev, equity } = result;
  const fcf1  = rows[0].fcf;
  const fcf5  = rows[4].fcf;
  const rev5  = rows[4].rev;
  const pe    = equity / fcf1;
  const barPct = (rev5 / rev0 / 3) * 100;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: '1.5rem' }}>
      <MetricCard
        label="FCF Yr 1"
        value={fmt(fcf1, 0)}
        sub={fmtPct(fcf1 / ev * 100) + ' yield'}
        valueColor="var(--green)"
      />
      <MetricCard
        label="NPV FCFs"
        value={fmt(npvFCF, 0)}
        sub={fmtPct(npvFCF / ev * 100) + '% of EV'}
        valueColor="var(--accent)"
      />
      <MetricCard
        label="Terminal Val."
        value={fmt(pvTV, 0)}
        sub={fmtPct(pvTV / ev * 100) + '% of EV'}
        valueColor="var(--amber)"
      />
      <MetricCard
        label="Yr 5 Revenue"
        value={fmt(rev5, 0)}
        showBar
        barPct={barPct}
      />
      <MetricCard
        label="Yr 5 FCF"
        value={fmt(fcf5, 0)}
        sub={fmtPct(fcf5 / rev5 * 100) + '% margin'}
        valueColor="var(--green)"
      />
      <MetricCard
        label="Implied P/E"
        value={pe > 0 ? fmtMult(pe) : 'N/A'}
        sub="on Yr1 FCF"
        valueColor="var(--amber)"
      />
    </div>
  );
}
