import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { countryMetaFromTeam, flagPathForCountry, localizeCountry } from "@/lib/world-cup/geo";
import {
  formatCountdown,
  formatKickoffInTimezone,
  formatWeekdayInTimezone,
  getCountdownToKickoff,
} from "@/lib/world-cup/timezones";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import type { AppLocale } from "@/lib/i18n/config";
import type { AppTimezone, WorldCupFixture } from "@/lib/world-cup/types";
import { useSharedNow } from "./use-shared-now";

type MatchCardProps = {
  fixture: WorldCupFixture;
  timezone: AppTimezone;
  locale: AppLocale;
  labels: AppDictionary["matchCard"];
  phaseLabels: AppDictionary["phaseLabels"];
  rounds: AppDictionary["rounds"];
  hostCountryLabels: Record<WorldCupFixture["hostCountry"], string>;
  groupCountriesByGroup: Record<string, { countryKey: string; label: string; flagPath: string }[]>;
  isDesktopHover: boolean;
  countdownUnits: AppDictionary["countdown"];
  isFavorite: boolean;
  onToggleFavorite: (fixtureId: string) => void;
  favoriteLabels: {
    add: string;
    remove: string;
  };
};

function localizeRound(
  round: string,
  rounds: AppDictionary["rounds"],
  phaseLabels: AppDictionary["phaseLabels"],
): string {
  const matchday = round.match(/^Matchday\s+(\d+)$/);
  if (matchday) {
    return `${rounds.matchdayPrefix} ${matchday[1]}`;
  }

  if (round === "Round of 32") return phaseLabels["round-of-32"];
  if (round === "Round of 16") return phaseLabels["round-of-16"];
  if (round === "Quarter-final") return phaseLabels["quarter-finals"];
  if (round === "Semi-final") return phaseLabels["semi-finals"];
  if (round === "Match for third place") return phaseLabels["third-place"];
  if (round === "Final") return phaseLabels["final"];
  return round;
}

