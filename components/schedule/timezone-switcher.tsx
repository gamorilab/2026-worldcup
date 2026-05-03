"use client";

import type { AppDictionary } from "@/lib/i18n/dictionaries";
import type { AppTimezone } from "@/lib/world-cup/types";
import {
  CURATED_TIMEZONE_OPTIONS,
  type TimezoneGroup,
} from "@/lib/world-cup/timezone-options";

type TimezoneSwitcherProps = {
  value: AppTimezone;
  onChange: (timezone: AppTimezone) => void;
  labels: AppDictionary["timezoneLabels"];
  title: string;
};

export function TimezoneSwitcher({
  value,
  onChange,
  labels,
  title,
}: TimezoneSwitcherProps) {
  const groupLabels: Record<TimezoneGroup, string> = {
    brazil: labels.groupBrazil,
    americas: labels.groupAmericas,
    "europe-africa": labels.groupEuropeAfrica,
    "asia-oceania": labels.groupAsiaOceania,
  };

  return (
    <label className="flex w-full flex-col gap-2 text-xs text-zinc-400 sm:max-w-xs">
      {title}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as AppTimezone)}
        className="h-11 rounded-2xl border border-white/15 bg-white/10 px-3 text-sm text-zinc-100 outline-none ring-lime-300 transition focus:ring-2"
      >
        {Object.entries(groupLabels).map(([group, groupLabel]) => (
          <optgroup key={group} label={groupLabel}>
            {CURATED_TIMEZONE_OPTIONS.filter((option) => option.group === group).map(
              (option) => (
                <option key={option.value} value={option.value} className="bg-[#10131f]">
                  {option.label}
                </option>
              ),
            )}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
