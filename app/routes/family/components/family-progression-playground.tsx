import { useState, useEffect, useRef } from "react";
import {
  Play,
  Square,
  Plus,
  Trash2,
  Music2,
  Sparkles,
  RotateCcw,
  Volume2,
} from "lucide-react";
import type { FamilyChordEntry } from "~/theory-music/family";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { Slider } from "~/templates/components/ui/slider";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { useLearnFretboardStore } from "~/shared/stores/learn-fretboard.store";

interface FamilyProgressionPlaygroundProps {
  entries: FamilyChordEntry[];
  root: string;
  scaleType: "major" | "minor";
}

interface ProgressionPreset {
  name: string;
  degrees: string[];
  genre: string;
  description: string;
}

const PRESETS_MAJOR: ProgressionPreset[] = [
  {
    name: "Pop 4-Chords",
    degrees: ["I", "V", "vi", "IV"],
    genre: "Pop / Rock",
    description: "Progresi paling ikonik di musik populer (Let It Be, Perfect, Stand By Me).",
  },
  {
    name: "Jazz ii–V–I",
    degrees: ["ii", "V", "I"],
    genre: "Jazz / Neo-Soul",
    description: "Fondasi harmoni jazz; gerak predominant ii ke dominant V lalu resolusi sempurna ke I.",
  },
  {
    name: "Royal Road (J-Pop)",
    degrees: ["IV", "V", "iii", "vi"],
    genre: "J-Pop / Anime",
    description: "Sangat emosional, gerak dari Subdominant IV naik ke V lalu tertahan di iii dan vi.",
  },
  {
    name: "Deceptive Resolution",
    degrees: ["I", "IV", "V", "vi"],
    genre: "Ballad / Pop",
    description: "Tegang pada V lalu mengejutkan telinga dengan resolusi ke vi daripada I.",
  },
  {
    name: "Plagal Gospel",
    degrees: ["I", "IV", "I", "V"],
    genre: "Gospel / Worship",
    description: "Karakter 'Amen' dari IV ke I memberi kesan hangat dan religius.",
  },
];

const PRESETS_MINOR: ProgressionPreset[] = [
  {
    name: "Epic Minor (1-6-3-7)",
    degrees: ["i", "VI", "III", "VII"],
    genre: "Cinematic / Pop",
    description: "Progresi minor paling populer di film dan lagu pop modern.",
  },
  {
    name: "Andalusian Cadence",
    degrees: ["i", "VII", "VI", "v"],
    genre: "Flamenco / Rock",
    description: "Gerak bass bertahap turun (4-step descending line) penuh gairah.",
  },
  {
    name: "Minor ii°–V–i",
    degrees: ["ii°", "v", "i"],
    genre: "Jazz / Latin",
    description: "Cadence minor klasik dengan ketegangan diminished ii° menuju v.",
  },
  {
    name: "Sad Ballad",
    degrees: ["i", "iv", "v", "i"],
    genre: "Acoustic / Blues",
    description: "Gerak minor sederhana i-iv-v dengan resolusi melankolis.",
  },
];

