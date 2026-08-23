import React, { useState } from 'react';
import type { PropertyModel, FinancialMetrics, CurrencyCode } from '../types/realEstate';
import { formatCurrency } from '../utils/currencyConverter';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { BarChart3 } from 'lucide-react';

interface FinancialChartsProps {
  properties: PropertyModel[];
  metricsList: FinancialMetrics[];
  baseCurrency: CurrencyCode;
}

export const FinancialCharts: React.FC<FinancialChartsProps> = ({
  properties,
  metricsList,
  baseCurrency
}) => {
  const [activeTab, setActiveTab] = useState<'waterfall' | 'equity' | 'irr'>('waterfall');
  const [selectedPropertyIdx, setSelectedPropertyIdx] = useState<number>(0);

  if (properties.length === 0 || metricsList.length === 0) return null;

  const currentProperty = properties[selectedPropertyIdx] || properties[0];
  const currentMetrics = metricsList[selectedPropertyIdx] || metricsList[0];

  // Waterfall Chart Data Preparation (In Base Currency)
  const waterfallData = currentMetrics.schedule.map((row) => ({
    year: `Yr ${row.year}`,
    grossRent: Math.round(row.grossRentBase),
    opEx: -Math.round(row.operatingExpensesLocal * row.fxRateToBaseCurrency),
    propertyTax: -Math.round(row.propertyTaxLocal * row.fxRateToBaseCurrency),
    debtService: -Math.round(row.debtServiceLocal * row.fxRateToBaseCurrency),
    rentalTax: -Math.round(row.rentalIncomeTaxLocal * row.fxRateToBaseCurrency),
    netCashFlow: Math.round(row.netCashFlowAfterTaxBase)
  }));

  // Equity Accumulation Data Preparation (In Base Currency)
  const equityData = currentMetrics.schedule.map((row) => ({
    year: `Yr ${row.year}`,
    propertyValue: Math.round(row.propertyValueBase),
    loanBalance: Math.round(row.remainingLoanBalanceLocal * row.fxRateToBaseCurrency),
    netEquity: Math.round(row.totalEquityBase)
  }));

  // Multi-Property Levered IRR Data Preparation
  const irrComparisonData = properties.map((p, idx) => ({
    name: `${p.city} (${p.localCurrency})`,
    leveredIRR: Number(metricsList[idx].leveredIRRBase.toFixed(2)),
    netYield: Number(metricsList[idx].initialNetYieldPercent.toFixed(2)),
    cashOnCash: Number(metricsList[idx].initialCashOnCashPercent.toFixed(2))
  }));

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <span>Interactive Financial Forecast & Visualizations</span>
          </h2>
          <p className="text-xs text-slate-400">
            Dynamic year-by-year cash flow waterfall, debt paydown, and cross-border IRR comparison
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('waterfall')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'waterfall'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cash Flow Waterfall
          </button>

          <button
            onClick={() => setActiveTab('equity')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'equity'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Equity Build-Up
          </button>

          <button
            onClick={() => setActiveTab('irr')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'irr'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Market IRR Benchmarking
          </button>
        </div>
      </div>

      {/* Main Chart Container */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
        
        {/* Property Picker sub-header for single-property charts */}
        {activeTab !== 'irr' && (
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <span className="text-xl">{currentProperty.flagEmoji}</span>
              <span className="font-bold text-white text-sm">{currentProperty.city}</span>
              <span className="text-xs text-slate-400">({currentProperty.name})</span>
            </div>

            {properties.length > 1 && (
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-400">Select Market:</span>
                <select
                  value={selectedPropertyIdx}
                  onChange={(e) => setSelectedPropertyIdx(Number(e.target.value))}
                  className="bg-slate-900 border border-slate-700 text-slate-200 font-semibold rounded-lg px-2.5 py-1 text-xs focus:outline-none"
                >
                  {properties.map((p, idx) => (
                    <option key={p.id} value={idx}>
                      {p.flagEmoji} {p.city} ({p.localCurrency})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: WATERFALL CHART */}
        {activeTab === 'waterfall' && (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterfallData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [formatCurrency(Number(val || 0), baseCurrency), '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="grossRent" name="Gross Rent" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="opEx" name="Operating Expenses" fill="#f43f5e" radius={[0, 0, 4, 4]} />
                <Bar dataKey="debtService" name="Debt Service (P+I)" fill="#fbbf24" radius={[0, 0, 4, 4]} />
                <Bar dataKey="rentalTax" name="Rental Income Tax" fill="#a855f7" radius={[0, 0, 4, 4]} />
                <Bar dataKey="netCashFlow" name={`Net Cash Flow (${baseCurrency})`} fill="#34d399" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* TAB 2: EQUITY ACCUMULATION CHART */}
        {activeTab === 'equity' && (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={equityData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [formatCurrency(Number(val || 0), baseCurrency), '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="propertyValue" name="Asset Valuation" stroke="#38bdf8" fillOpacity={1} fill="url(#colorValue)" />
                <Area type="monotone" dataKey="netEquity" name="Investor Equity" stroke="#34d399" fillOpacity={1} fill="url(#colorEquity)" />
                <Area type="monotone" dataKey="loanBalance" name="Mortgage Debt Balance" stroke="#f43f5e" fill="transparent" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* TAB 3: MARKET IRR BENCHMARKING CHART */}
        {activeTab === 'irr' && (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={irrComparisonData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(val) => `${val}%`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}%`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="leveredIRR" name={`Levered IRR (${baseCurrency})`} fill="#38bdf8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="netYield" name="Net Rental Yield (%)" fill="#34d399" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cashOnCash" name="Cash-on-Cash Return (%)" fill="#fbbf24" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

      </div>
    </section>
  );
};
