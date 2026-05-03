"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AppDictionary } from "@/lib/i18n/dictionaries";
import type { MatchPhase } from "@/lib/world-cup/types";

export const PHASE_ITEMS: MatchPhase[] = [
  "all",
  "group-stage",
  "round-of-32",
  "round-of-16",
  "quarter-finals",
  "semi-finals",
  "third-place",
  "final",
];

type PhaseNavProps = {
  value: MatchPhase;
  onChange: (phase: MatchPhase) => void;
  labels: AppDictionary["phaseLabels"];
};

export function PhaseNav({ value, onChange, labels }: PhaseNavProps) {
  return (
    <div className="no-scrollbar -mx-2 flex gap-2 overflow-x-auto px-2 pb-1">
      {PHASE_ITEMS.map((phase) => {
        const active = value === phase;
        return (
          <Button
            key={phase}
            type="button"
            variant={active ? "solid" : "default"}
            size="sm"
            className={cn("shrink-0", active && "shadow-[0_0_20px_rgba(190,242,100,0.35)]")}
            onClick={() => onChange(phase)}
          >
            {labels[phase]}
          </Button>
        );
      })}
    </div>
  );
}
