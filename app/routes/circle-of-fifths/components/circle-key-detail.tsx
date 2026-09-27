// ════════════════════════════════════════════════════════
// Circle of Fifths — Key Detail & Diatonic Matrix Component
// Mobile-Friendly, Clean & Responsive Layout
// ════════════════════════════════════════════════════════

import { useState } from "react";
import {
  Play,
  Volume2,
  Sparkles,
  Music,
  Plus,
  BookOpen,
  Layers,
} from "lucide-react";
import type {
  CircleKeyData,
  DiatonicChord,
} from "~/theory-music/circle-of-fifths/circle-data";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/templates/components/ui/tabs";
import { cn } from "~/templates/lib/utils";

interface CircleKeyDetailProps {
  keyData: CircleKeyData;
  onAddChordToProgression?: (chordName: string) => void;
  className?: string;
}

/**
 * Key Signature Staff Notation (SVG Treble Clef with sharp/flat placement)
 */
function KeySignatureStaff({ keyData }: { keyData: CircleKeyData }) {
  const lineY = [18, 28, 38, 48, 58];
  const staffWidth = 140;

  const sharpPositions = [
    { y: 18 }, // F5
    { y: 33 }, // C5
    { y: 13 }, // G5
    { y: 28 }, // D5
    { y: 43 }, // A4
    { y: 23 }, // E5
    { y: 38 }, // B4
  ];

  const flatPositions = [
    { y: 38 }, // B4
    { y: 23 }, // E5
    { y: 43 }, // A4
    { y: 28 }, // D5
    { y: 48 }, // G4
    { y: 33 }, // C5
    { y: 53 }, // F4
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 rounded-xl bg-card/60 border border-border/70 backdrop-blur">
      <div className="flex items-center justify-center bg-background/50 rounded-lg p-1 border border-border/40 shrink-0">
        <svg viewBox={`0 0 ${staffWidth} 76`} className="w-32 h-16 shrink-0 overflow-visible">
          {/* 5 Staff lines */}
          {lineY.map((y, idx) => (
            <line
              key={`line-${idx}`}
              x1={8}
              y1={y}
              x2={staffWidth - 8}
              y2={y}
              stroke="currentColor"
              strokeOpacity={0.35}
              strokeWidth={1.2}
            />
          ))}

          {/* Treble Clef glyph path */}
          <g transform="translate(12, 10) scale(0.55)" fill="currentColor" fillOpacity={0.85}>
            <path d="M18.5 35.8c-1.2-1.9-2.2-4.5-2.2-7.3 0-5.8 4.2-10.2 10.2-10.2 2.5 0 4.8.8 6.5 2.2l.6-3.8c-2.1-1.3-4.7-2.1-7.6-2.1-8.2 0-14.2 5.9-14.2 13.9 0 3.7 1.3 7.1 3.2 9.8l3.5-2.5zm5.8-21.5c.3-1.8.8-3.4 1.5-4.8 1.4-2.8 3.5-4.5 5.7-4.5 3.3 0 5.2 2.9 5.2 7.1 0 4.2-1.8 9.3-4.5 13.9l2.7 1.8c3.2-5.4 5.3-11.2 5.3-16.1 0-6.2-3.2-10.5-8.7-10.5-3.8 0-7.3 2.8-9.4 7.2-.9 1.9-1.5 4-1.9 6.2l4.1 1.7z" />
            <path d="M28.5 68.5c-4.8 0-8.2-3.5-8.2-8.2 0-4.5 3.1-7.8 7.2-7.8 4.5 0 7.8 3.2 7.8 7.8 0 4.7-3.4 8.2-6.8 8.2zm1-58.5h-2.5v50.2c-1.4-.8-3.1-1.2-4.9-1.2-5.8 0-10.5 4.5-10.5 10.5 0 6.1 4.7 10.5 10.5 10.5 5.5 0 10.2-4.2 10.2-9.8V10z" />
          </g>

          {/* Sharps */}
          {keyData.accidentalType === "sharp" &&
            keyData.accidentalsList.map((_, i) => {
              const pos = sharpPositions[i];
              if (!pos) return null;
              const x = 42 + i * 11;
              return (
                <text
                  key={`sharp-${i}`}
                  x={x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  className="fill-foreground font-serif text-sm font-bold select-none"
                >
                  ♯
                </text>
              );
            })}

          {/* Flats */}
          {keyData.accidentalType === "flat" &&
            keyData.accidentalsList.map((_, i) => {
              const pos = flatPositions[i];
              if (!pos) return null;
              const x = 42 + i * 11;
              return (
                <text
                  key={`flat-${i}`}
                  x={x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  className="fill-foreground font-serif text-sm font-bold select-none"
                >
                  ♭
                </text>
              );
            })}

          {keyData.accidentalsCount === 0 && (
            <text
              x={75}
              y={42}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px] italic font-sans"
            >
              Natural (0 ♯/♭)
            </text>
          )}
        </svg>
      </div>

      <div className="text-xs space-y-1 min-w-0 flex-1">
        <div className="font-semibold text-foreground flex items-center gap-1.5 flex-wrap">
          <span>Key Signature:</span>
          <span className="text-primary font-mono font-bold">
            {keyData.accidentalsCount === 0
              ? "0 Accidental (Natural)"
              : `${keyData.accidentalsCount} ${keyData.accidentalType === "sharp" ? "Kres (♯)" : "Mol (♭)"}`}
          </span>
        </div>
        <p className="text-muted-foreground text-[11px] leading-tight">
          {keyData.accidentalsCount > 0
            ? `Daftar nada: ${keyData.accidentalsList.join(", ")}`
            : "Semua nada natural tanpa tanda kres/mol."}
        </p>
        <p className="text-[11px] text-primary/85 italic">
          Mnemonic: &ldquo;{keyData.orderMnemonic}&rdquo;
        </p>
      </div>
    </div>
  );
}

export function CircleKeyDetail({
  keyData,
  onAddChordToProgression,
  className,
}: CircleKeyDetailProps) {
  const [activeTab, setActiveTab] = useState("diatonic");

  // Audio actions using soundfont engine
  const handlePlayScale = () => {
    circleAudio.playScale(keyData.scaleNotes, 0.22, 4, "piano");
  };

  const handlePlayCadence = () => {
    const I = keyData.diatonicChords[0].notes;
    const IV = keyData.diatonicChords[3].notes;
    const V = keyData.diatonicChords[4].notes;
    circleAudio.playCadenceChords([I, IV, V, I], 96);
  };

  const handlePlayArpeggio = () => {
    const tonic = keyData.diatonicChords[0];
    if (tonic) {
      circleAudio.playChord(tonic.notes, { type: "arpeggio", duration: 2.5, speed: 0.16 });
    }
  };

  return (
    <div className={cn("space-y-5", className)}>
      {/* ── Key Hero Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-xl border border-border/80 bg-card/70 backdrop-blur">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {keyData.majorKey} Major
            </h2>
            <span className="text-muted-foreground">/</span>
            <h3 className="text-xl font-semibold text-primary">
              {keyData.relativeMinor} Minor
            </h3>
            {keyData.majorAlt && (
              <Badge variant="outline" className="text-[11px]">
                enharmonic: {keyData.majorAlt}
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1">
            <span>
              Scale: <strong className="text-foreground font-mono">{keyData.scaleNotes.join(" - ")}</strong>
            </span>
            <span className="hidden sm:inline" aria-hidden="true">·</span>
            <span>Parallel Minor: <strong className="text-foreground">{keyData.parallelMinor}</strong></span>
          </div>
        </div>

        {/* Quick Audio Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="default"
            className="h-8 gap-1.5 text-xs font-semibold"
            onClick={handlePlayCadence}
          >
            <Play className="size-3.5 fill-current" />
            Cadence (I–IV–V–I)
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={handlePlayScale}
          >
            <Music className="size-3.5 text-primary" />
            Scale
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-8 gap-1.5 text-xs"
            onClick={handlePlayArpeggio}
          >
            <Sparkles className="size-3.5 text-amber-500" />
            Arpeggio
          </Button>
        </div>
      </div>

      {/* ── Key Signature Staff ── */}
      <KeySignatureStaff keyData={keyData} />

      {/* ── Deep Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1 gap-1">
          <TabsTrigger value="diatonic" className="text-xs py-2">
            Diatonic Chords (7)
          </TabsTrigger>
          <TabsTrigger value="secondary" className="text-xs py-2">
            Secondary Dominants
          </TabsTrigger>
          <TabsTrigger value="borrowed" className="text-xs py-2">
            Borrowed (Modal)
          </TabsTrigger>
          <TabsTrigger value="modes" className="text-xs py-2">
            Modes & Tips
          </TabsTrigger>
        </TabsList>

        {/* ── Tab 1: Diatonic Chords Matrix (Clean Mobile-Friendly Grid) ── */}
        <TabsContent value="diatonic" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
            {keyData.diatonicChords.map((chord) => {
              const functionColors = {
                Tonic: "border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/10",
                Subdominant: "border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10",
                Dominant: "border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10",
              };

              const badgeColors = {
                Tonic: "bg-blue-500/15 text-blue-400 border-blue-500/30",
                Subdominant: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                Dominant: "bg-amber-500/15 text-amber-400 border-amber-500/30",
              };

              return (
                <div
                  key={chord.degree}
                  className={cn(
                    "flex flex-col justify-between p-3.5 rounded-xl border transition-all duration-200 min-w-0 shadow-xs",
                    functionColors[chord.function],
                  )}
                >
                  {/* Top degree & function label */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-mono font-extrabold text-foreground px-1.5 py-0.5 rounded bg-background/80 border border-border/40">
                        {chord.degree}
                      </span>
                      <span
                        className={cn(
                          "text-[9px] px-1.5 py-0.5 rounded font-medium border truncate",
                          badgeColors[chord.function],
                        )}
                      >
                        {chord.function}
                      </span>
                    </div>

                    {/* Chord Triad & 7th */}
                    <div className="pt-0.5">
                      <div className="text-lg font-bold tracking-tight text-foreground">
                        {chord.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                        <span>7th:</span>
                        <span className="font-semibold text-primary">{chord.seventhName}</span>
                      </div>
                    </div>

                    {/* Chord notes */}
                    <div className="text-[10px] text-muted-foreground/80 font-mono tracking-tight">
                      [{chord.notes.join(", ")}]
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between gap-1 text-xs">
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => circleAudio.playChord(chord.notes, { type: "strum" })}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors"
                        title={`Mainkan Triad ${chord.name}`}
                        aria-label={`Play ${chord.name}`}
                      >
                        <Volume2 className="size-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => circleAudio.playChord(chord.seventhNotes, { type: "strum" })}
                        className="px-1.5 py-0.5 text-[10px] rounded font-medium bg-background/60 hover:bg-background transition-colors text-muted-foreground hover:text-foreground"
                        title={`Mainkan 7th ${chord.seventhName}`}
                      >
                        7th
                      </button>
                    </div>

                    {onAddChordToProgression && (
                      <button
                        type="button"
                        onClick={() => onAddChordToProgression(chord.name)}
                        className="p-1 rounded-md text-primary hover:bg-primary/10 transition-colors"
                        title="Tambah ke Progression Builder"
                        aria-label={`Add ${chord.name} to progression`}
                      >
                        <Plus className="size-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground pt-1 px-1">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-blue-500 inline-block" /> Tonic (Pusat Pulang)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-emerald-500 inline-block" /> Subdominant (Transisi/Predominant)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full bg-amber-500 inline-block" /> Dominant (Puncak Tegangan Menuju I)
            </span>
          </div>
        </TabsContent>

        {/* ── Tab 2: Secondary Dominants & Tritone Sub ── */}
        <TabsContent value="secondary" className="mt-4 space-y-4">
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Secondary Dominant adalah chord dominant (V7) yang &ldquo;dipinjam&rdquo; untuk mengarah ke salah satu chord diatonic selain tonic (I), menciptakan dorongan gerak harmonis yang elegan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {keyData.secondaryDominants.map((sec) => (
                <div
                  key={sec.symbol}
                  className="p-3.5 rounded-xl border border-border/70 bg-card/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-amber-400">
                      {sec.symbol}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      Target: {sec.targetDegree} ({sec.targetChord})
                    </Badge>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-foreground">{sec.chordName}</span>
                    <span className="text-xs text-muted-foreground font-mono">
                      [{sec.notes.join(", ")}]
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-muted-foreground">
                      Resolves to: <strong className="text-foreground">{sec.targetChord}</strong>
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-xs gap-1"
                      onClick={() => {
                        circleAudio.playCadenceChords([sec.notes, sec.resolutionNotes], 100);
                      }}
                    >
                      <Play className="size-3 fill-current" />
                      Dengar Resolusi
                    </Button>
                  </div>
                </div>
              ))}

              {/* Tritone Sub Card */}
              <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-red-400">
                    subV7 (Tritone Sub)
                  </span>
                  <Badge variant="destructive" className="text-[10px]">
                    180° Polar
                  </Badge>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-foreground">{keyData.tritoneSub.subV7}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  Menggantikan V7 dengan dominant chord tepat 1/2 nada di atas tonic untuk resolusi chromatic bass turun yang sangat halus.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── Tab 3: Modal Interchange (Borrowed Chords) ── */}
        <TabsContent value="borrowed" className="mt-4 space-y-4">
          <p className="text-xs text-muted-foreground">
            Modal Interchange adalah teknik meminjam chord dari tangga nada parallel minor ({keyData.parallelMinor}) untuk memberikan warna emosi yang kaya dan magis tanpa keluar dari tonalitas utama.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {keyData.borrowedChords.map((borrowed) => (
              <div
                key={borrowed.symbol}
                className="p-3.5 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-mono font-bold text-purple-400">
                    {borrowed.symbol}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {borrowed.sourceMode}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    {borrowed.chordName}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    [{borrowed.notes.join(", ")}]
                  </span>
                </div>
                <p className="text-xs text-muted-foreground italic">
                  &ldquo;{borrowed.character}&rdquo;
                </p>
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-purple-500/20">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs gap-1 text-purple-300 hover:text-purple-200"
                    onClick={() => {
                      const I = keyData.diatonicChords[0].notes;
                      circleAudio.playCadenceChords([I, borrowed.notes, I], 88);
                    }}
                  >
                    <Play className="size-3 fill-current" />
                    Preview (I → {borrowed.symbol} → I)
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ── Tab 4: Modes & Practical Tips ── */}
        <TabsContent value="modes" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Modes List */}
            <div className="space-y-2 rounded-xl border border-border/70 p-4 bg-card/40">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                7 Modes of {keyData.majorKey}
              </h4>
              <div className="space-y-2 pt-1">
                {keyData.modes.map((mode) => (
                  <div
                    key={mode.name}
                    className="flex items-start justify-between gap-2 p-2 rounded-lg bg-background/50 border border-border/40 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-foreground">
                        {mode.root} {mode.name}
                      </div>
                      <p className="text-[11px] text-muted-foreground">{mode.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => circleAudio.playNote(mode.root, 4)}
                      className="p-1 rounded text-primary hover:bg-primary/10 shrink-0"
                    >
                      <Volume2 className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Songwriting & Guitar Tips */}
            <div className="space-y-3 rounded-xl border border-border/70 p-4 bg-card/40">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <BookOpen className="size-3.5 text-primary" />
                Tips Praktis & Karakter Key
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-background/50 border border-border/40 space-y-1">
                  <span className="font-semibold text-foreground">Karakter & Mood Musik:</span>
                  <p className="text-muted-foreground">{keyData.practicalTips.mood}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-background/50 border border-border/40 space-y-1">
                  <span className="font-semibold text-foreground">Tips Penulisan Lagu (Songwriting):</span>
                  <p className="text-muted-foreground">{keyData.practicalTips.songwriting}</p>
                </div>

                <div className="p-2.5 rounded-lg bg-background/50 border border-border/40 space-y-1">
                  <span className="font-semibold text-foreground">Panduan Capo Gitar:</span>
                  <p className="text-muted-foreground">{keyData.practicalTips.guitarCapo}</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
