import * as React from "react";
import { buildCellId } from "../lib/studio-utils";
import type { CellPosition, NoteDuration, StudioNote } from "../types";

// ════════════════════════════════════════════════════════
// useStudioGridInteraction
// Marquee (rubber-band) multi-select, arrow navigation,
// Ctrl+Arrow duplication — all via DOM for performance.
// ════════════════════════════════════════════════════════

export type MarqueeRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export function useStudioGridInteraction(opts: {
  gridContainerRef: React.RefObject<HTMLDivElement | null>;
  notesRef: React.RefObject<StudioNote[]>;
  noteByCell: Map<string, StudioNote>;
  measureCount: number;
  beatsPerMeasure: number;
  stringCount: number;
  defaultDuration: NoteDuration;
  selectedNoteIds: Set<string>;
  selectedCell: CellPosition | null;
  setSelectedNoteIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSelectedCell: React.Dispatch<React.SetStateAction<CellPosition | null>>;
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;
  setNotes: React.Dispatch<React.SetStateAction<StudioNote[]>>;
  rememberHistory: (snapshot: StudioNote[]) => void;
  useEditorScore: () => void;
  onReorderMeasure: (fromMeasure: number, toMeasure: number) => void;
}) {
  const {
    gridContainerRef,
    notesRef,
    noteByCell,
    measureCount,
    beatsPerMeasure,
    stringCount,
    defaultDuration: _defaultDuration,
    selectedNoteIds,
    selectedCell,
    setSelectedNoteIds,
    setSelectedCell,
    setSelectedNoteId,
    setNotes,
    rememberHistory,
    useEditorScore,
    onReorderMeasure,
  } = opts;

  // ── Marquee state (DOM-driven, only rect triggers overlay render) ──
  const [marqueeRect, setMarqueeRect] = React.useState<MarqueeRect | null>(
    null,
  );
  const isDragging = React.useRef(false);
  const dragStart = React.useRef({ x: 0, y: 0 });

  // ── Marquee mouse handlers ─────────────────────────

  const onGridPointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      // Only left-click, not on buttons/inputs/popovers
      if (event.button !== 0) return;
      const target = event.target as HTMLElement;
      if (
        target.closest("button") ||
        target.closest("[data-radix-popper-content-wrapper]") ||
        target.closest("input") ||
        target.closest("[role='menu']") ||
        target.closest("[role='dialog']")
      )
        return;

      const grid = gridContainerRef.current;
      if (!grid) return;

      // Only start marquee if clicking on empty grid area (not a cell with note)
      const noteBtn = target.closest("[data-note-btn]");
      const cellEl = target.closest("[data-cell-id]");

      // If shift-clicking a note cell, toggle it in selection
      if (event.shiftKey && cellEl) {
        const noteId = cellEl.getAttribute("data-note-id");
        if (noteId) {
          event.preventDefault();
          setSelectedNoteIds((prev) => {
            const next = new Set(prev);
            if (next.has(noteId)) next.delete(noteId);
            else next.add(noteId);
            return next;
          });
          return;
        }
      }

      // Don't start marquee on interactive note buttons
      if (noteBtn) return;

      const gridRect = grid.getBoundingClientRect();
      const x = event.clientX - gridRect.left + grid.scrollLeft;
      const y = event.clientY - gridRect.top + grid.scrollTop;

      isDragging.current = true;
      dragStart.current = { x, y };

      // Clear selection unless shift held
      if (!event.shiftKey) {
        setSelectedNoteIds(new Set());
      }

      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [gridContainerRef, setSelectedNoteIds],
  );

  const onGridPointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;

      const grid = gridContainerRef.current;
      if (!grid) return;

      const gridRect = grid.getBoundingClientRect();
      const currentX = event.clientX - gridRect.left + grid.scrollLeft;
      const currentY = event.clientY - gridRect.top + grid.scrollTop;

      const x = Math.min(dragStart.current.x, currentX);
      const y = Math.min(dragStart.current.y, currentY);
      const width = Math.abs(currentX - dragStart.current.x);
      const height = Math.abs(currentY - dragStart.current.y);

      // Only show marquee after 5px movement to avoid accidental drags
      if (width > 5 || height > 5) {
        setMarqueeRect({ x, y, width, height });
      }
    },
    [gridContainerRef],
  );

  const onGridPointerUp = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;
      isDragging.current = false;

      const grid = gridContainerRef.current;
      const rect = marqueeRect;

      if (grid && rect && rect.width > 5 && rect.height > 5) {
        // Find all note buttons within the marquee rectangle
        const gridRect = grid.getBoundingClientRect();
        const matchedIds = new Set<string>(
          event.shiftKey ? selectedNoteIds : [],
        );

        const noteButtons = grid.querySelectorAll("[data-note-btn]");
        for (const btn of noteButtons) {
          const btnRect = btn.getBoundingClientRect();
          // Convert to grid-relative coords
          const bx = btnRect.left - gridRect.left + grid.scrollLeft;
          const by = btnRect.top - gridRect.top + grid.scrollTop;
          const bw = btnRect.width;
          const bh = btnRect.height;

          // Check overlap with marquee
          if (
            bx + bw > rect.x &&
            bx < rect.x + rect.width &&
            by + bh > rect.y &&
            by < rect.y + rect.height
          ) {
            const noteId = btn.getAttribute("data-note-btn");
            if (noteId) matchedIds.add(noteId);
          }
        }

        setSelectedNoteIds(matchedIds);
      }

      setMarqueeRect(null);
      event.currentTarget.releasePointerCapture(event.pointerId);
    },
    [gridContainerRef, marqueeRect, selectedNoteIds, setSelectedNoteIds],
  );

  // ── Apply .studio-multi-selected class via DOM (no re-render) ──
  const prevMultiSelectedRef = React.useRef<Element[]>([]);

  React.useEffect(() => {
    const grid = gridContainerRef.current;
    if (!grid) return;

    // Clear previous
    for (const el of prevMultiSelectedRef.current) {
      el.classList.remove("studio-multi-selected");
    }

    if (selectedNoteIds.size === 0) {
      prevMultiSelectedRef.current = [];
      return;
    }

    // Apply to matched elements
    const next: Element[] = [];
    for (const noteId of selectedNoteIds) {
      const el = grid.querySelector(`[data-note-btn="${noteId}"]`);
      if (el) {
        el.classList.add("studio-multi-selected");
        next.push(el);
      }
      // Also highlight the parent cell
      const cellEl = grid.querySelector(`[data-note-id="${noteId}"]`);
      if (cellEl) {
        cellEl.classList.add("studio-multi-selected");
        next.push(cellEl);
      }
    }

    prevMultiSelectedRef.current = next;
  }, [gridContainerRef, selectedNoteIds]);

  // ── Arrow navigation + Ctrl+Arrow duplicate ────────

  const navigateCell = React.useCallback(
    (direction: "up" | "down" | "left" | "right", duplicate: boolean) => {
      // Find current position from selectedCell or from first selectedNoteId
      let pos: CellPosition | null = selectedCell;

      if (!pos && selectedNoteIds.size > 0) {
        const firstId = selectedNoteIds.values().next().value;
        const note = notesRef.current.find((n) => n.id === firstId);
        if (note) {
          pos = { measure: note.measure, beat: note.beat, string: note.string };
        }
      }

      if (!pos) return;

      let { measure, beat, string: stringIdx } = pos;

      switch (direction) {
        case "up":
          stringIdx = Math.max(0, stringIdx - 1);
          break;
        case "down":
          stringIdx = Math.min(stringCount - 1, stringIdx + 1);
          break;
        case "left": {
          beat -= 1;
          if (beat < 0) {
            measure -= 1;
            beat = beatsPerMeasure - 1;
          }
          if (measure < 0) {
            measure = 0;
            beat = 0;
          }
          break;
        }
        case "right": {
          beat += 1;
          if (beat >= beatsPerMeasure) {
            measure += 1;
            beat = 0;
          }
          if (measure >= measureCount) {
            measure = measureCount - 1;
            beat = beatsPerMeasure - 1;
          }
          break;
        }
      }

      const targetPos: CellPosition = {
        measure,
        beat,
        string: stringIdx,
      };

      if (duplicate) {
        // Duplicate all selected notes in that direction
        const notesToDuplicate =
          selectedNoteIds.size > 0
            ? notesRef.current.filter((n) => selectedNoteIds.has(n.id))
            : selectedCell
              ? ([noteByCell.get(buildCellId(selectedCell))].filter(
                  Boolean,
                ) as StudioNote[])
              : [];

        if (notesToDuplicate.length === 0) return;

        rememberHistory(notesRef.current);

        // Compute offset from the original position
        const offsetMeasure = targetPos.measure - pos.measure;
        const offsetBeat = targetPos.beat - pos.beat;
        const offsetString = targetPos.string - pos.string;

        const newNotes: StudioNote[] = [];
        const newIds: string[] = [];

        for (const note of notesToDuplicate) {
          let newMeasure = note.measure + offsetMeasure;
          let newBeat = note.beat + offsetBeat;
          const newString = note.string + offsetString;

          // Wrap beat across measures
          if (newBeat < 0) {
            newMeasure -= 1;
            newBeat = beatsPerMeasure + newBeat;
          } else if (newBeat >= beatsPerMeasure) {
            newMeasure += 1;
            newBeat = newBeat - beatsPerMeasure;
          }

          // Clamp bounds
          if (newMeasure < 0 || newMeasure >= measureCount) continue;
          if (newString < 0 || newString >= stringCount) continue;

          // Don't overwrite existing notes
          const targetCellId = buildCellId({
            measure: newMeasure,
            beat: newBeat,
            string: newString,
          });
          if (noteByCell.has(targetCellId)) continue;

          const id = `n-${Math.random().toString(36).slice(2, 10)}`;
          newNotes.push({
            ...note,
            id,
            measure: newMeasure,
            beat: newBeat,
            string: newString,
          });
          newIds.push(id);
        }

        if (newNotes.length > 0) {
          setNotes((prev) => [...prev, ...newNotes]);
          setSelectedNoteIds(new Set(newIds));
          setSelectedNoteId(newIds[0]);
          setSelectedCell(targetPos);
          useEditorScore();
        }
      } else {
        // Just navigate
        setSelectedCell(targetPos);
        const cellId = buildCellId(targetPos);
        const existingNote = noteByCell.get(cellId);
        if (existingNote) {
          setSelectedNoteId(existingNote.id);
          setSelectedNoteIds(new Set([existingNote.id]));
        } else {
          setSelectedNoteId(null);
          setSelectedNoteIds(new Set());
        }

        // Scroll the target cell into view
        const grid = gridContainerRef.current;
        if (grid) {
          const cell = grid.querySelector(`[data-cell-id="${cellId}"]`);
          cell?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "nearest",
          });
        }
      }
    },
    [
      beatsPerMeasure,
      gridContainerRef,
      measureCount,
      noteByCell,
      notesRef,
      rememberHistory,
      selectedCell,
      selectedNoteIds,
      setNotes,
      setSelectedCell,
      setSelectedNoteId,
      setSelectedNoteIds,
      stringCount,
      useEditorScore,
    ],
  );

  // ── Bulk actions for context menu ──────────────────

  const deleteSelectedNotes = React.useCallback(() => {
    if (selectedNoteIds.size === 0) return;
    rememberHistory(notesRef.current);
    setNotes((prev) => prev.filter((n) => !selectedNoteIds.has(n.id)));
    setSelectedNoteIds(new Set());
    setSelectedNoteId(null);
    setSelectedCell(null);
    useEditorScore();
  }, [
    notesRef,
    rememberHistory,
    selectedNoteIds,
    setNotes,
    setSelectedCell,
    setSelectedNoteId,
    setSelectedNoteIds,
    useEditorScore,
  ]);

  const selectAllInMeasure = React.useCallback(
    (measure: number) => {
      const ids = new Set<string>();
      for (const note of notesRef.current) {
        if (note.measure === measure) ids.add(note.id);
      }
      setSelectedNoteIds(ids);
    },
    [notesRef, setSelectedNoteIds],
  );

  const clearSelection = React.useCallback(() => {
    setSelectedNoteIds(new Set());
    setSelectedNoteId(null);
  }, [setSelectedNoteId, setSelectedNoteIds]);

  const selectAll = React.useCallback(() => {
    const ids = new Set(notesRef.current.map((n) => n.id));
    setSelectedNoteIds(ids);
  }, [notesRef, setSelectedNoteIds]);

  // ── Copy/paste selected notes ──────────────────────

  const copiedNotesRef = React.useRef<StudioNote[]>([]);

  const copySelectedNotes = React.useCallback(() => {
    const notes = notesRef.current.filter((n) => selectedNoteIds.has(n.id));
    copiedNotesRef.current = notes;
  }, [notesRef, selectedNoteIds]);

  const pasteNotes = React.useCallback(() => {
    const toPaste = copiedNotesRef.current;
    if (toPaste.length === 0) return;

    const target = selectedCell ?? {
      measure: 0,
      beat: 0,
      string: 0,
    };

    // Find offset from the first copied note to the target
    const first = toPaste[0];
    const offsetMeasure = target.measure - first.measure;
    const offsetBeat = target.beat - first.beat;
    const offsetString = target.string - first.string;

    rememberHistory(notesRef.current);

    const newNotes: StudioNote[] = [];
    const newIds: string[] = [];

    for (const note of toPaste) {
      let newMeasure = note.measure + offsetMeasure;
      let newBeat = note.beat + offsetBeat;
      const newString = note.string + offsetString;

      // Wrap beats
      while (newBeat < 0) {
        newMeasure -= 1;
        newBeat += beatsPerMeasure;
      }
      while (newBeat >= beatsPerMeasure) {
        newMeasure += 1;
        newBeat -= beatsPerMeasure;
      }

      if (
        newMeasure < 0 ||
        newMeasure >= measureCount ||
        newString < 0 ||
        newString >= stringCount
      )
        continue;

      const cellId = buildCellId({
        measure: newMeasure,
        beat: newBeat,
        string: newString,
      });
      if (noteByCell.has(cellId)) continue;

      const id = `n-${Math.random().toString(36).slice(2, 10)}`;
      newNotes.push({
        ...note,
        id,
        measure: newMeasure,
        beat: newBeat,
        string: newString,
      });
      newIds.push(id);
    }

    if (newNotes.length > 0) {
      setNotes((prev) => [...prev, ...newNotes]);
      setSelectedNoteIds(new Set(newIds));
      useEditorScore();
    }
  }, [
    beatsPerMeasure,
    measureCount,
    noteByCell,
    notesRef,
    rememberHistory,
    selectedCell,
    setNotes,
    setSelectedNoteIds,
    stringCount,
    useEditorScore,
  ]);

  // ── Bar drag reorder state ──────────────────────────

  const [dragBarFrom, setDragBarFrom] = React.useState<number | null>(null);
  const [dragBarOver, setDragBarOver] = React.useState<number | null>(null);
  const barDragStartPos = React.useRef({ x: 0, y: 0 });
  const barDragActive = React.useRef(false);

  const onBarDragStart = React.useCallback(
    (event: React.PointerEvent<HTMLElement>, measure: number) => {
      event.preventDefault();
      event.stopPropagation();
      barDragStartPos.current = { x: event.clientX, y: event.clientY };
      barDragActive.current = false;
      setDragBarFrom(measure);
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
    },
    [],
  );

  const onBarDragMove = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (dragBarFrom === null) return;

      // Require 5px movement to start drag
      if (!barDragActive.current) {
        const dx = Math.abs(event.clientX - barDragStartPos.current.x);
        const dy = Math.abs(event.clientY - barDragStartPos.current.y);
        if (dx < 5 && dy < 5) return;
        barDragActive.current = true;
      }

      // Find which bar we're hovering over by checking ruler cells
      const grid = gridContainerRef.current;
      if (!grid) return;

      const target = document.elementFromPoint(event.clientX, event.clientY);
      if (!target) return;

      // Look for a bar-label element or ruler cell with beat=0
      const barLabelEl = (target as HTMLElement).closest("[data-bar-drag]");
      if (barLabelEl) {
        const overMeasure = Number(barLabelEl.getAttribute("data-bar-drag"));
        if (!Number.isNaN(overMeasure) && overMeasure !== dragBarFrom) {
          setDragBarOver(overMeasure);
        }
        return;
      }

      // Also check ruler cells (beat=0 shows bar number)
      const rulerEl = (target as HTMLElement).closest("[data-abs-beat]");
      if (rulerEl) {
        const absBeat = Number(rulerEl.getAttribute("data-abs-beat"));
        const measure = Math.floor(absBeat / 1000);
        const beat = absBeat % 1000;
        if (beat === 0 && measure !== dragBarFrom) {
          setDragBarOver(measure);
        }
      }
    },
    [dragBarFrom, gridContainerRef],
  );

  const onBarDragEnd = React.useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      (event.target as HTMLElement).releasePointerCapture(event.pointerId);
      if (
        dragBarFrom !== null &&
        dragBarOver !== null &&
        dragBarFrom !== dragBarOver &&
        barDragActive.current
      ) {
        onReorderMeasure(dragBarFrom, dragBarOver);
      }
      setDragBarFrom(null);
      setDragBarOver(null);
      barDragActive.current = false;
    },
    [dragBarFrom, dragBarOver, onReorderMeasure],
  );

  // ── Arrow key + Ctrl+Arrow + Ctrl+C/V listener ────

  const navigateCellRef = React.useRef(navigateCell);
  navigateCellRef.current = navigateCell;

  const copyRef = React.useRef(copySelectedNotes);
  copyRef.current = copySelectedNotes;

  const pasteRef = React.useRef(pasteNotes);
  pasteRef.current = pasteNotes;

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      // ── Arrow keys ─────────────────────────────
      const ARROWS: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
      };

      const direction = ARROWS[event.key];
      if (direction) {
        event.preventDefault();
        const duplicate = event.ctrlKey || event.metaKey;
        navigateCellRef.current(direction, duplicate);
        return;
      }

      // ── Ctrl+C — copy ─────────────────────────
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "c" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        copyRef.current();
        return;
      }

      // ── Ctrl+V — paste ────────────────────────
      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "v" &&
        !event.shiftKey
      ) {
        event.preventDefault();
        pasteRef.current();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return {
    // Marquee
    marqueeRect,
    onGridPointerDown,
    onGridPointerMove,
    onGridPointerUp,
    // Navigation
    navigateCell,
    // Actions
    deleteSelectedNotes,
    selectAllInMeasure,
    clearSelection,
    selectAll,
    copySelectedNotes,
    pasteNotes,
    hasCopiedNotes: copiedNotesRef.current.length > 0,
    // Bar drag reorder
    dragBarFrom,
    dragBarOver,
    onBarDragStart,
    onBarDragMove,
    onBarDragEnd,
  } as const;
}
