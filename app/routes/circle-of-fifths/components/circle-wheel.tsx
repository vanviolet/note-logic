// ════════════════════════════════════════════════════════
// Circle of Fifths — Interactive SVG Wheel Component
// ════════════════════════════════════════════════════════

import { useMemo, useState } from "react";
import {
  Volume2,
  RotateCw,
  RotateCcw,
  Layers,
  Sparkles,
  Compass,
  Music4,
  Eye,
} from "lucide-react";
import {
  CIRCLE_KEYS,
  type CircleKeyData,
} from "~/theory-music/circle-of-fifths/circle-data";
import { circleAudio } from "~/theory-music/circle-of-fifths/circle-audio";
import { Button } from "~/templates/components/ui/button";
import { Badge } from "~/templates/components/ui/badge";
import { cn } from "~/templates/lib/utils";

export type HighlightMode =
  | "diatonic" // Highlights I, IV, V, ii, iii, vi, vii°
  | "all" // Flat view
  | "tritone" // Shows opposite tritone key
  | "pentatonic" // Shows 5 pentatonic notes
  | "secondary" // Secondary dominants
  | "diminished-square" // Diminished 7th square
  | "augmented-triangle" // Augmented triad triangle
  | "progression"; // Custom path

interface CircleWheelProps {
  selectedKeyIndex: number;
  onSelectKey: (index: number) => void;
  highlightMode: HighlightMode;
  onHighlightModeChange?: (mode: HighlightMode) => void;
  activeProgressionStep?: number | null;
  progressionKeyIndices?: number[];
  enharmonicMode?: "auto" | "sharps" | "flats";
  className?: string;
}

const SVG_SIZE = 520;
const CENTER = SVG_SIZE / 2;
const R_OUTER_EDGE = 245;
const R_MAJOR_OUTER = 240;
const R_MAJOR_INNER = 175;
const R_MINOR_OUTER = 170;
const R_MINOR_INNER = 115;
const R_DIM_OUTER = 110;
const R_DIM_INNER = 72;
const R_CENTER_HUB = 66;

// SVG Arc path generator helper
function describeArc(
  x: number,
  y: number,
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const polarToCartesian = (
    centerX: number,
    centerY: number,
    radius: number,
    angleInDegrees: number,
  ) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const startOuter = polarToCartesian(x, y, outerRadius, endAngle);
  const endOuter = polarToCartesian(x, y, outerRadius, startAngle);
  const startInner = polarToCartesian(x, y, innerRadius, endAngle);
  const endInner = polarToCartesian(x, y, innerRadius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M",
    startOuter.x,
    startOuter.y,
    "A",
    outerRadius,
    outerRadius,
    0,
    largeArcFlag,
    0,
    endOuter.x,
    endOuter.y,
    "L",
    endInner.x,
    endInner.y,
    "A",
    innerRadius,
    innerRadius,
    0,
    largeArcFlag,
    1,
    startInner.x,
    startInner.y,
    "Z",
  ].join(" ");
}

