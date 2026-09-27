import * as React from "react";
import { EFFECT_DRAG_MIME } from "../components/studio-effect-palette";
import type { EffectLevel } from "../components/studio-effect-palette";
import type { StudioNote } from "../types";

// ════════════════════════════════════════════════════════
// useStudioEffectDrop
// ════════════════════════════════════════════════════════
//
// Handles HTML5 dragover / drop events on the grid section.
// When a palette item is dropped:
//   - Beat-level → applies patch to ALL notes in that beat column
//   - Note-level → applies patch to ONE specific note
//
// Drop target detection uses data-attributes already on grid cells:
//   data-cell-id="m:{measure}:b:{beat}:s:{string}"
//   data-note-id="<noteId>"
//   data-note-btn="<noteId>"
// ════════════════════════════════════════════════════════

type DropPayload = {
  key: string;
  level: EffectLevel;
  patch: Record<string, unknown>;
};

export function useStudioEffectDrop(opts: {
  gridContainerRef: React.RefObject<HTMLDivElement | null>;
  notesRef: React.RefObject<StudioNote[]>;
  setNotes: React.Dispatch<React.SetStateAction<StudioNote[]>>;
  rememberHistory: (snapshot: StudioNote[]) => void;
  useEditorScore: () => void;
}) {
  const {
    gridContainerRef,
    notesRef,
    setNotes,
    rememberHistory,
    useEditorScore,
  } = opts;

  // Track the currently highlighted drop target for visual effect
  const highlightedRef = React.useRef<Element | null>(null);

  const clearHighlight = React.useCallback(() => {
    if (highlightedRef.current) {
      highlightedRef.current.classList.remove("studio-effect-drop-target");
      // Also remove beat-column highlights
      const grid = gridContainerRef.current;
      if (grid) {
        grid
          .querySelectorAll(".studio-effect-drop-target-beat")
          .forEach((el) =>
            el.classList.remove("studio-effect-drop-target-beat"),
          );
      }
      highlightedRef.current = null;
    }
  }, [gridContainerRef]);

  /**
   * Parse cell-id → { measure, beat, string }
   * Format: "m:{measure}:b:{beat}:s:{string}"
   */
  const parseCellId = React.useCallback(
    (
      cellId: string,
    ): { measure: number; beat: number; string: number } | null => {
      const parts = cellId.split(":");
      // parts = ["m", "{measure}", "b", "{beat}", "s", "{string}"]
      if (parts.length < 6) return null;
      const measure = Number(parts[1]);
      const beat = Number(parts[3]);
      const string = Number(parts[5]);
      if (isNaN(measure) || isNaN(beat) || isNaN(string)) return null;
      return { measure, beat, string };
    },
    [],
  );

  const onDragOver = React.useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      // Only respond to effect palette drags
      if (!e.dataTransfer.types.includes(EFFECT_DRAG_MIME)) return;

      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";

      const target = e.target as HTMLElement;
      const grid = gridContainerRef.current;
      if (!grid) return;

      const level = document.body.getAttribute(
        "data-effect-level",
      ) as EffectLevel | null;

      // Find the closest cell or note button
      const cellEl = target.closest("[data-cell-id]");
      const noteBtn = target.closest("[data-note-btn]");

      clearHighlight();

      if (level === "note" && noteBtn) {
        // Highlight only the note button
        noteBtn.classList.add("studio-effect-drop-target");
        highlightedRef.current = noteBtn;
      } else if (cellEl) {
        const cellId = cellEl.getAttribute("data-cell-id") ?? "";
        const parsed = parseCellId(cellId);

        if (level === "beat" && parsed) {
          // Highlight entire beat column (all cells with same measure:beat)
          const absBeat = parsed.measure * 1000 + parsed.beat;
          grid
            .querySelectorAll(`[data-abs-beat="${absBeat}"]`)
            .forEach((el) =>
              el.classList.add("studio-effect-drop-target-beat"),
            );
          cellEl.classList.add("studio-effect-drop-target");
          highlightedRef.current = cellEl;
        } else {
          // Single cell highlight
          cellEl.classList.add("studio-effect-drop-target");
          highlightedRef.current = cellEl;
        }
      }
    },
    [clearHighlight, gridContainerRef, parseCellId],
  );

  const onDragLeave = React.useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      if (!e.dataTransfer.types.includes(EFFECT_DRAG_MIME)) return;
      // Only clear if leaving the grid entirely
      const related = e.relatedTarget as HTMLElement | null;
      if (related && gridContainerRef.current?.contains(related)) return;
      clearHighlight();
    },
    [clearHighlight, gridContainerRef],
  );

  const onDrop = React.useCallback(
    (e: React.DragEvent<HTMLElement>) => {
      const raw = e.dataTransfer.getData(EFFECT_DRAG_MIME);
      if (!raw) return;

      e.preventDefault();
      clearHighlight();

      let payload: DropPayload;
      try {
        payload = JSON.parse(raw) as DropPayload;
      } catch {
        return;
      }

      const target = e.target as HTMLElement;
      const cellEl = target.closest("[data-cell-id]");
      const noteBtn = target.closest("[data-note-btn]");

      if (payload.level === "note") {
        // Note-level: must drop on a specific note
        const noteId =
          noteBtn?.getAttribute("data-note-btn") ??
          cellEl?.getAttribute("data-note-id");
        if (!noteId) return;

        rememberHistory(notesRef.current);
        setNotes((prev) =>
          prev.map((n) => (n.id === noteId ? { ...n, ...payload.patch } : n)),
        );
        useEditorScore();
      } else if (payload.level === "beat") {
        // Beat-level: apply to all notes in the same measure:beat
        const cellId = cellEl?.getAttribute("data-cell-id") ?? "";
        const parsed = parseCellId(cellId);
        if (!parsed) {
          // Fallback: try to get from note
          const noteId =
            noteBtn?.getAttribute("data-note-btn") ??
            cellEl?.getAttribute("data-note-id");
          if (!noteId) return;

          const targetNote = notesRef.current.find((n) => n.id === noteId);
          if (!targetNote) return;

          rememberHistory(notesRef.current);
          setNotes((prev) =>
            prev.map((n) =>
              n.measure === targetNote.measure && n.beat === targetNote.beat
                ? { ...n, ...payload.patch }
                : n,
            ),
          );
          useEditorScore();
          return;
        }

        rememberHistory(notesRef.current);
        setNotes((prev) =>
          prev.map((n) =>
            n.measure === parsed.measure && n.beat === parsed.beat
              ? { ...n, ...payload.patch }
              : n,
          ),
        );
        useEditorScore();
      }
    },
    [
      clearHighlight,
      notesRef,
      parseCellId,
      rememberHistory,
      setNotes,
      useEditorScore,
    ],
  );

  return {
    onDragOver,
    onDragLeave,
    onDrop,
  } as const;
}
