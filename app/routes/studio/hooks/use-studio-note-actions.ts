import * as React from "react";
import { buildCellId, NOTE_DEFAULTS } from "../lib/studio-utils";
import type { CellPosition, NoteDuration, StudioNote } from "../types";

/**
 * Note-level CRUD callbacks for the studio grid.
 */
export function useStudioNoteActions(
  notesRef: React.RefObject<StudioNote[]>,
  noteByCell: Map<string, StudioNote>,
  defaultDuration: NoteDuration,
  selectedNoteId: string | null,
  setNotes: React.Dispatch<React.SetStateAction<StudioNote[]>>,
  setSelectedCell: React.Dispatch<React.SetStateAction<CellPosition | null>>,
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>,
  setDefaultDuration: React.Dispatch<React.SetStateAction<NoteDuration>>,
  rememberHistory: (snapshot: StudioNote[]) => void,
  useEditorScore: () => void,
) {
  const addOrSelectCell = React.useCallback(
    (position: CellPosition) => {
      setSelectedCell(position);
      const cellId = buildCellId(position);
      const existing = noteByCell.get(cellId);
      if (existing) {
        setSelectedNoteId(existing.id);
        return;
      }
      rememberHistory(notesRef.current);
      const id = `n-${Math.random().toString(36).slice(2, 10)}`;
      setNotes((prev) => [
        ...prev,
        {
          id,
          measure: position.measure,
          beat: position.beat,
          string: position.string,
          fret: 0,
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
      useEditorScore();
    },
    [
      defaultDuration,
      noteByCell,
      notesRef,
      rememberHistory,
      setNotes,
      setSelectedCell,
      setSelectedNoteId,
      useEditorScore,
    ],
  );

  const updateDuration = React.useCallback(
    (duration: NoteDuration) => {
      setDefaultDuration(duration);
      if (!selectedNoteId) return;
      rememberHistory(notesRef.current);
      setNotes((prev) =>
        prev.map((n) => (n.id === selectedNoteId ? { ...n, duration } : n)),
      );
      useEditorScore();
    },
    [
      notesRef,
      rememberHistory,
      selectedNoteId,
      setDefaultDuration,
      setNotes,
      useEditorScore,
    ],
  );

  const updateNoteById = React.useCallback(
    (noteId: string, updates: Partial<StudioNote>) => {
      rememberHistory(notesRef.current);

      // Pre-check which beat-level keys are present so we can skip
      // notes that don't need any changes (structural sharing).
      const hasBeatUpdates =
        updates.duration !== undefined ||
        updates.dynamic !== undefined ||
        updates.vibrato !== undefined ||
        updates.beatEffect !== undefined ||
        updates.tuplet !== undefined ||
        updates.tremoloMark !== undefined ||
        updates.graceType !== undefined ||
        updates.fermata !== undefined ||
        updates.octaveShift !== undefined ||
        updates.wahMode !== undefined ||
        updates.strokeType !== undefined ||
        updates.arpeggioType !== undefined ||
        updates.chordName !== undefined ||
        updates.beatText !== undefined;

      setNotes((prev) => {
        const target = prev.find((n) => n.id === noteId);
        if (!target) return prev;

        return prev.map((note) => {
          const isTarget = note.id === noteId;
          const sameBeat =
            note.measure === target.measure && note.beat === target.beat;

          // ── Skip notes that don't need changes (keep same ref) ────
          if (!isTarget && (!sameBeat || !hasBeatUpdates)) return note;

          const next = { ...note };

          // ── Note-level: only update the specific note ──────────────
          if (isTarget) {
            if (updates.fret !== undefined)
              next.fret = Math.max(0, Math.min(24, updates.fret));
            if (updates.noteEffect !== undefined)
              next.noteEffect = updates.noteEffect;
            if (updates.isDead !== undefined) next.isDead = updates.isDead;
            if (updates.isBend !== undefined) next.isBend = updates.isBend;
            if (updates.isPalmMute !== undefined)
              next.isPalmMute = updates.isPalmMute;
            if (updates.isLetRing !== undefined)
              next.isLetRing = updates.isLetRing;
            if (updates.isStaccato !== undefined)
              next.isStaccato = updates.isStaccato;
            if (updates.slideIn !== undefined) next.slideIn = updates.slideIn;
            if (updates.slideOut !== undefined)
              next.slideOut = updates.slideOut;
            if (updates.isTied !== undefined) next.isTied = updates.isTied;
            if (updates.isGhost !== undefined) next.isGhost = updates.isGhost;
            if (updates.isLeftHandTap !== undefined)
              next.isLeftHandTap = updates.isLeftHandTap;
            if (updates.harmonicType !== undefined)
              next.harmonicType = updates.harmonicType;
            if (updates.trillFret !== undefined)
              next.trillFret = updates.trillFret;
            if (updates.trillSpeed !== undefined)
              next.trillSpeed = updates.trillSpeed;
            if (updates.accent !== undefined) next.accent = updates.accent;
            if (updates.ornament !== undefined)
              next.ornament = updates.ornament;
            if (updates.pickSlide !== undefined)
              next.pickSlide = updates.pickSlide;
          }

          // ── Beat-level: propagate to all notes in the same beat ────
          if (sameBeat && hasBeatUpdates) {
            if (updates.duration !== undefined)
              next.duration = updates.duration;
            if (updates.dynamic !== undefined) next.dynamic = updates.dynamic;
            if (updates.vibrato !== undefined) next.vibrato = updates.vibrato;
            if (updates.beatEffect !== undefined)
              next.beatEffect = updates.beatEffect;
            if (updates.tuplet !== undefined) next.tuplet = updates.tuplet;
            if (updates.tremoloMark !== undefined)
              next.tremoloMark = updates.tremoloMark;
            if (updates.graceType !== undefined)
              next.graceType = updates.graceType;
            if (updates.fermata !== undefined) next.fermata = updates.fermata;
            if (updates.octaveShift !== undefined)
              next.octaveShift = updates.octaveShift;
            if (updates.wahMode !== undefined) next.wahMode = updates.wahMode;
            if (updates.strokeType !== undefined)
              next.strokeType = updates.strokeType;
            if (updates.arpeggioType !== undefined)
              next.arpeggioType = updates.arpeggioType;
            if (updates.chordName !== undefined)
              next.chordName = updates.chordName;
            if (updates.beatText !== undefined)
              next.beatText = updates.beatText;
          }

          return next;
        });
      });
      setSelectedNoteId(noteId);
      useEditorScore();
    },
    [notesRef, rememberHistory, setNotes, setSelectedNoteId, useEditorScore],
  );

  const removeNoteById = React.useCallback(
    (noteId: string) => {
      rememberHistory(notesRef.current);
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
      setSelectedNoteId((prev) => (prev === noteId ? null : prev));
      useEditorScore();
    },
    [notesRef, rememberHistory, setNotes, setSelectedNoteId, useEditorScore],
  );

  const removeSelectedNote = React.useCallback(() => {
    if (!selectedNoteId) return;
    rememberHistory(notesRef.current);
    setNotes((prev) => prev.filter((n) => n.id !== selectedNoteId));
    setSelectedNoteId(null);
    useEditorScore();
  }, [
    notesRef,
    rememberHistory,
    selectedNoteId,
    setNotes,
    setSelectedNoteId,
    useEditorScore,
  ]);

  return {
    addOrSelectCell,
    updateDuration,
    updateNoteById,
    removeNoteById,
    removeSelectedNote,
  } as const;
}
