import type { PropertyModel, FinancialMetrics, CurrencyCode } from '../types/realEstate';

export function exportPropertyScheduleToCSV(
  property: PropertyModel,
  metrics: FinancialMetrics,
  baseCurrency: CurrencyCode
): void {
  const headers = [
    'Year',
    `Property Value (${property.localCurrency})`,
    `Property Value (${baseCurrency})`,
    `Gross Rent (${property.localCurrency})`,
    `Gross Rent (${baseCurrency})`,
    `Vacancy Loss (${property.localCurrency})`,
    `OpEx (${property.localCurrency})`,
    `Property Tax (${property.localCurrency})`,
    `NOI (${property.localCurrency})`,
    `Debt Service (${property.localCurrency})`,
    `Rental Income Tax (${property.localCurrency})`,
    `Net Cash Flow After Tax (${property.localCurrency})`,
    `Net Cash Flow After Tax (${baseCurrency})`,
    `Cumulative Cash Flow (${baseCurrency})`,
    `Total Net Equity (${baseCurrency})`
  ];

  const rows = metrics.schedule.map(row => [
    row.year,
    Math.round(row.propertyValueLocal),
    Math.round(row.propertyValueBase),
    Math.round(row.grossRentLocal),
    Math.round(row.grossRentBase),
    Math.round(row.vacancyLossLocal),
    Math.round(row.operatingExpensesLocal),
    Math.round(row.propertyTaxLocal),
    Math.round(row.netOperatingIncomeLocal),
    Math.round(row.debtServiceLocal),
    Math.round(row.rentalIncomeTaxLocal),
    Math.round(row.netCashFlowAfterTaxLocal),
    Math.round(row.netCashFlowAfterTaxBase),
    Math.round(row.cumulativeCashFlowBase),
    Math.round(row.totalEquityBase)
  ]);

  const csvContent = [
    `# GlobalYield Analytics - Property Financial Model Export`,
    `# Property Name: ${property.name}`,
    `# Market: ${property.city}, ${property.country}`,
    `# Base Currency: ${baseCurrency}`,
    `# Levered IRR (${baseCurrency}): ${metrics.leveredIRRBase.toFixed(2)}%`,
    `# Equity Multiple: ${metrics.equityMultipleBase.toFixed(2)}x`,
    `# Net Rental Yield: ${metrics.initialNetYieldPercent.toFixed(2)}%`,
    '',
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${property.name.toLowerCase().replace(/\s+/g, '_')}_financial_model.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
