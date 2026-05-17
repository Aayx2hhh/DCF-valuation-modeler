# DCF Valuation Studio

A professional-grade **Discounted Cash Flow (DCF) valuation tool** built with React + Vite. Model any company's intrinsic value with real-time sensitivity analysis, scenario planning, and interactive charts — all in a sleek dark terminal-inspired UI.

![DCF Valuation Studio](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react) ![Recharts](https://img.shields.io/badge/Recharts-3.8-22B5BF?style=flat) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat&logo=vite) ![License](https://img.shields.io/badge/license-MIT-green?style=flat)

---

## Features

### Valuation Engine
- **10-year FCF projection** with realistic growth decay — initial growth rate fades linearly toward the terminal rate over the projection period
- **Gordon Growth Model** terminal value calculation
- **WACC discounting** with per-year discount factors
- Live **Enterprise Value**, **Equity Value**, and **Price Per Share** output

### Scenario Planning
- One-click **Bear / Base / Bull** presets that load realistic full parameter sets
- Instant scenario comparison row showing EV across all three cases
- **EV/EBITDA** and **EV/Revenue** multiples calculated live

### Sensitivity Analysis
- **WACC × Terminal Growth Rate** heat map — equity value per share
- **WACC × Revenue Growth** heat map — enterprise value
- Color-coded cells (red → neutral → green) with active scenario highlighted

### Charts & Visualizations
- **Free Cash Flow chart** — PV of FCF, nominal FCF, and revenue overlay (bar + line combo)
- **Margin trend chart** — EBITDA margin vs FCF margin over 10 years
- **EV Bridge waterfall** — decomposition of FCF chunks + terminal value into total EV
- **Full DCF schedule table** — every line item across all 10 years

### Inputs
| Input | Range |
|---|---|
| Base Revenue | Any ($M) |
| EBITDA Margin | 5% – 60% |
| D&A as % of Revenue | 1% – 20% |
| Capex as % of Revenue | 1% – 30% |
| Change in NWC as % of Revenue | 0% – 15% |
| Revenue Growth Rate (Yr 1–5) | 0% – 50% |
| WACC | 4% – 25% |
| Terminal Growth Rate | 0% – 6% |
| Effective Tax Rate | 0% – 40% |
| Net Debt | Any ($M) |
| Shares Outstanding | Any (M) |

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/Aayx2hhh/DCF-valuation-modeler.git

# Enter the project directory
cd DCF-valuation-modeler

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── App.jsx                     # Main layout, state management, tab routing
├── dcfUtils.js                 # DCF math: calcDCF, scenario helpers, formatters
├── index.css                   # Global styles & CSS custom properties
└── components/
    ├── SliderField.jsx         # Range slider input with live value display
    ├── NumberField.jsx         # Text-based numeric input (no type=number bugs)
    ├── ValuationPanel.jsx      # Hero EV card with scenario range row
    ├── MetricsGrid.jsx         # 6-card metrics summary (FCF, NPV, TV, P/E...)
    ├── CashFlowCharts.jsx      # FCF bar+line chart & margin trend chart
    ├── WaterfallChart.jsx      # EV bridge waterfall
    ├── SensitivityTables.jsx   # Two heat-map sensitivity tables
    └── DCFSchedule.jsx         # Full 10-year DCF line-item table
```

---

## How the Model Works

1. **Revenue Projection** — Base revenue grows at the input rate in Year 1. From Year 2–10, the growth rate decays linearly toward the terminal growth rate, mimicking a maturing business.

2. **Free Cash Flow** — Each year:
   ```
   FCF = NOPAT + D&A − Capex − ΔWorking Capital
   NOPAT = EBIT × (1 − Tax Rate)
   EBIT  = EBITDA − D&A
   ```

3. **Discounting** — Each FCF is discounted back using:
   ```
   PV = FCF / (1 + WACC)^t
   ```

4. **Terminal Value** — Gordon Growth Model applied to Year 10 FCF:
   ```
   TV = FCF₁₀ × (1 + TGR) / (WACC − TGR)
   ```

5. **Enterprise Value** — Sum of all discounted FCFs plus the PV of terminal value:
   ```
   EV = Σ PV(FCF) + PV(TV)
   ```

6. **Equity Value & Share Price**:
   ```
   Equity Value    = EV − Net Debt
   Price Per Share = Equity Value / Shares Outstanding
   ```

---

## Tech Stack

- **React 19** — UI framework
- **Vite 8** — build tool & dev server
- **Recharts 3** — charting library
- **DM Mono + Syne** — typography (Google Fonts)

---

## License

MIT — free to use, modify, and distribute.

---

*Built with React + Vite. Designed for finance professionals, students, and anyone who wants to understand intrinsic value.*
