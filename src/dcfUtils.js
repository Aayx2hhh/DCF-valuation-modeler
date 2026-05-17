export function calcDCF(inputs) {
  const {
    rev0, ebitdaPct, daPct, capexPct, nwcPct,
    g0, wacc, tgr, taxRate, netDebt, shares,
  } = inputs;
  const N = 10;

  const rows = [];
  let rev = rev0;

  for (let i = 1; i <= N; i++) {
    const decay = (N - i) / (N - 1);
    const gRate = g0 * decay + tgr * (1 - decay);
    rev = i === 1 ? rev0 * (1 + g0) : rev * (1 + gRate);

    const ebitda   = rev * ebitdaPct;
    const da       = rev * daPct;
    const ebit     = ebitda - da;
    const nopat    = ebit * (1 - taxRate);
    const capex    = rev * capexPct;
    const deltaNwc = rev * nwcPct * (i === 1 ? 1 : (rev / rows[i - 2].rev - 1));
    const fcf      = nopat + da - capex - deltaNwc;
    const df       = 1 / Math.pow(1 + wacc, i);
    const pv       = fcf * df;

    rows.push({ yr: i, rev, ebitda, da, ebit, nopat, capex, deltaNwc, fcf, df, pv, gRate });
  }

  const lastFCF = rows[N - 1].fcf;
  const tv      = lastFCF * (1 + tgr) / (wacc - tgr);
  const pvTV    = tv * rows[N - 1].df;
  const npvFCF  = rows.reduce((s, r) => s + r.pv, 0);
  const ev      = npvFCF + pvTV;
  const equity  = ev - netDebt;
  const pricePerShare = equity / shares;

  const yr1Ebitda  = rows[0].ebitda;
  const evEbitdaMult = ev / yr1Ebitda;
  const evRevMult    = ev / rows[0].rev;

  return { rows, tv, pvTV, npvFCF, ev, equity, pricePerShare, evEbitdaMult, evRevMult };
}

export function calcScenarioEV(inputs, g0Override, waccOverride, tgrOverride) {
  const {
    rev0, ebitdaPct, daPct, capexPct, nwcPct, taxRate,
  } = inputs;
  const N  = 10;
  const g0 = g0Override;
  const wk = waccOverride;
  const tg = tgrOverride;

  if (wk <= tg) return null;

  let rev = rev0;
  let npv = 0;

  for (let i = 1; i <= N; i++) {
    const decay = (N - i) / (N - 1);
    const gr    = g0 * decay + tg * (1 - decay);
    rev = i === 1 ? rev0 * (1 + g0) : rev * (1 + gr);
    const fcf = rev * ebitdaPct * (1 - taxRate) + rev * daPct - rev * capexPct - rev * nwcPct * 0.3;
    npv += fcf / Math.pow(1 + wk, i);
  }

  const lastFcf = rev * ebitdaPct * (1 - taxRate) + rev * daPct - rev * capexPct - rev * nwcPct * 0.3;
  const tv      = lastFcf * (1 + tg) / (wk - tg);
  const pvTV    = tv / Math.pow(1 + wk, N);

  return npv + pvTV;
}

export const SCENARIOS = {
  bear: { rev: 300, ebitda: 15, da: 6, capex: 12, nwc: 5, growth: 5,  wacc: 13, tgr: 2, tax: 28, debt: 200, shares: 50 },
  base: { rev: 500, ebitda: 25, da: 5, capex: 8,  nwc: 3, growth: 15, wacc: 10, tgr: 3, tax: 25, debt: 100, shares: 50 },
  bull: { rev: 700, ebitda: 35, da: 4, capex: 6,  nwc: 2, growth: 25, wacc: 8,  tgr: 4, tax: 22, debt: 50,  shares: 50 },
};

export function fmt(n, dec = 1) {
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(dec) + 'B';
  return n.toFixed(dec) + 'M';
}

export function fmtShare(n) { return '$' + n.toFixed(2); }
export function fmtPct(n)   { return n.toFixed(1) + '%'; }
export function fmtMult(n)  { return n.toFixed(1) + 'x'; }
