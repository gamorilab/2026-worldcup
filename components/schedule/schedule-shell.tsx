"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, Star } from "lucide-react";

import { GroupNav } from "@/components/schedule/group-nav";
import { HorizontalDragScroll } from "@/components/schedule/horizontal-drag-scroll";
import { LanguageSwitcher } from "@/components/schedule/language-switcher";
import { MatchCard } from "@/components/schedule/match-card";
import { PHASE_ITEMS, PhaseNav } from "@/components/schedule/phase-nav";
import { TeamCountryCombobox } from "@/components/schedule/team-country-combobox";
import { TimezoneSwitcher } from "@/components/schedule/timezone-switcher";
import { Button } from "@/components/ui/button";
import type { AppLocale } from "@/lib/i18n/config";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import {
  countryMetaFromKey,
  countryMetaFromTeam,
  flagPathForCountry,
  localizeCountry,
  type Continent,
} from "@/lib/world-cup/geo";
import { formatDateOnly, formatKickoffInTimezone } from "@/lib/world-cup/timezones";
import { formatCountdown, getCountdownToKickoff } from "@/lib/world-cup/timezones";
import {
  CURATED_TIMEZONES,
  type AppTimezone,
  type HostCountry,
  type MatchPhase,
  type WorldCupFixture,
} from "@/lib/world-cup/types";
import { useSharedNow } from "./use-shared-now";

type ScheduleShellProps = {
  fixtures: WorldCupFixture[];
  locale: AppLocale;
  dictionary: AppDictionary;
};

const PHASE_SET = new Set(PHASE_ITEMS);
const HOST_COUNTRIES: HostCountry[] = ["all", "United States", "Mexico", "Canada"];
const DEBOUNCE_MS = 220;
const FAVORITES_STORAGE_KEY = "copa.favorite-fixtures.v1";
const FAVORITE_CHIP_TRANSITION = { duration: 0.18, ease: [0.2, 0.8, 0.2, 1] } as const;
const FAVORITE_CHIP_MOTION = {
  initial: { opacity: 0, y: 10, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.985 },
} as const;
const FAVORITE_CHIP_REDUCED_MOTION = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

function getPhaseParam(value: string | null): MatchPhase {
  return value && PHASE_SET.has(value as MatchPhase) ? (value as MatchPhase) : "all";
}

function getTimezoneParam(value: string | null): AppTimezone {
  return value && CURATED_TIMEZONES.includes(value as AppTimezone)
    ? (value as AppTimezone)
    : "America/Sao_Paulo";
}

function getCountryParam(value: string | null): HostCountry {
  return value && HOST_COUNTRIES.includes(value as HostCountry)
    ? (value as HostCountry)
    : "all";
}

