import { useState } from "react";
import { Search, Sparkles, Check, HelpCircle, ArrowRight, RotateCcw } from "lucide-react";
import { generateFamilyChords, type ScaleType } from "~/theory-music/family";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { CHROMATIC_12_ROOTS } from "~/shared/constants/music";
import { rootToPc } from "~/theory-music/core";

interface KeyMatchResult {
  root: string;
  scaleType: ScaleType;
  matchCount: number;
  totalSelected: number;
  percentage: number;
  mappedChords: Array<{
    chordName: string;
    degree: string | null;
    family: string | null;
    isDiatonic: boolean;
  }>;
}

const COMMON_CHORDS_LIST = [
  "C", "Cm", "C#m", "Db", "D", "Dm", "Eb", "E", "Em", "F", "Fm", "F#m",
  "G", "Gm", "Ab", "A", "Am", "Bb", "B", "Bm", "C7", "G7", "D7", "A7", "E7", "Fmaj7"
];

export function FamilySongKeyFinder() {
  const [selectedChords, setSelectedChords] = useState<string[]>(["C", "Am", "F", "G"]);
  const [customInput, setCustomInput] = useState<string>("");

  const toggleChord = (chord: string) => {
    setSelectedChords((prev) =>
      prev.includes(chord) ? prev.filter((c) => c !== chord) : [...prev, chord]
    );
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selectedChords.includes(trimmed)) {
      setSelectedChords((prev) => [...prev, trimmed]);
      setCustomInput("");
    }
  };

  const clearSelected = () => {
    setSelectedChords([]);
  };

  // Analyze key matches across 12 chromatic roots for Major and Minor
  const analyzeKeys = (): KeyMatchResult[] => {
    if (selectedChords.length === 0) return [];

    const candidateKeys: KeyMatchResult[] = [];

    CHROMATIC_12_ROOTS.forEach((rootObj) => {
      const rootStr = rootObj.value;

      (["major", "minor"] as ScaleType[]).forEach((sScale) => {
        const familyEntries = generateFamilyChords(rootStr, sScale, { spell: "auto" });
        let matchCount = 0;

        const mapped = selectedChords.map((userChord) => {
          // Normalize matching: compare root and triad symbol
          const found = familyEntries.find(
            (fe) =>
              fe.chord.name.toLowerCase() === userChord.toLowerCase() ||
              fe.chord.name.replace("m", "min").toLowerCase() === userChord.toLowerCase()
          );

          if (found) {
            matchCount += 1;
            return {
              chordName: userChord,
              degree: found.degree,
              family: found.family,
              isDiatonic: true,
            };
          }

          return {
            chordName: userChord,
            degree: null,
            family: null,
            isDiatonic: false,
          };
        });

        const percentage = Math.round((matchCount / selectedChords.length) * 100);

        candidateKeys.push({
          root: rootStr,
          scaleType: sScale,
          matchCount,
          totalSelected: selectedChords.length,
          percentage,
          mappedChords: mapped,
        });
      });
    });

    // Sort by match percentage descending
    return candidateKeys
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 4); // Top 4 candidate keys
  };

  const topMatches = analyzeKeys();

  return (
    <div className="rounded-xl border border-border/80 bg-card/60 p-5 shadow-xs backdrop-blur space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Search className="size-4 text-cyan-500" />
            <h2 className="text-lg font-semibold tracking-tight">
              Pengulik Lagu (Song Key & Function Finder)
            </h2>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            Punya chord lagu yang sedang kamu kulik? Pilih chord-chordnya di bawah ini untuk menebak nada dasar dan analisis fungsi harmoninya.
          </p>
        </div>

        {selectedChords.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={clearSelected}
            className="text-xs gap-1.5 shrink-0"
          >
            <RotateCcw className="size-3" />
            Reset Selection
          </Button>
        )}
      </div>

      {/* Selected Chords Chip Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Chord yang Ditemukan di Lagu ({selectedChords.length}):
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 min-h-[44px] rounded-lg border border-border/60 bg-muted/20 p-2">
          {selectedChords.length === 0 ? (
            <span className="text-muted-foreground text-xs italic px-2">
              Pilih chord di bawah ini untuk memulai pengulikan...
            </span>
          ) : (
            selectedChords.map((chord) => (
              <span
                key={`sel-${chord}`}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 border border-primary/30 px-2.5 py-1 text-xs font-bold text-primary"
              >
                {chord}
                <button
                  type="button"
                  onClick={() => toggleChord(chord)}
                  className="hover:text-destructive text-muted-foreground text-xs"
                >
                  ×
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Quick Chord Selector Grid */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Pilih Chord Populer:</p>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_CHORDS_LIST.map((chord) => {
            const isSelected = selectedChords.includes(chord);
            return (
              <button
                key={`common-${chord}`}
                type="button"
                onClick={() => toggleChord(chord)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-bold shadow-xs"
                    : "bg-background border border-border/70 hover:bg-muted text-foreground/80"
                }`}
              >
                {chord}
              </button>
            );
          })}
        </div>
      </div>

      {/* Key Matching Results */}
      {selectedChords.length > 0 && (
        <div className="space-y-3 pt-2">
          <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-amber-500" />
            Hasil Analisis Nada Dasar (Key Matches):
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {topMatches.map((match, idx) => (
              <div
                key={`match-${match.root}-${match.scaleType}`}
                className={`rounded-lg border p-3.5 space-y-2.5 transition-all ${
                  idx === 0
                    ? "border-emerald-500/50 bg-emerald-500/5 shadow-xs"
                    : "border-border/60 bg-background/60"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-foreground">
                      Key {match.root} {match.scaleType === "major" ? "Mayor" : "Minor"}
                    </span>
                    {idx === 0 && (
                      <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px]">
                        Peluang Tertinggi
                      </Badge>
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    {match.percentage}% Fit ({match.matchCount}/{match.totalSelected})
                  </span>
                </div>

                {/* Diatonic Degree Mapping */}
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {match.mappedChords.map((m) => (
                    <div
                      key={`m-${match.root}-${m.chordName}`}
                      className="flex items-center justify-between rounded bg-muted/40 px-2 py-1"
                    >
                      <span className="font-semibold">{m.chordName}</span>
                      {m.isDiatonic ? (
                        <span className="font-mono text-primary text-[11px]">
                          {m.degree} ({m.family})
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-[10px] italic">
                          Non-diatonic
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
