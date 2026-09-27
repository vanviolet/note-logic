import { Search } from "lucide-react";
import type { SpellMode } from "~/theory-music/music";
import { ROOT_FILTER_OPTIONS } from "~/shared/constants/music";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "~/templates/components/ui/input-group";
import { Label } from "~/templates/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "~/templates/components/ui/radio-group";
import type { FilterMode } from "../types";

interface IntervalControlsCardProps {
  root: string;
  onRootChange: (value: string) => void;
  spell: SpellMode;
  onSpellChange: (value: SpellMode) => void;
  query: string;
  onQueryChange: (value: string) => void;
  filter: FilterMode;
  onFilterChange: (value: FilterMode) => void;
}

export function IntervalControlsCard({
  root,
  onRootChange,
  spell,
  onSpellChange,
  query,
  onQueryChange,
  filter,
  onFilterChange,
}: IntervalControlsCardProps) {
  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1 text-xs font-medium">Search</p>
        <InputGroup className="h-8">
          <InputGroupAddon align="inline-start">
            <InputGroupText>
              <Search className="size-3.5" />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search interval..."
            className="h-8 text-xs"
          />
        </InputGroup>
      </div>

      <div className="space-y-1.5">
        <p className="text-muted-foreground text-[11px]">Root</p>
        <RadioGroup
          value={root}
          onValueChange={onRootChange}
          className="grid grid-cols-4 gap-1"
        >
          {ROOT_FILTER_OPTIONS.map((note) => (
            <Label
              key={`interval-root-${note}`}
              htmlFor={`interval-root-${note}`}
              className="flex cursor-pointer items-center gap-1 rounded border border-border/70 px-1.5 py-1 text-[11px]"
            >
              <RadioGroupItem
                id={`interval-root-${note}`}
                value={note}
                className="size-3"
              />
              {note}
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-1.5">
        <p className="text-muted-foreground text-[11px]">Spelling</p>
        <RadioGroup
          value={spell}
          onValueChange={(value) => onSpellChange(value as SpellMode)}
          className="grid grid-cols-3 gap-1"
        >
          {[
            { value: "auto", label: "Auto" },
            { value: "sharp", label: "Sharp" },
            { value: "flat", label: "Flat" },
          ].map((option) => (
            <Label
              key={`interval-spell-${option.value}`}
              htmlFor={`interval-spell-${option.value}`}
              className="flex cursor-pointer items-center gap-1 rounded border border-border/70 px-1.5 py-1 text-[11px]"
            >
              <RadioGroupItem
                id={`interval-spell-${option.value}`}
                value={option.value}
                className="size-3"
              />
              {option.label}
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="space-y-1.5">
        <p className="text-muted-foreground text-[11px]">Consonance</p>
        <RadioGroup
          value={filter}
          onValueChange={(value) => onFilterChange(value as FilterMode)}
          className="grid grid-cols-2 gap-1"
        >
          {[
            { value: "all", label: "All" },
            { value: "perfect-consonance", label: "Perfect" },
            { value: "imperfect-consonance", label: "Imperfect" },
            { value: "dissonance", label: "Dissonance" },
          ].map((option) => (
            <Label
              key={`interval-filter-${option.value}`}
              htmlFor={`interval-filter-${option.value}`}
              className="flex cursor-pointer items-center gap-1 rounded border border-border/70 px-1.5 py-1 text-[11px]"
            >
              <RadioGroupItem
                id={`interval-filter-${option.value}`}
                value={option.value}
                className="size-3"
              />
              {option.label}
            </Label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
