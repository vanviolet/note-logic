import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Activity, Mic2 } from "lucide-react";
import type { Route } from "./+types";
import {
  useLiveGuitarPitch,
  useIsClient,
  type LivePitchFrame,
} from "~/templates/hooks";
import { useTheme } from "~/templates/components/theme-provider";
import { Badge } from "~/templates/components/ui/badge";
import { FloatingFilterSidebar } from "~/routes/components/floating-filter-sidebar";
import { useLearnSidebarStore } from "~/shared/stores/learn-sidebar.store";
import { cn } from "~/templates/lib/utils";
import { clamp } from "./lib/tuner-utils";
import {
  TunerControlPanelFallback,
  TunerMeterFallback,
} from "./components/tuner-fallbacks";
import {
  buildStringLabel,
  closestTargetByMidi,
  GUITAR_STRING_TARGETS,
  toFrameCentsAgainstTarget,
} from "./lib/tuner-utils";
import { lazyNamed } from "./lib/lazy";
import type { TuningMode } from "./types";

const TunerMeter = lazyNamed(
  () => import("./components/tuner-meter"),
  "TunerMeter",
);

const TunerControlPanel = lazyNamed(
  () => import("./components/tuner-control-panel"),
  "TunerControlPanel",
);

export function meta(_: Route.MetaArgs) {
  return [
    { title: "NoteLogic | Guitar Tuner" },
    {
      name: "description",
      content:
        "Pro guitar tuner with smooth live meter, auto target string detection, and stable pitch tracking.",
    },
  ];
}

function ConfidenceBars({ value }: { value: number }) {
  const total = 10;
  const lit = Math.round((value / 100) * total);
  return (
    <div className="flex items-end gap-[3px]">
      {Array.from({ length: total }).map((_, i) => {
        const isLit = i < lit;
        const barH = 6 + i * 1.6;
        const litColor =
          i < 3
            ? "bg-red-400/90 shadow-[0_0_4px_rgb(248_113_113/0.65)]"
            : i < 6
              ? "bg-amber-400/90 shadow-[0_0_4px_rgb(251_191_36/0.65)]"
              : i < 8
                ? "bg-lime-400/90 shadow-[0_0_4px_rgb(163_230_53/0.65)]"
                : "bg-emerald-400/90 shadow-[0_0_4px_rgb(52_211_153/0.65)]";
        return (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-[2px] transition-all duration-200",
              isLit ? litColor : "bg-border/25",
            )}
            style={{ height: `${barH}px` }}
          />
        );
      })}
    </div>
  );
}

