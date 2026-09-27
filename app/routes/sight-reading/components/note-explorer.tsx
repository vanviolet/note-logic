// ════════════════════════════════════════════════════════
// NoteExplorer – Interactive staff note explorer
// ════════════════════════════════════════════════════════
//
// Shows all notes on a clef with interactive click-to-hear,
// labeled staff lines/spaces, and mnemonic hints.
// ════════════════════════════════════════════════════════

import { memo, useState, useCallback } from "react";
import { Music, AudioLines } from "lucide-react";
import { StaffRenderer } from "./staff-renderer";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/templates/components/ui/tabs";
import { useGuitarAudio } from "~/templates/hooks";
import { normalizeNoteName } from "~/shared/lib/music-utils";
import {
  TREBLE_NOTES_ALL,
  BASS_NOTES_ALL,
  TREBLE_MNEMONICS,
  BASS_MNEMONICS,
} from "../lib/note-data";
import type { StaffNote, ClefType } from "../types";
import { cn } from "~/templates/lib/utils";

// ── Main Component ─────────────────────────────────────

export const NoteExplorer = memo(function NoteExplorer() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">
          Eksplorasi Not pada Paranada
        </h2>
        <p className="text-sm text-muted-foreground">
          Klik not untuk melihat posisinya pada staff dan mendengar bunyinya.
        </p>
      </div>

      <Tabs defaultValue="treble" className="w-full">
        <TabsList className="grid w-full max-w-xs grid-cols-2">
          <TabsTrigger value="treble">
            <Music className="size-4" />
            Treble Clef
          </TabsTrigger>
          <TabsTrigger value="bass">
            <AudioLines className="size-4" />
            Bass Clef
          </TabsTrigger>
        </TabsList>

        <TabsContent value="treble">
          <ClefExplorer
            clef="treble"
            notes={TREBLE_NOTES_ALL}
            mnemonics={TREBLE_MNEMONICS}
          />
        </TabsContent>
        <TabsContent value="bass">
          <ClefExplorer
            clef="bass"
            notes={BASS_NOTES_ALL}
            mnemonics={BASS_MNEMONICS}
          />
        </TabsContent>
      </Tabs>
    </section>
  );
});

// ── Clef Explorer ──────────────────────────────────────

interface ClefExplorerProps {
  clef: ClefType;
  notes: StaffNote[];
  mnemonics: {
    lines: { notes: string[]; mnemonic: string; mnemonicId: string };
    spaces: { notes: string[]; mnemonic: string; mnemonicId: string };
  };
}

function ClefExplorer({ clef, notes, mnemonics }: ClefExplorerProps) {
  const [selectedNote, setSelectedNote] = useState<StaffNote | null>(null);
  const { ensureReady, isReady, isLoading, playNote } = useGuitarAudio();

  const handleNoteClick = useCallback(
    (note: StaffNote) => {
      setSelectedNote(note);
      if (!isReady && !isLoading) ensureReady();
      playNote(`${normalizeNoteName(note.noteName)}${note.octave}`, {
        duration: 1.5,
        gain: 0.9,
      });
    },
    [ensureReady, isReady, isLoading, playNote],
  );

  return (
    <div className="mt-4 space-y-6">
      {/* Mnemonic Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        <MnemonicCard
          title="Garis (Lines)"
          notes={mnemonics.lines.notes}
          mnemonic={mnemonics.lines.mnemonic}
          mnemonicId={mnemonics.lines.mnemonicId}
        />
        <MnemonicCard
          title="Spasi (Spaces)"
          notes={mnemonics.spaces.notes}
          mnemonic={mnemonics.spaces.mnemonic}
          mnemonicId={mnemonics.spaces.mnemonicId}
        />
      </div>

      {/* Interactive note grid */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
          Klik not untuk mendengar
        </h3>
        <div className="flex flex-wrap gap-2">
          {notes.map((note) => (
            <button
              key={note.key}
              type="button"
              onClick={() => handleNoteClick(note)}
              className={cn(
                "rounded-lg border px-3 py-2 text-sm font-medium transition-all",
                "hover:border-primary hover:bg-primary/5",
                selectedNote?.key === note.key
                  ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                  : "border-border bg-card",
              )}
            >
              {note.displayName}
            </button>
          ))}
        </div>
      </div>

      {/* Selected note preview */}
      {selectedNote && (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-start">
          <StaffRenderer
            note={selectedNote}
            clef={clef}
            width={200}
            height={160}
            showLabel
            highlightColor="hsl(var(--primary))"
          />
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-2xl font-bold">{selectedNote.displayName}</h3>
            <p className="text-sm text-muted-foreground">
              Not <span className="font-semibold">{selectedNote.noteName}</span>{" "}
              pada oktaf {selectedNote.octave}
            </p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
              <Badge variant="outline">MIDI: {selectedNote.midi}</Badge>
              <Badge variant="outline">
                Pitch Class: {selectedNote.pitchClass}
              </Badge>
              <Badge variant="outline">
                {mnemonics.lines.notes.includes(selectedNote.displayName)
                  ? "Pada Garis"
                  : mnemonics.spaces.notes.includes(selectedNote.displayName)
                    ? "Pada Spasi"
                    : "Ledger Line"}
              </Badge>
            </div>
            {!isReady && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => ensureReady()}
                disabled={isLoading}
              >
                {isLoading ? "Memuat audio..." : "Aktifkan Audio"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mnemonic Card ──────────────────────────────────────

function MnemonicCard({
  title,
  notes,
  mnemonic,
  mnemonicId,
}: {
  title: string;
  notes: string[];
  mnemonic: string;
  mnemonicId: string;
}) {
  return (
    <div className="rounded-xl border border-border p-4 space-y-2">
      <h4 className="text-sm font-semibold">{title}</h4>
      <div className="flex flex-wrap gap-1.5">
        {notes.map((n) => (
          <Badge key={n} variant="secondary" className="font-mono">
            {n}
          </Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold">EN:</span> {mnemonic}
      </p>
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold">ID:</span> {mnemonicId}
      </p>
    </div>
  );
}
