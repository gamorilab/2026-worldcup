import type { AppTimezone } from "./types";

export type TimezoneGroup = "brazil" | "americas" | "europe-africa" | "asia-oceania";

export type TimezoneOption = {
  value: AppTimezone;
  label: string;
  group: TimezoneGroup;
};

export const CURATED_TIMEZONE_OPTIONS: TimezoneOption[] = [
  { value: "America/Sao_Paulo", label: "São Paulo (UTC-3)", group: "brazil" },
  { value: "America/Cuiaba", label: "Cuiabá (UTC-4)", group: "brazil" },
  { value: "America/Manaus", label: "Manaus (UTC-4)", group: "brazil" },
  { value: "America/Rio_Branco", label: "Rio Branco (UTC-5)", group: "brazil" },
  { value: "America/New_York", label: "New York (UTC-5/-4)", group: "americas" },
  { value: "America/Chicago", label: "Chicago (UTC-6/-5)", group: "americas" },
  { value: "America/Denver", label: "Denver (UTC-7/-6)", group: "americas" },
  { value: "America/Los_Angeles", label: "Los Angeles (UTC-8/-7)", group: "americas" },
  { value: "America/Mexico_City", label: "Mexico City (UTC-6)", group: "americas" },
  { value: "America/Toronto", label: "Toronto (UTC-5/-4)", group: "americas" },
  { value: "America/Vancouver", label: "Vancouver (UTC-8/-7)", group: "americas" },
  { value: "America/Bogota", label: "Bogotá (UTC-5)", group: "americas" },
  { value: "America/Lima", label: "Lima (UTC-5)", group: "americas" },
  { value: "America/Santiago", label: "Santiago (UTC-4/-3)", group: "americas" },
  { value: "America/Buenos_Aires", label: "Buenos Aires (UTC-3)", group: "americas" },
  { value: "Europe/London", label: "London (UTC+0/+1)", group: "europe-africa" },
  { value: "Europe/Lisbon", label: "Lisbon (UTC+0/+1)", group: "europe-africa" },
  { value: "Europe/Madrid", label: "Madrid (UTC+1/+2)", group: "europe-africa" },
  { value: "Europe/Paris", label: "Paris (UTC+1/+2)", group: "europe-africa" },
  { value: "Europe/Berlin", label: "Berlin (UTC+1/+2)", group: "europe-africa" },
  { value: "Europe/Rome", label: "Rome (UTC+1/+2)", group: "europe-africa" },
  { value: "Europe/Athens", label: "Athens (UTC+2/+3)", group: "europe-africa" },
  { value: "Africa/Cairo", label: "Cairo (UTC+2)", group: "europe-africa" },
  { value: "Africa/Johannesburg", label: "Johannesburg (UTC+2)", group: "europe-africa" },
  { value: "Asia/Dubai", label: "Dubai (UTC+4)", group: "asia-oceania" },
  { value: "Asia/Kolkata", label: "Mumbai/Delhi (UTC+5:30)", group: "asia-oceania" },
  { value: "Asia/Bangkok", label: "Bangkok (UTC+7)", group: "asia-oceania" },
  { value: "Asia/Singapore", label: "Singapore (UTC+8)", group: "asia-oceania" },
  { value: "Asia/Tokyo", label: "Tokyo (UTC+9)", group: "asia-oceania" },
  { value: "Asia/Seoul", label: "Seoul (UTC+9)", group: "asia-oceania" },
  { value: "Australia/Sydney", label: "Sydney (UTC+10/+11)", group: "asia-oceania" },
  { value: "Pacific/Auckland", label: "Auckland (UTC+12/+13)", group: "asia-oceania" },
];
