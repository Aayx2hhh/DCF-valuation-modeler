import { useState, useMemo } from 'react';
import { calcDCF, calcScenarioEV, SCENARIOS } from './dcfUtils';
import SliderField from './components/SliderField';
import NumberField from './components/NumberField';
import ValuationPanel from './components/ValuationPanel';
import MetricsGrid from './components/MetricsGrid';
import CashFlowCharts from './components/CashFlowCharts';
import WaterfallChart from './components/WaterfallChart';
import SensitivityTables from './components/SensitivityTables';
import DCFSchedule from './components/DCFSchedule';

const TABS = [
  { id: 'cashflows',   label: 'Cash Flows' },
  { id: 'waterfall',   label: 'Waterfall' },
  { id: 'sensitivity', label: 'Sensitivity' },
  { id: 'schedule',    label: 'DCF Schedule' },
];

const SECTION_LABEL = {
  fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--label)',
  letterSpacing: 3, textTransform: 'uppercase', marginBottom: '1rem',
  display: 'flex', alignItems: 'center', gap: 8,
};

export default function App() {
  const [activeTab,      setActiveTab]      = useState('cashflows');
  const [activeScenario, setActiveScenario] = useState('base');

  const [rev,    setRev]    = useState(500);
  const [ebitda, setEbitda] = useState(25);
  const [da,     setDa]     = useState(5);
  const [capex,  setCapex]  = useState(8);
  const [nwc,    setNwc]    = useState(3);
  const [growth, setGrowth] = useState(15);
  const [wacc,   setWacc]   = useState(10);
  const [tgr,    setTgr]    = useState(3);
  const [tax,    setTax]    = useState(25);
  const [debt,   setDebt]   = useState(100);
  const [shares, setShares] = useState(50);

  const inputs = useMemo(() => ({
    rev0:      rev,
    ebitdaPct: ebitda / 100,
    daPct:     da     / 100,
    capexPct:  capex  / 100,
    nwcPct:    nwc    / 100,
    g0:        growth / 100,
    wacc:      wacc   / 100,
    tgr:       tgr    / 100,
    taxRate:   tax    / 100,
    netDebt:   debt,
    shares,
  }), [rev, ebitda, da, capex, nwc, growth, wacc, tgr, tax, debt, shares]);

  const result = useMemo(() => {
    if (inputs.wacc <= inputs.tgr) return null;
    return calcDCF(inputs);
  }, [inputs]);

  const scenarioEVs = useMemo(() => ({
    bear: calcScenarioEV(inputs, Math.max(0, inputs.g0 - 0.07), inputs.wacc + 0.02, Math.max(0, inputs.tgr - 0.01)),
    bull: calcScenarioEV(inputs, inputs.g0 + 0.07, Math.max(0.04, inputs.wacc - 0.02), inputs.tgr + 0.01),
  }), [inputs]);

  function loadScenario(type) {
    setActiveScenario(type);
    const s = SCENARIOS[type];
    setRev(s.rev); setEbitda(s.ebitda); setDa(s.da);
    setCapex(s.capex); setNwc(s.nwc); setGrowth(s.growth);
    setWacc(s.wacc); setTgr(s.tgr); setTax(s.tax);
    setDebt(s.debt); setShares(s.shares);
  }

  const scenarioBtnBase = {
    flex: 1, padding: '8px', border: '1px solid var(--border)',
    background: 'var(--surface2)', borderRadius: 10,
    fontSize: 12, fontFamily: 'var(--mono)', cursor: 'pointer',
    textAlign: 'center', transition: 'all 0.2s',
  };

  function scenarioStyle(type) {
    if (activeScenario !== type) return { ...scenarioBtnBase, color: 'var(--muted)' };
    const colors = {
      bear:  { background: 'rgba(255,95,107,0.1)',    border: '1px solid var(--red)',    color: 'var(--red)'    },
      base:  { background: 'rgba(124,110,255,0.12)',  border: '1px solid var(--accent)', color: 'var(--accent)' },
      bull:  { background: 'rgba(46,204,138,0.1)',    border: '1px solid var(--green)',  color: 'var(--green)'  },
    };
    return { ...scenarioBtnBase, ...colors[type] };
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: 'var(--display)' }}>

      {/* Header */}
      <div style={{
        padding: '2rem 2.5rem 1rem', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)', letterSpacing: -1 }}>DCF</span>
          <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: 2, textTransform: 'uppercase' }}>
            Valuation Studio
          </span>
        </div>
        <span style={{
          background: 'rgba(124,110,255,0.12)', border: '1px solid rgba(124,110,255,0.3)',
          color: 'var(--accent)', fontSize: 11, fontFamily: 'var(--mono)',
          padding: '4px 12px', borderRadius: 20, letterSpacing: 1,
        }}>
          BETA v2.0
        </span>
      </div>

      {/* Two-column layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', minHeight: 'calc(100vh - 73px)' }}>

        {/* LEFT PANEL */}
        <div style={{
          borderRight: '1px solid var(--border)', padding: '1.5rem',
          overflowY: 'auto', background: 'var(--surface)',
        }}>

          {/* Scenario */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={SECTION_LABEL}>
              Scenario
              <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['bear', 'base', 'bull'].map(t => (
                <div key={t} style={scenarioStyle(t)} onClick={() => loadScenario(t)}>
                  {t === 'bear' ? '🐻' : t === 'base' ? '⚖️' : '🐂'} {t.charAt(0).toUpperCase() + t.slice(1)}
                </div>
              ))}
            </div>
          </div>

          {/* Fundamentals */}
          <div style={SECTION_LABEL}>
            Company Fundamentals
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <NumberField label="Base Revenue ($M)" prefix="$" value={rev} min={1} onChange={setRev} />
          </div>

          <SliderField label="EBITDA Margin"          id="ebitda" min={5}  max={60} value={ebitda} onChange={setEbitda} />
          <SliderField label="D&A as % of Revenue"    id="da"     min={1}  max={20} value={da}     onChange={setDa} />
          <SliderField label="Capex as % of Revenue"  id="capex"  min={1}  max={30} value={capex}  onChange={setCapex} />
          <SliderField label="Change in NWC as % Rev" id="nwc"    min={0}  max={15} value={nwc}    onChange={setNwc} />

          {/* Growth & Discount */}
          <div style={{ ...SECTION_LABEL, marginTop: '1.5rem' }}>
            Growth &amp; Discount Rate
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <SliderField
              label="Revenue Growth Rate (Yr 1–5)" id="growth"
              min={0} max={50} step={0.5} value={growth} onChange={setGrowth}
            />
            <div style={{ fontSize: 10, color: 'var(--label)', fontFamily: 'var(--mono)', marginTop: 3 }}>
              Growth decays linearly toward terminal rate over 10 years
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <SliderField label="WACC"             id="wacc" min={4} max={25} step={0.5} value={wacc} onChange={setWacc} />
            <SliderField label="Terminal Growth"  id="tgr"  min={0} max={6}  step={0.25} value={tgr} onChange={setTgr} />
          </div>

          {/* Capital Structure */}
          <div style={{ ...SECTION_LABEL, marginTop: '1.5rem' }}>
            Capital Structure
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: '1rem' }}>
            <NumberField label="Net Debt ($M)"    prefix="$" value={debt}   min={0}   onChange={setDebt} />
            <NumberField label="Shares Out. (M)"             value={shares} min={0.1} step={0.1} onChange={setShares} />
          </div>

          {/* Tax */}
          <div style={{ ...SECTION_LABEL, marginTop: '0.5rem' }}>
            Tax Rate
            <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>
          <SliderField label="Effective Tax Rate" id="tax" min={0} max={40} value={tax} onChange={setTax} />

        </div>

        {/* RIGHT PANEL */}
        <div style={{ padding: '1.5rem', overflowY: 'auto' }}>

          {!result && (
            <div style={{
              background: 'rgba(255,95,107,0.1)', border: '1px solid var(--red)',
              borderRadius: 12, padding: '1rem', marginBottom: '1rem',
              fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--red)',
            }}>
              ⚠ WACC must be greater than Terminal Growth Rate for a valid DCF.
            </div>
          )}

          <ValuationPanel result={result} scenarioEVs={scenarioEVs} />
          <MetricsGrid result={result} rev0={rev} />

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 4, marginBottom: '1.25rem',
            background: 'var(--surface2)', borderRadius: 10, padding: 4,
          }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
                flex: 1, padding: '7px 16px', borderRadius: 8,
                fontSize: 12, fontFamily: 'var(--mono)', cursor: 'pointer',
                border: 'none', transition: 'all 0.2s', letterSpacing: '0.5px',
                background: activeTab === tab.id ? 'var(--accent)' : 'none',
                color:      activeTab === tab.id ? '#fff'           : 'var(--muted)',
                fontWeight: activeTab === tab.id ? 500              : 400,
              }}>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'cashflows'   && <CashFlowCharts rows={result?.rows} />}
          {activeTab === 'waterfall'   && <WaterfallChart result={result} />}
          {activeTab === 'sensitivity' && <SensitivityTables inputs={inputs} result={result} />}
          {activeTab === 'schedule'    && <DCFSchedule rows={result?.rows} />}

        </div>
      </div>
    </div>
  );
}
