import { normalizeFixtures } from "./normalize";
import type { OpenFootballWorldCupResponse, WorldCupFixture } from "./types";

const OPENFOOTBALL_2026_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

export async function getWorldCupFixtures(): Promise<WorldCupFixture[]> {
  const response = await fetch(OPENFOOTBALL_2026_URL, {
    next: { revalidate: 60 * 60 * 6 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch fixtures: ${response.status}`);
  }

  const payload = (await response.json()) as OpenFootballWorldCupResponse;
  const fixtures = normalizeFixtures(payload.matches ?? []);

  if (fixtures.length < 100) {
    throw new Error("Fixture source returned incomplete schedule.");
  }

  return fixtures;
}
