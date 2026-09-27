// ════════════════════════════════════════════════════════
// ChordFretboardBar – Bottom bar with Guitar / Piano / Ukulele
// ════════════════════════════════════════════════════════
//
// Fixed bottom bar with tabs to switch between interactive
// instrument views.  Desktop: open by default.  Mobile: closed.
// ════════════════════════════════════════════════════════

import { Suspense, memo, useCallback, useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Music } from "lucide-react";
import { lazyNamed } from "~/shared/lib/lazy";
import { useGuitarAudio } from "~/templates/hooks";
import { cn } from "~/templates/lib/utils";
import type { FretboardNote } from "~/templates/components/custom/fretboard";
import type { UkuleleFretboardNote } from "~/templates/components/custom/ukulele-fretboard";
import type { PianoNote } from "~/templates/components/custom/piano";
import { normalizeNoteName } from "~/shared/lib/music-utils";
import { Skeleton } from "~/templates/components/ui/skeleton";

// ── Lazy-loaded instrument components ──────────────────

const Fretboard = lazyNamed(
  () => import("~/templates/components/custom/fretboard"),
  "Fretboard",
);

const UkuleleFretboard = lazyNamed(
  () => import("~/templates/components/custom/ukulele-fretboard"),
  "UkuleleFretboard",
);

const Piano = lazyNamed(
  () => import("~/templates/components/custom/piano"),
  "Piano",
);

// ── Skeleton ───────────────────────────────────────────

function InstrumentSkeleton() {
  return (
    <div className="space-y-2 p-4">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-[180px] w-full rounded-lg" />
    </div>
  );
}

// ── Tab types ──────────────────────────────────────────

type InstrumentTab = "guitar" | "piano" | "ukulele";

const TAB_LABELS: Record<InstrumentTab, string> = {
  guitar: "Guitar",
  piano: "Piano",
  ukulele: "Ukulele",
};

// ── Props ──────────────────────────────────────────────

interface ChordFretboardBarProps {
  /** Pitch classes to highlight on all instruments */
  highlightedPitchClasses?: number[];
  /** Label shown in the collapsed bar */
  label?: string;
}

export const ChordFretboardBar = memo(function ChordFretboardBar({
  highlightedPitchClasses = [],
  label = "Interactive Instruments",
}: ChordFretboardBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<InstrumentTab>("guitar");

  const [activeFret, setActiveFret] = useState<{
    stringIndex: number;
    fret: number;
  } | null>(null);
  const [activeUkeFret, setActiveUkeFret] = useState<{
    stringIndex: number;
    fret: number;
  } | null>(null);
  const [activePianoNote, setActivePianoNote] = useState<{
    midi: number;
  } | null>(null);

  const { ensureReady, isReady, isLoading, playNote } = useGuitarAudio();

  // Desktop: open by default. Mobile: closed.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(min-width: 768px)");
    setIsOpen(mq.matches);
    if (mq.matches) setHasBeenOpened(true);
    const handler = (e: MediaQueryListEvent) => {
      setIsOpen(e.matches);
      if (e.matches) setHasBeenOpened(true);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Track first open for lazy mount
  useEffect(() => {
    if (isOpen && !hasBeenOpened) setHasBeenOpened(true);
  }, [isOpen, hasBeenOpened]);

  const handleFretClick = useCallback(
    (fretNote: FretboardNote) => {
      setActiveFret({
        stringIndex: fretNote.stringIndex,
        fret: fretNote.fret,
      });
      if (!isReady && !isLoading) ensureReady();
      playNote(`${normalizeNoteName(fretNote.note)}${fretNote.octave}`, {
        duration: 2,
        gain: 0.95,
      });
    },
    [ensureReady, isReady, isLoading, playNote],
  );

  const handleUkeFretClick = useCallback(
    (fretNote: UkuleleFretboardNote) => {
      setActiveUkeFret({
        stringIndex: fretNote.stringIndex,
        fret: fretNote.fret,
      });
      if (!isReady && !isLoading) ensureReady();
      playNote(`${normalizeNoteName(fretNote.note)}${fretNote.octave}`, {
        duration: 2,
        gain: 0.95,
      });
    },
    [ensureReady, isReady, isLoading, playNote],
  );

  const handlePianoKeyClick = useCallback(
    (pianoNote: PianoNote) => {
      setActivePianoNote({ midi: pianoNote.midi });
      if (!isReady && !isLoading) ensureReady();
      playNote(`${normalizeNoteName(pianoNote.note)}${pianoNote.octave}`, {
        duration: 2,
        gain: 0.95,
      });
    },
    [ensureReady, isReady, isLoading, playNote],
  );

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out",
      )}
    >
      {/* ── Toggle Handle ─────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <span className="flex items-center gap-2">
          <Music className="h-4 w-4" />
          {label}
          {!isReady && (
            <span className="text-[10px] opacity-60">(click to play)</span>
          )}
        </span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronUp className="h-4 w-4" />
        )}
      </button>

      {/* ── Instrument Content (animated panel) ──── */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          {hasBeenOpened && (
            <div className="px-3 pb-3 space-y-2">
              {/* ── Instrument Tabs ─────────────────── */}
              <div className="flex items-center gap-1 border-b border-border pb-1">
                {(["guitar", "piano", "ukulele"] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors",
                      activeTab === tab
                        ? "bg-primary/10 text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {TAB_LABELS[tab]}
                  </button>
                ))}
              </div>

              {/* ── Guitar ──────────────────────────── */}
              {activeTab === "guitar" && (
                <div className="overflow-x-auto">
                  <Suspense fallback={<InstrumentSkeleton />}>
                    <Fretboard
                      highlightedPitchClasses={highlightedPitchClasses}
                      activeNote={activeFret}
                      onFretClick={handleFretClick}
                      enableLiveMic
                    />
                  </Suspense>
                </div>
              )}

              {/* ── Piano ──────────────────────────── */}
              {activeTab === "piano" && (
                <div className="overflow-x-auto">
                  <Suspense fallback={<InstrumentSkeleton />}>
                    <Piano
                      startOctave={2}
                      octaveCount={4}
                      highlightedPitchClasses={highlightedPitchClasses}
                      activeNote={activePianoNote}
                      onKeyClick={handlePianoKeyClick}
                      enableLiveMic
                    />
                  </Suspense>
                </div>
              )}

              {/* ── Ukulele ────────────────────────── */}
              {activeTab === "ukulele" && (
                <div className="overflow-x-auto">
                  <Suspense fallback={<InstrumentSkeleton />}>
                    <UkuleleFretboard
                      highlightedPitchClasses={highlightedPitchClasses}
                      activeNote={activeUkeFret}
                      onFretClick={handleUkeFretClick}
                      enableLiveMic
                    />
                  </Suspense>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
