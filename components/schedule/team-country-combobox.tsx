"use client";

import { useMemo, useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type TeamCountryOption = {
  value: string;
  label: string;
  continentLabel: string;
  flagPath: string;
};

type TeamCountryComboboxProps = {
  label: string;
  placeholder: string;
  emptyLabel: string;
  selectedValue: string;
  options: TeamCountryOption[];
  onChange: (value: string | null) => void;
};

export function TeamCountryCombobox({
  label,
  placeholder,
  emptyLabel,
  selectedValue,
  options,
  onChange,
}: TeamCountryComboboxProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((option) => option.value === selectedValue);

  const grouped = useMemo(() => {
    const map = new Map<string, TeamCountryOption[]>();
    options.forEach((option) => {
      const key = option.continentLabel;
      const bucket = map.get(key) ?? [];
      bucket.push(option);
      map.set(key, bucket);
    });
    return Array.from(map.entries());
  }, [options]);

  return (
    <label className="flex flex-col gap-2 text-xs text-zinc-400">
      {label}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-11 justify-between rounded-2xl bg-white/10 text-sm text-zinc-100 hover:bg-white/10"
          >
            <span className={cn("truncate", !selected && "text-zinc-500")}>
              {selected ? selected.label : placeholder}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] max-w-[calc(100vw-2rem)] p-0" align="start">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>{emptyLabel}</CommandEmpty>
              {grouped.map(([continentLabel, groupItems]) => (
                <CommandGroup key={continentLabel} heading={continentLabel}>
                  {groupItems.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => {
                        const nextValue = selectedValue === option.value ? null : option.value;
                        onChange(nextValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValue === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                      {option.flagPath ? (
                        <Image
                          src={option.flagPath}
                          alt=""
                          width={24}
                          height={16}
                          className="mr-2 h-4 w-6 rounded-[2px] border border-white/20 object-cover"
                        />
                      ) : null}
                      <span className="truncate">{option.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </label>
  );
}
