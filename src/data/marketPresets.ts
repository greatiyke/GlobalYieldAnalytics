import type { PropertyModel, Currency } from '../types/realEstate';

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', usdExchangeRate: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', usdExchangeRate: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', usdExchangeRate: 0.78 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', usdExchangeRate: 155.0 },
  { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', usdExchangeRate: 3.67 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', usdExchangeRate: 1.34 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', usdExchangeRate: 1.52 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', usdExchangeRate: 1.36 },
  { code: 'CHF', symbol: 'CHF ', name: 'Swiss Franc', usdExchangeRate: 0.89 },
  { code: 'IDR', symbol: 'Rp ', name: 'Indonesian Rupiah', usdExchangeRate: 15800.0 }
];

export const GLOBAL_MARKET_PRESETS: PropertyModel[] = [
  {
    id: 'preset-usa-miami',
    presetId: 'usa-miami',
    name: 'BricKell Bay Residence',
    city: 'Miami',
    country: 'United States',
    countryCode: 'US',
    flagEmoji: '🇺🇸',
    localCurrency: 'USD',
    purchasePriceLocal: 850000,
    monthlyGrossRentLocal: 5400,
    propertyType: 'Residential Apartment',
    holdingPeriodYears: 10,
    acquisitionTaxes: {
      stampDutyPercent: 0.7,
      nonResidentSurchargePercent: 0.0,
      legalAndNotaryPercent: 1.2,
      agentFeePercent: 0.0 // Paid by seller in US
    },
    operatingExpenses: {
      propertyManagementPercent: 8.0,
      maintenanceReservePercent: 5.0,
      hoaAndInsuranceAnnualLocal: 7200,
      vacancyRatePercent: 5.0,
      annualPropertyTaxPercent: 1.65
    },
    taxStructure: {
      rentalIncomeTaxPercent: 22.0,
      allowableDepreciationPercent: 2.75, // 27.5 year straight line US residential
      mortgageInterestDeductible: true,
      capitalGainsTaxPercent: 20.0,
      cgtHoldingPeriodExemptionYears: 0
    },
    financing: {
      useMortgage: true,
      ltvPercent: 70,
      interestRatePercent: 6.5,
      loanTermYears: 30,
      isInterestOnly: false
    },
    macro: {
      expectedAppreciationAnnualPercent: 4.5,
      expectedInflationAnnualPercent: 2.5,
      expectedRentGrowthAnnualPercent: 3.5,
      fxAnnualDriftPercent: 0.0 // Base reference currency USD
    },
    notes: 'Prime waterfront condo in Miami. Strong rental demand backed by corporate migration, with US IRS building depreciation tax shield.'
  },
  {
    id: 'preset-uk-london',
    presetId: 'uk-london',
    name: 'Kensington Park Apartment',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    flagEmoji: '🇬🇧',
    localCurrency: 'GBP',
    purchasePriceLocal: 650000,
    monthlyGrossRentLocal: 3200,
    propertyType: 'Residential Apartment',
    holdingPeriodYears: 10,
    acquisitionTaxes: {
      stampDutyPercent: 5.0, // SDLT base bracket
      nonResidentSurchargePercent: 2.0, // UK overseas buyer surcharge
      legalAndNotaryPercent: 1.5,
      agentFeePercent: 0.0
    },
    operatingExpenses: {
      propertyManagementPercent: 10.0,
      maintenanceReservePercent: 4.0,
      hoaAndInsuranceAnnualLocal: 3600, // Service charge + ground rent
      vacancyRatePercent: 4.0,
      annualPropertyTaxPercent: 0.0 // Paid by tenant via Council Tax in UK
    },
    taxStructure: {
      rentalIncomeTaxPercent: 20.0, // Non-resident basic rate
      allowableDepreciationPercent: 0.0,
      mortgageInterestDeductible: false, // Restricted via Section 24 20% tax credit
      capitalGainsTaxPercent: 24.0,
      cgtHoldingPeriodExemptionYears: 0
    },
    financing: {
      useMortgage: true,
      ltvPercent: 65,
      interestRatePercent: 5.2,
      loanTermYears: 25,
      isInterestOnly: true // Buy-to-let interest only common in UK
    },
    macro: {
      expectedAppreciationAnnualPercent: 3.8,
      expectedInflationAnnualPercent: 2.2,
      expectedRentGrowthAnnualPercent: 4.0,
      fxAnnualDriftPercent: 0.5 // Projected slight GBP recovery
    },
    notes: 'Prime Central London residential. Stable blue-chip asset with high tenant quality and long-term capital preservation.'
  },
  {
    id: 'preset-uae-dubai',
    presetId: 'uae-dubai',
    name: 'Downtown Marina Tower',
    city: 'Dubai',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    flagEmoji: '🇦🇪',
    localCurrency: 'AED',
    purchasePriceLocal: 2200000,
    monthlyGrossRentLocal: 15500,
    propertyType: 'Residential Apartment',
    holdingPeriodYears: 10,
    acquisitionTaxes: {
      stampDutyPercent: 4.0, // DLD Land Department fee
      nonResidentSurchargePercent: 0.0,
      legalAndNotaryPercent: 0.5,
      agentFeePercent: 2.0
    },
    operatingExpenses: {
      propertyManagementPercent: 7.0,
      maintenanceReservePercent: 4.0,
      hoaAndInsuranceAnnualLocal: 24000, // Service charges per sqft
      vacancyRatePercent: 5.0,
      annualPropertyTaxPercent: 0.0 // 0% property tax in Dubai
    },
    taxStructure: {
      rentalIncomeTaxPercent: 0.0, // Tax free jurisdiction
      allowableDepreciationPercent: 0.0,
      mortgageInterestDeductible: false,
      capitalGainsTaxPercent: 0.0, // 0% CGT
      cgtHoldingPeriodExemptionYears: 0
    },
    financing: {
      useMortgage: true,
      ltvPercent: 60,
      interestRatePercent: 5.0,
      loanTermYears: 25,
      isInterestOnly: false
    },
    macro: {
      expectedAppreciationAnnualPercent: 5.0,
      expectedInflationAnnualPercent: 2.0,
      expectedRentGrowthAnnualPercent: 4.5,
      fxAnnualDriftPercent: 0.0 // AED is pegged to USD at 3.6725
    },
    notes: 'Zero income tax and zero capital gains tax jurisdiction. High net yields, AED currency pegged 1:1 to USD.'
  },
  {
    id: 'preset-japan-tokyo',
    presetId: 'japan-tokyo',
    name: 'Roppongi Hills Residence',
    city: 'Tokyo',
    country: 'Japan',
    countryCode: 'JP',
    flagEmoji: '🇯🇵',
    localCurrency: 'JPY',
    purchasePriceLocal: 72000000,
    monthlyGrossRentLocal: 340000,
    propertyType: 'Residential Apartment',
    holdingPeriodYears: 10,
    acquisitionTaxes: {
      stampDutyPercent: 0.5,
      nonResidentSurchargePercent: 0.0,
      legalAndNotaryPercent: 1.5,
      agentFeePercent: 3.0 // Standard 3% + 60k yen agent fee
    },
    operatingExpenses: {
      propertyManagementPercent: 5.0,
      maintenanceReservePercent: 5.0,
      hoaAndInsuranceAnnualLocal: 360000, // Building repair reserve fund + insurance
      vacancyRatePercent: 3.0,
      annualPropertyTaxPercent: 1.4 // Fixed Asset & City Planning Tax
    },
    taxStructure: {
      rentalIncomeTaxPercent: 20.0, // Non-resident flat tax on net rental income
      allowableDepreciationPercent: 3.5, // Generous RC building depreciation shield
      mortgageInterestDeductible: true,
      capitalGainsTaxPercent: 15.315, // Long-term CGT rate (held over 5 years)
      cgtHoldingPeriodExemptionYears: 5
    },
    financing: {
      useMortgage: true,
      ltvPercent: 70,
      interestRatePercent: 2.2, // Low yen interest rates
      loanTermYears: 30,
      isInterestOnly: false
    },
    macro: {
      expectedAppreciationAnnualPercent: 2.5,
      expectedInflationAnnualPercent: 1.2,
      expectedRentGrowthAnnualPercent: 2.0,
      fxAnnualDriftPercent: 1.0 // Expected JPY recovery from historic lows
    },
    notes: 'Ultra-low borrowing cost market in safe haven Tokyo. Solid occupancy rate exceeding 97% with strong depreciation tax shields.'
  },
  {
    id: 'preset-portugal-lisbon',
    presetId: 'portugal-lisbon',
    name: 'Chiado Heritage Flat',
    city: 'Lisbon',
    country: 'Portugal',
    countryCode: 'PT',
    flagEmoji: '🇵🇹',
    localCurrency: 'EUR',
    purchasePriceLocal: 480000,
    monthlyGrossRentLocal: 2400,
    propertyType: 'Residential Apartment',
    holdingPeriodYears: 10,
    acquisitionTaxes: {
      stampDutyPercent: 0.8,
      nonResidentSurchargePercent: 0.0,
      legalAndNotaryPercent: 1.5,
      agentFeePercent: 0.0 // Paid by vendor in Portugal
    },
    operatingExpenses: {
      propertyManagementPercent: 8.0,
      maintenanceReservePercent: 4.0,
      hoaAndInsuranceAnnualLocal: 1400,
      vacancyRatePercent: 4.0,
      annualPropertyTaxPercent: 0.4 // IMI tax (0.3% - 0.45%)
    },
    taxStructure: {
      rentalIncomeTaxPercent: 25.0, // Reduced non-resident rental tax
      allowableDepreciationPercent: 1.0,
      mortgageInterestDeductible: false,
      capitalGainsTaxPercent: 28.0, // 28% flat CGT rate for non-residents
      cgtHoldingPeriodExemptionYears: 0
    },
    financing: {
      useMortgage: true,
      ltvPercent: 70,
      interestRatePercent: 3.8,
      loanTermYears: 25,
      isInterestOnly: false
    },
    macro: {
      expectedAppreciationAnnualPercent: 4.2,
      expectedInflationAnnualPercent: 2.0,
      expectedRentGrowthAnnualPercent: 3.5,
      fxAnnualDriftPercent: 0.2 // EUR vs USD stability
    },
    notes: 'Historic capital in Western Europe. High tourism demand and growing tech ecosystem supporting residential asset values.'
  },
  {
    id: 'preset-singapore-sg',
    presetId: 'singapore-sg',
    name: 'Orchard Boulevard Residence',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    flagEmoji: '🇸🇬',
    localCurrency: 'SGD',
    purchasePriceLocal: 1950000,
    monthlyGrossRentLocal: 6500,
    propertyType: 'Residential Apartment',
    holdingPeriodYears: 10,
    acquisitionTaxes: {
      stampDutyPercent: 4.0, // BSD base rate
      nonResidentSurchargePercent: 60.0, // ABSD foreign buyer tax (60%)
      legalAndNotaryPercent: 0.5,
      agentFeePercent: 0.0
    },
    operatingExpenses: {
      propertyManagementPercent: 5.0,
      maintenanceReservePercent: 3.0,
      hoaAndInsuranceAnnualLocal: 4800, // Maintenance fee (MCST)
      vacancyRatePercent: 3.0,
      annualPropertyTaxPercent: 1.0 // Owner-non-occupier property tax
    },
    taxStructure: {
      rentalIncomeTaxPercent: 15.0, // Non-resident flat 24% or progressive
      allowableDepreciationPercent: 0.0,
      mortgageInterestDeductible: true,
      capitalGainsTaxPercent: 0.0, // Zero CGT in Singapore
      cgtHoldingPeriodExemptionYears: 0
    },
    financing: {
      useMortgage: true,
      ltvPercent: 50, // LTV cap for foreigners
      interestRatePercent: 3.5,
      loanTermYears: 25,
      isInterestOnly: false
    },
    macro: {
      expectedAppreciationAnnualPercent: 3.5,
      expectedInflationAnnualPercent: 1.8,
      expectedRentGrowthAnnualPercent: 3.0,
      fxAnnualDriftPercent: 0.5 // Strong SGD appreciation trend
    },
    notes: 'Tier-1 Asian financial center. Highest foreign buyer ABSD barrier (60%), but unmatched rule of law, zero capital gains tax, and currency strength.'
  },
  {
    id: 'preset-spain-madrid',
    presetId: 'spain-madrid',
    name: 'Chamberí Luxury Flat',
    city: 'Madrid',
    country: 'Spain',
    countryCode: 'ES',
    flagEmoji: '🇪🇸',
    localCurrency: 'EUR',
    purchasePriceLocal: 450000,
    monthlyGrossRentLocal: 2200,
    propertyType: 'Residential Apartment',
    holdingPeriodYears: 10,
    acquisitionTaxes: {
      stampDutyPercent: 6.0, // ITP in Madrid (6%)
      nonResidentSurchargePercent: 0.0,
      legalAndNotaryPercent: 1.5,
      agentFeePercent: 0.0
    },
    operatingExpenses: {
      propertyManagementPercent: 8.0,
      maintenanceReservePercent: 4.0,
      hoaAndInsuranceAnnualLocal: 1800, // Comunidad & Seguro
      vacancyRatePercent: 4.0,
      annualPropertyTaxPercent: 0.5 // IBI property tax
    },
    taxStructure: {
      rentalIncomeTaxPercent: 24.0, // Non-EU non-resident 24% tax rate
      allowableDepreciationPercent: 3.0, // 3% building value depreciation deduction
      mortgageInterestDeductible: true,
      capitalGainsTaxPercent: 19.0, // Non-resident CGT
      cgtHoldingPeriodExemptionYears: 0
    },
    financing: {
      useMortgage: true,
      ltvPercent: 65,
      interestRatePercent: 3.9,
      loanTermYears: 25,
      isInterestOnly: false
    },
    macro: {
      expectedAppreciationAnnualPercent: 4.0,
      expectedInflationAnnualPercent: 2.1,
      expectedRentGrowthAnnualPercent: 3.8,
      fxAnnualDriftPercent: 0.2
    },
    notes: 'Madrid central district asset. High yield potential with generous 3% annual building depreciation tax shield.'
  },
  {
    id: 'preset-indonesia-bali',
    presetId: 'indonesia-bali',
    name: 'Canggu Sanctuary Villa',
    city: 'Bali',
    country: 'Indonesia',
    countryCode: 'ID',
    flagEmoji: '🇮🇩',
    localCurrency: 'USD', // Transactions and rental pricing indexed in USD
    purchasePriceLocal: 340000,
    monthlyGrossRentLocal: 3800,
    propertyType: 'Luxury Villa',
    holdingPeriodYears: 10,
    acquisitionTaxes: {
      stampDutyPercent: 2.5, // Notary & transfer tax
      nonResidentSurchargePercent: 0.0,
      legalAndNotaryPercent: 1.5,
      agentFeePercent: 0.0
    },
    operatingExpenses: {
      propertyManagementPercent: 15.0, // Fully managed holiday rental villa operator
      maintenanceReservePercent: 6.0,
      hoaAndInsuranceAnnualLocal: 2800, // Pool, garden, security
      vacancyRatePercent: 20.0, // Short-term rental occupancy model (80% occupancy)
      annualPropertyTaxPercent: 0.2
    },
    taxStructure: {
      rentalIncomeTaxPercent: 10.0, // Final withholding tax for non-residents
      allowableDepreciationPercent: 0.0,
      mortgageInterestDeductible: false,
      capitalGainsTaxPercent: 10.0,
      cgtHoldingPeriodExemptionYears: 0
    },
    financing: {
      useMortgage: false, // Cash buyer investment market
      ltvPercent: 0,
      interestRatePercent: 0.0,
      loanTermYears: 0,
      isInterestOnly: false
    },
    macro: {
      expectedAppreciationAnnualPercent: 6.5,
      expectedInflationAnnualPercent: 3.0,
      expectedRentGrowthAnnualPercent: 4.0,
      fxAnnualDriftPercent: 0.0 // USD indexed contract
    },
    notes: 'High-yielding luxury lifestyle villa asset. High gross yields (13%+) driven by international short-term tourism rental demand.'
  }
];