export function CircleWheel({
  selectedKeyIndex,
  onSelectKey,
  highlightMode,
  onHighlightModeChange,
  activeProgressionStep,
  progressionKeyIndices = [],
  enharmonicMode = "auto",
  className,
}: CircleWheelProps) {
  const [rotationOffset, setRotationOffset] = useState(0); // in degrees (multiples of 30)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const activeKey = CIRCLE_KEYS[selectedKeyIndex];

  // Diatonic indices relative to active key
  // In Circle of Fifths:
  // I = selectedKeyIndex (angle 0)
  // V = (idx + 1) % 12 (1 step clockwise)
  // IV = (idx + 11) % 12 (1 step counter-clockwise)
  // vi = relative minor of I
  // iii = relative minor of V
  // ii = relative minor of IV
  // vii° = diminished (inner ring)
  const diatonicMap = useMemo(() => {
    const idx = selectedKeyIndex;
    const vIdx = (idx + 1) % 12;
    const ivIdx = (idx + 11) % 12;

    return {
      tonicMajor: idx, // I
      dominantMajor: vIdx, // V
      subdominantMajor: ivIdx, // IV
      tonicMinor: idx, // vi (relative to I)
      dominantMinor: vIdx, // iii (relative to V)
      subdominantMinor: ivIdx, // ii (relative to IV)
      diminished: idx, // vii°
    };
  }, [selectedKeyIndex]);

  // Rotate to place selected key at the top (12 o'clock)
  const centerSelectedToTop = () => {
    const targetAngle = -(selectedKeyIndex * 30);
    setRotationOffset(targetAngle);
  };

  const resetRotation = () => setRotationOffset(0);

  // Play chord sound on click
  const handleKeyClick = (keyData: CircleKeyData, isMinor: boolean = false) => {
    onSelectKey(keyData.index);
    if (isMinor) {
      // Find relative minor chord
      const minorChord = keyData.diatonicChords.find((c) => c.degree === "vi");
      if (minorChord) {
        circleAudio.playChord(minorChord.notes, { type: "strum", baseOctave: 3 });
      } else {
        circleAudio.playNote(keyData.relativeMinor.replace("m", ""), 3);
      }
    } else {
      const tonicChord = keyData.diatonicChords[0];
      if (tonicChord) {
        circleAudio.playChord(tonicChord.notes, { type: "strum", baseOctave: 3 });
      } else {
        circleAudio.playNote(keyData.majorKey, 4);
      }
    }
  };

  // Coordinates helper with rotation
  const getCoordinates = (index: number, radius: number) => {
    const angleDeg = index * 30 + rotationOffset;
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: CENTER + radius * Math.cos(angleRad),
      y: CENTER + radius * Math.sin(angleRad),
      angleDeg,
    };
  };

  return (
    <div className={cn("relative flex flex-col items-center justify-center select-none", className)}>
      {/* Top Floating Wheel Controls */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 w-full max-w-[520px] px-2 text-xs">
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs gap-1"
            onClick={() => setRotationOffset((r) => r - 30)}
            title="Putar 30° Berlawanan Jarum Jam"
          >
            <RotateCcw className="size-3.5" />
            <span>-30°</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs gap-1"
            onClick={() => setRotationOffset((r) => r + 30)}
            title="Putar 30° Searah Jarum Jam"
          >
            <RotateCw className="size-3.5" />
            <span>+30°</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={centerSelectedToTop}
            title="Posisikan Key Aktif di Atas"
          >
            <Compass className="size-3.5 mr-1 text-primary" />
            Key ke Atas
          </Button>
          {rotationOffset !== 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground"
              onClick={resetRotation}
            >
              Reset 0°
            </Button>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-muted-foreground hidden sm:inline">Mode:</span>
          <select
            value={highlightMode}
            onChange={(e) => onHighlightModeChange?.(e.target.value as HighlightMode)}
            className="h-7 rounded border border-border bg-background px-2 py-0.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="diatonic">Diatonic Family (6 Chords)</option>
            <option value="all">Standard Circle (All Keys)</option>
            <option value="tritone">Tritone Substitution (180°)</option>
            <option value="pentatonic">Pentatonic Cluster</option>
            <option value="secondary">Secondary Dominants</option>
            <option value="diminished-square">Diminished Square (3 Semitones)</option>
            <option value="augmented-triangle">Augmented Triangle (4 Semitones)</option>
            <option value="progression">Progression Path</option>
          </select>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative w-full max-w-[500px] aspect-square flex items-center justify-center p-1">
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Glow Filter for Active Key */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Radial background gradient */}
            <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--card)" stopOpacity="0.95" />
              <stop offset="100%" stopColor="var(--background)" stopOpacity="0.8" />
            </radialGradient>
          </defs>

          {/* Outer Border Track */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={R_OUTER_EDGE}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={1.5}
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={R_MAJOR_INNER}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={1}
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={R_MINOR_INNER}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.15}
            strokeWidth={1}
          />
          <circle
            cx={CENTER}
            cy={CENTER}
            r={R_DIM_INNER}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.12}
            strokeWidth={1}
          />

          {/* ═══════════════════════════════════════════════ */}
          {/* GEOMETRIC OVERLAYS                             */}
          {/* ═══════════════════════════════════════════════ */}

          {/* 1. Tritone Line (180° Diameter) */}
          {highlightMode === "tritone" && (
            <g className="transition-opacity duration-300">
              {(() => {
                const p1 = getCoordinates(selectedKeyIndex, (R_MAJOR_OUTER + R_MAJOR_INNER) / 2);
                const p2 = getCoordinates((selectedKeyIndex + 6) % 12, (R_MAJOR_OUTER + R_MAJOR_INNER) / 2);
                return (
                  <>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke="#ef4444"
                      strokeWidth={3}
                      strokeDasharray="4 4"
                    />
                    <circle cx={p1.x} cy={p1.y} r={18} fill="none" stroke="#ef4444" strokeWidth={2} />
                    <circle cx={p2.x} cy={p2.y} r={18} fill="none" stroke="#ef4444" strokeWidth={2} />
                  </>
                );
              })()}
            </g>
          )}

          {/* 2. Diminished Square (4 keys separated by 3 steps on circle) */}
          {highlightMode === "diminished-square" && (
            <g className="transition-opacity duration-300">
              {(() => {
                const indices = [
                  selectedKeyIndex,
                  (selectedKeyIndex + 3) % 12,
                  (selectedKeyIndex + 6) % 12,
                  (selectedKeyIndex + 9) % 12,
                ];
                const points = indices.map((i) => getCoordinates(i, (R_MAJOR_OUTER + R_MAJOR_INNER) / 2));
                const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
                return (
                  <>
                    <path d={d} fill="rgba(168, 85, 247, 0.12)" stroke="#a855f7" strokeWidth={2} />
                    {points.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r={12} fill="rgba(168,85,247,0.3)" stroke="#a855f7" />
                    ))}
                  </>
                );
              })()}
            </g>
          )}

          {/* 3. Augmented Triangle (3 keys separated by 4 steps on circle) */}
          {highlightMode === "augmented-triangle" && (
            <g className="transition-opacity duration-300">
              {(() => {
                const indices = [
                  selectedKeyIndex,
                  (selectedKeyIndex + 4) % 12,
                  (selectedKeyIndex + 8) % 12,
                ];
                const points = indices.map((i) => getCoordinates(i, (R_MAJOR_OUTER + R_MAJOR_INNER) / 2));
                const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ") + " Z";
                return (
                  <>
                    <path d={d} fill="rgba(245, 158, 11, 0.15)" stroke="#f59e0b" strokeWidth={2} />
                    {points.map((p, i) => (
                      <circle key={i} cx={p.x} cy={p.y} r={12} fill="rgba(245,158,11,0.3)" stroke="#f59e0b" />
                    ))}
                  </>
                );
              })()}
            </g>
          )}

          {/* 4. Progression Flow Lines */}
          {highlightMode === "progression" && progressionKeyIndices.length > 1 && (
            <g className="transition-opacity duration-300">
              {progressionKeyIndices.map((keyIdx, i) => {
                if (i === 0) return null;
                const prevIdx = progressionKeyIndices[i - 1];
                const p1 = getCoordinates(prevIdx, (R_MAJOR_OUTER + R_MAJOR_INNER) / 2);
                const p2 = getCoordinates(keyIdx, (R_MAJOR_OUTER + R_MAJOR_INNER) / 2);
                const isActiveStep = activeProgressionStep === i;
                return (
                  <g key={`prog-line-${i}`}>
                    <line
                      x1={p1.x}
                      y1={p1.y}
                      x2={p2.x}
                      y2={p2.y}
                      stroke={isActiveStep ? "#38bdf8" : "rgba(56, 189, 248, 0.5)"}
                      strokeWidth={isActiveStep ? 3.5 : 2}
                      strokeDasharray={isActiveStep ? "none" : "3 3"}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* ═══════════════════════════════════════════════ */}
          {/* 12 WEDGES / SECTORS (Clockwise)                */}
          {/* ═══════════════════════════════════════════════ */}
          {CIRCLE_KEYS.map((keyData, i) => {
            const startAngle = i * 30 - 15 + rotationOffset;
            const endAngle = i * 30 + 15 + rotationOffset;
            const isSelected = selectedKeyIndex === i;
            const isHovered = hoveredIndex === i;

            // Diatonic classification in active mode
            let majorFill = "var(--card)";
            let majorStroke = "currentColor";
            let majorRole = "";
            let minorFill = "var(--card)";
            let minorRole = "";

            if (highlightMode === "diatonic") {
              if (i === diatonicMap.tonicMajor) {
                majorFill = "#3b82f6"; // I - Tonic (Blue)
                majorRole = "I";
                minorFill = "#6366f1"; // vi - Submediant (Indigo)
                minorRole = "vi";
              } else if (i === diatonicMap.dominantMajor) {
                majorFill = "#f59e0b"; // V - Dominant (Amber)
                majorRole = "V";
                minorFill = "#d97706"; // iii - Mediant (Orange)
                minorRole = "iii";
              } else if (i === diatonicMap.subdominantMajor) {
                majorFill = "#10b981"; // IV - Subdominant (Emerald)
                majorRole = "IV";
                minorFill = "#059669"; // ii - Supertonic (Green)
                minorRole = "ii";
              }
            } else if (highlightMode === "pentatonic") {
              // 5 adjacent keys on circle: IV, I, V, ii, vi
              const pentaIndices = [
                (selectedKeyIndex + 11) % 12,
                selectedKeyIndex,
                (selectedKeyIndex + 1) % 12,
                (selectedKeyIndex + 2) % 12,
                (selectedKeyIndex + 3) % 12,
              ];
              if (pentaIndices.includes(i)) {
                majorFill = "#0ea5e9";
                minorFill = "#8b5cf6";
              }
            } else if (highlightMode === "tritone") {
              if (i === selectedKeyIndex) {
                majorFill = "#3b82f6";
              } else if (i === (selectedKeyIndex + 6) % 12) {
                majorFill = "#ef4444";
              }
            } else {
              if (isSelected) {
                majorFill = "var(--primary)";
                minorFill = "var(--primary)";
              }
            }

            // Outer Major Arc path
            const majorArcPath = describeArc(
              CENTER,
              CENTER,
              R_MAJOR_INNER,
              R_MAJOR_OUTER,
              startAngle,
              endAngle,
            );

            // Middle Minor Arc path
            const minorArcPath = describeArc(
              CENTER,
              CENTER,
              R_MINOR_INNER,
              R_MINOR_OUTER,
              startAngle,
              endAngle,
            );

            // Inner Diminished Arc path
            const dimArcPath = describeArc(
              CENTER,
              CENTER,
              R_DIM_INNER,
              R_DIM_OUTER,
              startAngle,
              endAngle,
            );

            // Center of text
            const majorTextPos = getCoordinates(i, (R_MAJOR_OUTER + R_MAJOR_INNER) / 2);
            const minorTextPos = getCoordinates(i, (R_MINOR_OUTER + R_MINOR_INNER) / 2);
            const dimTextPos = getCoordinates(i, (R_DIM_OUTER + R_DIM_INNER) / 2);
            const accidentalTextPos = getCoordinates(i, R_MAJOR_OUTER + 14);

            return (
              <g
                key={`wedge-${keyData.majorKey}-${i}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="transition-all duration-200"
              >
                {/* ── Major Key Wedge (Outer Ring) ── */}
                <path
                  d={majorArcPath}
                  fill={majorFill}
                  fillOpacity={
                    highlightMode === "diatonic" && majorRole
                      ? 0.85
                      : isSelected
                      ? 0.95
                      : isHovered
                      ? 0.25
                      : 0.08
                  }
                  stroke={majorStroke}
                  strokeOpacity={isSelected ? 0.9 : 0.2}
                  strokeWidth={isSelected ? 2.5 : 1}
                  className="cursor-pointer transition-all duration-150 hover:brightness-110"
                  onClick={() => handleKeyClick(keyData, false)}
                />

                {/* Major Text Label */}
                <text
                  x={majorTextPos.x}
                  y={majorTextPos.y - (majorRole ? 3 : 0)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={cn(
                    "pointer-events-none font-bold text-sm tracking-tight transition-all",
                    isSelected || (highlightMode === "diatonic" && majorRole)
                      ? "fill-white font-extrabold"
                      : "fill-foreground",
                  )}
                >
                  {enharmonicMode === "flats" && keyData.majorAlt?.includes("b")
                    ? keyData.majorAlt
                    : enharmonicMode === "sharps" && keyData.majorAlt?.includes("#")
                    ? keyData.majorAlt
                    : keyData.majorKey}
                </text>

                {/* Roman Numeral Badge on Major */}
                {majorRole && (
                  <text
                    x={majorTextPos.x}
                    y={majorTextPos.y + 9}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none fill-white/90 text-[9px] font-semibold tracking-wider"
                  >
                    {majorRole}
                  </text>
                )}

                {/* ── Minor Key Wedge (Middle Ring) ── */}
                <path
                  d={minorArcPath}
                  fill={minorFill}
                  fillOpacity={
                    highlightMode === "diatonic" && minorRole
                      ? 0.75
                      : isSelected
                      ? 0.65
                      : isHovered
                      ? 0.2
                      : 0.05
                  }
                  stroke="currentColor"
                  strokeOpacity={isSelected ? 0.7 : 0.15}
                  strokeWidth={1}
                  className="cursor-pointer transition-all duration-150 hover:brightness-110"
                  onClick={() => handleKeyClick(keyData, true)}
                />

                {/* Minor Text Label */}
                <text
                  x={minorTextPos.x}
                  y={minorTextPos.y - (minorRole ? 3 : 0)}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={cn(
                    "pointer-events-none text-xs font-semibold tracking-tight transition-all",
                    isSelected || (highlightMode === "diatonic" && minorRole)
                      ? "fill-white font-bold"
                      : "fill-muted-foreground",
                  )}
                >
                  {keyData.relativeMinor}
                </text>

                {/* Roman Numeral Badge on Minor */}
                {minorRole && (
                  <text
                    x={minorTextPos.x}
                    y={minorTextPos.y + 8}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none fill-white/90 text-[8px] font-medium"
                  >
                    {minorRole}
                  </text>
                )}

                {/* ── Diminished Wedge (Inner Ring) ── */}
                <path
                  d={dimArcPath}
                  fill={
                    highlightMode === "diatonic" && i === selectedKeyIndex
                      ? "#a855f7"
                      : "var(--card)"
                  }
                  fillOpacity={
                    highlightMode === "diatonic" && i === selectedKeyIndex
                      ? 0.7
                      : isSelected
                      ? 0.4
                      : 0.03
                  }
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  strokeWidth={0.75}
                  className="cursor-pointer transition-all hover:brightness-110"
                  onClick={() => {
                    const dimChord = keyData.diatonicChords.find((c) => c.degree === "vii°");
                    if (dimChord) {
                      circleAudio.playChord(dimChord.notes, { type: "strum", baseOctave: 3 });
                    }
                  }}
                />

                {/* Diminished Text Label */}
                <text
                  x={dimTextPos.x}
                  y={dimTextPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={cn(
                    "pointer-events-none text-[8.5px] font-medium transition-all",
                    highlightMode === "diatonic" && i === selectedKeyIndex
                      ? "fill-white font-bold"
                      : "fill-muted-foreground/70",
                  )}
                >
                  {keyData.diminishedChord}
                </text>

                {/* ── Accidental Badge Indicator (Outside Perimeter) ── */}
                {keyData.accidentalsCount > 0 ? (
                  <text
                    x={accidentalTextPos.x}
                    y={accidentalTextPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none fill-muted-foreground font-mono text-[9px] font-medium"
                  >
                    {keyData.accidentalsCount}
                    {keyData.accidentalType === "sharp"
                      ? "♯"
                      : keyData.accidentalType === "flat"
                      ? "♭"
                      : "♯/♭"}
                  </text>
                ) : (
                  <text
                    x={accidentalTextPos.x}
                    y={accidentalTextPos.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    className="pointer-events-none fill-muted-foreground/50 font-mono text-[9px]"
                  >
                    0
                  </text>
                )}
              </g>
            );
          })}

          {/* ═══════════════════════════════════════════════ */}
          {/* CENTER HUB (Interactive Play & Key summary)    */}
          {/* ═══════════════════════════════════════════════ */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={R_CENTER_HUB}
            fill="url(#centerGrad)"
            stroke="currentColor"
            strokeOpacity={0.2}
            strokeWidth={1.5}
            className="cursor-pointer transition-all hover:stroke-primary"
            onClick={() => {
              const tonic = activeKey.diatonicChords[0];
              if (tonic) {
                circleAudio.playChord(tonic.notes, { type: "strum", baseOctave: 3 });
              }
            }}
          />

          <g className="pointer-events-none select-none">
            <text
              x={CENTER}
              y={CENTER - 20}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px] uppercase font-semibold tracking-wider"
            >
              Key Aktif
            </text>
            <text
              x={CENTER}
              y={CENTER + 2}
              textAnchor="middle"
              className="fill-foreground font-extrabold text-2xl tracking-tight"
            >
              {activeKey.majorKey}
            </text>
            <text
              x={CENTER}
              y={CENTER + 20}
              textAnchor="middle"
              className="fill-primary font-medium text-xs"
            >
              rel: {activeKey.relativeMinor}
            </text>
            <text
              x={CENTER}
              y={CENTER + 34}
              textAnchor="middle"
              className="fill-muted-foreground/80 font-mono text-[9px]"
            >
              {activeKey.accidentalsCount === 0
                ? "Natural"
                : `${activeKey.accidentalsCount} ${activeKey.accidentalType === "sharp" ? "Sharps (♯)" : "Flats (♭)"}`}
            </text>
          </g>
        </svg>
      </div>

      {/* Legend & Quick Info Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground">
        {highlightMode === "diatonic" && (
          <div className="flex flex-wrap items-center justify-center gap-3 px-2 py-1 rounded-md bg-muted/30 border border-border/50">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2.5 rounded-full bg-blue-500 inline-block" />
              Tonic (I / vi)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2.5 rounded-full bg-emerald-500 inline-block" />
              Subdominant (IV / ii)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2.5 rounded-full bg-amber-500 inline-block" />
              Dominant (V / iii)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="size-2.5 rounded-full bg-purple-500 inline-block" />
              Diminished (vii°)
            </span>
          </div>
        )}
        <p className="text-[11px] text-muted-foreground text-center">
          Klik lingkaran luar untuk Major chord, lingkaran tengah untuk Minor chord.
        </p>
      </div>
    </div>
  );
}
