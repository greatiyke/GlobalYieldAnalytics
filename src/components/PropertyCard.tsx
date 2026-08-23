import React, { useState } from 'react';
import type { PropertyModel, FinancialMetrics, CurrencyCode } from '../types/realEstate';
import { formatCurrency } from '../utils/currencyConverter';
import { 
  Settings, 
  Trash2, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Percent, 
  Compass, 
  ArrowUpRight,
  FileSpreadsheet
} from 'lucide-react';
import { exportPropertyScheduleToCSV } from '../utils/exportCsv';

interface PropertyCardProps {
  property: PropertyModel;
  metrics: FinancialMetrics;
  baseCurrency: CurrencyCode;
  onEdit: () => void;
  onClone: () => void;
  onRemove: () => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  metrics,
  baseCurrency,
  onEdit,
  onClone,
  onRemove
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glass-card rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col justify-between hover:border-slate-700/80 transition-all duration-300 shadow-xl">
      
      {/* Card Header */}
      <div className="p-5 border-b border-slate-800/60 bg-slate-900/60">
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <span className="text-3xl p-1 bg-slate-800/80 rounded-xl border border-slate-700/60 shadow-sm">
              {property.flagEmoji}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-base tracking-tight">{property.city}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 border border-slate-700">
                  {property.countryCode}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-300 truncate max-w-[200px] sm:max-w-[240px]">
                {property.name}
              </p>
              <span className="text-[10px] text-slate-500">{property.propertyType}</span>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onEdit}
              title="Edit parameters & taxes"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-500/20 hover:text-cyan-400 text-slate-400 transition-all border border-slate-700/60"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClone}
              title="Clone property model"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-all border border-slate-700/60"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={onRemove}
              title="Remove property from matrix"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 transition-all border border-slate-700/60"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Primary Metric Banner */}
        <div className="mt-4 grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Levered IRR ({baseCurrency})
            </span>
            <span className="text-xl font-extrabold font-mono text-cyan-400">
              {metrics.leveredIRRBase.toFixed(2)}%
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Net Rental Yield
            </span>
            <span className="text-xl font-extrabold font-mono text-emerald-400">
              {metrics.initialNetYieldPercent.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      {/* Key Financial Specifications Body */}
      <div className="p-5 space-y-3.5 text-xs">
        
        {/* Purchase Price */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Purchase Price</span>
          <div className="text-right">
            <span className="font-bold font-mono text-white block">
              {formatCurrency(property.purchasePriceLocal, property.localCurrency)}
            </span>
            {property.localCurrency !== baseCurrency && (
              <span className="text-[10px] text-slate-500 font-mono block">
                ≈ {formatCurrency(metrics.totalAcquisitionCostBase - (metrics.totalAcquisitionCostBase - metrics.totalAcquisitionCostBase / 1.05), baseCurrency, true)}
              </span>
            )}
          </div>
        </div>

        {/* Monthly Gross Rent */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Monthly Gross Rent</span>
          <span className="font-semibold font-mono text-slate-200">
            {formatCurrency(property.monthlyGrossRentLocal, property.localCurrency)}
          </span>
        </div>

        {/* Total Outlay */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Total Cash Outlay ({baseCurrency})</span>
          <span className="font-bold font-mono text-slate-200">
            {formatCurrency(metrics.equityInvestedBase, baseCurrency)}
          </span>
        </div>

        {/* Cash-on-Cash Return */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Initial Cash-on-Cash</span>
          <span className="font-bold font-mono text-cyan-300">
            {metrics.initialCashOnCashPercent.toFixed(2)}%
          </span>
        </div>

        {/* Equity Multiple */}
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Equity Multiple ({property.holdingPeriodYears} yrs)</span>
          <span className="font-bold font-mono text-amber-400">
            {metrics.equityMultipleBase.toFixed(2)}x
          </span>
        </div>

      </div>

      {/* Expandable Parameter & Tax Detail Accordion */}
      {isExpanded && (
        <div className="p-5 border-t border-slate-800/80 bg-slate-950/90 text-xs space-y-4 animate-fadeIn">
          
          {/* Acquisition Friction & Taxes */}
          <div>
            <h4 className="font-bold text-slate-300 mb-2 flex items-center space-x-1 text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Acquisition Friction & Tax Fees</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div>Stamp Duty / ITP: <span className="font-semibold text-slate-200">{property.acquisitionTaxes.stampDutyPercent}%</span></div>
              <div>Non-Resident Surcharge: <span className="font-semibold text-slate-200">{property.acquisitionTaxes.nonResidentSurchargePercent}%</span></div>
              <div>Legal & Notary: <span className="font-semibold text-slate-200">{property.acquisitionTaxes.legalAndNotaryPercent}%</span></div>
              <div>Buyer Agent Fee: <span className="font-semibold text-slate-200">{property.acquisitionTaxes.agentFeePercent}%</span></div>
            </div>
          </div>

          {/* Operating & Rental Tax */}
          <div>
            <h4 className="font-bold text-slate-300 mb-2 flex items-center space-x-1 text-[11px] uppercase tracking-wider">
              <Percent className="w-3.5 h-3.5 text-emerald-400" />
              <span>OpEx & Rental Tax Shield</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div>Mgmt Fee: <span className="font-semibold text-slate-200">{property.operatingExpenses.propertyManagementPercent}%</span></div>
              <div>Vacancy Reserve: <span className="font-semibold text-slate-200">{property.operatingExpenses.vacancyRatePercent}%</span></div>
              <div>Income Tax Rate: <span className="font-semibold text-slate-200">{property.taxStructure.rentalIncomeTaxPercent}%</span></div>
              <div>Depreciation Shield: <span className="font-semibold text-slate-200">{property.taxStructure.allowableDepreciationPercent}%/yr</span></div>
            </div>
          </div>

          {/* Mortgage & Macro */}
          <div>
            <h4 className="font-bold text-slate-300 mb-2 flex items-center space-x-1 text-[11px] uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              <span>Financing & FX Assumptions</span>
            </h4>
            <div className="grid grid-cols-2 gap-2 text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
              <div>LTV Leverage: <span className="font-semibold text-slate-200">{property.financing.ltvPercent}%</span></div>
              <div>Interest Rate: <span className="font-semibold text-slate-200">{property.financing.interestRatePercent}%</span></div>
              <div>Capital Growth CAGR: <span className="font-semibold text-slate-200">{property.macro.expectedAppreciationAnnualPercent}%</span></div>
              <div>Annual FX Drift: <span className="font-semibold text-slate-200">{property.macro.fxAnnualDriftPercent}%</span></div>
            </div>
          </div>

          {/* Export CSV Button for Property */}
          <button
            onClick={() => exportPropertyScheduleToCSV(property, metrics, baseCurrency)}
            className="w-full flex items-center justify-center space-x-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Financial Model (CSV)</span>
          </button>

        </div>
      )}

      {/* Card Footer Toggle Button */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between text-xs">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center space-x-1 text-slate-400 hover:text-cyan-400 font-medium transition-colors"
        >
          <span>{isExpanded ? 'Hide Specs' : 'View Full Assumptions'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={onEdit}
          className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center space-x-1"
        >
          <span>Configure</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
