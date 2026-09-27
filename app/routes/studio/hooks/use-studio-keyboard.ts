import * as React from "react";
import { buildCellId, NOTE_DEFAULTS } from "../lib/studio-utils";
import type { CellPosition, NoteDuration, StudioNote } from "../types";

// ════════════════════════════════════════════════════════
// useStudioKeyboard
// ════════════════════════════════════════════════════════

export function useStudioKeyboard(opts: {
  selectedCell: CellPosition | null;
  selectedNoteId: string | null;
  selectedNoteIds: Set<string>;
  defaultDuration: NoteDuration;
  noteByCell: Map<string, StudioNote>;
  notesRef: React.RefObject<StudioNote[]>;

  // sidebar state read-only
  sidebarHasFocus: boolean;
  activeSidebarItemKey: string;

  // mutators
  setNotes: React.Dispatch<React.SetStateAction<StudioNote[]>>;
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedNoteIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  rememberHistory: (snapshot: StudioNote[]) => void;
  useEditorScore: () => void;
  undo: () => void;
  redo: () => void;
}) {
  const {
    selectedCell,
    selectedNoteId,
    selectedNoteIds,
    defaultDuration,
    noteByCell,
    notesRef,
    sidebarHasFocus,
    activeSidebarItemKey,
    setNotes,
    setSelectedNoteId,
    setSelectedNoteIds,
    rememberHistory,
    useEditorScore,
    undo,
    redo,
  } = opts;

  const fretInputTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const fretInputFreshRef = React.useRef(true);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const tag = (event.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      const activeCellNote = selectedCell
        ? noteByCell.get(buildCellId(selectedCell))
        : null;
      const currentNoteId = selectedNoteId ?? activeCellNote?.id ?? null;

      // ── Fret digit input ─────────────────────────
      if (event.key >= "0" && event.key <= "9") {
        event.preventDefault();
        const digit = Number(event.key);
        const isFresh = fretInputFreshRef.current;
        if (fretInputTimerRef.current) clearTimeout(fretInputTimerRef.current);
        rememberHistory(notesRef.current);

        if (currentNoteId) {
          setNotes((prev) =>
            prev.map((n) => {
              if (n.id !== currentNoteId) return n;
              const raw = isFresh ? digit : Number(`${n.fret}${digit}`);
              const fret = raw > 24 ? digit : Math.max(0, raw);
              return { ...n, fret };
            }),
          );
          setSelectedNoteId(currentNoteId);
        } else if (selectedCell) {
          const id = `n-${Math.random().toString(36).slice(2, 10)}`;
          setNotes((prev) => [
            ...prev.filter(
              (n) =>
                !(
                  n.measure === selectedCell.measure &&
                  n.beat === selectedCell.beat &&
                  n.string === selectedCell.string
                ),
            ),
            {
              id,
              measure: selectedCell.measure,
              beat: selectedCell.beat,
              string: selectedCell.string,
              fret: digit,
              duration: defaultDuration,
              dynamic: "mf",
              beatEffect: "none",
              noteEffect: "none",
              vibrato: "none",
              slideIn: "none",
              slideOut: "none",
              isBend: false,
              isLetRing: false,
              isPalmMute: false,
              isDead: false,
              isStaccato: false,
              ...NOTE_DEFAULTS,
            },
          ]);
          setSelectedNoteId(id);
        } else {
          return;
        }

        useEditorScore();
        fretInputFreshRef.current = false;
        fretInputTimerRef.current = setTimeout(() => {
          fretInputFreshRef.current = true;
        }, 800);
      }

      // ── Delete note(s) ─────────────────────────
      if (event.key === "Backspace" || event.key === "Delete") {
        const activeKind = activeSidebarItemKey.split(":")[0] ?? "";
        if (sidebarHasFocus && activeKind !== "note") return;

        // Bulk delete if multi-selected
        if (selectedNoteIds.size > 0) {
          event.preventDefault();
          rememberHistory(notesRef.current);
          setNotes((prev) => prev.filter((n) => !selectedNoteIds.has(n.id)));
          setSelectedNoteIds(new Set());
          setSelectedNoteId(null);
          useEditorScore();
          return;
        }

        if (!currentNoteId) return;
        event.preventDefault();
        rememberHistory(notesRef.current);
        setNotes((prev) => prev.filter((n) => n.id !== currentNoteId));
        setSelectedNoteId(null);
        useEditorScore();
      }

      // ── Escape — clear selection ─────────────────
      if (event.key === "Escape") {
        event.preventDefault();
        setSelectedNoteIds(new Set());
        setSelectedNoteId(null);
      }

      // ── Undo / Redo ─────────────────────────────
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        if (event.shiftKey) redo();
        else undo();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "y") {
        event.preventDefault();
        redo();
      }

      // ── Ctrl+A — select all ─────────────────────
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "a") {
        event.preventDefault();
        setSelectedNoteIds(new Set(notesRef.current.map((n) => n.id)));
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (fretInputTimerRef.current) clearTimeout(fretInputTimerRef.current);
    };
  }, [
    activeSidebarItemKey,
    defaultDuration,
    noteByCell,
    notesRef,
    redo,
    rememberHistory,
    selectedCell,
    selectedNoteId,
    selectedNoteIds,
    setNotes,
    setSelectedNoteId,
    setSelectedNoteIds,
    sidebarHasFocus,
    undo,
    useEditorScore,
  ]);
}
