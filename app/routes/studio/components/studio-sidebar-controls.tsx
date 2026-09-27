import * as React from "react";
import { Button } from "~/templates/components/ui/button";
import { Input } from "~/templates/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/templates/components/ui/select";
import type { NoteDuration } from "../types";

type StudioSidebarControlsProps = {
  measureCount: number;
  beatsPerMeasure: number;
  tempo: number;
  cellWidth: number;
  selectedDuration: NoteDuration;
  playheadBeat: number;
  totalBeats: number;
  onChangeMeasureCount: (next: number) => void;
  onChangeBeatsPerMeasure: (next: number) => void;
  onChangeTempo: (next: number) => void;
  onChangeCellWidth: (next: number) => void;
  onChangeDuration: (next: NoteDuration) => void;
  onChangePlayhead: (next: number) => void;
  onUseEditorScore: () => void;
  onClearCurrentMeasure: () => void;
  onDuplicateCurrentMeasure: () => void;
  onRemoveSelected: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onCopyCurrentMeasure: () => void;
  onPasteToCurrentMeasure: () => void;
  onTransposeSelected: (semitone: number) => void;
  hasSelectedNote: boolean;
  canUndo: boolean;
  canRedo: boolean;
  hasCopiedMeasure: boolean;
};

const BEAT_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12] as const;

export const StudioSidebarControls = React.memo(function StudioSidebarControls({
  measureCount,
  beatsPerMeasure,
  tempo,
  cellWidth,
  selectedDuration,
  playheadBeat,
  totalBeats,
  onChangeMeasureCount,
  onChangeBeatsPerMeasure,
  onChangeTempo,
  onChangeCellWidth,
  onChangeDuration,
  onChangePlayhead,
  onUseEditorScore,
  onClearCurrentMeasure,
  onDuplicateCurrentMeasure,
  onRemoveSelected,
  onUndo,
  onRedo,
  onCopyCurrentMeasure,
  onPasteToCurrentMeasure,
  onTransposeSelected,
  hasSelectedNote,
  canUndo,
  canRedo,
  hasCopiedMeasure,
}: StudioSidebarControlsProps) {
  return (
    <div className="space-y-3 rounded-lg border border-border/70 bg-card p-3">
      <p className="text-xs font-semibold">Editor Controls</p>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onUndo}
          disabled={!canUndo}
        >
          Undo
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onRedo}
          disabled={!canRedo}
        >
          Redo
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] text-muted-foreground">Bar</p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onChangeMeasureCount(Math.max(1, measureCount - 1))}
          >
            -
          </Button>
          <span className="min-w-8 text-center text-sm font-medium">
            {measureCount}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onChangeMeasureCount(Math.min(64, measureCount + 1))}
          >
            +
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] text-muted-foreground">Time Signature</p>
        <Select
          value={String(beatsPerMeasure)}
          onValueChange={(value) => onChangeBeatsPerMeasure(Number(value))}
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BEAT_OPTIONS.map((beats) => (
              <SelectItem key={beats} value={String(beats)}>
                {beats}/4
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] text-muted-foreground">Tempo</p>
        <Input
          className="h-8"
          type="number"
          min={30}
          max={260}
          value={tempo}
          onChange={(event) =>
            onChangeTempo(
              Math.max(30, Math.min(260, Number(event.target.value) || 96)),
            )
          }
        />
      </div>

      <div className="space-y-2">
        <p className="text-[11px] text-muted-foreground">Zoom Timeline</p>
        <Input
          className="h-8"
          type="range"
          min={44}
          max={88}
          value={cellWidth}
          onChange={(event) => onChangeCellWidth(Number(event.target.value))}
        />
      </div>

      <div className="space-y-2">
        <p className="text-[11px] text-muted-foreground">Default Duration</p>
        <Select
          value={String(selectedDuration)}
          onValueChange={(value) =>
            onChangeDuration(Number(value) as NoteDuration)
          }
        >
          <SelectTrigger className="h-8 w-full">
            <SelectValue placeholder="Duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Whole</SelectItem>
            <SelectItem value="2">Half</SelectItem>
            <SelectItem value="4">Quarter</SelectItem>
            <SelectItem value="8">Eighth</SelectItem>
            <SelectItem value="16">Sixteenth</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <p className="text-[11px] text-muted-foreground">Playhead</p>
        <Input
          type="range"
          min={0}
          max={Math.max(0, totalBeats - 1)}
          value={Math.min(playheadBeat, Math.max(0, totalBeats - 1))}
          onChange={(event) => onChangePlayhead(Number(event.target.value))}
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onCopyCurrentMeasure}
        >
          Copy Bar
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onPasteToCurrentMeasure}
          disabled={!hasCopiedMeasure}
        >
          Paste Bar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onTransposeSelected(-1)}
          disabled={!hasSelectedNote}
        >
          Transpose -1
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => onTransposeSelected(1)}
          disabled={!hasSelectedNote}
        >
          Transpose +1
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onUseEditorScore}
        >
          Use Editor
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onDuplicateCurrentMeasure}
        >
          Duplicate Bar
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onClearCurrentMeasure}
        >
          Clear Bar
        </Button>
        <Button
          type="button"
          size="sm"
          variant="destructive"
          onClick={onRemoveSelected}
          disabled={!hasSelectedNote}
        >
          Remove Note
        </Button>
      </div>
    </div>
  );
});
