import * as React from "react";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/templates/components/ui/card";
import { Input } from "~/templates/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/templates/components/ui/select";
import type { NoteDuration } from "../types";

type StudioControlsProps = {
  measureCount: number;
  tempo: number;
  beatsPerMeasure: number;
  cellWidth: number;
  selectedDuration: NoteDuration;
  playheadBeat: number;
  totalBeats: number;
  notesCount: number;
  isPlaying: boolean;
  isAudioLoading: boolean;
  alphaReady: boolean;
  onChangeMeasureCount: (next: number) => void;
  onChangeTempo: (next: number) => void;
  onChangeBeatsPerMeasure: (next: number) => void;
  onChangeCellWidth: (next: number) => void;
  onChangeDuration: (next: NoteDuration) => void;
  onChangePlayhead: (next: number) => void;
  onPlayEditor: () => void;
  onStopEditor: () => void;
  onPlayPauseAlphaTab: () => void;
  onStopAlphaTab: () => void;
  onExportAlphaTex: () => void;
  onUseEditorScore: () => void;
  onClearCurrentMeasure: () => void;
  onDuplicateCurrentMeasure: () => void;
  onRemoveSelected: () => void;
  onImportFile: (file: File) => void;
  hasSelectedNote: boolean;
};

const BEAT_OPTIONS = [3, 4, 6] as const;

export function StudioControls({
  measureCount,
  tempo,
  beatsPerMeasure,
  cellWidth,
  selectedDuration,
  playheadBeat,
  totalBeats,
  notesCount,
  isPlaying,
  isAudioLoading,
  alphaReady,
  onChangeMeasureCount,
  onChangeTempo,
  onChangeBeatsPerMeasure,
  onChangeCellWidth,
  onChangeDuration,
  onChangePlayhead,
  onPlayEditor,
  onStopEditor,
  onPlayPauseAlphaTab,
  onStopAlphaTab,
  onExportAlphaTex,
  onUseEditorScore,
  onClearCurrentMeasure,
  onDuplicateCurrentMeasure,
  onRemoveSelected,
  onImportFile,
  hasSelectedNote,
}: StudioControlsProps) {
  return (
    <Card className="min-w-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>Control Panel</span>
          <Badge variant="secondary">{notesCount} notes</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 lg:grid-cols-[2fr_1.2fr]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Measures</p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onChangeMeasureCount(Math.max(1, measureCount - 1))
                }
              >
                -
              </Button>
              <span className="min-w-10 text-center text-sm font-medium">
                {measureCount}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  onChangeMeasureCount(Math.min(32, measureCount + 1))
                }
              >
                +
              </Button>
            </div>
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Time Signature</p>
            <Select
              value={String(beatsPerMeasure)}
              onValueChange={(value) => onChangeBeatsPerMeasure(Number(value))}
            >
              <SelectTrigger>
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

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Tempo (BPM)</p>
            <Input
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

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Grid Zoom</p>
            <Input
              type="range"
              min={44}
              max={88}
              value={cellWidth}
              onChange={(event) =>
                onChangeCellWidth(Number(event.target.value))
              }
            />
          </div>

          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground">Selected Duration</p>
            <Select
              value={String(selectedDuration)}
              onValueChange={(value) =>
                onChangeDuration(Number(value) as NoteDuration)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Whole (1)</SelectItem>
                <SelectItem value="2">Half (2)</SelectItem>
                <SelectItem value="4">Quarter (4)</SelectItem>
                <SelectItem value="8">Eighth (8)</SelectItem>
                <SelectItem value="16">Sixteenth (16)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 sm:col-span-2 xl:col-span-5">
            <p className="text-xs text-muted-foreground">Playhead</p>
            <Input
              type="range"
              min={0}
              max={Math.max(0, totalBeats - 1)}
              value={Math.min(playheadBeat, Math.max(0, totalBeats - 1))}
              onChange={(event) => onChangePlayhead(Number(event.target.value))}
            />
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          <Button
            type="button"
            onClick={onPlayEditor}
            disabled={isPlaying || isAudioLoading}
          >
            {isPlaying ? "Playing..." : "Play Editor"}
          </Button>
          <Button type="button" variant="outline" onClick={onStopEditor}>
            Stop Editor
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={onPlayPauseAlphaTab}
            disabled={!alphaReady}
          >
            Play/Pause alphaTab
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onStopAlphaTab}
            disabled={!alphaReady}
          >
            Stop alphaTab
          </Button>
          <Button type="button" variant="outline" onClick={onExportAlphaTex}>
            Export AlphaTex
          </Button>

          <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-border px-3 text-sm font-medium transition hover:border-primary/60 hover:text-primary">
            Import GP
            <input
              type="file"
              accept=".gp,.gp3,.gp4,.gp5,.gpx"
              className="sr-only"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  onImportFile(file);
                }
              }}
            />
          </label>

          <Button type="button" variant="ghost" onClick={onUseEditorScore}>
            Use Editor Score
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClearCurrentMeasure}
          >
            Clear Bar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onDuplicateCurrentMeasure}
          >
            Duplicate Bar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onRemoveSelected}
            disabled={!hasSelectedNote}
          >
            Remove Selected
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
