import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ScheduleShell } from "@/components/schedule/schedule-shell";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { hasLocale } from "@/lib/i18n/config";
import { SITE_URL, buildLanguageAlternates } from "@/lib/seo";
import { getWorldCupFixtures } from "@/lib/world-cup/source";

type LangPageProps = {
  params: Promise<{ lang: string }>;
};

const SOCIAL_IMAGE_ALT =
  "FIFA World Cup 2026 trophy - schedule of all 104 matches in Brazil time.";
const OG_IMAGE_PATH = "/opengraph-image.png";
const TWITTER_IMAGE_PATH = "/twitter-image.png";

export async function generateMetadata({ params }: LangPageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const dictionary = await getDictionary(lang);
  const { meta } = dictionary;
  const canonical = `${SITE_URL}/${lang}`;
  const alternateLocales = (["pt_BR", "en_US", "es_ES"] as const).filter(
    (value) => value !== meta.ogLocale,
  );

  return {
    title: { absolute: `${meta.title} — ${meta.siteName}` },
    description: meta.description,
    keywords: meta.keywords,
    applicationName: meta.siteName,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(lang),
    },
    openGraph: {
      type: "website",
      siteName: meta.siteName,
      title: meta.ogTitle,
      description: meta.ogDescription,
      url: canonical,
      locale: meta.ogLocale,
      alternateLocale: [...alternateLocales],
      images: [
        {
          url: OG_IMAGE_PATH,
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.ogTitle,
      description: meta.ogDescription,
      images: [
        {
          url: TWITTER_IMAGE_PATH,
          alt: SOCIAL_IMAGE_ALT,
        },
      ],
    },
  };
}

async function loadFixtures() {
  try {
    return await getWorldCupFixtures();
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function LangHomePage({ params }: LangPageProps) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dictionary = await getDictionary(lang);
  const fixtures = await loadFixtures();

  if (!fixtures) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-16">
        <div className="w-full rounded-3xl border border-red-300/20 bg-red-500/10 p-6 text-sm text-red-100">
          {dictionary.page.fixtureUnavailable}
        </div>
      </main>
    );
  }

  return (
    <Suspense
      fallback={
        <main className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-16">
          <div className="w-full rounded-3xl border border-white/20 bg-white/10 p-6 text-sm text-zinc-100">
            {dictionary.page.loading}
          </div>
        </main>
      }
    >
      <ScheduleShell fixtures={fixtures} locale={lang} dictionary={dictionary} />
    </Suspense>
  );
}
