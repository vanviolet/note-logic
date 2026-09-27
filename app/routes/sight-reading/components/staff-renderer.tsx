// ════════════════════════════════════════════════════════
// StaffRenderer – VexFlow-based music staff rendering
// ════════════════════════════════════════════════════════
//
// Renders a single note (or rest) on a music staff using VexFlow.
// Supports treble and bass clef, accidentals, ledger lines, and
// optional highlighting for interactive quiz use.
//
// This component lazy-loads VexFlow on the client side only.
// ════════════════════════════════════════════════════════

import { memo, useEffect, useRef, useCallback } from "react";
import type { ClefType, StaffNote } from "../types";
import { parseNoteForVex } from "../lib/note-data";

interface StaffRendererProps {
  /** Note to render on the staff */
  note: StaffNote;
  /** Clef to use */
  clef: ClefType;
  /** Width of the SVG container */
  width?: number;
  /** Height of the SVG container */
  height?: number;
  /** Optional CSS class */
  className?: string;
  /** Show note name label below the staff */
  showLabel?: boolean;
  /** Highlight color for the note head */
  highlightColor?: string;
  /** Show the note name on the notehead */
  showNoteNameOnHead?: boolean;
}

export const StaffRenderer = memo(function StaffRenderer({
  note,
  clef,
  width = 200,
  height = 180,
  className,
  showLabel = false,
  highlightColor,
  showNoteNameOnHead = false,
}: StaffRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderStaff = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;

    // Clear previous render
    el.innerHTML = "";

    // Dynamically import VexFlow (client-only)
    const VF = await import("vexflow");
    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = VF;

    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    // Stave positioning
    const staveX = 10;
    const staveY = 20;
    const staveWidth = width - 20;

    const stave = new Stave(staveX, staveY, staveWidth);
    stave.addClef(clef);
    stave.setContext(context).draw();

    // Build the note
    const { accidental } = parseNoteForVex(note.key);
    const staveNote = new StaveNote({
      keys: [note.key],
      duration: note.isRest ? `${note.duration}r` : note.duration,
      clef,
    });

    if (accidental) {
      staveNote.addModifier(new Accidental(accidental));
    }

    // Apply highlight color
    if (highlightColor) {
      staveNote.setStyle({
        fillStyle: highlightColor,
        strokeStyle: highlightColor,
      });
    }

    // Create a voice and add the note
    const voice = new Voice({
      numBeats: 4,
      beatValue: 4,
    }).setStrict(false);

    voice.addTickables([staveNote]);

    new Formatter().joinVoices([voice]).format([voice], staveWidth - 60);
    voice.draw(context, stave);

    // Annotate notename on the head
    if (showNoteNameOnHead && !note.isRest) {
      const bbox = staveNote.getBoundingBox();
      if (bbox) {
        const textX = bbox.getX() + bbox.getW() / 2;
        const textY = bbox.getY() + bbox.getH() / 2 + 4;
        const svgEl = el.querySelector("svg");
        if (svgEl) {
          const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text",
          );
          text.setAttribute("x", String(textX));
          text.setAttribute("y", String(textY));
          text.setAttribute("text-anchor", "middle");
          text.setAttribute("font-size", "10");
          text.setAttribute("font-weight", "bold");
          text.setAttribute("fill", highlightColor ?? "hsl(var(--primary))");
          text.textContent = note.noteName;
          svgEl.appendChild(text);
        }
      }
    }
  }, [note, clef, width, height, highlightColor, showNoteNameOnHead]);

  useEffect(() => {
    renderStaff();
  }, [renderStaff]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="overflow-hidden rounded-lg"
        style={{ width, height }}
      />
      {showLabel && !note.isRest && (
        <p className="mt-1 text-center text-xs font-semibold text-muted-foreground">
          {note.displayName}
        </p>
      )}
    </div>
  );
});

// ── Multi-Note Staff Renderer ──────────────────────────

