import React, { useState } from 'react';
import type { PropertyModel, CurrencyCode } from '../types/realEstate';
import { generateSensitivityMatrix } from '../utils/financialCalculations';
import { Compass } from 'lucide-react';

interface SensitivityHeatmapProps {
  properties: PropertyModel[];
  baseCurrency: CurrencyCode;
}

export const SensitivityHeatmap: React.FC<SensitivityHeatmapProps> = ({
  properties,
  baseCurrency
}) => {
  const [selectedPropertyIdx, setSelectedPropertyIdx] = useState<number>(0);

  if (properties.length === 0) return null;

  const currentProperty = properties[selectedPropertyIdx] || properties[0];
  const matrix = generateSensitivityMatrix(currentProperty, baseCurrency);

  const fxDriftSteps = [-15, -10, -5, 0, 5, 10, 15];
  const appreciationSteps = [-5, -2, 0, 3, 5, 8, 12];

  // Helper for color coding IRR heatmap cells
  const getCellColorClass = (irr: number) => {
    if (irr >= 15) return 'bg-emerald-500/30 text-emerald-300 font-bold border-emerald-500/40';
    if (irr >= 10) return 'bg-emerald-500/15 text-emerald-400 font-semibold border-emerald-500/20';
    if (irr >= 6) return 'bg-cyan-500/15 text-cyan-300 font-medium border-cyan-500/20';
    if (irr >= 2) return 'bg-amber-500/15 text-amber-300 border-amber-500/20';
    if (irr >= 0) return 'bg-slate-800 text-slate-300 border-slate-700';
    return 'bg-rose-500/20 text-rose-300 font-bold border-rose-500/30';
  };

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Compass className="w-5 h-5 text-cyan-400" />
            <span>2D FX Volatility & Capital Growth Sensitivity Matrix</span>
          </h2>
          <p className="text-xs text-slate-400">
            Stress-test Levered IRR ({baseCurrency}) under combined FX exchange rate movements and property appreciation rates
          </p>
        </div>

        {properties.length > 1 && (
          <div className="flex items-center space-x-2 text-xs self-start sm:self-auto">
            <span className="text-slate-400 font-medium">Target Market:</span>
            <select
              value={selectedPropertyIdx}
              onChange={(e) => setSelectedPropertyIdx(Number(e.target.value))}
              className="bg-slate-900 border border-slate-700 text-white font-bold rounded-xl px-3 py-1.5 text-xs focus:outline-none"
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

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 shadow-2xl">
        
        {/* Heatmap Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse min-w-[650px]">
            <thead>
              <tr>
                <th rowSpan={2} className="p-3 text-xs font-bold text-slate-400 border-b border-r border-slate-800 bg-slate-900/80">
                  <div className="flex flex-col items-center">
                    <span>Annual FX Drift %</span>
                    <span className="text-[9px] font-normal text-slate-500">↓ (Row) vs Appreciation % →</span>
                  </div>
                </th>
                <th colSpan={appreciationSteps.length} className="p-2 text-xs font-bold text-cyan-400 bg-slate-900/60 border-b border-slate-800">
                  Expected Capital Appreciation CAGR (%)
                </th>
              </tr>
              <tr className="bg-slate-900/40 border-b border-slate-800 text-xs font-semibold text-slate-300">
                {appreciationSteps.map((app) => (
                  <th key={app} className="p-2.5 font-mono">
                    {app > 0 ? `+${app}%` : `${app}%`}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {matrix.map((row, rowIdx) => {
                const fxDriftVal = fxDriftSteps[rowIdx];
                return (
                  <tr key={fxDriftVal} className="hover:bg-slate-900/20">
                    <td className="p-3 font-semibold text-slate-300 bg-slate-900/50 border-r border-slate-800 text-center">
                      {fxDriftVal > 0 ? `+${fxDriftVal}% FX` : `${fxDriftVal}% FX`}
                    </td>

                    {row.map((cell, colIdx) => {
                      const isBaseScenario = cell.fxDrift === 0 && cell.appreciationRate === currentProperty.macro.expectedAppreciationAnnualPercent;
                      return (
                        <td
                          key={colIdx}
                          className={`p-3 border text-center transition-all ${getCellColorClass(cell.leveredIRRBase)} ${
                            isBaseScenario ? 'ring-2 ring-cyan-400 shadow-lg font-black' : ''
                          }`}
                        >
                          {cell.leveredIRRBase.toFixed(1)}%
                          {isBaseScenario && (
                            <span className="block text-[8px] uppercase tracking-tighter text-cyan-300 font-black">
                              Base
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Heatmap Legend */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-slate-300">IRR Range Legend:</span>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-rose-500/40 inline-block"></span>
              <span>Negative / &lt;0%</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-amber-500/30 inline-block"></span>
              <span>0 - 6%</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500/30 inline-block"></span>
              <span>6 - 10%</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/40 inline-block"></span>
              <span>10%+ (Outperform)</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 italic">
            * All IRR calculations converted into investor base currency ({baseCurrency}) over {currentProperty.holdingPeriodYears}-year horizon.
          </div>
        </div>

      </div>
    </section>
  );
};
