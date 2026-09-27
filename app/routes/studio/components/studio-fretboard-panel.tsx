import * as React from "react";
import {
  Fretboard,
  type FretboardNote,
} from "~/templates/components/custom/fretboard";
import { Badge } from "~/templates/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/templates/components/ui/card";
import { Input } from "~/templates/components/ui/input";
import { STRING_TUNING } from "../lib/studio-utils";
import type { StudioNote } from "../types";

type StudioFretboardPanelProps = {
  selectedMeasure: number;
  selectedBeat: number;
  selectedNote: StudioNote | null;
  highlightedPitchClasses: number[];
  activeFretboardNote: { stringIndex: number; fret: number } | null;
  onFretClick: (note: FretboardNote) => void;
  onChangeSelectedFret: (fret: number) => void;
};

export function StudioFretboardPanel({
  selectedMeasure,
  selectedBeat,
  selectedNote,
  highlightedPitchClasses,
  activeFretboardNote,
  onFretClick,
  onChangeSelectedFret,
}: StudioFretboardPanelProps) {
  return (
    <Card className="min-w-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Interactive Fretboard</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Click fret untuk edit note yang sedang dipilih. Highlight mengikuti
          bar aktif supaya konteks harmoni lebih jelas.
        </p>

        <Fretboard
          enableLiveMic={false}
          showOpenLabel
          highlightedPitchClasses={highlightedPitchClasses}
          activeNote={activeFretboardNote}
          onFretClick={onFretClick}
        />

        {selectedNote ? (
          <div className="grid gap-2 rounded-md border border-border/70 bg-background/60 p-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Selected</span>
              <Badge variant="outline">{selectedNote.id}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>Measure: {selectedNote.measure + 1}</div>
              <div>Beat: {selectedNote.beat + 1}</div>
              <div>String: {STRING_TUNING[selectedNote.string]}</div>
              <div>Fret: {selectedNote.fret}</div>
            </div>

            <Input
              type="number"
              min={0}
              max={24}
              value={selectedNote.fret}
              onChange={(event) =>
                onChangeSelectedFret(Number(event.target.value) || 0)
              }
            />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">
            Pilih cell terlebih dulu (bar {selectedMeasure + 1}, beat{" "}
            {selectedBeat + 1}).
          </p>
        )}
      </CardContent>
    </Card>
  );
}
