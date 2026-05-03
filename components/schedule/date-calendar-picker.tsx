"use client";

import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import { formatDateOnly } from "@/lib/world-cup/timezones";

type DateCalendarPickerProps = {
  selectedDate: string;
  locale: string;
  labels: Pick<AppDictionary["filters"], "dateCalendarButton" | "clearDate">;
  allowedDates: string[];
  onSelectDate: (date: string | null) => void;
};

function toDate(dateIso: string): Date {
  const [year, month, day] = dateIso.split("-").map(Number);
  return new Date(Date.UTC(year, (month || 1) - 1, day || 1));
}

export function DateCalendarPicker({
  selectedDate,
  locale,
  labels,
  allowedDates,
  onSelectDate,
}: DateCalendarPickerProps) {
  const selected = selectedDate === "all" ? undefined : toDate(selectedDate);
  const allowedSet = new Set(allowedDates);

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button size="sm" variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selected ? formatDateOnly(selectedDate, locale) : labels.dateCalendarButton}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="p-2">
          <Calendar
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (!date) {
                onSelectDate(null);
                return;
              }
              const iso = format(date, "yyyy-MM-dd");
              onSelectDate(allowedSet.has(iso) ? iso : null);
            }}
            disabled={(date) => !allowedSet.has(format(date, "yyyy-MM-dd"))}
          />
        </PopoverContent>
      </Popover>
      {selected ? (
        <Button size="sm" variant="ghost" onClick={() => onSelectDate(null)}>
          <X className="mr-1 h-3.5 w-3.5" />
          {labels.clearDate}
        </Button>
      ) : null}
    </div>
  );
}
