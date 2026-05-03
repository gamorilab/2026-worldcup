export const SUPPORTED_LOCALES = ["pt-BR", "en-US", "es-ES"] as const;

export type AppLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: AppLocale = "pt-BR";
export const LOCALE_COOKIE_NAME = "preferred-locale";

export function hasLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale);
}

export function getSafeLocale(value: string | null | undefined): AppLocale {
  if (!value) return DEFAULT_LOCALE;
  return hasLocale(value) ? value : DEFAULT_LOCALE;
}