interface MultiNoteStaffRendererProps {
  notes: StaffNote[];
  clef: ClefType;
  width?: number;
  height?: number;
  className?: string;
  /** Index of note to highlight (for quiz active note) */
  highlightIdx?: number;
  highlightColor?: string;
}

export const MultiNoteStaffRenderer = memo(function MultiNoteStaffRenderer({
  notes,
  clef,
  width = 600,
  height = 180,
  className,
  highlightIdx,
  highlightColor = "hsl(142, 76%, 36%)",
}: MultiNoteStaffRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderStaff = useCallback(async () => {
    const el = containerRef.current;
    if (!el || notes.length === 0) return;

    el.innerHTML = "";

    const VF = await import("vexflow");
    const { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } = VF;

    const renderer = new Renderer(el, Renderer.Backends.SVG);
    renderer.resize(width, height);
    const context = renderer.getContext();

    const stave = new Stave(10, 20, width - 20);
    stave.addClef(clef);
    stave.setContext(context).draw();

    const staveNotes = notes.map((note, idx) => {
      const { accidental } = parseNoteForVex(note.key);
      const sn = new StaveNote({
        keys: [note.key],
        duration: note.duration,
        clef,
      });

      if (accidental) sn.addModifier(new Accidental(accidental));

      if (idx === highlightIdx) {
        sn.setStyle({
          fillStyle: highlightColor,
          strokeStyle: highlightColor,
        });
      }

      return sn;
    });

    const voice = new Voice({
      numBeats: notes.length,
      beatValue: 4,
    }).setStrict(false);

    voice.addTickables(staveNotes);
    new Formatter().joinVoices([voice]).format([voice], width - 80);
    voice.draw(context, stave);
  }, [notes, clef, width, height, highlightIdx, highlightColor]);

  useEffect(() => {
    renderStaff();
  }, [renderStaff]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="overflow-hidden rounded-lg"
        style={{ width: "100%", maxWidth: width, height }}
      />
    </div>
  );
});

// ── Duration Comparison Renderer ───────────────────────

interface DurationComparisonProps {
  durations: { vexDuration: string; label: string; beats: number }[];
  width?: number;
  height?: number;
  className?: string;
}

export const DurationComparisonRenderer = memo(
  function DurationComparisonRenderer({
    durations,
    width = 600,
    height = 180,
    className,
  }: DurationComparisonProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    const render = useCallback(async () => {
      const el = containerRef.current;
      if (!el || durations.length === 0) return;

      el.innerHTML = "";

      const VF = await import("vexflow");
      const { Renderer, Stave, StaveNote, Voice, Formatter, Annotation } = VF;

      const renderer = new Renderer(el, Renderer.Backends.SVG);
      renderer.resize(width, height);
      const context = renderer.getContext();

      const stave = new Stave(10, 20, width - 20);
      stave.addClef("treble");
      stave.setContext(context).draw();

      const totalBeats = durations.reduce((sum, d) => sum + d.beats, 0);

      const staveNotes = durations.map((d) => {
        const sn = new StaveNote({
          keys: ["b/4"],
          duration: d.vexDuration,
          clef: "treble",
        });

        sn.addModifier(
          new Annotation(d.label).setVerticalJustification(
            Annotation.VerticalJustify.BOTTOM,
          ),
        );

        return sn;
      });

      const voice = new Voice({
        numBeats: Math.ceil(totalBeats),
        beatValue: 4,
      }).setStrict(false);

      voice.addTickables(staveNotes);
      new Formatter().joinVoices([voice]).format([voice], width - 80);
      voice.draw(context, stave);
    }, [durations, width, height]);

    useEffect(() => {
      render();
    }, [render]);

    return (
      <div className={className}>
        <div
          ref={containerRef}
          className="overflow-hidden rounded-lg"
          style={{ width: "100%", maxWidth: width, height }}
        />
      </div>
    );
  },
);
