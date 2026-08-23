import { useState, useMemo } from 'react';
import type { PropertyModel, CurrencyCode, InvestmentScenario } from './types/realEstate';
import { GLOBAL_MARKET_PRESETS } from './data/marketPresets';
import { calculatePropertyMetrics } from './utils/financialCalculations';

import { Header } from './components/Header';
import { MarketSelector } from './components/MarketSelector';
import { ComparisonGrid } from './components/ComparisonGrid';
import { PropertyCard } from './components/PropertyCard';
import { PropertyEditorModal } from './components/PropertyEditorModal';
import { FinancialCharts } from './components/FinancialCharts';
import { SensitivityHeatmap } from './components/SensitivityHeatmap';
import { CashFlowTable } from './components/CashFlowTable';
import { InvestmentMemoModal } from './components/InvestmentMemoModal';

import { Building2, Sparkles } from 'lucide-react';

export function App() {
  // Default active markets: Miami, London, Dubai
  const [activeProperties, setActiveProperties] = useState<PropertyModel[]>([
    GLOBAL_MARKET_PRESETS[0], // Miami USA
    GLOBAL_MARKET_PRESETS[1], // London UK
    GLOBAL_MARKET_PRESETS[2]  // Dubai UAE
  ]);

  const [baseCurrency, setBaseCurrency] = useState<CurrencyCode>('USD');
  const [scenario, setScenario] = useState<InvestmentScenario>('base');
  const [editingProperty, setEditingProperty] = useState<PropertyModel | null>(null);
  const [isMemoOpen, setIsMemoOpen] = useState<boolean>(false);

  // Recalculate metrics for all active properties when property params, base currency, or scenario changes
  const metricsList = useMemo(() => {
    return activeProperties.map((p) => calculatePropertyMetrics(p, baseCurrency, scenario));
  }, [activeProperties, baseCurrency, scenario]);

  // Handlers
  const handleSelectPreset = (preset: PropertyModel) => {
    if (activeProperties.length >= 4) return;
    const newProperty = {
      ...preset,
      id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
    };
    setActiveProperties([...activeProperties, newProperty]);
  };

  const handleRemoveProperty = (id: string) => {
    setActiveProperties(activeProperties.filter((p) => p.id !== id));
  };

  const handleCloneProperty = (propertyToClone: PropertyModel) => {
    if (activeProperties.length >= 4) return;
    const cloned: PropertyModel = {
      ...propertyToClone,
      id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: `${propertyToClone.name} (Copy)`
    };
    setActiveProperties([...activeProperties, cloned]);
  };

  const handleSaveProperty = (updatedProperty: PropertyModel) => {
    setActiveProperties(
      activeProperties.map((p) => (p.id === updatedProperty.id ? updatedProperty : p))
    );
  };

  const handleCreateCustomProperty = () => {
    if (activeProperties.length >= 4) return;
    const customProp: PropertyModel = {
      id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name: 'Custom Investment Property',
      city: 'Paris',
      country: 'France',
      countryCode: 'FR',
      flagEmoji: '🇫🇷',
      localCurrency: 'EUR',
      purchasePriceLocal: 500000,
      monthlyGrossRentLocal: 2600,
      propertyType: 'Residential Apartment',
      holdingPeriodYears: 10,
      acquisitionTaxes: {
        stampDutyPercent: 7.5, // Notary fees in France
        nonResidentSurchargePercent: 0.0,
        legalAndNotaryPercent: 1.0,
        agentFeePercent: 0.0
      },
      operatingExpenses: {
        propertyManagementPercent: 8.0,
        maintenanceReservePercent: 4.0,
        hoaAndInsuranceAnnualLocal: 1600,
        vacancyRatePercent: 4.0,
        annualPropertyTaxPercent: 0.5
      },
      taxStructure: {
        rentalIncomeTaxPercent: 20.0,
        allowableDepreciationPercent: 2.0,
        mortgageInterestDeductible: true,
        capitalGainsTaxPercent: 19.0,
        cgtHoldingPeriodExemptionYears: 22
      },
      financing: {
        useMortgage: true,
        ltvPercent: 70,
        interestRatePercent: 3.8,
        loanTermYears: 25,
        isInterestOnly: false
      },
      macro: {
        expectedAppreciationAnnualPercent: 3.5,
        expectedInflationAnnualPercent: 2.0,
        expectedRentGrowthAnnualPercent: 3.0,
        fxAnnualDriftPercent: 0.0
      },
      notes: 'Custom European property model'
    };

    setActiveProperties([...activeProperties, customProp]);
    setEditingProperty(customProp);
  };

  const handleResetPresets = () => {
    setActiveProperties([
      GLOBAL_MARKET_PRESETS[0],
      GLOBAL_MARKET_PRESETS[1],
      GLOBAL_MARKET_PRESETS[2]
    ]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Header */}
      <Header
        baseCurrency={baseCurrency}
        onBaseCurrencyChange={setBaseCurrency}
        scenario={scenario}
        onScenarioChange={setScenario}
        onAddProperty={handleCreateCustomProperty}
        onOpenMemo={() => setIsMemoOpen(true)}
        onResetPresets={handleResetPresets}
        activePropertyCount={activeProperties.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
        
        {/* Global Market Selector */}
        <MarketSelector
          activeProperties={activeProperties}
          onSelectPreset={handleSelectPreset}
          onRemoveProperty={handleRemoveProperty}
          onOpenCustomBuilder={handleCreateCustomProperty}
        />

        {/* Empty State Warning */}
        {activeProperties.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800 my-8">
            <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-bounce" />
            <h3 className="text-lg font-bold text-white mb-1">No Active Property Markets Selected</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
              Choose a preset market above or create a custom property model to compare cross-border cash flows and returns.
            </p>
            <button
              onClick={handleResetPresets}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              Load Default Global Markets
            </button>
          </div>
        ) : (
          <>
            {/* Side-by-Side Comparison Matrix */}
            <ComparisonGrid
              properties={activeProperties}
              metricsList={metricsList}
              baseCurrency={baseCurrency}
            />

            {/* Individual Property Model Cards Grid */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <span>Active Real Estate Assets ({activeProperties.length})</span>
                </h2>
                <span className="text-xs text-slate-400">
                  Click 'Configure' to modify taxes, debt leverage, or purchase friction
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {activeProperties.map((property, idx) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    metrics={metricsList[idx]}
                    baseCurrency={baseCurrency}
                    onEdit={() => setEditingProperty(property)}
                    onClone={() => handleCloneProperty(property)}
                    onRemove={() => handleRemoveProperty(property.id)}
                  />
                ))}
              </div>
            </section>

            {/* Financial Charts */}
            <FinancialCharts
              properties={activeProperties}
              metricsList={metricsList}
              baseCurrency={baseCurrency}
            />

            {/* Sensitivity Matrix */}
            <SensitivityHeatmap
              properties={activeProperties}
              baseCurrency={baseCurrency}
            />

            {/* Cash Flow Statement Schedule Table */}
            <CashFlowTable
              properties={activeProperties}
              metricsList={metricsList}
              baseCurrency={baseCurrency}
            />
          </>
        )}

      </main>

      {/* Property Editor Modal */}
      {editingProperty && (
        <PropertyEditorModal
          property={editingProperty}
          onSave={handleSaveProperty}
          onClose={() => setEditingProperty(null)}
        />
      )}

      {/* Investment Memorandum Pitch Book Modal */}
      {isMemoOpen && (
        <InvestmentMemoModal
          properties={activeProperties}
          metricsList={metricsList}
          baseCurrency={baseCurrency}
          scenario={scenario}
          onClose={() => setIsMemoOpen(false)}
        />
      )}

      {/* Sleek App Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 px-4 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">GlobalYield Analytics</span>
            <span>—</span>
            <span>Cross-Border Financial Comparison & Multi-Currency Risk Engine</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>IRC / DTT Tax Compliant Modeling</span>
            <span>•</span>
            <span>Purchasing Power Parity (PPP) FX Drift</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
