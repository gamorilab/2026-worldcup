export const CURATED_TIMEZONES = [
  "America/Sao_Paulo",
  "America/Cuiaba",
  "America/Manaus",
  "America/Rio_Branco",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/Toronto",
  "America/Vancouver",
  "America/Bogota",
  "America/Lima",
  "America/Santiago",
  "America/Buenos_Aires",
  "Europe/London",
  "Europe/Lisbon",
  "Europe/Madrid",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Athens",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Bangkok",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Asia/Seoul",
  "Australia/Sydney",
  "Pacific/Auckland",
] as const;

export type AppTimezone = (typeof CURATED_TIMEZONES)[number];

export type MatchPhase =
  | "all"
  | "group-stage"
  | "round-of-32"
  | "round-of-16"
  | "quarter-finals"
  | "semi-finals"
  | "third-place"
  | "final";

export type HostCountry = "all" | "United States" | "Mexico" | "Canada";

export type OpenFootballMatch = {
  round: string;
  date: string;
  time: string;
  team1: string;
  team2: string;
  group?: string;
  ground: string;
  num?: number;
};

export type OpenFootballWorldCupResponse = {
  name: string;
  matches: OpenFootballMatch[];
};

export type WorldCupFixture = {
  id: string;
  round: string;
  phase: Exclude<MatchPhase, "all">;
  date: string;
  kickoffUtc: string;
  homeTeam: string;
  awayTeam: string;
  group: string | null;
  matchNumber: number | null;
  venue: string;
  hostCountry: Exclude<HostCountry, "all">;
};
