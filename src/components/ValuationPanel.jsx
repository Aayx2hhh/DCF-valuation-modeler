import { fmt, fmtShare, fmtMult, fmtPct } from '../dcfUtils';

export default function ValuationPanel({ result, scenarioEVs }) {
  if (!result) return null;
  const { ev, equity, pricePerShare, evEbitdaMult, evRevMult } = result;
  const suffix = ev >= 1000 ? 'B' : 'M';
  const displayNum = ev >= 1000 ? (ev / 1000).toFixed(1) : ev.toFixed(0);

  return (
    <div className="animate-in" style={{
      background: 'linear-gradient(135deg, rgba(124,110,255,0.1), rgba(46,204,138,0.05))',
      border: '1px solid rgba(124,110,255,0.25)',
      borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: -30, right: -30, width: 120, height: 120,
        background: 'radial-gradient(circle, rgba(124,110,255,0.15), transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
        Enterprise Value
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
        <span style={{ fontSize: 24, color: 'var(--accent)', marginRight: 4 }}>$</span>
        <span style={{ fontSize: 42, fontWeight: 800, letterSpacing: -2, color: 'var(--text)', lineHeight: 1 }}>
          {displayNum}
        </span>
        <span style={{ fontSize: 20, color: 'var(--muted)', marginLeft: 6, fontFamily: 'var(--mono)' }}>{suffix}</span>
      </div>

      <div style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'var(--mono)', marginTop: 8 }}>
        Equity Value: {fmt(equity, 0)} &nbsp;|&nbsp; Per Share: {fmtShare(pricePerShare)}
      </div>

      <div style={{ display: 'flex', gap: 16, marginTop: 12, flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--label)', fontFamily: 'var(--mono)', letterSpacing: 1, textTransform: 'uppercase' }}>Bear</div>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--mono)', marginTop: 2, color: 'var(--red)' }}>
            {scenarioEVs?.bear ? fmt(scenarioEVs.bear, 0) : '—'}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--label)', fontFamily: 'var(--mono)', letterSpacing: 1, textTransform: 'uppercase' }}>Base</div>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--mono)', marginTop: 2, color: 'var(--accent)' }}>
            {fmt(ev, 0)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--label)', fontFamily: 'var(--mono)', letterSpacing: 1, textTransform: 'uppercase' }}>Bull</div>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--mono)', marginTop: 2, color: 'var(--green)' }}>
            {scenarioEVs?.bull ? fmt(scenarioEVs.bull, 0) : '—'}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginLeft: 'auto' }}>
          <div style={{ fontSize: 10, color: 'var(--label)', fontFamily: 'var(--mono)', letterSpacing: 1, textTransform: 'uppercase' }}>EV/EBITDA</div>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--mono)', marginTop: 2, color: 'var(--amber)' }}>
            {fmtMult(evEbitdaMult)}
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 10, color: 'var(--label)', fontFamily: 'var(--mono)', letterSpacing: 1, textTransform: 'uppercase' }}>EV/Revenue</div>
          <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--mono)', marginTop: 2, color: 'var(--amber)' }}>
            {fmtMult(evRevMult)}
          </div>
        </div>
      </div>
    </div>
  );
}
