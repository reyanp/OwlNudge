// Number formatting utilities for compact display with full precision tooltips

export type LocaleCurrency = {
  locale?: string;   // e.g., "en-US"
  currency?: string; // e.g., "USD"
};

export function formatFullCurrency(
  value: number,
  { locale = "en-US", currency = "USD" }: LocaleCurrency = {}
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: Math.abs(value) < 1 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactCurrency(
  value: number,
  { locale = "en-US", currency = "USD" }: LocaleCurrency = {}
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: Math.abs(value) < 10_000 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatFullPercent(value: number, locale = "en-US") {
  // value as decimal (0.684 -> "68.4%")
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatCompactPercent(value: number, locale = "en-US") {
  const abs = Math.abs(value);
  const digits = abs < 0.1 ? 2 : abs < 1 ? 1 : 0;
  
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatCompactNumber(value: number, locale = "en-US") {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: Math.abs(value) < 10_000 ? 0 : 1,
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatFullNumber(value: number, locale = "en-US") {
  return new Intl.NumberFormat(locale).format(value);
}