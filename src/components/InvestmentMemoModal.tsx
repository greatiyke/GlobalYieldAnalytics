import React, { useState } from 'react';
import type { PropertyModel, FinancialMetrics, CurrencyCode, InvestmentScenario } from '../types/realEstate';
import { formatCurrency } from '../utils/currencyConverter';
import { exportElementToPDF } from '../utils/exportPdf';
import { X, Download, Trophy, FileText, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InvestmentMemoModalProps {
  properties: PropertyModel[];
  metricsList: FinancialMetrics[];
  baseCurrency: CurrencyCode;
  scenario: InvestmentScenario;
  onClose: () => void;
}

export const InvestmentMemoModal: React.FC<InvestmentMemoModalProps> = ({
  properties,
  metricsList,
  baseCurrency,
  scenario,
  onClose
}) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportPDF = async () => {
    setIsExporting(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
    await exportElementToPDF('investment-memo-content', 'global_real_estate_investment_memo.pdf');
    setIsExporting(false);
  };

  // Identify top overall deal
  let topIRRIdx = 0;
  metricsList.forEach((m, i) => {
    if (m.leveredIRRBase > metricsList[topIRRIdx].leveredIRRBase) topIRRIdx = i;
  });

  const winner = properties[topIRRIdx];
  const winnerMetrics = metricsList[topIRRIdx];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-cyan-400" />
            <div>
              <h3 className="text-lg font-bold text-white">
                Global Real Estate Investment Memorandum
              </h3>
              <p className="text-xs text-slate-400">
                Executive summary pitch book & cross-border allocation strategy ({scenario.toUpperCase()} Macro Scenario)
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PDF...' : 'Download PDF Memorandum'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Memorandum Content */}
        <div id="investment-memo-content" className="p-8 overflow-y-auto space-y-8 bg-slate-950 text-slate-100 font-sans text-xs">
          
          {/* Executive Header Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400 block mb-1">
                CONFIDENTIAL INVESTMENT PITCH BOOK
              </span>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Cross-Border Property Portfolio Allocation
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Base Currency: <span className="text-white font-bold">{baseCurrency}</span> | Macro Scenario: <span className="text-cyan-300 font-bold uppercase">{scenario}</span> | Date: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>

            {winner && winnerMetrics && (
              <div className="p-4 rounded-xl bg-slate-900/90 border border-cyan-500/50 text-center min-w-[200px]">
                <div className="flex items-center justify-center space-x-1 text-amber-400 mb-1">
                  <Trophy className="w-4 h-4" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider">Top Performing Asset</span>
                </div>
                <div className="text-base font-black text-white">{winner.flagEmoji} {winner.city}</div>
                <div className="text-xl font-extrabold text-cyan-400 font-mono mt-0.5">
                  {winnerMetrics.leveredIRRBase.toFixed(2)}% IRR
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">{winnerMetrics.equityMultipleBase.toFixed(2)}x Equity Multiple</div>
              </div>
            )}
          </div>

          {/* Executive Summary Narrative */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-1.5">
              1. Investment Rationale & Multi-Market Strategy
            </h2>
            <p className="text-slate-300 leading-relaxed text-xs">
              This cross-border real estate financial comparison evaluates international property acquisitions across {properties.length} global markets. All cash flows, operating expenses, local tax obligations (Stamp Duty, Non-Resident Withholding Tax, Building Depreciation tax shields, Capital Gains Tax), mortgage debt service, and annual foreign exchange (FX) currency drift have been converted and benchmarked in <strong className="text-white">{baseCurrency}</strong>.
            </p>
          </div>

          {/* Side-by-Side Target Market Comparison Table */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-1.5">
              2. Target Market Comparison & Normalized Financial Summary
            </h2>
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                    <th className="p-3">Market / Asset</th>
                    <th className="p-3">Local Price</th>
                    <th className="p-3">Outlay ({baseCurrency})</th>
                    <th className="p-3">Net Yield</th>
                    <th className="p-3">Levered IRR ({baseCurrency})</th>
                    <th className="p-3">Equity Multiple</th>
                    <th className="p-3">Leverage & Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {properties.map((p, idx) => {
                    const m = metricsList[idx];
                    const isWinner = idx === topIRRIdx;
                    return (
                      <tr key={p.id} className={isWinner ? 'bg-cyan-500/10 font-bold' : 'hover:bg-slate-900/50'}>
                        <td className="p-3 font-sans font-bold text-slate-100">
                          {p.flagEmoji} {p.city}, {p.countryCode}
                        </td>
                        <td className="p-3 text-slate-300">{formatCurrency(p.purchasePriceLocal, p.localCurrency)}</td>
                        <td className="p-3 text-slate-300">{formatCurrency(m.equityInvestedBase, baseCurrency)}</td>
                        <td className="p-3 text-emerald-400">{m.initialNetYieldPercent.toFixed(2)}%</td>
                        <td className="p-3 text-cyan-300 font-extrabold text-sm">{m.leveredIRRBase.toFixed(2)}%</td>
                        <td className="p-3 text-amber-400">{m.equityMultipleBase.toFixed(2)}x</td>
                        <td className="p-3 text-slate-400 font-sans text-[11px]">
                          {p.financing.useMortgage ? `${p.financing.ltvPercent}% LTV @ ${p.financing.interestRatePercent}%` : 'Cash (0% Debt)'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Jurisdiction Tax & Risk Matrix */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-cyan-300 uppercase tracking-wider border-b border-slate-800 pb-1.5">
              3. Jurisdiction Tax Structure & Risk Assessment
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{p.flagEmoji} {p.city} Tax Profile</span>
                    <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-cyan-400">{p.localCurrency}</span>
                  </div>
                  <ul className="space-y-1 text-slate-300 text-[11px]">
                    <li className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>Stamp Duty & Buyer Fees: <strong>{(p.acquisitionTaxes.stampDutyPercent + p.acquisitionTaxes.nonResidentSurchargePercent).toFixed(1)}%</strong></span>
                    </li>
                    <li className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>Rental Income Tax: <strong>{p.taxStructure.rentalIncomeTaxPercent}%</strong> {p.taxStructure.allowableDepreciationPercent > 0 ? `(Shielded by ${p.taxStructure.allowableDepreciationPercent}%/yr Depreciation)` : ''}</span>
                    </li>
                    <li className="flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>Capital Gains Tax: <strong>{p.taxStructure.capitalGainsTaxPercent}%</strong></span>
                    </li>
                  </ul>
                  <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800">
                    "{p.notes}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            Generated by GlobalYield Analytics Platform. Model forecasts are based on input assumptions and purchasing power parity FX drift. Past real estate growth is not indicative of future results.
          </div>

        </div>

      </div>
    </div>
  );
};