export function FamilyProgressionPlayground({
  entries,
  root,
  scaleType,
}: FamilyProgressionPlaygroundProps) {
  const selectFamily = useLearnFretboardStore((s) => s.selectFamily);

  // Active progression scratchpad (default to first preset)
  const presets = scaleType === "major" ? PRESETS_MAJOR : PRESETS_MINOR;
  const [progressionDegrees, setProgressionDegrees] = useState<string[]>(
    presets[0]?.degrees ?? entries.slice(0, 4).map((e) => e.degree),
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);
  const [bpm, setBpm] = useState<number>(90);
  const [strumType, setStrumType] = useState<"strum" | "block" | "arpeggio">("strum");

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Map degrees to actual entries
  const currentProgressionEntries = progressionDegrees
    .map((deg) => entries.find((e) => e.degree === deg))
    .filter((e): e is FamilyChordEntry => Boolean(e));

  const addDegree = (deg: string) => {
    if (progressionDegrees.length >= 8) return;
    setProgressionDegrees((prev) => [...prev, deg]);
  };

  const removeStep = (index: number) => {
    setProgressionDegrees((prev) => prev.filter((_, i) => i !== index));
  };

  const clearProgression = () => {
    setProgressionDegrees([]);
    stopPlayback();
  };

  const applyPreset = (preset: ProgressionPreset) => {
    setProgressionDegrees(preset.degrees);
    stopPlayback();
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setActiveStepIndex(-1);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startPlayback = () => {
    if (currentProgressionEntries.length === 0) return;
    setIsPlaying(true);
    let step = 0;

    const playStep = () => {
      const entry = currentProgressionEntries[step];
      if (entry) {
        setActiveStepIndex(step);
        selectFamily(entry);
        const notes = entry.chord.composed.map((t) => t.note);
        circleAudio.playChord(notes, {
          type: strumType,
          duration: (60 / bpm) * 2 * 0.9,
          speed: strumType === "strum" ? 0.04 : 0.02,
        });
      }
      step = (step + 1) % currentProgressionEntries.length;
    };

    playStep();
    const intervalMs = (60 / bpm) * 2 * 1000;
    timerRef.current = setInterval(playStep, intervalMs);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="rounded-xl border border-border/80 bg-card/60 p-5 shadow-xs backdrop-blur space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/50 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Music2 className="size-4 text-emerald-500" />
            <h2 className="text-lg font-semibold tracking-tight">
              Mengulik Progresi Chord ({root} {scaleType === "major" ? "Mayor" : "Minor"})
            </h2>
          </div>
          <p className="text-muted-foreground text-xs mt-0.5">
            Rangkai chord family dan dengarkan bagaimana pergantian fungsi harmonik menciptakan alur musik.
          </p>
        </div>

        {/* Play / Stop Controls */}
        <div className="flex items-center gap-2">
          {isPlaying ? (
            <Button
              size="sm"
              variant="destructive"
              className="gap-2 shrink-0"
              onClick={stopPlayback}
            >
              <Square className="size-3.5 fill-current" />
              Stop Loop
            </Button>
          ) : (
            <Button
              size="sm"
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
              onClick={startPlayback}
              disabled={currentProgressionEntries.length === 0}
            >
              <Play className="size-3.5 fill-current" />
              Putar Loop
            </Button>
          )}

          <Button
            size="sm"
            variant="ghost"
            onClick={clearProgression}
            disabled={progressionDegrees.length === 0}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <Sparkles className="size-3 text-amber-500" />
          Preset Progresi Populer:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button
              key={`preset-${preset.name}`}
              type="button"
              onClick={() => applyPreset(preset)}
              className="rounded-lg border border-border/60 bg-muted/30 px-2.5 py-1 text-xs font-medium hover:bg-muted hover:border-primary/50 transition-colors"
            >
              <span className="font-semibold">{preset.name}</span>
              <span className="text-[10px] text-muted-foreground ml-1 font-mono">
                ({preset.degrees.join("–")})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Scratchpad Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Scratchpad Progresi ({currentProgressionEntries.length}/8 Chord)
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              BPM: <strong className="text-foreground font-mono">{bpm}</strong>
            </span>
            <div className="w-24">
              <Slider
                value={[bpm]}
                min={60}
                max={160}
                step={2}
                onValueChange={(val) => setBpm(val[0] ?? 90)}
              />
            </div>
          </div>
        </div>

        {/* Chord Blocks Grid */}
        <div className="min-h-[90px] rounded-xl border border-dashed border-border/80 bg-background/50 p-3 flex flex-wrap items-center gap-3">
          {currentProgressionEntries.length === 0 ? (
            <p className="text-muted-foreground text-xs italic mx-auto py-3">
              Klik chord di bawah ini untuk menambahkan ke progresi...
            </p>
          ) : (
            currentProgressionEntries.map((entry, idx) => {
              const isCurrentStep = isPlaying && activeStepIndex === idx;
              const familyColor =
                entry.family === "Tonic"
                  ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300"
                  : entry.family === "Subdominant"
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300";

              return (
                <div
                  key={`step-${idx}-${entry.degree}`}
                  className={`group relative flex flex-col items-center justify-center rounded-lg border px-4 py-2.5 transition-all min-w-[80px] ${
                    isCurrentStep
                      ? "ring-2 ring-emerald-500 scale-105 shadow-md bg-emerald-500/20 font-bold"
                      : `${familyColor} hover:shadow-xs`
                  }`}
                >
                  <span className="font-mono text-sm font-bold">{entry.degree}</span>
                  <span className="text-xs">{entry.chord.name}</span>
                  <span className="text-[9px] uppercase opacity-75 font-mono">{entry.family}</span>

                  <button
                    type="button"
                    onClick={() => removeStep(idx)}
                    className="absolute -top-1.5 -right-1.5 hidden group-hover:flex size-4 items-center justify-center rounded-full bg-destructive text-white text-[10px]"
                    title="Hapus"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Available Diatonic Chords Picker */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground">
          Tambah Chord Diatonic ({root} {scaleType}):
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {entries.map((entry) => (
            <button
              key={`picker-${entry.degree}`}
              type="button"
              onClick={() => {
                addDegree(entry.degree);
                selectFamily(entry);
                circleAudio.playChord(entry.chord.composed.map((t) => t.note), { type: "strum" });
              }}
              className="flex flex-col items-center justify-center rounded-lg border border-border/70 bg-background hover:border-primary hover:bg-muted/80 p-2 text-center transition-all shadow-2xs"
            >
              <span className="font-mono text-xs font-bold text-primary">{entry.degree}</span>
              <span className="text-xs font-semibold">{entry.chord.name}</span>
              <span className="text-[9px] text-muted-foreground mt-0.5">{entry.family}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
