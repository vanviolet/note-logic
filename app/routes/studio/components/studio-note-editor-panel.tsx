import { Badge } from "~/templates/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/templates/components/ui/card";
import { Input } from "~/templates/components/ui/input";
import { cn } from "~/templates/lib/utils";
import { STRING_TUNING } from "../lib/studio-utils";
import type { StudioNote } from "../types";

type StudioNoteEditorPanelProps = {
  selectedMeasure: number;
  selectedBeat: number;
  selectedNote: StudioNote | null;
  activeNote: { stringIndex: number; fret: number } | null;
  onApplyFret: (stringIndex: number, fret: number) => void;
  onChangeSelectedFret: (fret: number) => void;
};

const FRET_PRESET = Array.from({ length: 13 }, (_, index) => index);

export function StudioNoteEditorPanel({
  selectedMeasure,
  selectedBeat,
  selectedNote,
  activeNote,
  onApplyFret,
  onChangeSelectedFret,
}: StudioNoteEditorPanelProps) {
  return (
    <Card className="min-w-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Note Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          Editor note mandiri (tanpa komponen fretboard). Klik angka fret untuk
          menaruh note ke cell aktif.
        </p>

        <div className="overflow-x-auto rounded-md border border-border/70 bg-background/40 p-2">
          <div
            className="grid min-w-[720px] gap-1"
            style={{
              gridTemplateColumns: "84px repeat(13, minmax(34px, 1fr))",
            }}
          >
            <div className="flex h-8 items-center px-2 text-[11px] font-medium text-muted-foreground">
              String
            </div>
            {FRET_PRESET.map((fret) => (
              <div
                key={`head-${fret}`}
                className="flex h-8 items-center justify-center text-[10px] text-muted-foreground"
              >
                {fret}
              </div>
            ))}

            {STRING_TUNING.map((open, stringIndex) => (
              <div key={`row-${open}`} className="contents">
                <div
                  key={`label-${open}`}
                  className="flex h-9 items-center rounded-md border border-border/70 bg-card px-2 text-xs font-medium"
                >
                  {open}
                </div>
                {FRET_PRESET.map((fret) => {
                  const isActive =
                    activeNote?.stringIndex === stringIndex &&
                    activeNote?.fret === fret;

                  return (
                    <button
                      key={`${open}-${fret}`}
                      type="button"
                      className={cn(
                        "h-9 rounded-md border border-border/70 bg-card text-xs text-foreground/90 transition hover:border-primary/60 hover:text-primary",
                        isActive &&
                          "border-primary bg-primary/20 text-primary ring-1 ring-primary/40",
                      )}
                      onClick={() => onApplyFret(stringIndex, fret)}
                    >
                      {fret}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

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
