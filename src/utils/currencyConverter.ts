import type { CurrencyCode } from '../types/realEstate';
import { SUPPORTED_CURRENCIES } from '../data/marketPresets';

/**
 * Converts an amount from source currency to target currency given spot rate and year FX drift
 */
export function convertCurrency(
  amount: number,
  fromCode: CurrencyCode,
  toCode: CurrencyCode,
  annualDriftPercent: number = 0,
  year: number = 0
): number {
  if (fromCode === toCode && annualDriftPercent === 0) {
    return amount;
  }

  const fromCurr = SUPPORTED_CURRENCIES.find(c => c.code === fromCode);
  const toCurr = SUPPORTED_CURRENCIES.find(c => c.code === toCode);

  if (!fromCurr || !toCurr) return amount;

  // Convert from local to USD first: amountInUSD = amount / fromCurr.usdExchangeRate
  const amountUSD = amount / fromCurr.usdExchangeRate;

  // Apply annual FX drift factor: (1 + drift/100)^year
  const driftFactor = Math.pow(1 + annualDriftPercent / 100, year);
  const adjustedUSD = amountUSD * driftFactor;

  // Convert from USD to target currency
  return adjustedUSD * toCurr.usdExchangeRate;
}

export function formatCurrency(
  amount: number,
  currencyCode: CurrencyCode,
  compact: boolean = false
): string {
  const currencyObj = SUPPORTED_CURRENCIES.find(c => c.code === currencyCode);
  const symbol = currencyObj ? currencyObj.symbol : '';

  if (compact) {
    if (Math.abs(amount) >= 1_000_000_000) {
      return `${symbol}${(amount / 1_000_000_000).toFixed(2)}B`;
    }
    if (Math.abs(amount) >= 1_000_000) {
      return `${symbol}${(amount / 1_000_000).toFixed(2)}M`;
    }
    if (Math.abs(amount) >= 1_000) {
      return `${symbol}${(amount / 1_000).toFixed(0)}k`;
    }
  }

  // Japanese Yen & Indonesian Rupiah usually formatted without decimals
  const decimals = (currencyCode === 'JPY' || currencyCode === 'IDR') ? 0 : 0;

  return `${symbol}${Math.round(amount).toLocaleString('en-US', {
    maximumFractionDigits: decimals
  })}`;
}