export function MatchCard({
  fixture,
  timezone,
  locale,
  labels,
  phaseLabels,
  rounds,
  hostCountryLabels,
  groupCountriesByGroup,
  isDesktopHover,
  countdownUnits,
  isFavorite,
  onToggleFavorite,
  favoriteLabels,
}: MatchCardProps) {
  const [open, setOpen] = useState(false);
  const popoverRootRef = useRef<HTMLDivElement | null>(null);
  const displayTime = formatKickoffInTimezone(fixture.kickoffUtc, timezone, locale);
  const weekday = formatWeekdayInTimezone(fixture.kickoffUtc, timezone, locale, "long");
  const shortRound = localizeRound(fixture.round, rounds, phaseLabels);
  const homeCountry = countryMetaFromTeam(fixture.homeTeam)?.key ?? fixture.homeTeam;
  const awayCountry = countryMetaFromTeam(fixture.awayTeam)?.key ?? fixture.awayTeam;
  const homeFlag = flagPathForCountry(homeCountry);
  const awayFlag = flagPathForCountry(awayCountry);
  const homeLabel = localizeCountry(homeCountry, locale);
  const awayLabel = localizeCountry(awayCountry, locale);
  const hostFlag = flagPathForCountry(fixture.hostCountry);
  const groupCountries = fixture.group ? (groupCountriesByGroup[fixture.group] ?? []) : [];

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      const root = popoverRootRef.current;
      if (!root) return;
      if (event.target instanceof Node && !root.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <Card
      className={cn(
        "relative h-full min-h-[18.5rem] transition-[border-color,box-shadow]",
        isFavorite && "border-amber-300/45 shadow-[0_0_0_1px_rgba(252,211,77,0.22),0_0_24px_rgba(217,119,6,0.2)]",
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(132,204,22,0.2),transparent_45%)]" />
      </div>
      <CardContent className="relative flex h-full flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="accent">{shortRound}</Badge>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-2 text-xs text-zinc-400">
              <Image
                src={hostFlag}
                alt=""
                width={20}
                height={12}
                className="h-3 w-5 rounded-[2px] border border-white/20 object-cover"
              />
              {hostCountryLabels[fixture.hostCountry]}
            </span>
            <button
              type="button"
              aria-pressed={isFavorite}
              aria-label={isFavorite ? favoriteLabels.remove : favoriteLabels.add}
              title={isFavorite ? favoriteLabels.remove : favoriteLabels.add}
              onClick={() => onToggleFavorite(fixture.id)}
              className={cn(
                "inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border transition-colors",
                isFavorite
                  ? "border-amber-300/50 bg-amber-300/15 text-amber-200"
                  : "border-white/20 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200",
              )}
            >
              <Star className={cn("h-4 w-4", isFavorite && "fill-amber-300")} />
            </button>
          </div>
        </div>
        <div className="grid min-h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
            <p className="inline-flex min-h-10 items-center justify-center gap-2 text-sm font-semibold leading-tight text-zinc-100 sm:text-base">
              <Image
                src={homeFlag}
                alt=""
                width={20}
                height={14}
                className="h-3.5 w-5 rounded-[2px] border border-white/20 object-cover"
              />
              {homeLabel}
            </p>
            <p className="text-xs tracking-[0.25em] text-zinc-500">{labels.versus}</p>
            <p className="inline-flex min-h-10 items-center justify-center gap-2 text-sm font-semibold leading-tight text-zinc-100 sm:text-base">
              <Image
                src={awayFlag}
                alt=""
                width={20}
                height={14}
                className="h-3.5 w-5 rounded-[2px] border border-white/20 object-cover"
              />
              {awayLabel}
            </p>
        </div>

        <div className="flex min-h-[5.25rem] items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-zinc-400">{labels.kickoffLabel}</p>
              <p className="text-lg font-semibold text-white sm:text-xl">{displayTime}</p>
              <p className="mt-1 text-xs text-lime-300">
                {labels.kickoffCountdownLabel}:{" "}
                <CardKickoffCountdown
                  kickoffUtc={fixture.kickoffUtc}
                  labels={labels}
                  countdownUnits={countdownUnits}
                />
              </p>
            </div>
            <div className="flex min-h-9 items-start">
              {fixture.group ? (
                <div
                  ref={popoverRootRef}
                  className="relative"
                  onMouseEnter={() => {
                    if (isDesktopHover) setOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (isDesktopHover) setOpen(false);
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-haspopup="dialog"
                    onClick={() => setOpen((prev) => !prev)}
                    className="appearance-none rounded-full bg-transparent p-0 [-webkit-tap-highlight-color:transparent]"
                    style={{ outline: "none", boxShadow: "none", border: "none" }}
                  >
                    <Badge>
                      {labels.groupLabel} {fixture.group}
                    </Badge>
                  </button>
                  {open ? (
                    <div
                      role="dialog"
                      className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-60 rounded-2xl border border-white/20 bg-[#1a2238] p-3 text-zinc-100 ring-1 ring-black/40"
                    >
                      <div className="space-y-2">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
                          {labels.groupLabel} {fixture.group}
                        </p>
                        <div className="space-y-1">
                          {groupCountries.map((country) => (
                            <div
                              key={country.countryKey}
                              className="flex items-center gap-2 rounded-lg px-1 py-1 text-sm text-zinc-100"
                            >
                              <Image
                                src={country.flagPath}
                                alt=""
                                width={20}
                                height={14}
                                className="h-3.5 w-5 rounded-[2px] border border-white/20 object-cover"
                              />
                              <span>{country.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <Badge className="invisible">
                  {labels.groupLabel} A
                </Badge>
              )}
            </div>
        </div>

        <div className="mt-auto grid min-h-10 grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] items-center gap-2 text-xs text-zinc-400">
            <span className="truncate capitalize">{weekday}</span>
            <span className="truncate text-center">{fixture.venue}</span>
            <span className="justify-self-end">
              {fixture.matchNumber ? `${labels.matchNumberLabel} #${fixture.matchNumber}` : "\u00a0"}
            </span>
        </div>
      </CardContent>
    </Card>
  );
}

type CardKickoffCountdownProps = {
  kickoffUtc: string;
  labels: AppDictionary["matchCard"];
  countdownUnits: AppDictionary["countdown"];
};

function CardKickoffCountdown({ kickoffUtc, labels, countdownUnits }: CardKickoffCountdownProps) {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = hostRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(Boolean(entry?.isIntersecting));
      },
      {
        root: null,
        rootMargin: "240px",
        threshold: 0,
      },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const nowMs = useSharedNow(isVisible);
  const countdown = isVisible ? getCountdownToKickoff(kickoffUtc, nowMs) : null;

  return (
    <span ref={hostRef}>
      {!countdown
        ? "--"
        : countdown.isStarted
        ? labels.startedLabel
        : formatCountdown(countdown, {
            days: countdownUnits.unitDays,
            hours: countdownUnits.unitHours,
            minutes: countdownUnits.unitMinutes,
            seconds: countdownUnits.unitSeconds,
          })}
    </span>
  );
}
