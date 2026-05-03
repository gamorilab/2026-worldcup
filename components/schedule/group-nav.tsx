"use client";

import { Button } from "@/components/ui/button";

type GroupNavProps = {
  groups: string[];
  value: string;
  onChange: (group: string) => void;
  allGroupsLabel: string;
  groupPrefixLabel: string;
};

export function GroupNav({
  groups,
  value,
  onChange,
  allGroupsLabel,
  groupPrefixLabel,
}: GroupNavProps) {
  return (
    <div className="no-scrollbar -mx-2 flex gap-2 overflow-x-auto px-2 pb-1">
      <Button
        type="button"
        size="sm"
        variant={value === "all" ? "solid" : "outline"}
        onClick={() => onChange("all")}
      >
        {allGroupsLabel}
      </Button>
      {groups.map((group) => (
        <Button
          key={group}
          type="button"
          size="sm"
          variant={value === group ? "solid" : "outline"}
          onClick={() => onChange(group)}
        >
          {groupPrefixLabel} {group}
        </Button>
      ))}
    </div>
  );
}
