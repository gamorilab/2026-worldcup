import type { AppLocale } from "@/lib/i18n/config";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://copa.gamori.dev");

export const SITE_AUTHOR = {
  name: "gamori",
  email: "contact@gamori.dev",
  url: "https://gamori.dev",
};

export function buildLanguageAlternates(currentLocale?: AppLocale) {
  const languages = SUPPORTED_LOCALES.reduce<Record<string, string>>((acc, locale) => {
    acc[locale] = `${SITE_URL}/${locale}`;
    return acc;
  }, {});

  languages["x-default"] = `${SITE_URL}/${currentLocale ?? SUPPORTED_LOCALES[0]}`;

  return languages;
}
