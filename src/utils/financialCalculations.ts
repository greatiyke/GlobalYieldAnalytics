import type {
  PropertyModel,
  FinancialMetrics,
  MultiYearCashFlowRow,
  CurrencyCode,
  InvestmentScenario,
  SensitivityMatrixCell
} from '../types/realEstate';
import { convertCurrency } from './currencyConverter';

/**
 * Calculates internal rate of return (IRR) for a series of cash flows using Newton-Raphson
 */
export function calculateIRR(cashFlows: number[]): number {
  if (cashFlows.length < 2) return 0;
  
  // Initial guess rate 10%
  let rate = 0.10;
  const maxIterations = 1000;
  const tolerance = 1e-7;

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    for (let t = 0; t < cashFlows.length; t++) {
      const discount = Math.pow(1 + rate, t);
      npv += cashFlows[t] / discount;
      dnpv -= (t * cashFlows[t]) / Math.pow(1 + rate, t + 1);
    }

    if (Math.abs(npv) < tolerance) {
      return rate * 100;
    }

    if (Math.abs(dnpv) < 1e-12) {
      break;
    }

    const newRate = rate - npv / dnpv;
    // Bound check to avoid divergence
    if (isNaN(newRate) || newRate <= -0.99 || newRate > 10.0) {
      break;
    }
    rate = newRate;
  }

  // Fallback binary search if Newton-Raphson fails to converge
  let low = -0.95;
  let high = 5.0;
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    let npv = 0;
    for (let t = 0; t < cashFlows.length; t++) {
      npv += cashFlows[t] / Math.pow(1 + mid, t);
    }
    if (Math.abs(npv) < tolerance) return mid * 100;
    if (npv > 0) low = mid;
    else high = mid;
  }

  return ((low + high) / 2) * 100;
}

/**
 * Calculate Net Present Value given cash flows and annual discount rate %
 */
export function calculateNPV(discountRatePercent: number, cashFlows: number[]): number {
  const r = discountRatePercent / 100;
  return cashFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + r, t), 0);
}

/**
 * Main financial modeling engine for cross-border real estate properties
 */
