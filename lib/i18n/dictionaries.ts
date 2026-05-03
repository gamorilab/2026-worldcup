import "server-only";

import type { MatchPhase } from "@/lib/world-cup/types";

import type { AppLocale } from "./config";

export type AppDictionary = {
  page: {
    badge: string;
    title: string;
    subtitle: string;
    loading: string;
    fixtureUnavailable: string;
  };
  filters: {
    timezoneLabel: string;
    hostCountryLabel: string;
    hostCountryAll: string;
    hostCountryUnitedStates: string;
    hostCountryMexico: string;
    hostCountryCanada: string;
    matchDateLabel: string;
    matchDateAll: string;
    searchLabel: string;
    searchPlaceholder: string;
    searchEmpty: string;
    searchTeamsGroup: string;
    searchCountriesGroup: string;
    allDays: string;
    allGroups: string;
    dateCalendarButton: string;
    clearDate: string;
    updating: string;
    showingMatches: string;
    resetFilters: string;
    noMatches: string;
  };
  mobileNav: {
    games: string;
    groups: string;
    knockout: string;
    clear: string;
  };
  matchCard: {
    versus: string;
    kickoffLabel: string;
    kickoffCountdownLabel: string;
    startedLabel: string;
    weekdayLabel: string;
    groupLabel: string;
    matchNumberLabel: string;
  };
  countdown: {
    title: string;
    startsInLabel: string;
    unitDays: string;
    unitHours: string;
    unitMinutes: string;
    unitSeconds: string;
  };
  rounds: {
    matchdayPrefix: string;
  };
  phaseLabels: Record<MatchPhase, string>;
  timezoneLabels: {
    groupBrazil: string;
    groupAmericas: string;
    groupEuropeAfrica: string;
    groupAsiaOceania: string;
  };
  continents: {
    africa: string;
    americas: string;
    asia: string;
    europe: string;
    oceania: string;
  };
  language: {
    label: string;
    ptBR: string;
    enUS: string;
    esES: string;
  };
};

const dictionaries = {
  "pt-BR": () =>
    import("@/dictionaries/pt-BR.json").then(
      (module) => module.default as AppDictionary,
    ),
  "en-US": () =>
    import("@/dictionaries/en-US.json").then(
      (module) => module.default as AppDictionary,
    ),
  "es-ES": () =>
    import("@/dictionaries/es-ES.json").then(
      (module) => module.default as AppDictionary,
    ),
} as const;

export async function getDictionary(locale: AppLocale): Promise<AppDictionary> {
  return dictionaries[locale]();
}
