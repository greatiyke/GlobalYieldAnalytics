import React from 'react';
import type { PropertyModel } from '../types/realEstate';
import { GLOBAL_MARKET_PRESETS } from '../data/marketPresets';
import { Plus, Building2, Check } from 'lucide-react';

interface MarketSelectorProps {
  activeProperties: PropertyModel[];
  onSelectPreset: (preset: PropertyModel) => void;
  onRemoveProperty: (id: string) => void;
  onOpenCustomBuilder: () => void;
}

export const MarketSelector: React.FC<MarketSelectorProps> = ({
  activeProperties,
  onSelectPreset,
  onRemoveProperty,
  onOpenCustomBuilder
}) => {
  const activePresetIds = activeProperties.map(p => p.presetId || p.id);

  return (
    <section className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <span>Global Market Presets & Portfolio Builder</span>
          </h2>
          <p className="text-xs text-slate-400">
            Select global markets to add to your side-by-side comparative model matrix
          </p>
        </div>

        <button
          onClick={onOpenCustomBuilder}
          className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-medium text-xs border border-cyan-500/30 transition-all shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Build Custom Property Model</span>
        </button>
      </div>

      {/* Preset Chips Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {GLOBAL_MARKET_PRESETS.map((preset) => {
          const isSelected = activePresetIds.includes(preset.presetId || preset.id);
          const isFull = activeProperties.length >= 4 && !isSelected;

          return (
            <button
              key={preset.id}
              onClick={() => {
                if (isSelected) {
                  const target = activeProperties.find(p => p.presetId === preset.presetId || p.id === preset.id);
                  if (target) onRemoveProperty(target.id);
                } else if (!isFull) {
                  onSelectPreset(preset);
                }
              }}
              disabled={isFull}
              className={`relative flex flex-col p-3 rounded-xl border text-left transition-all duration-200 group ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500'
                  : isFull
                  ? 'bg-slate-900/40 border-slate-800/60 opacity-40 cursor-not-allowed'
                  : 'glass-card hover:border-slate-600 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xl">{preset.flagEmoji}</span>
                {isSelected ? (
                  <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 group-hover:text-cyan-400 font-semibold transition-colors">
                    {preset.localCurrency}
                  </span>
                )}
              </div>

              <div className="font-bold text-xs text-white truncate group-hover:text-cyan-300">
                {preset.city}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {preset.country}
              </div>

              <div className="mt-2 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Yield</span>
                <span className="font-bold text-emerald-400">
                  {((preset.monthlyGrossRentLocal * 12) / preset.purchasePriceLocal * 100).toFixed(1)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
