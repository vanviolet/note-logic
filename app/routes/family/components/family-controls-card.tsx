import { Search } from "lucide-react";
import type { CadentialStrength, ScaleType } from "~/theory-music/family";
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
import type { CadentialFilter, FamilyFilter } from "../types";
import { ROOT_FILTER_OPTIONS } from "~/shared/constants/music";

interface FamilyControlsCardProps {
  scaleType: ScaleType;
  onScaleTypeChange: (value: ScaleType) => void;
  root: string;
  onRootChange: (value: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  familyFilter: FamilyFilter;
  onFamilyFilterChange: (value: FamilyFilter) => void;
  cadentialFilter: CadentialFilter;
  onCadentialFilterChange: (value: CadentialFilter) => void;
}

const CADENTIAL_OPTIONS: Array<{ value: CadentialFilter; label: string }> = [
  { value: "all", label: "All Cadential" },
  { value: "very-weak", label: "Very Weak" },
  { value: "weak", label: "Weak" },
  { value: "medium", label: "Medium" },
  { value: "strong", label: "Strong" },
  { value: "very-strong", label: "Very Strong" },
];

export function FamilyControlsCard({
  scaleType,
  onScaleTypeChange,
  root,
  onRootChange,
  query,
  onQueryChange,
  familyFilter,
  onFamilyFilterChange,
  cadentialFilter,
  onCadentialFilterChange,
}: FamilyControlsCardProps) {
  const roots = ROOT_FILTER_OPTIONS;

  const familyOptions: Array<{ value: FamilyFilter; label: string }> = [
    { value: "all", label: "All Family" },
    { value: "Tonic", label: "Tonic" },
    { value: "Subdominant", label: "Subdominant" },
    { value: "Dominant", label: "Dominant" },
  ];

  return (
    <div className="space-y-3">
      <div className="grid gap-3">
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
              placeholder="Search role, degree, progression..."
              className="h-8 text-xs"
            />
          </InputGroup>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-[11px]">Scale Type</p>
          <RadioGroup
            value={scaleType}
            onValueChange={(value) => onScaleTypeChange(value as ScaleType)}
            className="grid grid-cols-2 gap-1"
          >
            {[
              { value: "major", label: "Major" },
              { value: "minor", label: "Minor" },
            ].map((option) => (
              <Label
                key={`family-scale-${option.value}`}
                htmlFor={`family-scale-${option.value}`}
                className="flex cursor-pointer items-center gap-1 rounded border border-border/70 px-1.5 py-1 text-[11px]"
              >
                <RadioGroupItem
                  id={`family-scale-${option.value}`}
                  value={option.value}
                  className="size-3"
                />
                {option.label}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-[11px]">Root</p>
          <RadioGroup
            value={root}
            onValueChange={onRootChange}
            className="grid grid-cols-5 gap-1"
          >
            {roots.map((item) => (
              <Label
                key={`family-root-${item}`}
                htmlFor={`family-root-${item}`}
                className="flex cursor-pointer items-center gap-1 rounded border border-border/70 px-1.5 py-1 text-[11px]"
              >
                <RadioGroupItem
                  id={`family-root-${item}`}
                  value={item}
                  className="size-3"
                />
                {item}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-[11px]">Family</p>
          <RadioGroup
            value={familyFilter}
            onValueChange={(value) =>
              onFamilyFilterChange(value as FamilyFilter)
            }
            className="grid gap-1 sm:grid-cols-2"
          >
            {familyOptions.map((option) => (
              <Label
                key={`family-group-${option.value}`}
                htmlFor={`family-group-${option.value}`}
                className="flex cursor-pointer items-center gap-1 rounded border border-border/70 px-1.5 py-1 text-[11px]"
              >
                <RadioGroupItem
                  id={`family-group-${option.value}`}
                  value={option.value}
                  className="size-3"
                />
                {option.label}
              </Label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <p className="text-muted-foreground text-[11px]">
            Cadential Strength
          </p>
          <RadioGroup
            value={cadentialFilter}
            onValueChange={(value) =>
              onCadentialFilterChange(value as CadentialStrength | "all")
            }
            className="grid gap-1 sm:grid-cols-2"
          >
            {CADENTIAL_OPTIONS.map((option) => (
              <Label
                key={`family-cadential-${option.value}`}
                htmlFor={`family-cadential-${option.value}`}
                className="flex cursor-pointer items-center gap-1 rounded border border-border/70 px-1.5 py-1 text-[11px]"
              >
                <RadioGroupItem
                  id={`family-cadential-${option.value}`}
                  value={option.value}
                  className="size-3"
                />
                {option.label}
              </Label>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
