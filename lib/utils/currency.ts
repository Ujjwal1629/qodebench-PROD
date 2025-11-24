/**
 * Currency Conversion Utilities
 *
 * Automatically detects user's region via browser locale and IP
 * Converts prices from INR (base currency) to local currency
 */

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AUD' | 'CAD' | 'SGD' | 'AED';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  rate: number; // Exchange rate relative to INR
  locale: string; // For number formatting
  name: string;
}

// Exchange rates (relative to INR = 1.0)
// Updated as of December 2024
const EXCHANGE_RATES: Record<Currency, number> = {
  INR: 1.0,      // Base currency
  USD: 0.012,    // 1 INR = 0.012 USD (approx 83 INR = 1 USD)
  EUR: 0.011,    // 1 INR = 0.011 EUR (approx 90 INR = 1 EUR)
  GBP: 0.0095,   // 1 INR = 0.0095 GBP (approx 105 INR = 1 GBP)
  AUD: 0.018,    // 1 INR = 0.018 AUD (approx 55 INR = 1 AUD)
  CAD: 0.017,    // 1 INR = 0.017 CAD (approx 60 INR = 1 CAD)
  SGD: 0.016,    // 1 INR = 0.016 SGD (approx 62 INR = 1 SGD)
  AED: 0.044,    // 1 INR = 0.044 AED (approx 23 INR = 1 AED)
};

const CURRENCY_INFO: Record<Currency, Omit<CurrencyInfo, 'rate'>> = {
  INR: { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee' },
  USD: { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', locale: 'de-DE', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound' },
  AUD: { code: 'AUD', symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar' },
  CAD: { code: 'CAD', symbol: 'C$', locale: 'en-CA', name: 'Canadian Dollar' },
  SGD: { code: 'SGD', symbol: 'S$', locale: 'en-SG', name: 'Singapore Dollar' },
  AED: { code: 'AED', symbol: 'د.إ', locale: 'ar-AE', name: 'UAE Dirham' },
};

/**
 * Detect user's currency based on browser locale and timezone
 * More reliable than IP detection for client-side
 */
export function detectUserCurrency(): Currency {
  if (typeof window === 'undefined') return 'INR';

  try {
    // Get browser locale
    const locale = navigator.language || 'en-IN';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Detect by timezone first (most reliable)
    if (timezone.includes('Kolkata') || timezone.includes('India')) return 'INR';
    if (timezone.includes('America')) {
      if (timezone.includes('Toronto') || timezone.includes('Vancouver')) return 'CAD';
      return 'USD';
    }
    if (timezone.includes('London') || timezone.includes('Europe/Dublin')) return 'GBP';
    if (timezone.includes('Europe')) return 'EUR';
    if (timezone.includes('Australia')) return 'AUD';
    if (timezone.includes('Singapore')) return 'SGD';
    if (timezone.includes('Dubai') || timezone.includes('Asia/Dubai')) return 'AED';

    // Fallback to browser locale
    if (locale.includes('IN') || locale.includes('hi')) return 'INR';
    if (locale.includes('GB') || locale.startsWith('en-GB')) return 'GBP';
    if (locale.startsWith('en-AU')) return 'AUD';
    if (locale.startsWith('en-CA')) return 'CAD';
    if (locale.startsWith('en-SG')) return 'SGD';
    if (locale.startsWith('ar-AE') || locale.startsWith('en-AE')) return 'AED';
    if (locale.startsWith('de') || locale.startsWith('fr') || locale.startsWith('es') || locale.startsWith('it')) return 'EUR';
    if (locale.startsWith('en')) return 'USD';

    return 'INR'; // Default to INR
  } catch {
    return 'INR';
  }
}

/**
 * Convert INR price to target currency
 */
export function convertPrice(inrPrice: number, targetCurrency: Currency): number {
  const rate = EXCHANGE_RATES[targetCurrency];
  return inrPrice * rate;
}

/**
 * Format price with currency symbol and appropriate rounding
 */
export function formatPrice(amount: number, currency: Currency, options?: {
  decimals?: number;
  showFree?: boolean;
}): string {
  const { decimals = 0, showFree = true } = options || {};

  if (amount === 0 && showFree) {
    return 'Free';
  }

  const info = CURRENCY_INFO[currency];
  const rate = EXCHANGE_RATES[currency];

  const convertedAmount = amount * rate;

  // Smart rounding based on currency
  let roundedAmount: number;
  if (currency === 'INR') {
    // INR: Round to nearest 10
    roundedAmount = Math.round(convertedAmount / 10) * 10;
  } else if (currency === 'USD' || currency === 'EUR' || currency === 'GBP' || currency === 'SGD') {
    // Major currencies: Round to nearest 1 or 5
    roundedAmount = Math.round(convertedAmount);
  } else {
    // Others: Round to nearest 10
    roundedAmount = Math.round(convertedAmount / 10) * 10;
  }

  // Format with locale-specific number formatting
  const formatted = new Intl.NumberFormat(info.locale, {
    style: 'currency',
    currency: info.code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(roundedAmount);

  return formatted;
}

/**
 * Get full currency info with exchange rate
 */
export function getCurrencyInfo(currency: Currency): CurrencyInfo {
  return {
    ...CURRENCY_INFO[currency],
    rate: EXCHANGE_RATES[currency],
  };
}

/**
 * Get all supported currencies
 */
export function getSupportedCurrencies(): Currency[] {
  return Object.keys(CURRENCY_INFO) as Currency[];
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_INFO[currency].symbol;
}
