"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";

import { LOCALE_COOKIE_NAME, SUPPORTED_LOCALES, type AppLocale } from "@/lib/i18n/config";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  value: AppLocale;
  labels: AppDictionary["language"];
};

const LOCALE_LABEL_KEY: Record<AppLocale, keyof AppDictionary["language"]> = {
  "pt-BR": "ptBR",
  "en-US": "enUS",
  "es-ES": "esES",
};

export function LanguageSwitcher({ value, labels }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = (nextLocale: AppLocale) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return;

    segments[0] = nextLocale;
    const nextPathname = `/${segments.join("/")}`;
    const query = searchParams.toString();
    const href = query ? `${nextPathname}?${query}` : nextPathname;

    Cookies.set(LOCALE_COOKIE_NAME, nextLocale, {
      path: "/",
      sameSite: "lax",
      expires: 365,
    });
    router.replace(href, { scroll: false });
  };

  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto">
      <p className="text-xs text-zinc-400">{labels.label}</p>
      <div className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 p-1 backdrop-blur">
        {SUPPORTED_LOCALES.map((locale) => {
          const active = value === locale;
          return (
            <Button
              key={locale}
              type="button"
              size="sm"
              variant={active ? "solid" : "ghost"}
              onClick={() => onChange(locale)}
              className={cn("h-8 px-3 text-xs", active && "shadow-[0_0_16px_rgba(190,242,100,0.35)]")}
            >
              {labels[LOCALE_LABEL_KEY[locale]]}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