export default function TunerRoute() {
  const isClient = useIsClient();
  const { theme } = useTheme();
  const isSidebarOpen = useLearnSidebarStore((s) => s.isOpen);

  const isDarkMode = useMemo(() => {
    if (!isClient) return false;
    if (theme === "dark") return true;
    if (theme === "light") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }, [isClient, theme]);

  const [mode, setMode] = useState<TuningMode>("auto");
  const [manualTargetId, setManualTargetId] = useState("E2");
  const [pitchFrame, setPitchFrame] = useState<LivePitchFrame | null>(null);
  const [displayCents, setDisplayCents] = useState(0);

  const targetCentsRef = useRef(0);

  const { isStarting, isListening, error, start, stop } = useLiveGuitarPitch({
    onPitchFrame: setPitchFrame,
    minFrequency: 65,
    maxFrequency: 360,
    rmsThreshold: 0.01,
    smoothingAlpha: 0.34,
    lockFrameCount: 2,
  });

  const activeTarget = useMemo(() => {
    if (mode === "manual") {
      return (
        GUITAR_STRING_TARGETS.find((item) => item.id === manualTargetId) ??
        GUITAR_STRING_TARGETS[0]
      );
    }

    if (!pitchFrame) {
      return GUITAR_STRING_TARGETS.find((item) => item.id === "E2") ?? null;
    }

    return closestTargetByMidi(pitchFrame.midi);
  }, [manualTargetId, mode, pitchFrame]);

  const centsAgainstTarget = useMemo(
    () => toFrameCentsAgainstTarget(pitchFrame, activeTarget),
    [activeTarget, pitchFrame],
  );

  useEffect(() => {
    targetCentsRef.current = centsAgainstTarget ?? 0;
  }, [centsAgainstTarget]);

  useEffect(() => {
    let rafId = 0;

    const animate = () => {
      setDisplayCents((prev) => {
        const target = targetCentsRef.current;
        const next = prev + (target - prev) * 0.2;
        return Math.abs(next - target) < 0.15 ? target : next;
      });
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const isInTune = Math.abs(centsAgainstTarget ?? 0) <= 5;
  const isPerfectTune =
    !!pitchFrame &&
    isInTune &&
    Math.abs(centsAgainstTarget ?? 0) <= 1 &&
    (pitchFrame.confidence ?? 0) >= 0.94;

  const detectedLabel = pitchFrame
    ? `${pitchFrame.note}${pitchFrame.octave}`
    : "--";

  const confidencePct = clamp(
    Math.round((pitchFrame?.confidence ?? 0) * 100),
    0,
    100,
  );

  const handleToggleTuner = () => {
    if (isListening) {
      stop();
    } else {
      void start();
    }
  };

  const handleResetMeter = () => {
    setPitchFrame(null);
    setDisplayCents(0);
  };

  return (
    <section className="relative w-full min-h-[calc(100vh-4rem)] overflow-x-clip bg-background">
      {/* Pure CSS minimalist background */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,hsl(var(--primary)/0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-primary/5 to-transparent" />

      {/* ── Control Panel sidebar ── */}
      <FloatingFilterSidebar title="Control Panel" toggleLabel="Control Panel">
        <Suspense fallback={<TunerControlPanelFallback />}>
          <TunerControlPanel
            mode={mode}
            onModeChange={setMode}
            manualTargetId={manualTargetId}
            onManualTargetIdChange={setManualTargetId}
            isListening={isListening}
            isStarting={isStarting}
            onToggleTuner={handleToggleTuner}
            onResetMeter={handleResetMeter}
            error={error}
          />
        </Suspense>
      </FloatingFilterSidebar>

      {/* ── Sidebar-aware wrapper ── */}
      <div
        className={cn(
          "transition-all duration-300",
          isSidebarOpen ? "lg:pr-[300px]" : "",
        )}
      >
        {/* ── Hero header ── */}
        <div className="relative z-10 px-4 pt-8 pb-4 md:px-8 md:pt-10 lg:px-10">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Guitar Tuner
            </h1>
            <Badge variant="secondary">
              <Mic2 className="mr-1 h-3 w-3" />
              Pro Meter
            </Badge>
          </div>
        </div>

        {/* ── Main tuner content ── */}
        <div className="relative z-10 px-4 pb-24 md:px-8 lg:px-10">
          <Suspense fallback={<TunerMeterFallback />}>
            <TunerMeter
              displayCents={displayCents}
              rawCents={centsAgainstTarget ?? 0}
              isListening={isListening}
              isInTune={isInTune}
              isPerfectTune={isPerfectTune}
              targetLabel={activeTarget ? buildStringLabel(activeTarget) : "--"}
              targetMidi={activeTarget?.midi ?? null}
              detectedLabel={detectedLabel}
              detectedMidi={pitchFrame?.midi ?? null}
              frequencyHz={pitchFrame?.smoothedFrequency ?? null}
              confidence={pitchFrame?.confidence ?? 0}
              isStarting={isStarting}
              onToggleTuner={handleToggleTuner}
            />
          </Suspense>
        </div>
      </div>

      {/* ── Fixed bottom stability bar ── */}
      <div
        className={cn(
          "fixed bottom-0 left-0 z-50 transition-all duration-300",
          isSidebarOpen ? "right-[300px]" : "right-0",
        )}
      >
        <div className="border-border/60 bg-background/80 backdrop-blur-md border-t px-4 py-2.5 md:px-8 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <Activity className="h-3.5 w-3.5" />
              <span>Stability</span>
            </div>
            <span className="text-xs font-medium tabular-nums">
              {confidencePct}%
            </span>
          </div>
          <div className="mt-1.5">
            <ConfidenceBars value={confidencePct} />
          </div>
        </div>
      </div>
    </section>
  );
}
