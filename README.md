# 🌐 GlobalYield Analytics — Cross-Border Real Estate Comparison Platform

> **Advanced multi-currency real estate financial modeling platform for global property investors, fund managers, and international buyers.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-sky.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-purple.svg)](https://vitejs.dev/)

<p center>
  <img src="https://raw.githubusercontent.com/greatiyke/GlobalYieldAnalytics/main/public/hero_banner.png" alt="GlobalYield Analytics Platform" width="100%" />
</p>

---

## 📌 Executive Overview

Investing in real estate across international borders presents unique financial complexities—ranging from **foreign exchange (FX) rate volatility** and **purchasing power parity drift** to **jurisdiction-specific tax friction** (Stamp Duty, non-resident surcharges, building depreciation allowances, and Capital Gains Tax).

**GlobalYield Analytics** solves these challenges by providing a normalized, real-time side-by-side financial comparison engine. Investors can compare property acquisitions across global markets in their own native **Base Currency** (USD, EUR, GBP, JPY, AED, SGD, AUD, CAD, CHF, IDR) while accurately accounting for local mortgage debt leverage, operating expense reserves, local tax laws, and macro scenario stress testing.

---

## ✨ Key Features & Capabilities

### 1. 💱 Multi-Currency & Base Currency Normalization
- **Spot & FX Drift Modeling**: Seamlessly convert cash flows and terminal proceeds into your primary Base Currency.
- **Purchasing Power Parity (PPP)**: Model currency appreciation or depreciation rates relative to inflation differentials over 1 to 30-year holding horizons.

### 2. 🏛️ Jurisdiction-Specific Tax & Friction Engine
- **Acquisition Friction**: Calculates Stamp Duty (e.g., UK SDLT, Spain ITP), Foreign Buyer Surcharges (e.g., Singapore ABSD 60%, UK non-resident +2%), Legal/Survey fees, and Agent commissions.
- **Operating Taxes & Tax Shields**: Factors in progressive or flat rental income tax rates, allowable annual building depreciation tax deductions (e.g., US IRS 27.5-year straight-line, Japan RC 3.5%), mortgage interest tax deductibility, and local property taxes (e.g., US ~1.5%, Japan 1.4%, Dubai 0%).
- **Capital Gains Tax (CGT)**: Models exit CGT rates, holding period exemption thresholds, and foreign investor withholding rules.

### 3. 📊 Advanced Financial Return Metrics
- **Levered & Unlevered IRR**: Uses high-precision Newton-Raphson and binary search algorithms for multi-year internal rate of return computations.
- **Net Present Value (NPV)**: Discounted cash flow valuation at benchmark discount rates (7.0%).
- **Cash-on-Cash Return**: Year 1 net cash flow relative to total cash invested.
- **Net Rental Yield & Cap Rate**: True Net Operating Income (NOI) yield factoring in vacancy allowances, HOA, management, maintenance reserves, and property tax.
- **Equity Multiple & DSCR**: Total return multiple and Debt Service Coverage Ratio.

### 4. 🌍 Built-In Global Market Presets
Pre-configured, fully editable macroeconomic, leverage, and tax profiles for key international hubs:
- 🇺🇸 **Miami, USA** (`USD`): Waterfront condo | ~7.6% Gross yield | IRS depreciation tax shield.
- 🇬🇧 **London, UK** (`GBP`): Central London flat | SDLT + Overseas buyer surcharge | Interest-only mortgage.
- 🇦🇪 **Dubai, UAE** (`AED`): Downtown Marina apartment | 0% Income Tax | 0% Capital Gains Tax | AED pegged to USD.
- 🇯🇵 **Tokyo, Japan** (`JPY`): Roppongi residence | Low mortgage interest rate (2.2%) | Fixed asset tax.
- 🇵🇹 **Lisbon, Portugal** (`EUR`): Chiado flat | IMT buyer tax | Flat 25% non-resident rental income tax.
- 🇸🇬 **Singapore** (`SGD`): Orchard residence | 60% ABSD foreign buyer tax barrier | Zero CGT stability.
- 🇪🇸 **Madrid, Spain** (`EUR`): Chamberí flat | 6% ITP tax | 24% non-resident tax rate.
- 🇮🇩 **Bali, Indonesia** (`USD/IDR`): Luxury villa | Managed holiday rental model (13.4% gross yield).

### 5. 📈 Interactive Charts & Sensitivity Heatmaps
- **Cash Flow Waterfall Chart**: Visual breakdown of Gross Rent → OpEx → Debt Service → Taxes → Net Distributable Cash.
- **Equity Build-Up Chart**: Property valuation growth vs loan principal paydown vs net investor equity.
- **2D Sensitivity Heatmap**: Stress-tests Levered IRR across a grid of FX movement (-15% to +15%) vs Property Appreciation (-5% to +12%).
- **Macro Scenario Switcher**: One-click toggling between **Bull**, **Base**, and **Bear** economic scenarios.

### 6. 📄 Report Memorandums & Export Options
- **Investment Pitch Book Memorandum**: Full-screen printable PDF memorandum generator (`html2canvas` + `jsPDF`) with executive summary cards and tax risk profiles.
- **Raw CSV Export**: Export year-by-year income statement schedules to Excel or Google Sheets.

---

## 📐 Financial Modeling Formulas

### 1. Acquisition Cost & Initial Equity
$$\text{Total Acquisition Friction} = \text{Stamp Duty} + \text{Non-Resident Surcharge} + \text{Legal/Notary} + \text{Agent Fee}$$
$$\text{Total Cost} = \text{Purchase Price} + \text{Total Acquisition Friction}$$
$$\text{Equity Invested} = \text{Total Cost} - \text{Loan Amount}$$

### 2. Debt Service & Amortization
For fixed-rate amortizing mortgages with annual interest rate $r_a$ and loan term $n$ years:
$$m = \frac{r_a}{12}, \quad N = 12 \times n$$
$$\text{Monthly Debt Service} = \text{Loan Amount} \times \left[ \frac{m(1+m)^N}{(1+m)^N - 1} \right]$$

### 3. Net Operating Income (NOI)
$$\text{Effective Gross Rent}_t = \text{Gross Rent}_t \times (1 - \text{Vacancy Rate})$$
$$\text{NOI}_t = \text{Effective Gross Rent}_t - \text{OpEx}_t - \text{Property Tax}_t$$

### 4. Taxable Rental Income & Tax Shield
$$\text{Depreciation Shield}_t = \text{Purchase Price} \times 0.80 \times \text{Depreciation Rate}$$
$$\text{Taxable Income}_t = \max(0, \text{NOI}_t - \text{Deductible Interest}_t - \text{Depreciation Shield}_t)$$
$$\text{Rental Tax}_t = \text{Taxable Income}_t \times \text{Income Tax Rate}$$

### 5. Multi-Currency Internal Rate of Return (IRR)
The Levered IRR in Base Currency is the discount rate $R$ that satisfies:
$$0 = -\text{Equity Invested}_{\text{Base}} + \sum_{t=1}^{n} \frac{\text{Net Cash Flow}_{\text{Base}, t}}{(1+R)^t} + \frac{\text{Exit Proceeds}_{\text{Base}}}{(1+R)^n}$$

---

## 🛠️ Tech Stack & Architecture

- **Frontend Core**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + Custom Glassmorphism design system + Lucide Icons
- **Visualizations**: Recharts (`ResponsiveContainer`, `BarChart`, `AreaChart`, `Tooltip`)
- **Export Engine**: `html2canvas` + `jsPDF` for PDF Memos, Canvas Confetti for interactions, custom Blob CSV generator

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or higher)
- npm (v9.0 or higher)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/greatiyke/GlobalYieldAnalytics.git
   cd GlobalYieldAnalytics
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Repository Structure