export function ScheduleShell({ fixtures, locale, dictionary }: ScheduleShellProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastQueryRef = useRef<string | null>(null);
  const favoritesHydratedRef = useRef(false);
  const [isDesktopHover, setIsDesktopHover] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const [favoriteFixtureIds, setFavoriteFixtureIds] = useState<string[]>([]);

  const phase = getPhaseParam(searchParams.get("phase"));
  const group = searchParams.get("group") ?? "all";
  const timezone = getTimezoneParam(searchParams.get("tz"));
  const date = searchParams.get("date") ?? "all";
  const entity = searchParams.get("entity") ?? "";
  const country = getCountryParam(searchParams.get("country"));
  const hostCountryLabels = useMemo<Record<WorldCupFixture["hostCountry"], string>>(
    () => ({
      "United States": dictionary.filters.hostCountryUnitedStates,
      Mexico: dictionary.filters.hostCountryMexico,
      Canada: dictionary.filters.hostCountryCanada,
    }),
    [dictionary.filters.hostCountryCanada, dictionary.filters.hostCountryMexico, dictionary.filters.hostCountryUnitedStates],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setIsDesktopHover(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (!raw) {
        favoritesHydratedRef.current = true;
        return;
      }

      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        favoritesHydratedRef.current = true;
        return;
      }

      const normalized = Array.from(
        new Set(parsed.filter((value): value is string => typeof value === "string")),
      );

      window.setTimeout(() => {
        setFavoriteFixtureIds(normalized);
        favoritesHydratedRef.current = true;
      }, 0);
    } catch {
      favoritesHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!favoritesHydratedRef.current) return;
    try {
      window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteFixtureIds));
    } catch {
      // Ignore storage write errors (private mode / quota).
    }
  }, [favoriteFixtureIds]);

  const updateParams = (
    updates: Record<string, string | null>,
    options?: { debounce?: boolean },
  ) => {
    const next = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (!value || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });

    const query = next.toString();
    if (query === lastQueryRef.current) return;
    lastQueryRef.current = query;

    const navigate = () =>
      startTransition(() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      });

    if (options?.debounce) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(navigate, DEBOUNCE_MS);
      return;
    }

    navigate();
  };

  const resetFilters = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
    });
  };

  const filteredFixtures = useMemo(() => {
    const selectedCountryKey = entity;

    return fixtures.filter((fixture) => {
      if (phase !== "all" && fixture.phase !== phase) return false;
      if (phase === "group-stage" && group !== "all" && fixture.group !== group) return false;
      if (country !== "all" && fixture.hostCountry !== country) return false;
      if (date !== "all" && fixture.date !== date) return false;

      if (!selectedCountryKey) return true;
      const homeCountry = countryMetaFromTeam(fixture.homeTeam)?.key;
      const awayCountry = countryMetaFromTeam(fixture.awayTeam)?.key;
      return homeCountry === selectedCountryKey || awayCountry === selectedCountryKey;
    });
  }, [country, date, entity, fixtures, group, phase]);

  const groupOptions = useMemo(() => {
    return Array.from(
      new Set(
        fixtures
          .filter((fixture) => fixture.phase === "group-stage" && fixture.group)
          .map((fixture) => fixture.group as string),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [fixtures]);

  const dateOptions = useMemo(() => {
    const scoped = fixtures.filter((fixture) => {
      if (phase !== "all" && fixture.phase !== phase) return false;
      if (phase === "group-stage" && group !== "all" && fixture.group !== group) return false;
      if (country !== "all" && fixture.hostCountry !== country) return false;
      const selectedCountryKey = entity;
      if (!selectedCountryKey) return true;
      const homeCountry = countryMetaFromTeam(fixture.homeTeam)?.key;
      const awayCountry = countryMetaFromTeam(fixture.awayTeam)?.key;
      return homeCountry === selectedCountryKey || awayCountry === selectedCountryKey;
    });
    return Array.from(new Set(scoped.map((fixture) => fixture.date)));
  }, [country, entity, fixtures, group, phase]);

  const groupedByDate = useMemo(() => {
    const groups = new Map<string, WorldCupFixture[]>();
    filteredFixtures.forEach((fixture) => {
      const list = groups.get(fixture.date) ?? [];
      list.push(fixture);
      groups.set(fixture.date, list);
    });
    return Array.from(groups.entries());
  }, [filteredFixtures]);

  const favoriteFixtureIdSet = useMemo(() => new Set(favoriteFixtureIds), [favoriteFixtureIds]);

  const favoriteFixtures = useMemo(() => {
    if (favoriteFixtureIdSet.size === 0) return [];
    return fixtures
      .filter((fixture) => favoriteFixtureIdSet.has(fixture.id))
      .sort((left, right) => new Date(left.kickoffUtc).getTime() - new Date(right.kickoffUtc).getTime());
  }, [favoriteFixtureIdSet, fixtures]);

  const toggleFavoriteFixture = (fixtureId: string) => {
    setFavoriteFixtureIds((current) => {
      const next = new Set(current);
      if (next.has(fixtureId)) {
        next.delete(fixtureId);
      } else {
        next.add(fixtureId);
      }
      return Array.from(next);
    });
  };

  const openFavoriteFixture = (fixture: WorldCupFixture) => {
    updateParams({ date: fixture.date });
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        document.getElementById("games-list-start")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  const showingMatchesLabel = dictionary.filters.showingMatches.replace(
    "{count}",
    String(filteredFixtures.length),
  );

  const tournamentStartKickoffUtc = useMemo(() => {
    if (fixtures.length === 0) return null;
    let earliest = fixtures[0]!.kickoffUtc;
    let earliestMs = new Date(earliest).getTime();
    fixtures.forEach((fixture) => {
      const kickoffMs = new Date(fixture.kickoffUtc).getTime();
      if (kickoffMs < earliestMs) {
        earliestMs = kickoffMs;
        earliest = fixture.kickoffUtc;
      }
    });
    return earliest;
  }, [fixtures]);

  const continentLabels = useMemo<Record<Continent, string>>(
    () => ({
      africa: dictionary.continents.africa,
      americas: dictionary.continents.americas,
      asia: dictionary.continents.asia,
      europe: dictionary.continents.europe,
      oceania: dictionary.continents.oceania,
    }),
    [dictionary.continents],
  );

  const comboboxOptions = useMemo(() => {
    const countryKeys = new Set<string>();

    fixtures.forEach((fixture) => {
      if (fixture.phase !== "group-stage") return;

      [fixture.homeTeam, fixture.awayTeam].forEach((team) => {
        if (/^[WL]\d+$/.test(team)) return;
        if (/^\d[A-L]$/.test(team)) return;
        const meta = countryMetaFromTeam(team);
        if (meta) countryKeys.add(meta.key);
      });
    });

    return Array.from(countryKeys)
      .map((countryKey) => {
        const meta = countryMetaFromKey(countryKey);
        return {
          value: countryKey,
          label: localizeCountry(countryKey, locale),
          continentLabel: continentLabels[(meta?.continent ?? "europe") as Continent],
          flagPath: flagPathForCountry(countryKey),
        };
      })
      .sort((a, b) => {
      if (a.continentLabel === b.continentLabel) {
        return a.label.localeCompare(b.label);
      }
      return a.continentLabel.localeCompare(b.continentLabel);
    });
  }, [continentLabels, fixtures, locale]);

  const groupCountriesByGroup = useMemo(() => {
    const map = new Map<string, Map<string, { countryKey: string; label: string; flagPath: string }>>();

    fixtures.forEach((fixture) => {
      if (fixture.phase !== "group-stage" || !fixture.group) return;

      [fixture.homeTeam, fixture.awayTeam].forEach((team) => {
        const meta = countryMetaFromTeam(team);
        if (!meta) return;

        const groupMap = map.get(fixture.group!) ?? new Map();
        if (!groupMap.has(meta.key)) {
          groupMap.set(meta.key, {
            countryKey: meta.key,
            label: localizeCountry(meta.key, locale),
            flagPath: flagPathForCountry(meta.key),
          });
        }
        map.set(fixture.group!, groupMap);
      });
    });

    return Array.from(map.entries()).reduce<
      Record<string, { countryKey: string; label: string; flagPath: string }[]>
    >((acc, [group, countriesMap]) => {
      acc[group] = Array.from(countriesMap.values()).sort((a, b) =>
        a.label.localeCompare(b.label),
      );
      return acc;
    }, {});
  }, [fixtures, locale]);

  const hostCountryOptions = useMemo(
    () => [
      {
        value: "all",
        label: dictionary.filters.hostCountryAll,
        continentLabel: dictionary.filters.hostCountryLabel,
        flagPath: "",
      },
      {
        value: "United States",
        label: dictionary.filters.hostCountryUnitedStates,
        continentLabel: dictionary.continents.americas,
        flagPath: flagPathForCountry("United States"),
      },
      {
        value: "Mexico",
        label: dictionary.filters.hostCountryMexico,
        continentLabel: dictionary.continents.americas,
        flagPath: flagPathForCountry("Mexico"),
      },
      {
        value: "Canada",
        label: dictionary.filters.hostCountryCanada,
        continentLabel: dictionary.continents.americas,
        flagPath: flagPathForCountry("Canada"),
      },
    ],
    [dictionary],
  );

  return (
    <div className="min-h-screen pb-24 text-zinc-100">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 pb-10 pt-6 sm:px-6">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0f172a]/95 via-[#0b1224]/95 to-[#1a1034]/95 p-6 shadow-2xl shadow-black/40 sm:p-8">
          <div className="pointer-events-none absolute -left-8 top-0 h-40 w-40 rounded-full bg-lime-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-16 top-10 h-44 w-44 rounded-full bg-cyan-300/15 blur-3xl" />
          <div className="relative space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                  {dictionary.page.badge}
                </p>
                <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                  {dictionary.page.title}
                </h1>
                <p className="max-w-2xl text-sm text-zinc-300 sm:text-base">
                  {dictionary.page.subtitle}
                </p>
              </div>
              <LanguageSwitcher value={locale} labels={dictionary.language} />
            </div>
          </div>
        </section>

        <section className="space-y-4 rounded-[1.75rem] border border-white/10 bg-[#0e1426] p-4 sm:p-5">
          <PhaseNav
            value={phase}
            labels={dictionary.phaseLabels}
            onChange={(nextPhase) =>
              updateParams({
                phase: nextPhase === "all" ? null : nextPhase,
                group: nextPhase === "group-stage" ? group : null,
                date: null,
              })
            }
          />

          {phase === "group-stage" ? (
            <GroupNav
              value={group}
              groups={groupOptions}
              allGroupsLabel={dictionary.filters.allGroups}
              groupPrefixLabel={dictionary.matchCard.groupLabel}
              onChange={(value) => updateParams({ group: value, date: null })}
            />
          ) : null}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <TimezoneSwitcher
              value={timezone}
              labels={dictionary.timezoneLabels}
              title={dictionary.filters.timezoneLabel}
              onChange={(value) => updateParams({ tz: value })}
            />

            <TeamCountryCombobox
              label={dictionary.filters.hostCountryLabel}
              placeholder={dictionary.filters.hostCountryAll}
              emptyLabel={dictionary.filters.searchEmpty}
              selectedValue={country}
              options={hostCountryOptions}
              onChange={(value) =>
                updateParams(
                  { country: value === "all" || !value ? null : value, date: null },
                  { debounce: true },
                )
              }
            />

            <TeamCountryCombobox
              label={dictionary.filters.searchLabel}
              placeholder={dictionary.filters.searchPlaceholder}
              emptyLabel={dictionary.filters.searchEmpty}
              selectedValue={entity}
              options={comboboxOptions}
              onChange={(value) =>
                updateParams({ entity: value, date: null }, { debounce: true })
              }
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-end gap-2">
              {isPending ? (
                <span className="inline-flex items-center gap-1 text-xs text-zinc-400">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  {dictionary.filters.updating}
                </span>
              ) : null}
            </div>
            <HorizontalDragScroll className="-mx-1 flex gap-2 px-1 pb-1">
              <Button
                size="sm"
                variant={date === "all" ? "solid" : "outline"}
                className="shrink-0"
                onClick={() => updateParams({ date: null })}
              >
                {dictionary.filters.allDays}
              </Button>
              {dateOptions.map((day) => (
                <Button
                  key={day}
                  size="sm"
                  variant={date === day ? "solid" : "outline"}
                  className="shrink-0"
                  onClick={() => updateParams({ date: day })}
                >
                  {formatDateOnly(day, locale)}
                </Button>
              ))}
            </HorizontalDragScroll>
          </div>
        </section>

        <section className="space-y-4">
          {tournamentStartKickoffUtc ? (
            <EventStartCountdown
              kickoffUtc={tournamentStartKickoffUtc}
              labels={dictionary.countdown}
            />
          ) : null}

          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-zinc-400">{showingMatchesLabel}</p>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={resetFilters}
            >
              {dictionary.filters.resetFilters}
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-zinc-200">{dictionary.favorites.title}</p>
              {favoriteFixtures.length > 0 ? (
                <p className="text-xs text-zinc-400">
                  {dictionary.favorites.itemsCount.replace("{count}", String(favoriteFixtures.length))}
                </p>
              ) : null}
            </div>

            {favoriteFixtures.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-5 text-sm text-zinc-300">
                {dictionary.favorites.empty}
              </div>
            ) : (
              <HorizontalDragScroll className="no-scrollbar -mx-2 px-2 pb-2">
                <div className="flex items-center gap-2">
                  <AnimatePresence initial={false}>
                    {favoriteFixtures.map((fixture) => (
                      <motion.div
                        key={fixture.id}
                        className="shrink-0"
                        layout={!prefersReducedMotion}
                        initial={
                          prefersReducedMotion
                            ? FAVORITE_CHIP_REDUCED_MOTION.initial
                            : FAVORITE_CHIP_MOTION.initial
                        }
                        animate={
                          prefersReducedMotion
                            ? FAVORITE_CHIP_REDUCED_MOTION.animate
                            : FAVORITE_CHIP_MOTION.animate
                        }
                        exit={
                          prefersReducedMotion
                            ? FAVORITE_CHIP_REDUCED_MOTION.exit
                            : FAVORITE_CHIP_MOTION.exit
                        }
                        transition={FAVORITE_CHIP_TRANSITION}
                      >
                        <div className="inline-flex h-12 items-center overflow-hidden rounded-full border border-amber-300/35 bg-[#111a2f]/95 text-zinc-100 shadow-[0_0_0_1px_rgba(252,211,77,0.18)]">
                          <button
                            type="button"
                            className="inline-flex h-full min-w-0 max-w-[16rem] items-center gap-2 px-3 text-left hover:bg-white/5"
                            onClick={() => openFavoriteFixture(fixture)}
                            title={`${fixture.homeTeam} ${dictionary.matchCard.versus} ${fixture.awayTeam}`}
                          >
                            <span className="truncate text-xs font-semibold">
                              {fixture.homeTeam} {dictionary.matchCard.versus} {fixture.awayTeam}
                            </span>
                            <span className="shrink-0 text-[11px] text-zinc-300">
                              {formatKickoffInTimezone(fixture.kickoffUtc, timezone, locale)}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-full w-10 items-center justify-center border-l border-amber-300/25 text-amber-200 hover:bg-amber-300/10"
                            onClick={() => toggleFavoriteFixture(fixture.id)}
                            aria-label={dictionary.favorites.remove}
                            title={dictionary.favorites.remove}
                          >
                            <Star className="h-3.5 w-3.5 fill-amber-300" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </HorizontalDragScroll>
            )}
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div id="games-list-start" />

          {groupedByDate.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-zinc-300">
              {dictionary.filters.noMatches}
            </div>
          ) : (
            groupedByDate.map(([day, dayFixtures]) => (
              <div key={day} className="space-y-3">
                <p className="sticky top-2 z-10 inline-flex rounded-full border border-white/10 bg-[#0e1322]/90 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-400 backdrop-blur">
                  {formatDateOnly(day, locale)}
                </p>
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {dayFixtures.map((fixture) => (
                    <MatchCard
                      key={fixture.id}
                      fixture={fixture}
                      timezone={timezone}
                      locale={locale}
                      labels={dictionary.matchCard}
                      phaseLabels={dictionary.phaseLabels}
                      rounds={dictionary.rounds}
                      hostCountryLabels={hostCountryLabels}
                      groupCountriesByGroup={groupCountriesByGroup}
                      isDesktopHover={isDesktopHover}
                      countdownUnits={dictionary.countdown}
                      isFavorite={favoriteFixtureIdSet.has(fixture.id)}
                      onToggleFavorite={toggleFavoriteFixture}
                      favoriteLabels={{
                        add: dictionary.favorites.add,
                        remove: dictionary.favorites.remove,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-[#080c16]/90 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2">
          <p className="text-xs text-zinc-300">
            {filteredFixtures.length} {dictionary.mobileNav.games}
          </p>
          <Button size="sm" variant="outline" onClick={() => updateParams({ phase: "group-stage" })}>
            {dictionary.mobileNav.groups}
          </Button>
          <Button size="sm" variant="outline" onClick={() => updateParams({ phase: "round-of-32", group: null })}>
            {dictionary.mobileNav.knockout}
          </Button>
            <Button size="sm" variant="solid" onClick={resetFilters}>
            {dictionary.mobileNav.clear}
          </Button>
        </div>
      </div>
    </div>
  );
}

type EventStartCountdownProps = {
  kickoffUtc: string;
  labels: AppDictionary["countdown"];
};

function EventStartCountdown({ kickoffUtc, labels }: EventStartCountdownProps) {
  const nowMs = useSharedNow(true);
  const countdown = getCountdownToKickoff(kickoffUtc, nowMs);

  if (countdown.isStarted) {
    return null;
  }

  return (
    <div className="rounded-3xl border border-lime-300/30 bg-gradient-to-r from-lime-300/10 via-transparent to-cyan-300/10 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-zinc-300">{labels.title}</p>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
        <p className="text-sm text-zinc-300">{labels.startsInLabel}</p>
        <p className="text-2xl font-semibold text-lime-200 sm:text-3xl">
          {formatCountdown(countdown, {
            days: labels.unitDays,
            hours: labels.unitHours,
            minutes: labels.unitMinutes,
            seconds: labels.unitSeconds,
          })}
        </p>
      </div>
    </div>
  );
}
