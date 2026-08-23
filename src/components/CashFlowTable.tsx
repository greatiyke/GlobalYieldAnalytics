import React, { useState } from 'react';
import type { PropertyModel, FinancialMetrics, CurrencyCode } from '../types/realEstate';
import { formatCurrency } from '../utils/currencyConverter';
import { Table, Download } from 'lucide-react';
import { exportPropertyScheduleToCSV } from '../utils/exportCsv';

interface CashFlowTableProps {
  properties: PropertyModel[];
  metricsList: FinancialMetrics[];
  baseCurrency: CurrencyCode;
}

export const CashFlowTable: React.FC<CashFlowTableProps> = ({
  properties,
  metricsList,
  baseCurrency
}) => {
  const [selectedPropertyIdx, setSelectedPropertyIdx] = useState<number>(0);
  const [viewCurrency, setViewCurrency] = useState<'base' | 'local'>('base');

  if (properties.length === 0 || metricsList.length === 0) return null;

  const currentProperty = properties[selectedPropertyIdx] || properties[0];
  const currentMetrics = metricsList[selectedPropertyIdx] || metricsList[0];
  const currencyCode = viewCurrency === 'base' ? baseCurrency : currentProperty.localCurrency;

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Table className="w-5 h-5 text-cyan-400" />
            <span>Multi-Year Financial Schedule & Cash Flow Projections</span>
          </h2>
          <p className="text-xs text-slate-400">
            Comprehensive annual income statement, operating expenses, debt service, and net cash flow schedule
          </p>
        </div>

        {/* Property & Currency View Controls */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-xs">
          
          {properties.length > 1 && (
            <select
              value={selectedPropertyIdx}
              onChange={(e) => setSelectedPropertyIdx(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-slate-200 font-bold rounded-xl px-3 py-1.5 focus:outline-none"
            >
              {properties.map((p, idx) => (
                <option key={p.id} value={idx}>
                  {p.flagEmoji} {p.city} ({p.localCurrency})
                </option>
              ))}
            </select>
          )}

          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800 font-semibold">
            <button
              onClick={() => setViewCurrency('base')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewCurrency === 'base'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              In {baseCurrency}
            </button>
            <button
              onClick={() => setViewCurrency('local')}
              className={`px-3 py-1 rounded-lg transition-all ${
                viewCurrency === 'local'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              In {currentProperty.localCurrency}
            </button>
          </div>

          <button
            onClick={() => exportPropertyScheduleToCSV(currentProperty, currentMetrics, baseCurrency)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-medium border border-cyan-500/30 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Schedule</span>
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse text-xs min-w-[900px]">
            <thead>
              <tr className="bg-slate-900/90 border-b border-slate-800 text-slate-300 font-semibold">
                <th className="p-3 text-left">Yr</th>
                <th className="p-3">Property Value</th>
                <th className="p-3">Gross Rent</th>
                <th className="p-3">Vacancy Loss</th>
                <th className="p-3">OpEx</th>
                <th className="p-3">Property Tax</th>
                <th className="p-3 font-bold text-slate-100">NOI</th>
                <th className="p-3 text-amber-300">Debt Service</th>
                <th className="p-3 text-purple-300">Rental Tax</th>
                <th className="p-3 font-bold text-emerald-400">Net Cash Flow</th>
                <th className="p-3 font-bold text-cyan-300">Cumulative Cash Flow</th>
                <th className="p-3 font-bold text-slate-100">Net Equity</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-mono">
              {currentMetrics.schedule.map((row) => {
                const isBase = viewCurrency === 'base';
                const fxRate = row.fxRateToBaseCurrency;

                const propVal = isBase ? row.propertyValueBase : row.propertyValueLocal;
                const grossRent = isBase ? row.grossRentBase : row.grossRentLocal;
                const vacancy = isBase ? row.vacancyLossLocal * fxRate : row.vacancyLossLocal;
                const opEx = isBase ? row.operatingExpensesLocal * fxRate : row.operatingExpensesLocal;
                const propTax = isBase ? row.propertyTaxLocal * fxRate : row.propertyTaxLocal;
                const noi = isBase ? row.netOperatingIncomeLocal * fxRate : row.netOperatingIncomeLocal;
                const debtService = isBase ? row.debtServiceLocal * fxRate : row.debtServiceLocal;
                const rentalTax = isBase ? row.rentalIncomeTaxLocal * fxRate : row.rentalIncomeTaxLocal;
                const netCF = isBase ? row.netCashFlowAfterTaxBase : row.netCashFlowAfterTaxLocal;
                const cumCF = isBase ? row.cumulativeCashFlowBase : row.cumulativeCashFlowBase / fxRate;
                const netEquity = isBase ? row.totalEquityBase : row.totalEquityBase / fxRate;

                return (
                  <tr key={row.year} className="hover:bg-slate-900/40">
                    <td className="p-3 text-left font-bold text-slate-300 font-sans">Yr {row.year}</td>
                    <td className="p-3 text-slate-300">{formatCurrency(propVal, currencyCode)}</td>
                    <td className="p-3 text-slate-200">{formatCurrency(grossRent, currencyCode)}</td>
                    <td className="p-3 text-rose-300">-{formatCurrency(vacancy, currencyCode)}</td>
                    <td className="p-3 text-rose-300">-{formatCurrency(opEx, currencyCode)}</td>
                    <td className="p-3 text-rose-300">-{formatCurrency(propTax, currencyCode)}</td>
                    <td className="p-3 font-bold text-slate-100">{formatCurrency(noi, currencyCode)}</td>
                    <td className="p-3 text-amber-300">-{formatCurrency(debtService, currencyCode)}</td>
                    <td className="p-3 text-purple-300">-{formatCurrency(rentalTax, currencyCode)}</td>
                    <td className="p-3 font-bold text-emerald-400 bg-emerald-500/5">
                      {formatCurrency(netCF, currencyCode)}
                    </td>
                    <td className="p-3 font-bold text-cyan-300">{formatCurrency(cumCF, currencyCode)}</td>
                    <td className="p-3 font-bold text-slate-100">{formatCurrency(netEquity, currencyCode)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
