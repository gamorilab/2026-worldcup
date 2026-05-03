import Image from "next/image";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { countryMetaFromTeam, flagPathForCountry, localizeCountry } from "@/lib/world-cup/geo";
import { formatKickoffInTimezone } from "@/lib/world-cup/timezones";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import type { AppLocale } from "@/lib/i18n/config";
import type { AppTimezone, WorldCupFixture } from "@/lib/world-cup/types";

type MatchCardProps = {
  fixture: WorldCupFixture;
  timezone: AppTimezone;
  locale: AppLocale;
  labels: AppDictionary["matchCard"];
  phaseLabels: AppDictionary["phaseLabels"];
  rounds: AppDictionary["rounds"];
  hostCountryLabels: Record<WorldCupFixture["hostCountry"], string>;
  groupCountriesByGroup: Record<string, { countryKey: string; label: string; flagPath: string }[]>;
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
}: MatchCardProps) {
  const [open, setOpen] = useState(false);
  const [isDesktopHover, setIsDesktopHover] = useState(false);
  const displayTime = formatKickoffInTimezone(fixture.kickoffUtc, timezone, locale);
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
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setIsDesktopHover(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(132,204,22,0.2),transparent_45%)]" />
      <CardContent className="relative space-y-4">
        <div className="flex items-center justify-between gap-3">
          <Badge variant="accent">{shortRound}</Badge>
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
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
          <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-zinc-100 sm:text-base">
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
          <p className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-zinc-100 sm:text-base">
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

        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-400">{labels.kickoffLabel}</p>
            <p className="text-lg font-semibold text-white sm:text-xl">{displayTime}</p>
          </div>
          {fixture.group ? (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="rounded-full"
                  onMouseEnter={() => {
                    if (isDesktopHover) setOpen(true);
                  }}
                  onMouseLeave={() => {
                    if (isDesktopHover) setOpen(false);
                  }}
                >
                  <Badge>
                    {labels.groupLabel} {fixture.group}
                  </Badge>
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-56 p-3"
                align="end"
                onMouseEnter={() => {
                  if (isDesktopHover) setOpen(true);
                }}
                onMouseLeave={() => {
                  if (isDesktopHover) setOpen(false);
                }}
              >
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.16em] text-zinc-400">
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
              </PopoverContent>
            </Popover>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
          <span>{fixture.venue}</span>
          {fixture.matchNumber ? <span>{labels.matchNumberLabel} #{fixture.matchNumber}</span> : null}
        </div>
      </CardContent>
    </Card>
  );
}
