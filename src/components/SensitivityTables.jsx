import { fmtShare, fmt } from '../dcfUtils';

function cellClass(diff, base) {
  if (diff < -base * 0.15) return { background: 'rgba(255,95,107,0.12)', color: '#ff8f99' };
  if (diff >  base * 0.15) return { background: 'rgba(46,204,138,0.12)', color: '#2ecc8a' };
  return { background: 'rgba(124,110,255,0.12)', color: '#9d92ff' };
}

export default function SensitivityTables({ inputs, result }) {
  if (!result) return null;

  const { ev, equity } = result;
  const { wacc, tgr, g0, rev0, ebitdaPct, daPct, capexPct, nwcPct, taxRate, netDebt, shares } = inputs;
  const N = 10;

  function getSharePrice(w, tg) {
    if (w <= tg) return null;
    let rev = rev0, npv = 0;
    for (let i = 1; i <= N; i++) {
      const decay = (N - i) / (N - 1);
      const gr = g0 * decay + tg * (1 - decay);
      rev = i === 1 ? rev0 * (1 + g0) : rev * (1 + gr);
      const fcf = rev * ebitdaPct * (1 - taxRate) + rev * daPct - rev * capexPct - rev * nwcPct * 0.3;
      npv += fcf / Math.pow(1 + w, i);
    }
    const lf = rev * ebitdaPct * (1 - taxRate) + rev * daPct - rev * capexPct - rev * nwcPct * 0.3;
    const tv = lf * (1 + tg) / (w - tg);
    return (npv + tv / Math.pow(1 + w, N) - netDebt) / shares;
  }

  function getEV(w, g) {
    if (w <= tgr) return null;
    let rev = rev0, npv = 0;
    for (let i = 1; i <= N; i++) {
      const decay = (N - i) / (N - 1);
      const gr = g * decay + tgr * (1 - decay);
      rev = i === 1 ? rev0 * (1 + g) : rev * (1 + gr);
      const fcf = rev * ebitdaPct * (1 - taxRate) + rev * daPct - rev * capexPct - rev * nwcPct * 0.3;
      npv += fcf / Math.pow(1 + w, i);
    }
    const lf = rev * ebitdaPct * (1 - taxRate) + rev * daPct - rev * capexPct - rev * nwcPct * 0.3;
    const tv = lf * (1 + tgr) / (w - tgr);
    return npv + tv / Math.pow(1 + w, N);
  }

  const waccRange = [wacc - 0.04, wacc - 0.02, wacc, wacc + 0.02, wacc + 0.04];
  const tgrRange  = [tgr - 0.01, tgr, tgr + 0.01, tgr + 0.02, tgr + 0.03];
  const gRange    = [Math.max(0, g0 - 0.1), Math.max(0, g0 - 0.05), g0, g0 + 0.05, g0 + 0.1];
  const basePrice = (ev - netDebt) / shares;

  const thStyle = {
    background: 'var(--surface2)', padding: '8px 12px', textAlign: 'center',
    color: 'var(--muted)', fontWeight: 400, border: '1px solid var(--border)',
    fontFamily: 'var(--mono)', fontSize: 12,
  };
  const rowHeaderStyle = { ...thStyle, textAlign: 'center' };

  return (
    <>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '1.25rem', marginBottom: '1.25rem',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Sensitivity — Equity Value Per Share ($)</div>
        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: '1rem' }}>WACC vs Terminal Growth Rate</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={thStyle}>WACC \ TGR</th>
                {tgrRange.map((t, i) => <th key={i} style={thStyle}>{t >= 0 && t < 0.07 ? (t * 100).toFixed(2) + '%' : 'N/A'}</th>)}
              </tr>
            </thead>
            <tbody>
              {waccRange.map((w, wi) => (
                <tr key={wi}>
                  <td style={rowHeaderStyle}>{(w * 100).toFixed(1)}%</td>
                  {tgrRange.map((t, ti) => {
                    const sp = getSharePrice(w, t);
                    if (sp === null || sp < 0) return <td key={ti} style={{ ...thStyle, background: 'rgba(255,95,107,0.12)', color: '#ff8f99' }}>N/A</td>;
                    const isBase = Math.abs(w - wacc) < 0.001 && Math.abs(t - tgr) < 0.001;
                    const style = {
                      ...cellClass(sp - basePrice, basePrice),
                      padding: '8px 12px', textAlign: 'center',
                      border: '1px solid var(--border)', cursor: 'pointer',
                      outline: isBase ? '2px solid var(--accent)' : 'none',
                      borderRadius: isBase ? 4 : 0,
                    };
                    return <td key={ti} style={style}>{fmtShare(sp)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '1.25rem',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Sensitivity — WACC vs Revenue Growth</div>
        <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: '1rem' }}>Enterprise Value ($M)</div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--mono)', fontSize: 12 }}>
            <thead>
              <tr>
                <th style={thStyle}>WACC \ Growth</th>
                {gRange.map((g, i) => <th key={i} style={thStyle}>{(g * 100).toFixed(1)}%</th>)}
              </tr>
            </thead>
            <tbody>
              {waccRange.map((w, wi) => (
                <tr key={wi}>
                  <td style={rowHeaderStyle}>{(w * 100).toFixed(1)}%</td>
                  {gRange.map((g, gi) => {
                    const evv = getEV(w, g);
                    if (!evv) return <td key={gi} style={{ ...thStyle, background: 'rgba(255,95,107,0.12)', color: '#ff8f99' }}>N/A</td>;
                    const isBase = Math.abs(w - wacc) < 0.001 && Math.abs(g - g0) < 0.001;
                    const style = {
                      ...cellClass(evv - ev, ev),
                      padding: '8px 12px', textAlign: 'center',
                      border: '1px solid var(--border)', cursor: 'pointer',
                      outline: isBase ? '2px solid var(--accent)' : 'none',
                      borderRadius: isBase ? 4 : 0,
                    };
                    return <td key={gi} style={style}>{fmt(evv, 0)}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
