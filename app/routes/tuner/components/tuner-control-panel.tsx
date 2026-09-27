import { Button } from "~/templates/components/ui/button";
import { Label } from "~/templates/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "~/templates/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/templates/components/ui/select";
import { GUITAR_STRING_TARGETS } from "../lib/tuner-utils";
import type { TuningMode } from "../types";

interface TunerControlPanelProps {
  mode: TuningMode;
  onModeChange: (value: TuningMode) => void;
  manualTargetId: string;
  onManualTargetIdChange: (value: string) => void;
  isListening: boolean;
  isStarting: boolean;
  onToggleTuner: () => void;
  onResetMeter: () => void;
  error: string | null;
}

export function TunerControlPanel({
  mode,
  onModeChange,
  manualTargetId,
  onManualTargetIdChange,
  isListening: _isListening,
  isStarting: _isStarting,
  onToggleTuner: _onToggleTuner,
  onResetMeter,
  error,
}: TunerControlPanelProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs">Mode</p>
        <RadioGroup
          value={mode}
          onValueChange={(value) => onModeChange(value as TuningMode)}
          className="grid gap-2"
        >
          <Label
            htmlFor="mode-auto"
            className="group relative flex cursor-pointer items-start gap-3 rounded-xl border border-border/70 bg-background/60 p-3 transition hover:border-primary/50 hover:bg-primary/5"
          >
            <RadioGroupItem id="mode-auto" value="auto" className="mt-0.5" />
            <span className="space-y-0.5">
              <span className="block text-sm font-semibold">
                Auto Detect String
              </span>
              <span className="text-muted-foreground block text-xs font-normal">
                Target string dipilih otomatis dari pitch terdekat.
              </span>
            </span>
          </Label>

          <Label
            htmlFor="mode-manual"
            className="group relative flex cursor-pointer items-start gap-3 rounded-xl border border-border/70 bg-background/60 p-3 transition hover:border-primary/50 hover:bg-primary/5"
          >
            <RadioGroupItem
              id="mode-manual"
              value="manual"
              className="mt-0.5"
            />
            <span className="space-y-0.5">
              <span className="block text-sm font-semibold">Manual Target</span>
              <span className="text-muted-foreground block text-xs font-normal">
                Pilih string target sendiri untuk latihan fokus.
              </span>
            </span>
          </Label>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-xs">Target String</p>
        <Select
          value={manualTargetId}
          onValueChange={onManualTargetIdChange}
          disabled={mode !== "manual"}
        >
          <SelectTrigger className="max-w-xs">
            <SelectValue placeholder="Pick string" />
          </SelectTrigger>
          <SelectContent>
            {GUITAR_STRING_TARGETS.map((target) => (
              <SelectItem key={target.id} value={target.id}>
                {target.id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={onResetMeter}>
          Reset Meter
        </Button>
      </div>

      {error ? (
        <p className="text-destructive text-xs">Mic error: {error}</p>
      ) : null}
    </div>
  );
}
