// ════════════════════════════════════════════════════════
// ChordStaffRenderer — VexFlow chord notation on staff
// ════════════════════════════════════════════════════════
//
// Renders the notes of a chord as a stacked chord symbol on a
// music staff using VexFlow. Supports dark/light mode by
// reading the current theme from the DOM.
//
// Client-only: VexFlow is lazy-loaded via dynamic import.
// ════════════════════════════════════════════════════════

import { memo, useCallback, useEffect, useRef } from "react";
import { cn } from "~/templates/lib/utils";

export interface ChordStaffRendererProps {
  /** Chord name (displayed above the staff) */
  chordName: string;
  /** Notes in VexFlow key format: ["c/4", "e/4", "g/4"] */
  notes: string[];
  /** Clef to use (default: treble) */
  clef?: "treble" | "bass";
  /** Width of the SVG container */
  width?: number;
  /** Height of the SVG container */
  height?: number;
  /** Optional CSS class */
  className?: string;
  /** Show note labels below the staff */
  showLabels?: boolean;
}

/**
 * Parse a VexFlow key like "c#/4" or "bb/3" into
 * { key: "c#/4", accidental: "#" | "b" | "bb" | null }
 */
function parseVexKey(key: string): { key: string; accidental: string | null } {
  const match = key.match(/^([a-g])(#{1,2}|b{1,2})?\/(\d)$/i);
  if (!match) return { key, accidental: null };
  const acc = match[2] ?? null;
  return { key, accidental: acc };
}

/**
 * Convert a note name like "C#" to VexFlow key format "c#/4".
 * Assigns octaves intelligently so the chord fits nicely on the staff.
 */
export function notesToVexKeys(noteNames: string[], baseOctave = 4): string[] {
  if (noteNames.length === 0) return [];

  // Map pitch class order for ascending voicing
  const PC_ORDER: Record<string, number> = {
    C: 0,
    "C#": 1,
    Db: 1,
    D: 2,
    "D#": 3,
    Eb: 3,
    E: 4,
    Fb: 4,
    "E#": 5,
    F: 5,
    "F#": 6,
    Gb: 6,
    G: 7,
    "G#": 8,
    Ab: 8,
    A: 9,
    "A#": 10,
    Bb: 10,
    B: 11,
    Cb: 11,
    "B#": 0,
  };

  // Convert note names to { name, pc, vexName }
  const parsed = noteNames.map((n) => {
    const pc = PC_ORDER[n] ?? 0;
    // VexFlow uses lowercase, # and b for accidentals
    const vexName = n.toLowerCase().replace("♯", "#").replace("♭", "b");
    return { name: n, pc, vexName };
  });

  // Assign octaves: start from baseOctave, bump if PC goes down
  const keys: string[] = [];
  let currentOctave = baseOctave;
  let prevPc = -1;

  for (const { pc, vexName } of parsed) {
    if (prevPc >= 0 && pc <= prevPc) {
      currentOctave++;
    }
    keys.push(`${vexName}/${currentOctave}`);
    prevPc = pc;
  }

  return keys;
}

export const ChordStaffRenderer = memo(function ChordStaffRenderer({
  chordName,
  notes,
  clef = "treble",
  width = 200,
  height = 200,
  className,
  showLabels = true,
}: ChordStaffRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderStaff = useCallback(async () => {
    const el = containerRef.current;
    if (!el || notes.length === 0) return;

    el.innerHTML = "";

    // Detect dark mode
    const isDark = document.documentElement.classList.contains("dark");
    const foreColor = isDark ? "#e4e4e7" : "#18181b";
    const bgColor = isDark ? "transparent" : "transparent";

    const VF = await import("vexflow");
    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = VF;

    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    // Set colors for dark/light mode
    context.setFillStyle(foreColor);
    context.setStrokeStyle(foreColor);
    context.setBackgroundFillStyle(bgColor);

    const staveX = 10;
    const staveY = 30;
    const staveWidth = width - 20;

    const stave = new Stave(staveX, staveY, staveWidth);
    stave.addClef(clef);
    stave.setContext(context).draw();

    // Style the stave lines for dark mode
    if (isDark) {
      const svgEl = el.querySelector("svg");
      if (svgEl) {
        svgEl.querySelectorAll("line, path, rect").forEach((line) => {
          const stroke = line.getAttribute("stroke");
          if (stroke && stroke !== "none") {
            line.setAttribute("stroke", foreColor);
          }
          const fill = line.getAttribute("fill");
          if (fill && fill !== "none" && fill !== "transparent") {
            line.setAttribute("fill", foreColor);
          }
        });
      }
    }

    // Build chord as a single StaveNote with multiple keys
    const keys = notes;
    const accidentals: (string | null)[] = keys.map((k) => {
      const { accidental } = parseVexKey(k);
      return accidental;
    });

    const staveNote = new StaveNote({
      keys,
      duration: "w", // whole note
      clef,
    });

    // Add accidentals
    accidentals.forEach((acc, idx) => {
      if (acc) {
        staveNote.addModifier(new Accidental(acc), idx);
      }
    });

    // Style note for dark mode
    if (isDark) {
      staveNote.setStyle({
        fillStyle: foreColor,
        strokeStyle: foreColor,
      });
      staveNote.setLedgerLineStyle({
        fillStyle: foreColor,
        strokeStyle: foreColor,
      });
    }

    const voice = new Voice({
      numBeats: 4,
      beatValue: 4,
    }).setStrict(false);

    voice.addTickables([staveNote]);
    new Formatter().joinVoices([voice]).format([voice], staveWidth - 70);
    voice.draw(context, stave);

    // Final dark mode pass: fix any remaining black elements
    if (isDark) {
      const svgEl = el.querySelector("svg");
      if (svgEl) {
        svgEl.querySelectorAll("*").forEach((node) => {
          const fill = node.getAttribute("fill");
          if (fill === "#000" || fill === "#000000" || fill === "black") {
            node.setAttribute("fill", foreColor);
          }
          const stroke = node.getAttribute("stroke");
          if (stroke === "#000" || stroke === "#000000" || stroke === "black") {
            node.setAttribute("stroke", foreColor);
          }
        });
      }
    }
  }, [notes, clef, width, height, chordName]);

  // Re-render on theme change
  useEffect(() => {
    renderStaff();

    // Watch for dark/light mode changes
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "attributes" && m.attributeName === "class") {
          renderStaff();
        }
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [renderStaff]);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div
        ref={containerRef}
        className="overflow-hidden rounded-lg"
        style={{ width, height }}
      />
      {showLabels && (
        <p className="mt-1 text-center text-xs font-semibold text-muted-foreground">
          {chordName}
        </p>
      )}
    </div>
  );
});
