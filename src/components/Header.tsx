import React from 'react';
import type { CurrencyCode, InvestmentScenario } from '../types/realEstate';
import { SUPPORTED_CURRENCIES } from '../data/marketPresets';
import { Globe, Download, Plus, RefreshCw, Layers } from 'lucide-react';

interface HeaderProps {
  baseCurrency: CurrencyCode;
  onBaseCurrencyChange: (code: CurrencyCode) => void;
  scenario: InvestmentScenario;
  onScenarioChange: (scenario: InvestmentScenario) => void;
  onAddProperty: () => void;
  onOpenMemo: () => void;
  onResetPresets: () => void;
  activePropertyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  baseCurrency,
  onBaseCurrencyChange,
  scenario,
  onScenarioChange,
  onAddProperty,
  onOpenMemo,
  onResetPresets,
  activePropertyCount
}) => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 shadow-2xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
            <Globe className="w-6 h-6 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-extrabold tracking-tight text-white font-sans bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                GlobalYield <span className="text-cyan-400">Analytics</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                PRO 2.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Cross-Border Financial Modeling, FX Risk & Tax Structure Comparison
            </p>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full md:w-auto">
          
          {/* Scenario Selector */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onScenarioChange('bear')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                scenario === 'bear'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bear
            </button>
            <button
              onClick={() => onScenarioChange('base')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                scenario === 'base'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Base
            </button>
            <button
              onClick={() => onScenarioChange('bull')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                scenario === 'bull'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bull
            </button>
          </div>

          {/* Base Currency Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-slate-400 font-medium hidden sm:inline">Base Currency:</span>
            <select
              value={baseCurrency}
              onChange={(e) => onBaseCurrencyChange(e.target.value as CurrencyCode)}
              className="bg-transparent text-white font-bold focus:outline-none cursor-pointer text-xs"
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-slate-900 text-slate-200">
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>

          {/* Add Property Button */}
          <button
            onClick={onAddProperty}
            disabled={activePropertyCount >= 4}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            <span>Compare Market ({activePropertyCount}/4)</span>
          </button>

          {/* Investment Memo PDF Modal */}
          <button
            onClick={onOpenMemo}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Pitch Book Memo</span>
          </button>

          {/* Reset Presets */}
          <button
            onClick={onResetPresets}
            title="Reset to default global market presets"
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
};
