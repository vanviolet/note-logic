// ════════════════════════════════════════════════════════
// Circle of Fifths — Multi-Instrument Visualizer (Piano & Guitar)
// Using standard NoteLogic Fretboard & Piano components
// ════════════════════════════════════════════════════════

import { useState, useMemo, useCallback } from "react";
import { Piano as PianoIcon, Guitar, Sparkles } from "lucide-react";
import { Piano, type PianoNote } from "~/templates/components/custom/piano";
import { Fretboard, type FretboardNote } from "~/templates/components/custom/fretboard";
import type { CircleKeyData } from "~/theory-music/circle-of-fifths/circle-data";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { NOTE_INDEX } from "~/theory-music/core";
import { Badge } from "~/templates/components/ui/badge";
import { cn } from "~/templates/lib/utils";

interface InstrumentViewProps {
  keyData: CircleKeyData;
  className?: string;
}

export function CircleInstrumentView({ keyData, className }: InstrumentViewProps) {
  const [instrument, setInstrument] = useState<"piano" | "guitar">("piano");
  const [viewMode, setViewMode] = useState<"scale" | "chord">("scale");
  const [selectedChordIndex, setSelectedChordIndex] = useState<number>(0);
  const [tuning, setTuning] = useState<string[]>(["E2", "A2", "D3", "G3", "B3", "E4"]);

  const activeChord = keyData.diatonicChords[selectedChordIndex] ?? keyData.diatonicChords[0];

  // Scale degrees & tone labels
  const { highlightedPitchClasses, highlightedToneLabels } = useMemo(() => {
    if (viewMode === "chord" && activeChord) {
      const pcs = activeChord.notes.map((n) => NOTE_INDEX[n.replace(/[0-9]/g, "")] ?? 0);
      const labels: Partial<Record<number, string>> = {};
      pcs.forEach((pc, idx) => {
        labels[pc] = idx === 0 ? "1" : idx === 1 ? "3" : idx === 2 ? "5" : "7";
      });
      return { highlightedPitchClasses: pcs, highlightedToneLabels: labels };
    }

    // Scale mode
    const pcs = keyData.scaleNotes.map((n) => NOTE_INDEX[n.replace(/[0-9]/g, "")] ?? 0);
    const labels: Partial<Record<number, string>> = {};
    const degreeNames = ["1", "2", "3", "4", "5", "6", "7"];
    pcs.forEach((pc, idx) => {
      labels[pc] = degreeNames[idx] ?? `${idx + 1}`;
    });

    return { highlightedPitchClasses: pcs, highlightedToneLabels: labels };
  }, [viewMode, activeChord, keyData.scaleNotes]);

  // Click handler for Piano keys
  const handlePianoKeyClick = useCallback((note: PianoNote) => {
    circleAudio.playNote(note.note, note.octave, 1.8, 0.9, "piano");
  }, []);

  // Click handler for Guitar frets
  const handleFretClick = useCallback((fretNote: FretboardNote) => {
    circleAudio.playNote(fretNote.note, fretNote.octave, 2.0, 0.9, "guitar");
  }, []);

  return (
    <div className={cn("space-y-4 p-4 sm:p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur", className)}>
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          {instrument === "piano" ? (
            <PianoIcon className="size-4 text-primary" />
          ) : (
            <Guitar className="size-4 text-primary" />
          )}
          <h3 className="font-bold text-base text-foreground">
            Instrument Visualizer
          </h3>
          <Badge variant="outline" className="text-xs">
            {keyData.majorKey} Major
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Instrument Selector */}
          <div className="flex rounded-lg border border-border p-0.5 bg-background">
            <button
              type="button"
              onClick={() => setInstrument("piano")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5",
                instrument === "piano"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <PianoIcon className="size-3.5" />
              Piano
            </button>
            <button
              type="button"
              onClick={() => setInstrument("guitar")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5",
                instrument === "guitar"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Guitar className="size-3.5" />
              Guitar Fretboard
            </button>
          </div>

          {/* Mode Selector */}
          <div className="flex rounded-lg border border-border p-0.5 bg-background">
            <button
              type="button"
              onClick={() => setViewMode("scale")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                viewMode === "scale"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Full Scale
            </button>
            <button
              type="button"
              onClick={() => setViewMode("chord")}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
                viewMode === "chord"
                  ? "bg-muted text-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Chord Notes
            </button>
          </div>
        </div>
      </div>

      {/* Chord Selector if in Chord View */}
      {viewMode === "chord" && (
        <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-lg bg-background/50 border border-border/50 text-xs">
          <span className="text-muted-foreground text-[11px] mr-1">Pilih Chord:</span>
          {keyData.diatonicChords.map((chord, idx) => (
            <button
              key={chord.degree}
              type="button"
              onClick={() => {
                setSelectedChordIndex(idx);
                circleAudio.playChord(chord.notes, {
                  type: "strum",
                  instrument: instrument === "guitar" ? "guitar" : "piano",
                });
              }}
              className={cn(
                "px-2.5 py-1 rounded text-xs font-medium transition-all",
                selectedChordIndex === idx
                  ? "bg-primary text-primary-foreground font-bold shadow-xs"
                  : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              {chord.degree}: {chord.name}
            </button>
          ))}
        </div>
      )}

      {/* ── REAL PIANO COMPONENT ── */}
      {instrument === "piano" && (
        <div className="space-y-2">
          <div className="overflow-x-auto rounded-xl">
            <Piano
              startOctave={3}
              octaveCount={2}
              highlightedPitchClasses={highlightedPitchClasses}
              highlightedToneLabels={highlightedToneLabels}
              enableLiveMic={false}
              onKeyClick={handlePianoKeyClick}
              className="bg-card/70 border-border/80"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              {viewMode === "scale"
                ? `Menampilkan tangga nada ${keyData.majorKey} Major (Derajat 1 sampai 7)`
                : `Menampilkan nada chord ${activeChord.name} [${activeChord.notes.join(", ")}]`}
            </span>
            <span className="hidden sm:inline">Klik tuts piano untuk memainkan suara</span>
          </div>
        </div>
      )}

      {/* ── REAL FRETBOARD COMPONENT ── */}
      {instrument === "guitar" && (
        <div className="space-y-2">
          <div className="overflow-x-auto rounded-xl">
            <Fretboard
              tuning={tuning}
              editableTuning={true}
              onTuningChange={setTuning}
              fretCount={15}
              highlightedPitchClasses={highlightedPitchClasses}
              highlightedToneLabels={highlightedToneLabels}
              enableLiveMic={false}
              onFretClick={handleFretClick}
              className="bg-card/70 border-border/80"
            />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              {viewMode === "scale"
                ? `Posisi nada ${keyData.majorKey} Major di seluruh fretboard (Fret 0-15)`
                : `Posisi nada chord ${activeChord.name} [${activeChord.notes.join(", ")}]`}
            </span>
            <span className="hidden sm:inline">Klik fret untuk memetik senar gitar</span>
          </div>
        </div>
      )}
    </div>
  );
}
