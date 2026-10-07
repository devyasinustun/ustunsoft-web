import type { Locale } from "@/i18n/routing";

// 10000 → "10.000+" (tr), "10,000+" (en)
export function formatCount(value: number, locale: Locale): string {
  return `${new Intl.NumberFormat(locale).format(value)}+`;
}

// 4.5 → "4,5" (tr), "4.5" (en)
export function formatRating(value: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value);
}

// "2026-03" → "Mart 2026" (tr), "March 2026" (en)
export function formatMonth(value: string, locale: Locale): string {
  const [year, month] = value.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}

// Türkçede i/İ dönüşümü yerel ayar ister.
export function toUpper(value: string, locale: Locale): string {
  return value.toLocaleUpperCase(locale);
}
