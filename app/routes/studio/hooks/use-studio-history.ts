import * as React from "react";
import type { StudioNote } from "../types";

/**
 * Manages undo/redo history for studio notes.
 *
 * Keeps a stack of snapshots (max 200) and provides
 * `rememberHistory`, `undo`, and `redo` callbacks.
 */
export function useStudioHistory(
  notesRef: React.RefObject<StudioNote[]>,
  setNotes: React.Dispatch<React.SetStateAction<StudioNote[]>>,
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>,
  useEditorScore: () => void,
) {
  const historyRef = React.useRef<StudioNote[][]>([]);
  const redoRef = React.useRef<StudioNote[][]>([]);
  const isRestoringRef = React.useRef(false);

  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);

  /** Push current snapshot onto the history stack (before mutation). */
  const rememberHistory = React.useCallback((snapshot: StudioNote[]) => {
    if (isRestoringRef.current) return;
    historyRef.current.push(snapshot);
    if (historyRef.current.length > 200) historyRef.current.shift();
    redoRef.current = [];
  }, []);

  /** Refresh canUndo / canRedo flags — call after notes change. */
  const refreshFlags = React.useCallback(() => {
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(redoRef.current.length > 0);
  }, []);

  const undo = React.useCallback(() => {
    const previous = historyRef.current.pop();
    if (!previous) return;
    isRestoringRef.current = true;
    redoRef.current.push(notesRef.current);
    setNotes(previous);
    window.setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
    setSelectedNoteId(null);
    useEditorScore();
  }, [notesRef, setNotes, setSelectedNoteId, useEditorScore]);

  const redo = React.useCallback(() => {
    const next = redoRef.current.pop();
    if (!next) return;
    isRestoringRef.current = true;
    historyRef.current.push(notesRef.current);
    setNotes(next);
    window.setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
    setSelectedNoteId(null);
    useEditorScore();
  }, [notesRef, setNotes, setSelectedNoteId, useEditorScore]);

  /** Reset both stacks (e.g. when loading a project). */
  const resetHistory = React.useCallback(() => {
    historyRef.current = [];
    redoRef.current = [];
    setCanUndo(false);
    setCanRedo(false);
  }, []);

  return {
    canUndo,
    canRedo,
    rememberHistory,
    refreshFlags,
    undo,
    redo,
    resetHistory,
    historyRef,
    redoRef,
    isRestoringRef,
  } as const;
}
