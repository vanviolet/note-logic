// ════════════════════════════════════════════════════════
// Circle of Fifths — Interactive Progression Builder & Sequencer
// ════════════════════════════════════════════════════════

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Square,
  Repeat,
  Sparkles,
  Trash2,
  Copy,
  Check,
  ChevronRight,
  Sliders,
  Volume2,
  Music2,
  Plus,
} from "lucide-react";
import {
  CIRCLE_KEYS,
  PROGRESSION_PRESETS,
  type ProgressionPreset,
  type CircleKeyData,
} from "~/theory-music/circle-of-fifths/circle-data";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { cn } from "~/templates/lib/utils";

interface ProgressionBuilderProps {
  currentKey: CircleKeyData;
  onKeyChange: (index: number) => void;
  onActiveStepChange?: (stepIndex: number | null) => void;
  onProgressionKeysChange?: (keyIndices: number[]) => void;
  className?: string;
}

export interface ProgressionChordItem {
  id: string;
  name: string;
  degreeLabel: string;
  notes: string[];
  keyIndex: number;
}

export function CircleProgressionBuilder({
  currentKey,
  onKeyChange,
  onActiveStepChange,
  onProgressionKeysChange,
  className,
}: ProgressionBuilderProps) {
  const [progression, setProgression] = useState<ProgressionChordItem[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>("pop-4-chord");
  const [bpm, setBpm] = useState<number>(110);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStepRef = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  // Convert preset degree string to actual chord item in currentKey
  const resolveDegreeToChord = (deg: string, key: CircleKeyData): ProgressionChordItem => {
    let name = "";
    let notes: string[] = [];
    let keyIdx = key.index;
    let label = deg;

    if (deg === "I") {
      name = key.diatonicChords[0].name;
      notes = key.diatonicChords[0].notes;
      keyIdx = key.index;
    } else if (deg === "ii") {
      name = key.diatonicChords[1].name;
      notes = key.diatonicChords[1].notes;
      keyIdx = (key.index + 11) % 12;
    } else if (deg === "iii") {
      name = key.diatonicChords[2].name;
      notes = key.diatonicChords[2].notes;
      keyIdx = (key.index + 1) % 12;
    } else if (deg === "IV") {
      name = key.diatonicChords[3].name;
      notes = key.diatonicChords[3].notes;
      keyIdx = (key.index + 11) % 12;
    } else if (deg === "V") {
      name = key.diatonicChords[4].name;
      notes = key.diatonicChords[4].notes;
      keyIdx = (key.index + 1) % 12;
    } else if (deg === "vi") {
      name = key.diatonicChords[5].name;
      notes = key.diatonicChords[5].notes;
      keyIdx = key.index;
    } else if (deg === "vii°") {
      name = key.diatonicChords[6].name;
      notes = key.diatonicChords[6].notes;
      keyIdx = key.index;
    } else if (deg === "iv_BORROWED") {
      const borrowed = key.borrowedChords.find((b) => b.symbol === "iv");
      name = borrowed ? borrowed.chordName : `${key.scaleNotes[3]}m`;
      notes = borrowed ? borrowed.notes : [];
      label = "iv (borrowed)";
      keyIdx = (key.index + 11) % 12;
    } else if (deg === "III_DOM") {
      const sec = key.secondaryDominants.find((s) => s.symbol === "V7/vi");
      name = sec ? sec.chordName : "E7";
      notes = sec ? sec.notes : [];
      label = "V7/vi";
      keyIdx = (key.index + 4) % 12;
    } else {
      // Fallback
      name = key.diatonicChords[0].name;
      notes = key.diatonicChords[0].notes;
    }

    return {
      id: `${label}-${name}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      degreeLabel: label,
      notes,
      keyIndex: keyIdx,
    };
  };

  // Load preset whenever preset or currentKey changes
  const loadPreset = (presetId: string, key: CircleKeyData) => {
    const preset = PROGRESSION_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const items = preset.degrees.map((deg) => resolveDegreeToChord(deg, key));
    setProgression(items);
    setBpm(preset.suggestedBpm);
  };

  // Initial load or key change update
  useEffect(() => {
    loadPreset(selectedPresetId, currentKey);
  }, [currentKey, selectedPresetId]);

  // Sync progression key indices to parent wheel
  useEffect(() => {
    const indices = progression.map((p) => p.keyIndex);
    onProgressionKeysChange?.(indices);
  }, [progression, onProgressionKeysChange]);

  // Playback Sequencer Engine
  const stopPlayback = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
    setActiveStep(null);
    onActiveStepChange?.(null);
  };

  const startPlayback = () => {
    if (progression.length === 0) return;
    stopPlayback();

    isPlayingRef.current = true;
    setIsPlaying(true);
    currentStepRef.current = 0;

    const playStep = () => {
      if (!isPlayingRef.current || progression.length === 0) return;

      const step = currentStepRef.current;
      setActiveStep(step);
      onActiveStepChange?.(step);

      const item = progression[step];
      if (item) {
        circleAudio.playChord(item.notes, {
          type: "strum",
          duration: (60 / bpm) * 2 * 0.95,
          speed: 0.04,
        });
      }

      currentStepRef.current += 1;

      if (currentStepRef.current >= progression.length) {
        if (isLooping) {
          currentStepRef.current = 0;
        } else {
          setTimeout(() => stopPlayback(), (60 / bpm) * 2 * 1000);
        }
      }
    };

    // Play immediately first step
    playStep();

    const intervalMs = (60 / bpm) * 2 * 1000;
    timerRef.current = setInterval(playStep, intervalMs);
  };

  // Toggle playback
  const handleTogglePlay = () => {
    if (isPlaying) {
      stopPlayback();
    } else {
      startPlayback();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Transpose progression by N semitones (shifts current key on circle)
  const transposeBy = (steps: number) => {
    const newIdx = (currentKey.index + steps + 12) % 12;
    onKeyChange(newIdx);
  };

  // Copy progression
  const handleCopy = () => {
    const text = progression.map((p) => p.name).join(" - ");
    navigator.clipboard.writeText(`${text} (Key: ${currentKey.majorKey})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Add a diatonic chord to progression
  const addDiatonicChord = (degreeIndex: number) => {
    const chord = currentKey.diatonicChords[degreeIndex];
    if (!chord) return;
    const newItem: ProgressionChordItem = {
      id: `${chord.degree}-${chord.name}-${Math.random().toString(36).substring(2, 7)}`,
      name: chord.name,
      degreeLabel: chord.degree,
      notes: chord.notes,
      keyIndex: currentKey.index,
    };
    setProgression((prev) => [...prev, newItem]);
  };

  // Remove single chord
  const removeChord = (index: number) => {
    setProgression((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={cn("space-y-4 p-5 rounded-xl border border-border/80 bg-card/60 backdrop-blur", className)}>
      {/* Header & Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Music2 className="size-4 text-primary" />
            <h3 className="font-bold text-base text-foreground">
              Progression Builder & Sequencer
            </h3>
            <Badge variant="secondary" className="font-mono text-xs">
              Key: {currentKey.majorKey}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Eksplorasi progresi chord legendaris dengan audio playback dan cursor realtime di lingkaran kuint.
          </p>
        </div>

        {/* Preset Selector Dropdown */}
        <div className="flex items-center gap-2">
          <select
            value={selectedPresetId}
            onChange={(e) => {
              setSelectedPresetId(e.target.value);
              loadPreset(e.target.value, currentKey);
            }}
            className="h-8 rounded-lg border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-none"
          >
            {PROGRESSION_PRESETS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.genre})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sequencer Track Visualizer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Track Chords ({progression.length} bar):</span>
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[11px] gap-1 text-muted-foreground"
              onClick={() => transposeBy(-1)}
              title="Transpose -1 Kuint (Counter-Clockwise)"
            >
              -1 Kuint
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[11px] gap-1 text-muted-foreground"
              onClick={() => transposeBy(1)}
              title="Transpose +1 Kuint (Clockwise)"
            >
              +1 Kuint
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[11px] gap-1"
              onClick={handleCopy}
            >
              {copied ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
              {copied ? "Tersalin" : "Salin Chord"}
            </Button>
          </div>
        </div>

        {/* Chord Step Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {progression.map((item, idx) => {
            const isActive = activeStep === idx;
            return (
              <div
                key={item.id}
                className={cn(
                  "relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-150 group",
                  isActive
                    ? "bg-primary/20 border-primary shadow-lg shadow-primary/20 scale-[1.03]"
                    : "bg-background/80 border-border hover:border-primary/40",
                )}
              >
                <span className="text-[10px] text-muted-foreground font-mono">
                  Bar {idx + 1} · {item.degreeLabel}
                </span>
                <span className="text-lg font-bold text-foreground tracking-tight my-0.5">
                  {item.name}
                </span>
                <span className="text-[9px] text-muted-foreground/70 font-mono">
                  [{item.notes.join(", ")}]
                </span>

                {/* Remove button on hover */}
                <button
                  type="button"
                  onClick={() => removeChord(idx)}
                  className="absolute -top-1.5 -right-1.5 size-4 rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-[10px]"
                  title="Hapus chord"
                >
                  ×
                </button>
              </div>
            );
          })}

          {/* Quick Add Button */}
          <button
            type="button"
            onClick={() => addDiatonicChord(0)}
            className="flex items-center justify-center p-2 rounded-xl border border-dashed border-border/70 hover:border-primary/50 text-muted-foreground hover:text-foreground transition-colors min-h-[72px]"
          >
            <div className="flex flex-col items-center gap-1 text-[11px]">
              <Plus className="size-4" />
              <span>+ Chord</span>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Add Diatonic Selector Bar */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
        <span className="text-muted-foreground text-[11px] mr-1">Klik untuk tambah:</span>
        {currentKey.diatonicChords.map((chord, idx) => (
          <button
            key={chord.degree}
            type="button"
            onClick={() => addDiatonicChord(idx)}
            className="px-2 py-1 rounded bg-muted/40 hover:bg-primary/20 hover:text-primary border border-border/50 text-xs font-medium transition-colors"
          >
            {chord.degree}: <strong className="ml-0.5">{chord.name}</strong>
          </button>
        ))}
      </div>

      {/* Playback Controls & Tempo Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={handleTogglePlay}
            className={cn(
              "h-9 px-4 gap-2 font-semibold text-xs transition-all",
              isPlaying
                ? "bg-amber-500 hover:bg-amber-600 text-white"
                : "bg-primary hover:bg-primary/90 text-primary-foreground",
            )}
          >
            {isPlaying ? (
              <>
                <Square className="size-3.5 fill-current" />
                Stop
              </>
            ) : (
              <>
                <Play className="size-3.5 fill-current" />
                Play Progression
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsLooping((v) => !v)}
            className={cn(
              "h-9 px-3 gap-1.5 text-xs",
              isLooping ? "bg-primary/10 text-primary border-primary/40" : "text-muted-foreground",
            )}
          >
            <Repeat className="size-3.5" />
            Loop {isLooping ? "ON" : "OFF"}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setProgression([])}
            className="h-9 px-2.5 text-xs text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        {/* BPM Tempo Slider */}
        <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
          <Sliders className="size-3.5" />
          <span>Tempo:</span>
          <input
            type="range"
            min={60}
            max={180}
            step={2}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-24 h-1.5 accent-primary bg-muted rounded cursor-pointer"
          />
          <span className="font-mono font-bold text-foreground w-12">{bpm} BPM</span>
        </div>
      </div>
    </div>
  );
}
