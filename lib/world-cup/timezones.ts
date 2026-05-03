import type { AppTimezone } from "./types";

export function parseOpenFootballKickoff(date: string, time: string): string {
  const match = time.match(/^(\d{1,2}):(\d{2})\s+UTC([+-]\d{1,2})$/);
  if (!match) {
    throw new Error(`Unsupported time format: ${time}`);
  }

  const [, hourRaw, minuteRaw, offsetRaw] = match;
  const [yearRaw, monthRaw, dayRaw] = date.split("-");

  const year = Number(yearRaw);
  const month = Number(monthRaw);
  const day = Number(dayRaw);
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);
  const utcOffsetHours = Number(offsetRaw);

  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    Number.isNaN(utcOffsetHours)
  ) {
    throw new Error(`Invalid date/time values for fixture: ${date} ${time}`);
  }

  // Source time is local to the listed UTC offset. Convert that local time to UTC.
  const utcMillis = Date.UTC(year, month - 1, day, hour - utcOffsetHours, minute);
  return new Date(utcMillis).toISOString();
}

export function formatKickoffInTimezone(
  kickoffUtcIso: string,
  timezone: AppTimezone,
  locale: string,
): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  }).format(new Date(kickoffUtcIso));
}

export function formatDateOnly(dateIso: string, locale: string): string {
  const [year, month, day] = dateIso.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