```
GlobalYieldAnalytics/
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── types/
│   │   └── realEstate.ts            # Core TypeScript interfaces
│   ├── data/
│   │   └── marketPresets.ts         # 8 global market profiles & currency definitions
│   ├── utils/
│   │   ├── financialCalculations.ts # IRR, NPV, Cash-on-Cash, Amortization, Tax & Sensitivity engine
│   │   ├── currencyConverter.ts     # Multi-currency conversion & PPP FX drift
│   │   ├── exportPdf.ts             # Pitch Book PDF memorandum exporter
│   │   └── exportCsv.ts             # CSV financial schedule exporter
│   └── components/
│       ├── Header.tsx               # Brand, base currency, macro scenario toggles
│       ├── MarketSelector.tsx       # Preset selector chips & custom property builder
│       ├── ComparisonGrid.tsx       # Normalized side-by-side comparison matrix
│       ├── PropertyCard.tsx         # Property overview, specs & parameter drawer
│       ├── PropertyEditorModal.tsx  # 6-tab modal for parameter & tax structure editing
│       ├── FinancialCharts.tsx      # Cash Flow Waterfall, Equity Build-Up, IRR Benchmarks
│       ├── SensitivityHeatmap.tsx   # 2D FX drift vs appreciation matrix
│       ├── CashFlowTable.tsx        # Multi-year cash flow schedule table
│       └── InvestmentMemoModal.tsx  # Printable PDF investment memo modal
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
