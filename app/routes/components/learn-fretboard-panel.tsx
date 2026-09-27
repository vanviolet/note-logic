import * as React from "react";
import {
  Suspense,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  ChevronUp,
  Guitar,
  GripHorizontal,
  Piano,
  Music,
} from "lucide-react";
import { useLearnFretboardStore } from "~/shared/stores/learn-fretboard.store";
import { useLearnSidebarStore } from "~/shared/stores/learn-sidebar.store";
import { lazyNamed } from "~/shared/lib/lazy";
import { useGuitarAudio, type LivePitchFrame } from "~/templates/hooks";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import { Input } from "~/templates/components/ui/input";
import { Skeleton } from "~/templates/components/ui/skeleton";
import { cn } from "~/templates/lib/utils";
import type { FretboardNote } from "~/templates/components/custom/fretboard";
import type { PianoNote } from "~/templates/components/custom/piano";
import type { UkuleleFretboardNote } from "~/templates/components/custom/ukulele-fretboard";

const Fretboard = lazyNamed(
  () => import("~/templates/components/custom/fretboard"),
  "Fretboard",
);

const PianoKeyboard = lazyNamed(
  () => import("~/templates/components/custom/piano"),
  "Piano",
);

const UkuleleBoard = lazyNamed(
  () => import("~/templates/components/custom/ukulele-fretboard"),
  "UkuleleFretboard",
);

const COLLAPSED_HEIGHT = 48;
const MAX_HEIGHT_RATIO = 0.92;
/** Snap to closed when drag releases below this height */
const SNAP_CLOSE_THRESHOLD = COLLAPSED_HEIGHT + 24;

/**
 * Matches the actual fretboard grid so the panel doesn't shift layout
 * when the lazy chunk finishes loading.
 */
function FretboardSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-card/70 p-3">
      {/* Live mic button row */}
      <div className="mb-3 flex gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-16 opacity-50" />
      </div>
      {/* Fretboard grid: 124px label col + 13 fret cols (frets 0–12) */}
      <div
        className="gap-1"
        style={{
          display: "grid",
          minWidth: `${124 + 13 * 44}px`,
          gridTemplateColumns: `124px repeat(13, minmax(44px, 1fr))`,
        }}
      >
        {/* Header row */}
        <Skeleton className="h-8" />
        {Array.from({ length: 13 }, (_, i) => (
          <Skeleton key={i} className="h-8 opacity-50" />
        ))}
        {/* 6 string rows */}
        {Array.from({ length: 6 }, (_, si) => (
          <React.Fragment key={si}>
            <Skeleton className="h-11" />
            {Array.from({ length: 13 }, (_, fi) => (
              <Skeleton
                key={fi}
                className="h-11"
                style={{ opacity: 0.35 + si * 0.08 }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton for the Piano keyboard while lazy loading.
 */
function PianoSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-card/70 p-3">
      <div className="mb-3 flex gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-16 opacity-50" />
      </div>
      <div className="relative" style={{ height: 180, minWidth: 660 }}>
        {/* White keys */}
        <div className="flex h-full gap-[1.5px]">
          {Array.from({ length: 21 }, (_, i) => (
            <Skeleton
              key={i}
              className="flex-1 rounded-b-md"
              style={{ opacity: 0.35 + (i % 7) * 0.06 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton for the Ukulele fretboard while lazy loading.
 */
function UkuleleSkeleton() {
  return (
    <div className="overflow-x-auto rounded-xl border border-border/70 bg-card/70 p-3">
      <div className="mb-3 flex gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-16 opacity-50" />
      </div>
      <div
        className="gap-1"
        style={{
          display: "grid",
          minWidth: `${100 + 16 * 44}px`,
          gridTemplateColumns: `100px repeat(16, minmax(44px, 1fr))`,
        }}
      >
        <Skeleton className="h-8" />
        {Array.from({ length: 16 }, (_, i) => (
          <Skeleton key={i} className="h-8 opacity-50" />
        ))}
        {Array.from({ length: 4 }, (_, si) => (
          <React.Fragment key={si}>
            <Skeleton className="h-11" />
            {Array.from({ length: 16 }, (_, fi) => (
              <Skeleton
                key={fi}
                className="h-11"
                style={{ opacity: 0.35 + si * 0.1 }}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * LearnFretboardPanel — a shared, resizable bottom panel used across all learn
 * modules (chord / family / interval).
 *
 * - Always rendered in `learn-layout.tsx`.
 * - Reading state from `useLearnFretboardStore`; cards call `selectChord`,
 *   `selectFamily`, or `selectInterval` to push their data into the panel.
 * - Single `useGuitarAudio` instance persists across route changes.
 * - Drag the top bar to resize when open; click the chevron button to toggle.
 */
export function LearnFretboardPanel() {
  // ── Store selectors ────────────────────────────────────────────────────────
  const selectedId = useLearnFretboardStore((s) => s.selectedId);
  const selectedType = useLearnFretboardStore((s) => s.selectedType);
  const selectedTitle = useLearnFretboardStore((s) => s.selectedTitle);
  const selectedSubtitle = useLearnFretboardStore((s) => s.selectedSubtitle);
  const pitchClasses = useLearnFretboardStore((s) => s.pitchClasses);
  const toneLabels = useLearnFretboardStore((s) => s.toneLabels);
  const playableNotes = useLearnFretboardStore((s) => s.playableNotes);
  const intervalNotes = useLearnFretboardStore((s) => s.intervalNotes);
  const noteGapMs = useLearnFretboardStore((s) => s.noteGapMs);
  const tuning = useLearnFretboardStore((s) => s.tuning);
  const activeNote = useLearnFretboardStore((s) => s.activeNote);
  const activePianoNote = useLearnFretboardStore((s) => s.activePianoNote);
  const panelHeight = useLearnFretboardStore((s) => s.panelHeight);
  const isPanelOpen = useLearnFretboardStore((s) => s.isPanelOpen);
  const instrument = useLearnFretboardStore((s) => s.instrument);
  const setTuning = useLearnFretboardStore((s) => s.setTuning);
  const setActiveNote = useLearnFretboardStore((s) => s.setActiveNote);
  const setActivePianoNote = useLearnFretboardStore(
    (s) => s.setActivePianoNote,
  );
  const ukuleleTuning = useLearnFretboardStore((s) => s.ukuleleTuning);
  const activeUkuleleNote = useLearnFretboardStore((s) => s.activeUkuleleNote);
  const setUkuleleTuning = useLearnFretboardStore((s) => s.setUkuleleTuning);
  const setActiveUkuleleNote = useLearnFretboardStore(
    (s) => s.setActiveUkuleleNote,
  );
  const setLivePitch = useLearnFretboardStore((s) => s.setLivePitch);
  const setNoteGapMs = useLearnFretboardStore((s) => s.setNoteGapMs);
  const setInstrument = useLearnFretboardStore((s) => s.setInstrument);
  const togglePanel = useLearnFretboardStore((s) => s.togglePanel);

  // ── Sidebar state (for right-edge offset) ──────────────────────────────────
  const isSidebarOpen = useLearnSidebarStore((s) => s.isOpen);

  // ── Local live pitch for in-panel display ──────────────────────────────────
  const [localLivePitch, setLocalLivePitch] = useState<LivePitchFrame | null>(
    null,
  );

  // ── Audio ──────────────────────────────────────────────────────────────────
  const { ensureReady, isLoading, isReady, playNote, playStrum, error } =
    useGuitarAudio();

  // ── Panel DOM refs ─────────────────────────────────────────────────────────
  /** Direct ref to the panel outer div — height is written imperatively during drag (no React re-renders) */
  const panelRef = useRef<HTMLDivElement>(null);
  /** rAF handle — throttles pointermove to one DOM update per animation frame */
  const rafRef = useRef<number | null>(null);
  /** Drag tracking including the latest pending height */
  const dragRef = useRef<{
    startY: number;
    startHeight: number;
    pendingHeight: number;
  } | null>(null);

  // ── Sync CSS custom property → drives LearnContentWrapper paddingBottom ────
  // useLayoutEffect fires synchronously before the browser paints, so both the
  // panel height (React style prop) and the content wrapper padding
  // (var(--learn-panel-h)) update in the same frame — zero layout jank.
  // LearnContentWrapper no longer subscribes to panelHeight/isPanelOpen, which
  // eliminates its re-renders during every drag frame.
  useLayoutEffect(() => {
    const h = isPanelOpen ? panelHeight : COLLAPSED_HEIGHT;
    document.documentElement.style.setProperty("--learn-panel-h", `${h}px`);
  }, [panelHeight, isPanelOpen]);

  // ── Resize drag logic ──────────────────────────────────────────────────────

  const handleDragStart = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!selectedId) return;
      const maxH = Math.floor(window.innerHeight * MAX_HEIGHT_RATIO);
      const startH = isPanelOpen
        ? Math.min(panelHeight, maxH)
        : COLLAPSED_HEIGHT;
      dragRef.current = {
        startY: e.clientY,
        startHeight: startH,
        pendingHeight: startH,
      };
      e.currentTarget.setPointerCapture(e.pointerId);
      // Suspend CSS transitions so drag height tracks the pointer instantly
      if (panelRef.current) panelRef.current.style.transition = "none";
    },
    [isPanelOpen, panelHeight, selectedId],
  );

  const handleDragMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragRef.current) return;
      // Skip if an rAF is already pending — avoids queuing faster than 60 fps
      if (rafRef.current !== null) return;
      const clientY = e.clientY;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!dragRef.current || !panelRef.current) return;
        const delta = dragRef.current.startY - clientY; // positive = dragging up
        const maxH = Math.floor(window.innerHeight * MAX_HEIGHT_RATIO);
        const rawNext = dragRef.current.startHeight + delta;
        const next = Math.max(COLLAPSED_HEIGHT, Math.min(maxH, rawNext));
        dragRef.current.pendingHeight = next;
        // Write height directly to the DOM — zero React re-renders
        panelRef.current.style.height = `${next}px`;
        document.documentElement.style.setProperty(
          "--learn-panel-h",
          `${next}px`,
        );
      });
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    // Cancel any in-flight rAF
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    // Restore CSS transitions before committing so snap-close animates smoothly
    if (panelRef.current) panelRef.current.style.transition = "";
    if (!dragRef.current) return;
    const h = dragRef.current.pendingHeight;
    dragRef.current = null;
    const store = useLearnFretboardStore.getState();
    if (h <= SNAP_CLOSE_THRESHOLD) {
      store.closePanel();
      store.setPanelHeight(COLLAPSED_HEIGHT);
    } else {
      if (!store.isPanelOpen) store.openPanel();
      store.setPanelHeight(h);
    }
  }, []);

  // ── Fretboard click ────────────────────────────────────────────────────────
  const handleFretClick = useCallback(
    (fretNote: FretboardNote) => {
      setActiveNote({ stringIndex: fretNote.stringIndex, fret: fretNote.fret });
      void playNote(
        `${fretNote.note.replace("♯", "#").replace("♭", "b")}${fretNote.octave}`,
        { duration: 1.8, gain: 0.95 },
      );
    },
    [setActiveNote, playNote],
  );

  // ── Piano key click ─────────────────────────────────────────────────────────
  const handlePianoKeyClick = useCallback(
    (pianoNote: PianoNote) => {
      setActivePianoNote({ midi: pianoNote.midi });
      void playNote(
        `${pianoNote.note.replace("♯", "#").replace("♭", "b")}${pianoNote.octave}`,
        { duration: 1.8, gain: 0.95 },
      );
    },
    [setActivePianoNote, playNote],
  );

  // ── Ukulele fret click ─────────────────────────────────────────────────────
  const handleUkuleleFretClick = useCallback(
    (fretNote: UkuleleFretboardNote) => {
      setActiveUkuleleNote({
        stringIndex: fretNote.stringIndex,
        fret: fretNote.fret,
      });
      void playNote(
        `${fretNote.note.replace("♯", "#").replace("♭", "b")}${fretNote.octave}`,
        { duration: 1.8, gain: 0.95 },
      );
    },
    [setActiveUkuleleNote, playNote],
  );

  // ── Live pitch frame ───────────────────────────────────────────────────────
  const handleLivePitchFrame = useCallback(
    (frame: LivePitchFrame | null) => {
      setLocalLivePitch(frame);
      setLivePitch(frame);
    },
    [setLivePitch],
  );

  const currentHeight = isPanelOpen ? panelHeight : COLLAPSED_HEIGHT;

  return (
    <div
      ref={panelRef}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-30 flex flex-col border-t border-border/70 bg-background/95 backdrop-blur-sm",
        "transition-[height,right] duration-200 ease-out",
        isSidebarOpen && "lg:right-[300px]",
      )}
      style={{ height: `${currentHeight}px` }}
    >
      {/* ── Handle bar (always visible, always draggable) ─────────────────── */}
      <div
        className={cn(
          "grid cursor-ns-resize select-none items-center border-border/50 px-3",
          "grid-cols-[1fr_auto_1fr]",
          isPanelOpen && "border-b",
        )}
        style={{
          height: `${COLLAPSED_HEIGHT}px`,
          minHeight: `${COLLAPSED_HEIGHT}px`,
        }}
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
      >
        {/* Left: Instrument icon + title */}
        <div className="flex min-w-0 items-center gap-2 overflow-hidden">
          {instrument === "piano" ? (
            <Piano className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : instrument === "ukulele" ? (
            <Music className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <Guitar className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}
          <div className="flex min-w-0 flex-col overflow-hidden">
            {selectedId ? (
              <>
                <span className="truncate text-sm font-medium leading-tight">
                  {selectedTitle}
                </span>
                {selectedSubtitle ? (
                  <span className="hidden truncate text-[10px] leading-tight text-muted-foreground sm:block">
                    {selectedSubtitle}
                  </span>
                ) : null}
              </>
            ) : (
              <span className="truncate text-sm text-muted-foreground">
                {instrument === "piano"
                  ? "Piano"
                  : instrument === "ukulele"
                    ? "Ukulele"
                    : "Fretboard"}{" "}
                — klik card untuk tampil
              </span>
            )}
          </div>
        </div>

        {/* Center: GripHorizontal — visual drag affordance */}
        <div className="flex items-center justify-center px-4">
          <GripHorizontal className="h-5 w-5 text-muted-foreground/50" />
        </div>

        {/* Right: live pitch badge + toggle */}
        <div className="flex items-center justify-end gap-2">
          {localLivePitch ? (
            <Badge
              variant="outline"
              className="hidden shrink-0 gap-1 text-xs sm:flex"
            >
              {localLivePitch.note}
              {localLivePitch.octave} · {Math.round(localLivePitch.frequency)}{" "}
              Hz
            </Badge>
          ) : null}
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              if (!selectedId) return;
              togglePanel();
            }}
            aria-label={
              isPanelOpen
                ? "Collapse fretboard panel"
                : "Expand fretboard panel"
            }
            disabled={!selectedId}
          >
            {isPanelOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* ── Panel content (only when open) ─────────────────────────────────── */}
      {isPanelOpen ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4 pt-3 space-y-3">
          {/* Audio controls row */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => ensureReady()}
              disabled={isReady || isLoading}
            >
              {isReady
                ? "Audio Ready"
                : isLoading
                  ? "Preparing..."
                  : "Enable Guitar Audio"}
            </Button>

            {/* Chord / family: strum */}
            {(selectedType === "chord" || selectedType === "family") &&
            playableNotes.length > 0 ? (
              <Button
                type="button"
                size="sm"
                onClick={() => void playStrum(playableNotes, true)}
                disabled={isLoading}
              >
                Play Chord
              </Button>
            ) : null}

            {/* Interval: sequential playback + gap input */}
            {selectedType === "interval" && intervalNotes ? (
              <>
                <Button
                  type="button"
                  size="sm"
                  onClick={async () => {
                    const ok = await ensureReady();
                    if (!ok) return;
                    await playNote(intervalNotes.rootNote, {
                      duration: 1.8,
                      gain: 0.95,
                    });
                    await playNote(intervalNotes.targetNote, {
                      duration: 1.8,
                      gain: 0.95,
                      delay: noteGapMs / 1000,
                    });
                  }}
                  disabled={isLoading}
                >
                  Play Interval
                </Button>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">
                    Gap (ms)
                  </span>
                  <Input
                    type="number"
                    min={0}
                    max={5000}
                    step={10}
                    value={noteGapMs}
                    onChange={(e) => {
                      const next = Number(e.target.value);
                      setNoteGapMs(
                        Number.isFinite(next) ? Math.max(0, next) : 440,
                      );
                    }}
                    className="h-7 w-20 text-xs"
                  />
                </div>
              </>
            ) : null}

            {/* ── Instrument switcher ──────────────────────────────────────── */}
            <div className="ml-auto flex items-center rounded-lg border border-border/70 p-0.5">
              <button
                type="button"
                onClick={() => setInstrument("guitar")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  instrument === "guitar"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
                aria-label="Switch to guitar fretboard"
              >
                <Guitar className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Guitar</span>
              </button>
              <button
                type="button"
                onClick={() => setInstrument("piano")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  instrument === "piano"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
                aria-label="Switch to piano keyboard"
              >
                <Piano className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Piano</span>
              </button>
              <button
                type="button"
                onClick={() => setInstrument("ukulele")}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                  instrument === "ukulele"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
                aria-label="Switch to ukulele fretboard"
              >
                <Music className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Ukulele</span>
              </button>
            </div>

            {error ? (
              <p className="w-full text-xs text-destructive">
                Audio error: {error}
              </p>
            ) : null}

            {localLivePitch ? (
              <p className="w-full text-xs text-muted-foreground">
                Live: {localLivePitch.note}
                {localLivePitch.octave} · {Math.round(localLivePitch.frequency)}{" "}
                Hz · cents {localLivePitch.cents >= 0 ? "+" : ""}
                {Math.round(localLivePitch.cents)}
              </p>
            ) : null}
          </div>

          {/* ── Instrument view ────────────────────────────────────────────── */}
          {instrument === "piano" ? (
            <Suspense fallback={<PianoSkeleton />}>
              <PianoKeyboard
                startOctave={2}
                octaveCount={4}
                enableLiveMic
                liveMicOptions={{
                  minFrequency: 70,
                  maxFrequency: 2000,
                  rmsThreshold: 0.012,
                  smoothingAlpha: 0.26,
                  lockFrameCount: 3,
                }}
                liveMicSwitchLockCount={3}
                liveMicConfidenceThreshold={0.78}
                onLivePitchFrame={handleLivePitchFrame}
                highlightedPitchClasses={pitchClasses}
                highlightedToneLabels={toneLabels}
                activeNote={activePianoNote}
                onKeyClick={handlePianoKeyClick}
              />
            </Suspense>
          ) : instrument === "ukulele" ? (
            <Suspense fallback={<UkuleleSkeleton />}>
              <UkuleleBoard
                tuning={ukuleleTuning}
                editableTuning
                onTuningChange={setUkuleleTuning}
                enableLiveMic
                liveMicOptions={{
                  minFrequency: 200,
                  maxFrequency: 2000,
                  rmsThreshold: 0.012,
                  smoothingAlpha: 0.26,
                  lockFrameCount: 3,
                }}
                liveMicSwitchLockCount={3}
                liveMicConfidenceThreshold={0.78}
                onLivePitchFrame={handleLivePitchFrame}
                highlightedPitchClasses={pitchClasses}
                highlightedToneLabels={toneLabels}
                activeNote={activeUkuleleNote}
                onFretClick={handleUkuleleFretClick}
              />
            </Suspense>
          ) : (
            <Suspense fallback={<FretboardSkeleton />}>
              <Fretboard
                tuning={tuning}
                editableTuning
                onTuningChange={setTuning}
                enableLiveMic
                liveMicOptions={{
                  minFrequency: 70,
                  maxFrequency: 1200,
                  rmsThreshold: 0.012,
                  smoothingAlpha: 0.26,
                  lockFrameCount: 3,
                }}
                liveMicSwitchLockCount={3}
                liveMicConfidenceThreshold={0.78}
                onLivePitchFrame={handleLivePitchFrame}
                highlightedPitchClasses={pitchClasses}
                highlightedToneLabels={toneLabels}
                activeNote={activeNote}
                onFretClick={handleFretClick}
              />
            </Suspense>
          )}
        </div>
      ) : null}
    </div>
  );
}
