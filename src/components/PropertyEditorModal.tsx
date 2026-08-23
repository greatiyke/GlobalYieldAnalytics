import React, { useState } from 'react';
import type { PropertyModel, CurrencyCode, PropertyType } from '../types/realEstate';
import { SUPPORTED_CURRENCIES } from '../data/marketPresets';
import { X, Save, Building, ShieldAlert, DollarSign, Percent, Compass } from 'lucide-react';

interface PropertyEditorModalProps {
  property: PropertyModel;
  onSave: (updatedProperty: PropertyModel) => void;
  onClose: () => void;
}

export const PropertyEditorModal: React.FC<PropertyEditorModalProps> = ({
  property,
  onSave,
  onClose
}) => {
  const [formData, setFormData] = useState<PropertyModel>({ ...property });
  const [activeTab, setActiveTab] = useState<'general' | 'friction' | 'opex' | 'taxes' | 'financing' | 'macro'>('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{formData.flagEmoji}</span>
            <div>
              <h3 className="text-lg font-bold text-white">
                Configure Property Model: <span className="text-cyan-400">{formData.city}</span>
              </h3>
              <p className="text-xs text-slate-400">
                Adjust financial parameters, jurisdiction tax structures, and currency assumptions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'general', label: '1. Core Property', icon: Building },
            { id: 'friction', label: '2. Acquisition Friction', icon: ShieldAlert },
            { id: 'opex', label: '3. OpEx & Expenses', icon: DollarSign },
            { id: 'taxes', label: '4. Rental & Exit Tax', icon: Percent },
            { id: 'financing', label: '5. Mortgage Debt', icon: DollarSign },
            { id: 'macro', label: '6. Macro & FX Drift', icon: Compass }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-1.5 px-4 py-3 border-b-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-cyan-500 text-cyan-400 bg-slate-900/60 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
          
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Property Name / Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">City / Location</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Country</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Local Asset Currency</label>
                <select
                  value={formData.localCurrency}
                  onChange={(e) => setFormData({ ...formData, localCurrency: e.target.value as CurrencyCode })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900"
                >
                  {SUPPORTED_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Purchase Price ({formData.localCurrency})
                </label>
                <input
                  type="number"
                  value={formData.purchasePriceLocal}
                  onChange={(e) => setFormData({ ...formData, purchasePriceLocal: Number(e.target.value) })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  min="1000"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Monthly Gross Rent ({formData.localCurrency})
                </label>
                <input
                  type="number"
                  value={formData.monthlyGrossRentLocal}
                  onChange={(e) => setFormData({ ...formData, monthlyGrossRentLocal: Number(e.target.value) })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400"
                  min="0"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Property Asset Type</label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as PropertyType })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs bg-slate-900"
                >
                  <option value="Residential Apartment">Residential Apartment</option>
                  <option value="Single Family Home">Single Family Home</option>
                  <option value="Luxury Villa">Luxury Villa</option>
                  <option value="Short-Term Rental">Short-Term Rental</option>
                  <option value="Commercial Retail">Commercial Retail</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Holding Period (Years)</label>
                <input
                  type="number"
                  value={formData.holdingPeriodYears}
                  onChange={(e) => setFormData({ ...formData, holdingPeriodYears: Number(e.target.value) })}
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                  min="1"
                  max="30"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: ACQUISITION FRICTION */}
          {activeTab === 'friction' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Stamp Duty / Transfer Tax (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.acquisitionTaxes.stampDutyPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      acquisitionTaxes: { ...formData.acquisitionTaxes, stampDutyPercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
                <span className="text-[10px] text-slate-500">e.g. UK SDLT base 5%, Spain ITP 6-10%</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Non-Resident Buyer Surcharge (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.acquisitionTaxes.nonResidentSurchargePercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      acquisitionTaxes: { ...formData.acquisitionTaxes, nonResidentSurchargePercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono text-rose-400"
                />
                <span className="text-[10px] text-slate-500">e.g. Singapore ABSD 60%, UK Overseas +2%</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Legal, Survey & Notary Fees (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.acquisitionTaxes.legalAndNotaryPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      acquisitionTaxes: { ...formData.acquisitionTaxes, legalAndNotaryPercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Buyer Agent Fee (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.acquisitionTaxes.agentFeePercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      acquisitionTaxes: { ...formData.acquisitionTaxes, agentFeePercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 3: OPEX & OPERATING EXPENSES */}
          {activeTab === 'opex' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Property Management Fee (% Gross Rent)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.operatingExpenses.propertyManagementPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      operatingExpenses: { ...formData.operatingExpenses, propertyManagementPercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Maintenance / CapEx Reserve (% Gross Rent)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.operatingExpenses.maintenanceReservePercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      operatingExpenses: { ...formData.operatingExpenses, maintenanceReservePercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Fixed Annual HOA / Service Charge ({formData.localCurrency})
                </label>
                <input
                  type="number"
                  value={formData.operatingExpenses.hoaAndInsuranceAnnualLocal}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      operatingExpenses: { ...formData.operatingExpenses, hoaAndInsuranceAnnualLocal: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Vacancy Allowance (% Gross Rent)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.operatingExpenses.vacancyRatePercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      operatingExpenses: { ...formData.operatingExpenses, vacancyRatePercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Annual Property Tax (% Property Value)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.operatingExpenses.annualPropertyTaxPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      operatingExpenses: { ...formData.operatingExpenses, annualPropertyTaxPercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
                <span className="text-[10px] text-slate-500">e.g. US ~1.5%, Japan 1.4%, Dubai 0%</span>
              </div>
            </div>
          )}

          {/* TAB 4: TAX STRUCTURES */}
          {activeTab === 'taxes' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Rental Income Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.taxStructure.rentalIncomeTaxPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taxStructure: { ...formData.taxStructure, rentalIncomeTaxPercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono text-rose-300"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Building Annual Depreciation Shield (%/yr)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={formData.taxStructure.allowableDepreciationPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taxStructure: { ...formData.taxStructure, allowableDepreciationPercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono text-emerald-400"
                />
                <span className="text-[10px] text-slate-500">Deducts building value from taxable income</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Exit Capital Gains Tax Rate (CGT %)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.taxStructure.capitalGainsTaxPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taxStructure: { ...formData.taxStructure, capitalGainsTaxPercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  CGT Holding Exemption Threshold (Years)
                </label>
                <input
                  type="number"
                  value={formData.taxStructure.cgtHoldingPeriodExemptionYears}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taxStructure: { ...formData.taxStructure, cgtHoldingPeriodExemptionYears: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="sm:col-span-2 flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="interestDeductible"
                  checked={formData.taxStructure.mortgageInterestDeductible}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      taxStructure: { ...formData.taxStructure, mortgageInterestDeductible: e.target.checked }
                    })
                  }
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="interestDeductible" className="font-semibold text-slate-200 cursor-pointer">
                  Mortgage interest is tax-deductible against rental income in this jurisdiction
                </label>
              </div>
            </div>
          )}

          {/* TAB 5: FINANCING */}
          {activeTab === 'financing' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 flex items-center space-x-2 pb-2 border-b border-slate-800">
                <input
                  type="checkbox"
                  id="useMortgage"
                  checked={formData.financing.useMortgage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      financing: { ...formData.financing, useMortgage: e.target.checked }
                    })
                  }
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="useMortgage" className="font-bold text-white cursor-pointer text-sm">
                  Enable Foreign Investor Mortgage Debt Financing
                </label>
              </div>

              {formData.financing.useMortgage && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Loan-To-Value Ratio (LTV %)
                    </label>
                    <input
                      type="number"
                      value={formData.financing.ltvPercent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          financing: { ...formData.financing, ltvPercent: Number(e.target.value) }
                        })
                      }
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono font-bold text-cyan-400"
                      min="10"
                      max="90"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Annual Mortgage Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.financing.interestRatePercent}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          financing: { ...formData.financing, interestRatePercent: Number(e.target.value) }
                        })
                      }
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      Mortgage Loan Term (Years)
                    </label>
                    <input
                      type="number"
                      value={formData.financing.loanTermYears}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          financing: { ...formData.financing, loanTermYears: Number(e.target.value) }
                        })
                      }
                      className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-4">
                    <input
                      type="checkbox"
                      id="interestOnly"
                      checked={formData.financing.isInterestOnly}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          financing: { ...formData.financing, isInterestOnly: e.target.checked }
                        })
                      }
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                    />
                    <label htmlFor="interestOnly" className="font-semibold text-slate-200 cursor-pointer">
                      Interest-Only Mortgage Payment Structure
                    </label>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 6: MACRO & FX DRIFT */}
          {activeTab === 'macro' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Expected Capital Appreciation CAGR (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.macro.expectedAppreciationAnnualPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macro: { ...formData.macro, expectedAppreciationAnnualPercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Expected Rental Growth Rate (%/yr)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.macro.expectedRentGrowthAnnualPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macro: { ...formData.macro, expectedRentGrowthAnnualPercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Annual Inflation Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.macro.expectedInflationAnnualPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macro: { ...formData.macro, expectedInflationAnnualPercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Annual FX Currency Drift vs Base Currency (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={formData.macro.fxAnnualDriftPercent}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      macro: { ...formData.macro, fxAnnualDriftPercent: Number(e.target.value) }
                    })
                  }
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs font-mono text-cyan-400 font-bold"
                />
                <span className="text-[10px] text-slate-500">
                  Positive (+) = Local currency strengthens against Base Currency
                </span>
              </div>
            </div>
          )}

        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-end space-x-3 bg-slate-900/90">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save & Recalculate Model</span>
          </button>
        </div>

      </div>
    </div>
  );
};
