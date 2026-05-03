import { Suspense } from "react";
import { notFound } from "next/navigation";

import { ScheduleShell } from "@/components/schedule/schedule-shell";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { hasLocale } from "@/lib/i18n/config";
import { getWorldCupFixtures } from "@/lib/world-cup/source";

type LangPageProps = {
  params: Promise<{ lang: string }>;
};

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
