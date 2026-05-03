import type { AppTimezone } from "./types";

export type CountdownParts = {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isStarted: boolean;
};

export type CountdownUnitLabels = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

const dateTimeFormatterCache = new Map<string, Intl.DateTimeFormat>();

function getCachedDateTimeFormatter(
  cacheKey: string,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): Intl.DateTimeFormat {
  const existing = dateTimeFormatterCache.get(cacheKey);
  if (existing) return existing;
  const formatter = new Intl.DateTimeFormat(locale, options);
  dateTimeFormatterCache.set(cacheKey, formatter);
  return formatter;
}

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
  const formatter = getCachedDateTimeFormatter(`kickoff:${locale}:${timezone}`, locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: timezone,
  });
  return formatter.format(new Date(kickoffUtcIso));
}

export function formatDateOnly(dateIso: string, locale: string): string {
  const [year, month, day] = dateIso.split("-").map(Number);
  const date = new Date(Date.UTC(year, (month || 1) - 1, day || 1));

  const formatter = getCachedDateTimeFormatter(`date-only:${locale}`, locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
  return formatter.format(date);
}

export function formatWeekdayInTimezone(
  kickoffUtcIso: string,
  timezone: AppTimezone,
  locale: string,
  width: "long" | "short" = "long",
): string {
  const formatter = getCachedDateTimeFormatter(`weekday:${locale}:${timezone}:${width}`, locale, {
    weekday: width,
    timeZone: timezone,
  });
  return formatter.format(new Date(kickoffUtcIso));
}

export function getCountdownToKickoff(kickoffUtcIso: string, nowMs: number): CountdownParts {
  const kickoffMs = new Date(kickoffUtcIso).getTime();
  const rawMs = kickoffMs - nowMs;
  const totalMs = Math.max(0, rawMs);
  const totalSeconds = Math.floor(totalMs / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
    isStarted: rawMs <= 0,
  };
}

export function formatCountdown(parts: CountdownParts, labels: CountdownUnitLabels): string {
  return `${parts.days}${labels.days} ${String(parts.hours).padStart(2, "0")}${labels.hours} ${String(parts.minutes).padStart(2, "0")}${labels.minutes} ${String(parts.seconds).padStart(2, "0")}${labels.seconds}`;
}