export function calculatePropertyMetrics(
  property: PropertyModel,
  baseCurrency: CurrencyCode = 'USD',
  scenario: InvestmentScenario = 'base'
): FinancialMetrics {
  // Apply Scenario Multipliers if applicable
  let appreciationMod = 0;
  let rentGrowthMod = 0;
  let fxDriftMod = 0;

  if (scenario === 'bull') {
    appreciationMod = 1.5;
    rentGrowthMod = 1.0;
    fxDriftMod = 1.0;
  } else if (scenario === 'bear') {
    appreciationMod = -2.0;
    rentGrowthMod = -1.5;
    fxDriftMod = -1.5;
  }

  const appreciationRate = Math.max(-10, property.macro.expectedAppreciationAnnualPercent + appreciationMod);
  const rentGrowthRate = Math.max(-5, property.macro.expectedRentGrowthAnnualPercent + rentGrowthMod);
  const fxDriftPercent = property.macro.fxAnnualDriftPercent + fxDriftMod;
  const inflationRate = property.macro.expectedInflationAnnualPercent;

  // 1. Acquisition Cost Calculation
  const price = property.purchasePriceLocal;
  const stampDuty = price * (property.acquisitionTaxes.stampDutyPercent / 100);
  const nonResSurcharge = price * (property.acquisitionTaxes.nonResidentSurchargePercent / 100);
  const legalNotary = price * (property.acquisitionTaxes.legalAndNotaryPercent / 100);
  const agentFee = price * (property.acquisitionTaxes.agentFeePercent / 100);

  const totalAcquisitionFriction = stampDuty + nonResSurcharge + legalNotary + agentFee;
  const totalAcquisitionCostLocal = price + totalAcquisitionFriction;
  const totalAcquisitionCostBase = convertCurrency(totalAcquisitionCostLocal, property.localCurrency, baseCurrency, 0, 0);

  // 2. Loan & Mortgage Setup
  const useMortgage = property.financing.useMortgage;
  const loanAmountLocal = useMortgage ? price * (property.financing.ltvPercent / 100) : 0;
  const loanAmountBase = convertCurrency(loanAmountLocal, property.localCurrency, baseCurrency, 0, 0);

  const equityInvestedLocal = totalAcquisitionCostLocal - loanAmountLocal;
  const equityInvestedBase = convertCurrency(equityInvestedLocal, property.localCurrency, baseCurrency, 0, 0);

  // Monthly Debt Service calculation
  const monthlyRate = (property.financing.interestRatePercent / 100) / 12;
  const totalMonths = property.financing.loanTermYears * 12;
  
  let monthlyDebtService = 0;
  if (useMortgage && loanAmountLocal > 0) {
    if (property.financing.isInterestOnly) {
      monthlyDebtService = loanAmountLocal * monthlyRate;
    } else {
      if (monthlyRate > 0) {
        monthlyDebtService = loanAmountLocal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                             (Math.pow(1 + monthlyRate, totalMonths) - 1);
      } else {
        monthlyDebtService = loanAmountLocal / totalMonths;
      }
    }
  }

  const annualDebtServiceLocal = monthlyDebtService * 12;

  // Initial Year 1 Metrics
  const initialAnnualGrossRent = property.monthlyGrossRentLocal * 12;
  const initialGrossYieldPercent = (initialAnnualGrossRent / price) * 100;

  const initialVacancy = initialAnnualGrossRent * (property.operatingExpenses.vacancyRatePercent / 100);
  const initialEffectiveGrossRent = initialAnnualGrossRent - initialVacancy;
  const initialPropertyTax = price * (property.operatingExpenses.annualPropertyTaxPercent / 100);
  const initialOpEx = (initialEffectiveGrossRent * property.operatingExpenses.propertyManagementPercent / 100) +
                       (initialAnnualGrossRent * property.operatingExpenses.maintenanceReservePercent / 100) +
                       property.operatingExpenses.hoaAndInsuranceAnnualLocal;

  const initialNOILocal = initialEffectiveGrossRent - initialOpEx - initialPropertyTax;
  const initialNetYieldPercent = (initialNOILocal / totalAcquisitionCostLocal) * 100;
  const capRatePercent = (initialNOILocal / price) * 100;
  const dscr = annualDebtServiceLocal > 0 ? initialNOILocal / annualDebtServiceLocal : 999;

  // Year 1 Taxable Income
  const buildingDepreciationShield = price * 0.80 * (property.taxStructure.allowableDepreciationPercent / 100); // 80% building value assumption
  const year1Interest = useMortgage ? loanAmountLocal * (property.financing.interestRatePercent / 100) : 0;
  const year1DeductibleInterest = property.taxStructure.mortgageInterestDeductible ? year1Interest : 0;
  
  const taxableRentalIncomeYear1 = Math.max(0, initialNOILocal - year1DeductibleInterest - buildingDepreciationShield);
  const rentalIncomeTaxYear1 = taxableRentalIncomeYear1 * (property.taxStructure.rentalIncomeTaxPercent / 100);

  const initialCashFlowAfterTax = initialNOILocal - annualDebtServiceLocal - rentalIncomeTaxYear1;
  const initialCashOnCashPercent = equityInvestedLocal > 0 ? (initialCashFlowAfterTax / equityInvestedLocal) * 100 : 0;

  // 3. Multi-Year Schedule Generation
  const schedule: MultiYearCashFlowRow[] = [];
  let currentLoanBalance = loanAmountLocal;
  let cumulativeCashFlowBase = 0;

  const years = property.holdingPeriodYears;

  for (let t = 1; t <= years; t++) {
    const propVal = price * Math.pow(1 + appreciationRate / 100, t);
    const propValBase = convertCurrency(propVal, property.localCurrency, baseCurrency, fxDriftPercent, t);

    const grossRent = (property.monthlyGrossRentLocal * 12) * Math.pow(1 + rentGrowthRate / 100, t - 1);
    const grossRentBase = convertCurrency(grossRent, property.localCurrency, baseCurrency, fxDriftPercent, t);

    const vacancyLoss = grossRent * (property.operatingExpenses.vacancyRatePercent / 100);
    const effGrossRent = grossRent - vacancyLoss;

    const propTax = propVal * (property.operatingExpenses.annualPropertyTaxPercent / 100);
    const opEx = (effGrossRent * property.operatingExpenses.propertyManagementPercent / 100) +
                 (grossRent * property.operatingExpenses.maintenanceReservePercent / 100) +
                 (property.operatingExpenses.hoaAndInsuranceAnnualLocal * Math.pow(1 + inflationRate / 100, t - 1));

    const noi = effGrossRent - opEx - propTax;

    // Calculate Amortization for year t
    let interestPaidYear = 0;
    let principalPaidYear = 0;

    if (useMortgage && currentLoanBalance > 0) {
      if (property.financing.isInterestOnly) {
        interestPaidYear = currentLoanBalance * (property.financing.interestRatePercent / 100);
        principalPaidYear = 0;
      } else {
        for (let m = 0; m < 12; m++) {
          const interestMonth = currentLoanBalance * monthlyRate;
          const principalMonth = Math.min(currentLoanBalance, monthlyDebtService - interestMonth);
          interestPaidYear += interestMonth;
          principalPaidYear += principalMonth;
          currentLoanBalance -= principalMonth;
        }
      }
    }

    const debtServiceYear = interestPaidYear + principalPaidYear;

    // Tax calculation
    const deductibleInterest = property.taxStructure.mortgageInterestDeductible ? interestPaidYear : 0;
    const taxableRentalIncome = Math.max(0, noi - deductibleInterest - buildingDepreciationShield);
    const rentalIncomeTax = taxableRentalIncome * (property.taxStructure.rentalIncomeTaxPercent / 100);

    const cashFlowBeforeTax = noi - debtServiceYear;
    const cashFlowAfterTaxLocal = cashFlowBeforeTax - rentalIncomeTax;
    const cashFlowAfterTaxBase = convertCurrency(cashFlowAfterTaxLocal, property.localCurrency, baseCurrency, fxDriftPercent, t);

    cumulativeCashFlowBase += cashFlowAfterTaxBase;

    const fxRateUSD = convertCurrency(1, property.localCurrency, 'USD', fxDriftPercent, t);
    const fxRateBase = convertCurrency(1, property.localCurrency, baseCurrency, fxDriftPercent, t);
    const totalEquityBase = propValBase - convertCurrency(currentLoanBalance, property.localCurrency, baseCurrency, fxDriftPercent, t);

    schedule.push({
      year: t,
      propertyValueLocal: propVal,
      propertyValueBase: propValBase,
      grossRentLocal: grossRent,
      grossRentBase: grossRentBase,
      vacancyLossLocal: vacancyLoss,
      effectiveGrossRentLocal: effGrossRent,
      operatingExpensesLocal: opEx,
      propertyTaxLocal: propTax,
      netOperatingIncomeLocal: noi,
      debtServiceLocal: debtServiceYear,
      interestPaidLocal: interestPaidYear,
      principalPaidLocal: principalPaidYear,
      remainingLoanBalanceLocal: currentLoanBalance,
      taxableRentalIncomeLocal: taxableRentalIncome,
      rentalIncomeTaxLocal: rentalIncomeTax,
      netCashFlowBeforeTaxLocal: cashFlowBeforeTax,
      netCashFlowAfterTaxLocal: cashFlowAfterTaxLocal,
      netCashFlowAfterTaxBase: cashFlowAfterTaxBase,
      fxRateToUSD: fxRateUSD,
      fxRateToBaseCurrency: fxRateBase,
      cumulativeCashFlowBase: cumulativeCashFlowBase,
      totalEquityBase: totalEquityBase
    });
  }

  // 4. Exit / Terminal Capital Gains & Liquidation
  const exitPropertyValueLocal = schedule[years - 1].propertyValueLocal;
  const exitBrokerFeesLocal = exitPropertyValueLocal * 0.02; // 2% sale broker fee assumption
  const finalLoanBalanceLocal = schedule[years - 1].remainingLoanBalanceLocal;

  const netCapitalGainLocal = Math.max(0, exitPropertyValueLocal - totalAcquisitionCostLocal);
  let cgtRate = property.taxStructure.capitalGainsTaxPercent;

  if (property.taxStructure.cgtHoldingPeriodExemptionYears > 0 && 
      years >= property.taxStructure.cgtHoldingPeriodExemptionYears) {
    cgtRate = property.taxStructure.cgtExemptAfterYearsRate !== undefined 
      ? property.taxStructure.cgtExemptAfterYearsRate 
      : cgtRate * 0.5; // 50% discount if held past threshold
  }

  const exitCapitalGainsTaxLocal = netCapitalGainLocal * (cgtRate / 100);
  const exitNetProceedsLocal = exitPropertyValueLocal - exitBrokerFeesLocal - finalLoanBalanceLocal - exitCapitalGainsTaxLocal;

  const exitPropertyValueBase = convertCurrency(exitPropertyValueLocal, property.localCurrency, baseCurrency, fxDriftPercent, years);
  const exitNetProceedsBase = convertCurrency(exitNetProceedsLocal, property.localCurrency, baseCurrency, fxDriftPercent, years);

  // 5. IRR & Cash Flow vectors
  // Local Unlevered Cash Flows (Purchase Price vs NOI)
  const unleveredLocalCF = [-totalAcquisitionCostLocal];
  for (let t = 0; t < years; t++) {
    const isFinal = t === years - 1;
    const exitUnlevered = isFinal ? (exitPropertyValueLocal - exitBrokerFeesLocal - exitCapitalGainsTaxLocal) : 0;
    unleveredLocalCF.push(schedule[t].netOperatingIncomeLocal - schedule[t].rentalIncomeTaxLocal + exitUnlevered);
  }

  // Local Levered Cash Flows
  const leveredLocalCF = [-equityInvestedLocal];
  for (let t = 0; t < years; t++) {
    const isFinal = t === years - 1;
    const exitLevered = isFinal ? exitNetProceedsLocal : 0;
    leveredLocalCF.push(schedule[t].netCashFlowAfterTaxLocal + exitLevered);
  }

  // Base Currency Cash Flows
  const unleveredBaseCF = [-totalAcquisitionCostBase];
  for (let t = 0; t < years; t++) {
    const isFinal = t === years - 1;
    const exitBaseVal = isFinal ? convertCurrency(exitPropertyValueLocal - exitBrokerFeesLocal - exitCapitalGainsTaxLocal, property.localCurrency, baseCurrency, fxDriftPercent, years) : 0;
    const noiBase = convertCurrency(schedule[t].netOperatingIncomeLocal - schedule[t].rentalIncomeTaxLocal, property.localCurrency, baseCurrency, fxDriftPercent, t + 1);
    unleveredBaseCF.push(noiBase + exitBaseVal);
  }

  const leveredBaseCF = [-equityInvestedBase];
  for (let t = 0; t < years; t++) {
    const isFinal = t === years - 1;
    const exitBaseLevered = isFinal ? exitNetProceedsBase : 0;
    leveredBaseCF.push(schedule[t].netCashFlowAfterTaxBase + exitBaseLevered);
  }

  const unleveredIRRLocal = calculateIRR(unleveredLocalCF);
  const leveredIRRLocal = calculateIRR(leveredLocalCF);
  const unleveredIRRBase = calculateIRR(unleveredBaseCF);
  const leveredIRRBase = calculateIRR(leveredBaseCF);

  const totalNetCashFlowsBase = schedule.reduce((acc, row) => acc + row.netCashFlowAfterTaxBase, 0);
  const totalReturnCashBase = totalNetCashFlowsBase + exitNetProceedsBase;
  const equityMultipleBase = equityInvestedBase > 0 ? totalReturnCashBase / equityInvestedBase : 0;

  const discountRate = 7.0; // 7% benchmark discount rate for NPV
  const npvBase = calculateNPV(discountRate, leveredBaseCF);

  return {
    totalAcquisitionCostLocal,
    totalAcquisitionCostBase,
    equityInvestedLocal,
    equityInvestedBase,
    loanAmountLocal,
    loanAmountBase,
    initialGrossYieldPercent,
    initialNetYieldPercent,
    capRatePercent,
    initialCashOnCashPercent,
    debtServiceCoverageRatio: dscr,
    unleveredIRRLocal,
    leveredIRRLocal,
    unleveredIRRBase,
    leveredIRRBase,
    equityMultipleBase,
    npvBase,
    totalNetCashFlowsBase,
    exitPropertyValueLocal,
    exitPropertyValueBase,
    exitCapitalGainsTaxLocal,
    exitBrokerFeesLocal,
    exitNetProceedsBase,
    schedule
  };
}

/**
 * Generates a 2D matrix of Levered IRR (in Base Currency) across FX Drift vs Property Appreciation
 */
export function generateSensitivityMatrix(
  property: PropertyModel,
  baseCurrency: CurrencyCode = 'USD'
): SensitivityMatrixCell[][] {
  const fxDriftSteps = [-15, -10, -5, 0, 5, 10, 15]; // FX Drift %
  const appreciationSteps = [-5, -2, 0, 3, 5, 8, 12]; // Appreciation %

  const matrix: SensitivityMatrixCell[][] = [];

  for (const fxDrift of fxDriftSteps) {
    const row: SensitivityMatrixCell[] = [];
    for (const appreciationRate of appreciationSteps) {
      const customProperty: PropertyModel = {
        ...property,
        macro: {
          ...property.macro,
          expectedAppreciationAnnualPercent: appreciationRate,
          fxAnnualDriftPercent: fxDrift
        }
      };

      const metrics = calculatePropertyMetrics(customProperty, baseCurrency, 'base');
      row.push({
        fxDrift,
        appreciationRate,
        leveredIRRBase: metrics.leveredIRRBase,
        cashOnCashPercent: metrics.initialCashOnCashPercent
      });
    }
    matrix.push(row);
  }

  return matrix;
}
