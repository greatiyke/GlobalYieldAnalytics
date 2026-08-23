import React from 'react';
import type { PropertyModel, FinancialMetrics, CurrencyCode } from '../types/realEstate';
import { formatCurrency } from '../utils/currencyConverter';
import { Trophy, TrendingUp, Award } from 'lucide-react';

interface ComparisonGridProps {
  properties: PropertyModel[];
  metricsList: FinancialMetrics[];
  baseCurrency: CurrencyCode;
}

export const ComparisonGrid: React.FC<ComparisonGridProps> = ({
  properties,
  metricsList,
  baseCurrency
}) => {
  if (properties.length === 0) {
    return null;
  }

  // Find top winners in key categories
  let maxIRRIndex = 0;
  let maxNetYieldIndex = 0;
  let maxCashOnCashIndex = 0;
  let maxEquityMultipleIndex = 0;

  metricsList.forEach((m, idx) => {
    if (m.leveredIRRBase > metricsList[maxIRRIndex].leveredIRRBase) maxIRRIndex = idx;
    if (m.initialNetYieldPercent > metricsList[maxNetYieldIndex].initialNetYieldPercent) maxNetYieldIndex = idx;
    if (m.initialCashOnCashPercent > metricsList[maxCashOnCashIndex].initialCashOnCashPercent) maxCashOnCashIndex = idx;
    if (m.equityMultipleBase > metricsList[maxEquityMultipleIndex].equityMultipleBase) maxEquityMultipleIndex = idx;
  });

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Cross-Border Market Matrix & Returns Breakdown</span>
          </h2>
          <p className="text-xs text-slate-400">
            Normalized side-by-side metrics converted into investor base currency ({baseCurrency})
          </p>
        </div>
      </div>

      {/* Grid Comparison Matrix Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300 text-xs font-semibold">
                <th className="p-4 min-w-[200px]">Financial Metric</th>
                {properties.map((p) => (
                  <th key={p.id} className="p-4 text-center border-l border-slate-800/80 min-w-[180px]">
                    <div className="flex flex-col items-center">
                      <span className="text-2xl mb-1">{p.flagEmoji}</span>
                      <span className="font-bold text-white text-sm truncate max-w-[160px]">{p.city}</span>
                      <span className="text-[10px] text-slate-400">{p.name}</span>
                      <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-mono text-cyan-400">
                        {p.localCurrency} Asset
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs">
              
              {/* Purchase Price Local vs Base */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-3.5 font-medium text-slate-300">Purchase Price (Local)</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3.5 text-center font-mono border-l border-slate-800/60 text-slate-200">
                    {formatCurrency(p.purchasePriceLocal, p.localCurrency)}
                  </td>
                ))}
              </tr>

              <tr className="hover:bg-slate-900/40 bg-slate-900/20">
                <td className="p-3.5 font-semibold text-slate-200">Purchase Price ({baseCurrency})</td>
                {properties.map((p, idx) => (
                  <td key={p.id} className="p-3.5 text-center font-mono border-l border-slate-800/60 text-cyan-300 font-bold">
                    {formatCurrency(metricsList[idx].totalAcquisitionCostBase - (metricsList[idx].totalAcquisitionCostBase - metricsList[idx].totalAcquisitionCostBase / (1 + p.acquisitionTaxes.stampDutyPercent/100)), baseCurrency, true)}
                  </td>
                ))}
              </tr>

              {/* Total Initial Outlay (Equity Cash Required) */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-3.5 font-medium text-slate-300">Total Initial Cash Required ({baseCurrency})</td>
                {properties.map((p, idx) => (
                  <td key={p.id} className="p-3.5 text-center font-mono border-l border-slate-800/60 text-slate-200">
                    {formatCurrency(metricsList[idx].equityInvestedBase, baseCurrency)}
                  </td>
                ))}
              </tr>

              {/* Gross Rental Yield */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-3.5 font-medium text-slate-300">Gross Rental Yield</td>
                {properties.map((p, idx) => (
                  <td key={p.id} className="p-3.5 text-center font-mono border-l border-slate-800/60 text-slate-300">
                    {metricsList[idx].initialGrossYieldPercent.toFixed(2)}%
                  </td>
                ))}
              </tr>

              {/* Net Rental Yield */}
              <tr className="hover:bg-slate-900/40 bg-slate-900/30">
                <td className="p-3.5 font-semibold text-slate-200 flex items-center space-x-1">
                  <span>Net Rental Yield (NOI / Cost)</span>
                  {properties.length > 1 && (
                    <Award className="w-3.5 h-3.5 text-emerald-400 inline" />
                  )}
                </td>
                {properties.map((p, idx) => {
                  const isTop = idx === maxNetYieldIndex && properties.length > 1;
                  return (
                    <td
                      key={p.id}
                      className={`p-3.5 text-center font-mono border-l border-slate-800/60 font-bold ${
                        isTop ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-200'
                      }`}
                    >
                      {metricsList[idx].initialNetYieldPercent.toFixed(2)}%
                      {isTop && <span className="block text-[9px] font-sans text-emerald-400 uppercase font-bold">Market Top</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Cash-on-Cash Return */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-3.5 font-medium text-slate-300">Initial Cash-on-Cash Return</td>
                {properties.map((p, idx) => {
                  const isTop = idx === maxCashOnCashIndex && properties.length > 1;
                  return (
                    <td
                      key={p.id}
                      className={`p-3.5 text-center font-mono border-l border-slate-800/60 font-bold ${
                        isTop ? 'text-cyan-400 bg-cyan-500/10' : 'text-slate-300'
                      }`}
                    >
                      {metricsList[idx].initialCashOnCashPercent.toFixed(2)}%
                    </td>
                  );
                })}
              </tr>

              {/* Levered IRR in Base Currency */}
              <tr className="hover:bg-slate-900/40 bg-gradient-to-r from-cyan-950/20 via-blue-950/20 to-cyan-950/20">
                <td className="p-3.5 font-extrabold text-cyan-300 text-sm flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-cyan-400" />
                  <span>Levered IRR ({baseCurrency})</span>
                </td>
                {properties.map((p, idx) => {
                  const isTop = idx === maxIRRIndex && properties.length > 1;
                  return (
                    <td
                      key={p.id}
                      className={`p-3.5 text-center font-mono border-l border-slate-800/60 font-extrabold text-sm ${
                        isTop
                          ? 'text-cyan-300 bg-cyan-500/20 border-cyan-500/50 shadow-inner'
                          : 'text-slate-100'
                      }`}
                    >
                      {metricsList[idx].leveredIRRBase.toFixed(2)}%
                      {isTop && (
                        <span className="mt-0.5 inline-block px-2 py-0.5 rounded bg-cyan-500 text-slate-950 text-[9px] font-sans font-black uppercase tracking-wider">
                          Best Return
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Equity Multiple */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-3.5 font-medium text-slate-300">Equity Multiple ({pHoldingYears(properties[0])} yrs)</td>
                {properties.map((p, idx) => {
                  const isTop = idx === maxEquityMultipleIndex && properties.length > 1;
                  return (
                    <td
                      key={p.id}
                      className={`p-3.5 text-center font-mono border-l border-slate-800/60 font-bold ${
                        isTop ? 'text-amber-400 bg-amber-500/10' : 'text-slate-300'
                      }`}
                    >
                      {metricsList[idx].equityMultipleBase.toFixed(2)}x
                    </td>
                  );
                })}
              </tr>

              {/* Net Present Value */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-3.5 font-medium text-slate-300">NPV @ 7% Discount ({baseCurrency})</td>
                {properties.map((p, idx) => (
                  <td key={p.id} className="p-3.5 text-center font-mono border-l border-slate-800/60 text-slate-300">
                    {formatCurrency(metricsList[idx].npvBase, baseCurrency, true)}
                  </td>
                ))}
              </tr>

              {/* Tax Burden Friction */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-3.5 font-medium text-slate-300">Acquisition Friction & Tax %</td>
                {properties.map((p) => {
                  const totalTaxPct = 
                    p.acquisitionTaxes.stampDutyPercent + 
                    p.acquisitionTaxes.nonResidentSurchargePercent + 
                    p.acquisitionTaxes.legalAndNotaryPercent + 
                    p.acquisitionTaxes.agentFeePercent;
                  return (
                    <td key={p.id} className="p-3.5 text-center font-mono border-l border-slate-800/60 text-rose-300 font-semibold">
                      +{totalTaxPct.toFixed(1)}%
                    </td>
                  );
                })}
              </tr>

              {/* Mortgage Leverage Terms */}
              <tr className="hover:bg-slate-900/40">
                <td className="p-3.5 font-medium text-slate-300">Financing Terms</td>
                {properties.map((p) => (
                  <td key={p.id} className="p-3.5 text-center font-sans border-l border-slate-800/60 text-slate-300 text-[11px]">
                    {p.financing.useMortgage ? (
                      <div>
                        <span className="font-bold text-slate-200">{p.financing.ltvPercent}% LTV</span> @ {p.financing.interestRatePercent}%
                        <div className="text-[10px] text-slate-500">
                          {p.financing.isInterestOnly ? 'Interest-Only' : 'Amortizing'} ({p.financing.loanTermYears}yr)
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 italic">Cash Buyer (0% Debt)</span>
                    )}
                  </td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

function pHoldingYears(p?: PropertyModel): number {
  return p ? p.holdingPeriodYears : 10;
}
