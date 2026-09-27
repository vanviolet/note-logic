// ════════════════════════════════════════════════════════
// Knowledge – Circle of Fifths Widget
// ════════════════════════════════════════════════════════

import { useState } from "react";
import { CircleDot } from "lucide-react";
import { cn } from "~/templates/lib/utils";

const KEYS = [
  { note: "C", major: "C", minor: "Am", sharps: 0, flats: 0 },
  { note: "G", major: "G", minor: "Em", sharps: 1, flats: 0 },
  { note: "D", major: "D", minor: "Bm", sharps: 2, flats: 0 },
  { note: "A", major: "A", minor: "F#m", sharps: 3, flats: 0 },
  { note: "E", major: "E", minor: "C#m", sharps: 4, flats: 0 },
  { note: "B", major: "B", minor: "G#m", sharps: 5, flats: 0 },
  { note: "F#/Gb", major: "F#/Gb", minor: "D#m/Ebm", sharps: 6, flats: 6 },
  { note: "Db", major: "Db", minor: "Bbm", sharps: 0, flats: 5 },
  { note: "Ab", major: "Ab", minor: "Fm", sharps: 0, flats: 4 },
  { note: "Eb", major: "Eb", minor: "Cm", sharps: 0, flats: 3 },
  { note: "Bb", major: "Bb", minor: "Gm", sharps: 0, flats: 2 },
  { note: "F", major: "F", minor: "Dm", sharps: 0, flats: 1 },
];

const RADIUS = 140;
const INNER_RADIUS = 100;
const CENTER = 180;

export function CircleOfFifthsWidget() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showMinor, setShowMinor] = useState(false);

  const selected = selectedIndex !== null ? KEYS[selectedIndex] : null;

  // Compute adjacent keys (P5 up = next, P5 down = prev)
  const getAdjacent = (idx: number) => ({
    fifthUp: KEYS[(idx + 1) % 12],
    fifthDown: KEYS[(idx + 11) % 12],
  });

  return (
    <div className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
          <CircleDot className="h-4 w-4 text-primary" />
          Circle of Fifths
        </h4>
        <button
          type="button"
          onClick={() => setShowMinor((v) => !v)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
            showMinor
              ? "bg-purple-500/20 text-purple-400"
              : "bg-muted/50 text-muted-foreground hover:bg-muted",
          )}
        >
          {showMinor ? "Minor Keys ✓" : "Show Minor"}
        </button>
      </div>

      {/* SVG Circle */}
      <div className="flex justify-center">
        <svg
          viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
          className="w-full max-w-[360px] h-auto"
        >
          {/* Background circle */}
          <circle
            cx={CENTER}
            cy={CENTER}
            r={RADIUS + 20}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.1}
            strokeWidth={1}
          />

          {/* Lines connecting adjacent keys */}
          {KEYS.map((_, i) => {
            const angle1 = (i * 30 - 90) * (Math.PI / 180);
            const angle2 = ((i + 1) * 30 - 90) * (Math.PI / 180);
            const x1 = CENTER + RADIUS * Math.cos(angle1);
            const y1 = CENTER + RADIUS * Math.sin(angle1);
            const x2 = CENTER + RADIUS * Math.cos(angle2);
            const y2 = CENTER + RADIUS * Math.sin(angle2);
            const isHighlighted =
              selectedIndex !== null &&
              (i === selectedIndex || (i + 1) % 12 === selectedIndex);
            return (
              <line
                key={`line-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                strokeOpacity={isHighlighted ? 0.5 : 0.08}
                strokeWidth={isHighlighted ? 2 : 1}
              />
            );
          })}

          {/* Key nodes - outer (major), inner (minor) */}
          {KEYS.map((key, i) => {
            const angle = (i * 30 - 90) * (Math.PI / 180);
            const x = CENTER + RADIUS * Math.cos(angle);
            const y = CENTER + RADIUS * Math.sin(angle);
            const xi = CENTER + INNER_RADIUS * Math.cos(angle);
            const yi = CENTER + INNER_RADIUS * Math.sin(angle);
            const isSelected = selectedIndex === i;

            return (
              <g key={key.note}>
                {/* Major key circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={18}
                  className={cn(
                    "cursor-pointer transition-all",
                    isSelected
                      ? "fill-primary stroke-primary"
                      : "fill-muted/50 stroke-border hover:fill-muted",
                  )}
                  strokeWidth={1.5}
                  onClick={() => setSelectedIndex(isSelected ? null : i)}
                />
                <text
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={cn(
                    "pointer-events-none text-[11px] font-bold",
                    isSelected ? "fill-primary-foreground" : "fill-foreground",
                  )}
                >
                  {key.note}
                </text>

                {/* Minor key circle (inner) */}
                {showMinor && (
                  <>
                    <circle
                      cx={xi}
                      cy={yi}
                      r={14}
                      className={cn(
                        "cursor-pointer transition-all",
                        isSelected
                          ? "fill-purple-500 stroke-purple-400"
                          : "fill-muted/30 stroke-border/50 hover:fill-muted/50",
                      )}
                      strokeWidth={1}
                      onClick={() => setSelectedIndex(isSelected ? null : i)}
                    />
                    <text
                      x={xi}
                      y={yi}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className={cn(
                        "pointer-events-none text-[9px] font-medium",
                        isSelected ? "fill-white" : "fill-muted-foreground",
                      )}
                    >
                      {key.minor}
                    </text>
                  </>
                )}
              </g>
            );
          })}

          {/* Center info */}
          <text
            x={CENTER}
            y={showMinor ? CENTER - 8 : CENTER}
            textAnchor="middle"
            dominantBaseline="central"
            className="fill-muted-foreground/40 text-[10px]"
          >
            {selected ? "" : "Circle of"}
          </text>
          {!selected && (
            <text
              x={CENTER}
              y={showMinor ? CENTER + 8 : CENTER + 12}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-muted-foreground/40 text-[10px]"
            >
              Fifths
            </text>
          )}
        </svg>
      </div>

      {/* Info panel */}
      {selected && selectedIndex !== null && (
        <div className="rounded-lg border border-border/50 bg-muted/20 p-4 space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold">{selected.major} Major</span>
            {showMinor && (
              <span className="text-sm text-purple-400">
                / {selected.minor}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">Sharps: </span>
              <span className="font-medium">{selected.sharps}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Flats: </span>
              <span className="font-medium">{selected.flats}</span>
            </div>
          </div>
          <div className="text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">P5 naik → </span>
              <span className="font-medium">
                {getAdjacent(selectedIndex).fifthUp.major}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">P5 turun → </span>
              <span className="font-medium">
                {getAdjacent(selectedIndex).fifthDown.major}
              </span>
            </p>
          </div>
          <p className="text-[11px] text-muted-foreground/60">
            Setiap langkah searah jarum jam = naik Perfect 5th (7 semitone)
          </p>
        </div>
      )}

      <p className="text-muted-foreground/60 text-[11px]">
        Klik key untuk melihat detail. Toggle "Show Minor" untuk relative minor
        keys.
      </p>
    </div>
  );
}
