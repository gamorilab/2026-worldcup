import { parseOpenFootballKickoff } from "./timezones";
import type { OpenFootballMatch, WorldCupFixture } from "./types";

function getPhase(round: string): WorldCupFixture["phase"] {
  if (round.startsWith("Matchday")) return "group-stage";
  if (round === "Round of 32") return "round-of-32";
  if (round === "Round of 16") return "round-of-16";
  if (round === "Quarter-final") return "quarter-finals";
  if (round === "Semi-final") return "semi-finals";
  if (round === "Match for third place") return "third-place";
  if (round === "Final") return "final";
  return "group-stage";
}

function inferHostCountry(venue: string): WorldCupFixture["hostCountry"] {
  if (
    venue.includes("Toronto") ||
    venue.includes("Vancouver") ||
    venue.includes("Edmonton")
  ) {
    return "Canada";
  }

  if (
    venue.includes("Mexico City") ||
    venue.includes("Guadalajara") ||
    venue.includes("Monterrey")
  ) {
    return "Mexico";
  }

  return "United States";
}

export function normalizeFixtures(matches: OpenFootballMatch[]): WorldCupFixture[] {
  return matches
    .map((match, index) => {
      const group = match.group?.replace("Group ", "") ?? null;
      const kickoffUtc = parseOpenFootballKickoff(match.date, match.time);
      const phase = getPhase(match.round);

      return {
        id: `${match.date}-${match.team1}-${match.team2}-${index}`
          .toLowerCase()
          .replace(/\s+/g, "-"),
        round: match.round,
        phase,
        date: match.date,
        kickoffUtc,
        homeTeam: match.team1,
        awayTeam: match.team2,
        group,
        matchNumber: match.num ?? null,
        venue: match.ground,
        hostCountry: inferHostCountry(match.ground),
      };
    })
    .sort(
      (a, b) =>
        new Date(a.kickoffUtc).getTime() - new Date(b.kickoffUtc).getTime(),
    );
}
