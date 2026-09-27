// ════════════════════════════════════════════════════════
// Fingering Routine – Main Route Page
// ════════════════════════════════════════════════════════
//
// Full module for fingering exercises (guitar & piano).
// Features: instrument tabs, exercise catalog, playback,
// live mic exercise mode.

import { useCallback, useMemo, useState } from "react";
import {
  ChevronLeft,
  Guitar,
  Keyboard,
  ListMusic,
  Mic,
  Play,
} from "lucide-react";
import type { Route } from "./+types";
import { Tabs, TabsList, TabsTrigger } from "~/templates/components/ui/tabs";
import { Button } from "~/templates/components/ui/button";
import { cn } from "~/templates/lib/utils";
import type { Exercise, ExerciseCategory, Instrument } from "./types";
import { CATEGORY_LABELS } from "./types";
import { getExercisesForInstrument } from "./lib/exercise-data";
import { ExerciseCard } from "./components/exercise-card";
import { ExercisePlayer } from "./components/exercise-player";
import { MicExercise } from "./components/mic-exercise";

// ── Meta ───────────────────────────────────────────────

export function meta(_: Route.MetaArgs) {
  return [
    { title: "NoteLogic | Fingering Routine" },
    {
      name: "description",
      content:
        "Latihan fingering gitar & piano interaktif dengan audio playback dan deteksi mic real-time.",
    },
  ];
}

// ── Page ───────────────────────────────────────────────

type ViewMode = "play" | "mic";

export default function FingeringRoutinePage() {
  const [instrument, setInstrument] = useState<Instrument>("guitar");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("play");
  const [categoryFilter, setCategoryFilter] = useState<ExerciseCategory | null>(
    null,
  );
  const [micMatchIndex, setMicMatchIndex] = useState<number>(-1);

  // ── Exercises ────────────────────────────────────────

  const exercises = useMemo(
    () => getExercisesForInstrument(instrument),
    [instrument],
  );

  const filteredExercises = useMemo(() => {
    if (!categoryFilter) return exercises;
    return exercises.filter((e) => e.category === categoryFilter);
  }, [exercises, categoryFilter]);

  const categories = useMemo(() => {
    const cats = new Set(exercises.map((e) => e.category));
    return Array.from(cats) as ExerciseCategory[];
  }, [exercises]);

  // Auto-select first exercise when instrument/filter changes
  const handleInstrumentChange = useCallback((inst: string) => {
    setInstrument(inst as Instrument);
    setCategoryFilter(null);
    setSelectedExercise(null);
    setMicMatchIndex(-1);
  }, []);

  const handleSelectExercise = useCallback((ex: Exercise) => {
    setSelectedExercise(ex);
    setMicMatchIndex(-1);
  }, []);

  // ── Render ───────────────────────────────────────────

  return (
    <div className="w-full px-4 py-8 md:px-8 md:py-10 lg:px-10">
      {/* ── Page Header ────────────────────────────── */}
      <div className="mb-8 flex flex-col gap-2">
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">
          Fingering Routine
        </h1>
        <p className="text-sm text-muted-foreground">
          Latihan fingering interaktif untuk gitar dan piano. Mainkan dengan
          audio atau gunakan mic untuk latihan real-time.
        </p>
      </div>

      {/* ── Instrument Tabs ────────────────────────── */}
      <Tabs
        value={instrument}
        onValueChange={handleInstrumentChange}
        className="mb-6"
      >
        <TabsList className="w-full max-w-xs">
          <TabsTrigger value="guitar" className="gap-1.5">
            <Guitar className="size-4" />
            Guitar
          </TabsTrigger>
          <TabsTrigger value="piano" className="gap-1.5">
            <Keyboard className="size-4" />
            Piano
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ── Category Filter ────────────────────────── */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Button
          variant={categoryFilter === null ? "default" : "outline"}
          size="sm"
          className="h-7 text-xs"
          onClick={() => setCategoryFilter(null)}
        >
          Semua
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={categoryFilter === cat ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() =>
              setCategoryFilter(categoryFilter === cat ? null : cat)
            }
          >
            {CATEGORY_LABELS[cat]}
          </Button>
        ))}
      </div>

      {/* ── Main Layout ────────────────────────────── */}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* ── Exercise List ───────────────────────── */}
        <div
          className={cn(
            "flex flex-col gap-2",
            selectedExercise && "hidden lg:flex",
          )}
        >
          <div className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ListMusic className="size-3.5" />
            <span>
              {filteredExercises.length} latihan
              {categoryFilter && ` · ${CATEGORY_LABELS[categoryFilter]}`}
            </span>
          </div>

          <div className="flex max-h-[60vh] flex-col gap-2 overflow-y-auto pr-1 scrollbar-thin lg:max-h-[70vh]">
            {filteredExercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                isActive={selectedExercise?.id === ex.id}
                onSelect={handleSelectExercise}
              />
            ))}
          </div>
        </div>

        {/* ── Exercise Detail / Player ────────────── */}
        <div
          className={cn(
            "flex flex-col gap-4",
            !selectedExercise && "hidden lg:flex",
          )}
        >
          {selectedExercise ? (
            <>
              {/* Back button (mobile only) */}
              <Button
                variant="ghost"
                size="sm"
                className="self-start gap-1 text-xs lg:hidden"
                onClick={() => {
                  setSelectedExercise(null);
                  setViewMode("play");
                }}
              >
                <ChevronLeft className="size-4" />
                Kembali ke Daftar
              </Button>

              {/* ── Mode Toggle ─────────────────── */}
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "play" ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setViewMode("play")}
                >
                  <Play className="size-3.5" />
                  Play Mode
                </Button>
                <Button
                  variant={viewMode === "mic" ? "default" : "outline"}
                  size="sm"
                  className="gap-1.5"
                  onClick={() => setViewMode("mic")}
                >
                  <Mic className="size-3.5" />
                  Mic Exercise
                </Button>
              </div>

              {/* ── Player / Mic ────────────────── */}
              {viewMode === "play" ? (
                <ExercisePlayer
                  exercise={selectedExercise}
                  micMatchIndex={micMatchIndex}
                />
              ) : (
                <div className="flex flex-col gap-4">
                  <MicExercise
                    exercise={selectedExercise}
                    onMatchIndex={setMicMatchIndex}
                  />
                </div>
              )}
            </>
          ) : (
            /* ── Empty state ─────────────────────── */
            <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/50 bg-card/30 py-16 text-center backdrop-blur-sm">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                {instrument === "guitar" ? (
                  <Guitar className="size-7 text-muted-foreground" />
                ) : (
                  <Keyboard className="size-7 text-muted-foreground" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Pilih Latihan</p>
                <p className="text-xs text-muted-foreground">
                  Pilih latihan dari daftar untuk memulai
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
