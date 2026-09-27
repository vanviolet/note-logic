import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "~/templates/components/ui/popover";
import { Button } from "~/templates/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/templates/components/ui/select";
import { Separator } from "~/templates/components/ui/separator";
import type { BatchEditDraft } from "../lib/studio-types";

export type StudioBatchEditPopoverProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: BatchEditDraft;
  onDraftChange: (next: BatchEditDraft) => void;
  targetNoteCount: number;
  onApply: () => void;
};

function DraftSelect<K extends keyof BatchEditDraft>({
  label,
  field,
  draft,
  onDraftChange,
  options,
}: {
  label: string;
  field: K;
  draft: BatchEditDraft;
  onDraftChange: (next: BatchEditDraft) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1">
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <Select
        value={draft[field] as string}
        onValueChange={(value) =>
          onDraftChange({ ...draft, [field]: value as BatchEditDraft[K] })
        }
      >
        <SelectTrigger className="h-8 text-xs">
          <SelectValue placeholder="Keep current" />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const KEEP_ON_OFF = [
  { value: "keep", label: "Keep current" },
  { value: "on", label: "On" },
  { value: "off", label: "Off" },
];

export function StudioBatchEditPopover({
  open,
  onOpenChange,
  draft,
  onDraftChange,
  targetNoteCount,
  onApply,
}: StudioBatchEditPopoverProps) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverAnchor asChild>
        <div className="pointer-events-none absolute right-2 top-2 h-0 w-0" />
      </PopoverAnchor>
      <PopoverContent
        side="right"
        align="start"
        className="w-80"
        onOpenAutoFocus={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        onFocusOutside={(event) => event.preventDefault()}
      >
        <div className="max-h-[70vh] space-y-3 overflow-y-auto">
          <div>
            <p className="text-sm font-semibold">Batch Edit Notes</p>
            <p className="text-xs text-muted-foreground">
              Target: {targetNoteCount} note(s)
            </p>
          </div>

          {/* ── Beat-level ────────────────────────── */}
          <div className="grid grid-cols-2 gap-2">
            <DraftSelect
              label="Duration"
              field="duration"
              draft={draft}
              onDraftChange={onDraftChange}
              options={[
                { value: "keep", label: "Keep current" },
                { value: "1", label: "Whole (1)" },
                { value: "2", label: "Half (2)" },
                { value: "4", label: "Quarter (4)" },
                { value: "8", label: "Eighth (8)" },
                { value: "16", label: "16th (16)" },
              ]}
            />
            <DraftSelect
              label="Dynamic"
              field="dynamic"
              draft={draft}
              onDraftChange={onDraftChange}
              options={[
                { value: "keep", label: "Keep current" },
                { value: "pp", label: "pp" },
                { value: "p", label: "p" },
                { value: "mp", label: "mp" },
                { value: "mf", label: "mf" },
                { value: "f", label: "f" },
                { value: "ff", label: "ff" },
              ]}
            />
          </div>

          <Separator />

          {/* ── Techniques ────────────────────────── */}
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Techniques
          </p>
          <div className="grid grid-cols-2 gap-2">
            <DraftSelect
              label="Palm Mute"
              field="palmMute"
              draft={draft}
              onDraftChange={onDraftChange}
              options={KEEP_ON_OFF}
            />
            <DraftSelect
              label="Dead Note"
              field="deadNote"
              draft={draft}
              onDraftChange={onDraftChange}
              options={KEEP_ON_OFF}
            />
            <DraftSelect
              label="Let Ring"
              field="letRing"
              draft={draft}
              onDraftChange={onDraftChange}
              options={KEEP_ON_OFF}
            />
            <DraftSelect
              label="Staccato"
              field="staccato"
              draft={draft}
              onDraftChange={onDraftChange}
              options={KEEP_ON_OFF}
            />
            <DraftSelect
              label="Ghost"
              field="ghost"
              draft={draft}
              onDraftChange={onDraftChange}
              options={KEEP_ON_OFF}
            />
          </div>

          <Separator />

          {/* ── Note FX ───────────────────────────── */}
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Note FX
          </p>
          <div className="grid grid-cols-2 gap-2">
            <DraftSelect
              label="Accent"
              field="accent"
              draft={draft}
              onDraftChange={onDraftChange}
              options={[
                { value: "keep", label: "Keep current" },
                { value: "none", label: "None" },
                { value: "ac", label: "Accent" },
                { value: "hac", label: "Heavy Accent" },
                { value: "ten", label: "Tenuto" },
              ]}
            />
            <DraftSelect
              label="Harmonic"
              field="harmonic"
              draft={draft}
              onDraftChange={onDraftChange}
              options={[
                { value: "keep", label: "Keep current" },
                { value: "none", label: "None" },
                { value: "nh", label: "Natural" },
                { value: "ah", label: "Artificial" },
                { value: "ph", label: "Pinch" },
                { value: "th", label: "Tap" },
                { value: "sh", label: "Semi" },
                { value: "fh", label: "Feedback" },
              ]}
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onApply}
              disabled={targetNoteCount === 0}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
