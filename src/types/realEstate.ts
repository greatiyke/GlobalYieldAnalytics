export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'AED' | 'SGD' | 'AUD' | 'CAD' | 'IDR' | 'CHF';

export type PropertyType = 
  | 'Residential Apartment' 
  | 'Single Family Home' 
  | 'Luxury Villa' 
  | 'Short-Term Rental' 
  | 'Commercial Retail';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  usdExchangeRate: number; // 1 USD = X Local Currency
}

export interface AcquisitionTaxes {
  stampDutyPercent: number; // E.g., UK SDLT, Spain ITP
  nonResidentSurchargePercent: number; // E.g., UK +2%, Singapore ABSD 60%
  legalAndNotaryPercent: number; // Legal & survey fees
  agentFeePercent: number; // Buyer broker fee
}

export interface OperatingExpenses {
  propertyManagementPercent: number; // % of gross rent
  maintenanceReservePercent: number; // % of gross rent or asset value
  hoaAndInsuranceAnnualLocal: number; // Fixed annual HOA & landlord insurance
  vacancyRatePercent: number; // % of gross rent lost to vacancy
  annualPropertyTaxPercent: number; // % of asset value (e.g. US ~1.5%, Japan 1.4%)
}

export interface TaxStructure {
  rentalIncomeTaxPercent: number; // Local tax rate on rental income
  allowableDepreciationPercent: number; // Annual building depreciation tax deduction %
  mortgageInterestDeductible: boolean; // Can deduct mortgage interest from rental income
  capitalGainsTaxPercent: number; // CGT on sale
  cgtHoldingPeriodExemptionYears: number; // Years after which CGT drops or is exempt
  cgtExemptAfterYearsRate?: number; // CGT rate after exemption threshold
}

export interface MortgageFinancing {
  useMortgage: boolean;
  ltvPercent: number; // Loan to Value %
  interestRatePercent: number; // Annual mortgage rate
  loanTermYears: number; // Loan term
  isInterestOnly: boolean; // Interest only vs amortizing
}

export interface MacroFactors {
  expectedAppreciationAnnualPercent: number; // Capital appreciation CAGR %
  expectedInflationAnnualPercent: number; // Local inflation rate %
  expectedRentGrowthAnnualPercent: number; // Annual rental price increase %
  fxAnnualDriftPercent: number; // Currency appreciation (+) or depreciation (-) vs Base Currency %
}

export interface PropertyModel {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  localCurrency: CurrencyCode;
  purchasePriceLocal: number;
  monthlyGrossRentLocal: number;
  propertyType: PropertyType;
  holdingPeriodYears: number; // e.g. 10 years
  acquisitionTaxes: AcquisitionTaxes;
  operatingExpenses: OperatingExpenses;
  taxStructure: TaxStructure;
  financing: MortgageFinancing;
  macro: MacroFactors;
  notes: string;
  presetId?: string;
}

export interface MultiYearCashFlowRow {
  year: number;
  propertyValueLocal: number;
  propertyValueBase: number;
  grossRentLocal: number;
  grossRentBase: number;
  vacancyLossLocal: number;
  effectiveGrossRentLocal: number;
  operatingExpensesLocal: number;
  propertyTaxLocal: number;
  netOperatingIncomeLocal: number; // NOI
  debtServiceLocal: number; // Principal + Interest
  interestPaidLocal: number;
  principalPaidLocal: number;
  remainingLoanBalanceLocal: number;
  taxableRentalIncomeLocal: number;
  rentalIncomeTaxLocal: number;
  netCashFlowBeforeTaxLocal: number;
  netCashFlowAfterTaxLocal: number;
  netCashFlowAfterTaxBase: number;
  fxRateToUSD: number;
  fxRateToBaseCurrency: number;
  cumulativeCashFlowBase: number;
  totalEquityBase: number;
}

export interface FinancialMetrics {
  totalAcquisitionCostLocal: number;
  totalAcquisitionCostBase: number;
  equityInvestedLocal: number;
  equityInvestedBase: number;
  loanAmountLocal: number;
  loanAmountBase: number;
  
  initialGrossYieldPercent: number;
  initialNetYieldPercent: number;
  capRatePercent: number;
  initialCashOnCashPercent: number;
  debtServiceCoverageRatio: number; // DSCR
  
  unleveredIRRLocal: number;
  leveredIRRLocal: number;
  unleveredIRRBase: number;
  leveredIRRBase: number;
  
  equityMultipleBase: number;
  npvBase: number;
  
  totalNetCashFlowsBase: number;
  exitPropertyValueLocal: number;
  exitPropertyValueBase: number;
  exitCapitalGainsTaxLocal: number;
  exitBrokerFeesLocal: number;
  exitNetProceedsBase: number;
  
  schedule: MultiYearCashFlowRow[];
}

export type InvestmentScenario = 'bear' | 'base' | 'bull';

export interface SensitivityMatrixCell {
  fxDrift: number; // e.g., -10%, 0%, +10%
  appreciationRate: number; // e.g., 1%, 3%, 5%
  leveredIRRBase: number;
  cashOnCashPercent: number;
}
