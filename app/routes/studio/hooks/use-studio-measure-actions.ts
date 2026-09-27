import * as React from "react";
import type { SidebarGroup } from "../lib/studio-types";
import type { StudioNote } from "../types";

/** Move element at index `from` to index `to`, returning a new array. */
function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const next = arr.slice();
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/**
 * Measure-level CRUD callbacks for the studio.
 *
 * Covers: add/remove/duplicate/clear bars, bulk delete,
 * copy/paste bars, change measure count & time signature.
 */
export function useStudioMeasureActions(opts: {
  measureCount: number;
  beatsPerMeasure: number;
  selectedMeasure: number;
  activeSidebarBar: number;
  notesRef: React.RefObject<StudioNote[]>;
  copiedMeasureRef: React.MutableRefObject<StudioNote[] | null>;
  sidebarCopyMeasureRef: React.MutableRefObject<number | null>;
  setMeasureCount: React.Dispatch<React.SetStateAction<number>>;
  setBeatsPerMeasure: React.Dispatch<React.SetStateAction<number>>;
  setTimeSignatureNumerator: React.Dispatch<React.SetStateAction<number>>;
  setNotes: React.Dispatch<React.SetStateAction<StudioNote[]>>;
  setBarNames: React.Dispatch<React.SetStateAction<string[]>>;
  setBarGroups: React.Dispatch<React.SetStateAction<SidebarGroup[]>>;
  setPlayheadBeat: React.Dispatch<React.SetStateAction<number>>;
  setHasCopiedMeasure: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedCell: React.Dispatch<
    React.SetStateAction<{
      measure: number;
      beat: number;
      string: number;
    } | null>
  >;
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveSidebarBar: React.Dispatch<React.SetStateAction<number>>;
  setSelectedSidebarBars: React.Dispatch<React.SetStateAction<number[]>>;
  rememberHistory: (snapshot: StudioNote[]) => void;
  useEditorScore: () => void;
  setAlphaStatus: (status: string) => void;
}) {
  const {
    measureCount,
    beatsPerMeasure,
    selectedMeasure,
    activeSidebarBar,
    notesRef,
    copiedMeasureRef,
    sidebarCopyMeasureRef,
    setMeasureCount,
    setBeatsPerMeasure,
    setTimeSignatureNumerator,
    setNotes,
    setBarNames,
    setBarGroups,
    setPlayheadBeat,
    setHasCopiedMeasure,
    setSelectedCell,
    setSelectedNoteId,
    setActiveSidebarBar,
    setSelectedSidebarBars,
    rememberHistory,
    useEditorScore,
    setAlphaStatus,
  } = opts;

  // ── Sort helper ──────────────────────────────────
  const sortNotes = (a: StudioNote, b: StudioNote) => {
    if (a.measure !== b.measure) return a.measure - b.measure;
    if (a.beat !== b.beat) return a.beat - b.beat;
    return a.string - b.string;
  };

  // ── Change measure count ─────────────────────────
  const handleChangeMeasureCount = React.useCallback(
    (next: number) => {
      rememberHistory(notesRef.current);
      setMeasureCount(next);
      setNotes((prev) => prev.filter((n) => n.measure < next));
      setBarNames((prev) => {
        if (next <= prev.length) return prev.slice(0, next);
        return [
          ...prev,
          ...Array.from(
            { length: next - prev.length },
            (_, i) => `Bar ${prev.length + i + 1}`,
          ),
        ];
      });
      setPlayheadBeat((prev) =>
        Math.min(prev, Math.max(0, next * beatsPerMeasure - 1)),
      );
      setBarGroups((prev) =>
        prev.map((g) => ({ ...g, bars: g.bars.filter((b) => b < next) })),
      );
      useEditorScore();
    },
    [
      beatsPerMeasure,
      notesRef,
      rememberHistory,
      setBarGroups,
      setBarNames,
      setMeasureCount,
      setNotes,
      setPlayheadBeat,
      useEditorScore,
    ],
  );

  // ── Change beats per measure ─────────────────────
  const handleChangeBeatsPerMeasure = React.useCallback(
    (next: number) => {
      rememberHistory(notesRef.current);
      setBeatsPerMeasure(next);
      setTimeSignatureNumerator(next);
      setNotes((prev) => prev.map((n) => ({ ...n, beat: n.beat % next })));
      setPlayheadBeat((prev) =>
        Math.min(prev, Math.max(0, measureCount * next - 1)),
      );
      useEditorScore();
    },
    [
      measureCount,
      notesRef,
      rememberHistory,
      setBeatsPerMeasure,
      setNotes,
      setPlayheadBeat,
      setTimeSignatureNumerator,
      useEditorScore,
    ],
  );

  // ── Clear measure ────────────────────────────────
  const clearCurrentMeasure = React.useCallback(() => {
    rememberHistory(notesRef.current);
    setNotes((prev) => prev.filter((n) => n.measure !== selectedMeasure));
    setSelectedNoteId(null);
    useEditorScore();
  }, [
    notesRef,
    rememberHistory,
    selectedMeasure,
    setNotes,
    setSelectedNoteId,
    useEditorScore,
  ]);

  // ── Duplicate current measure ────────────────────
  const duplicateCurrentMeasure = React.useCallback(() => {
    if (selectedMeasure >= measureCount - 1) return;
    rememberHistory(notesRef.current);
    setNotes((prev) => {
      const source = prev.filter((n) => n.measure === selectedMeasure);
      const duplicated = source.map((n) => ({
        ...n,
        id: `n-${Math.random().toString(36).slice(2, 10)}`,
        measure: selectedMeasure + 1,
      }));
      const rest = prev.filter((n) => n.measure !== selectedMeasure + 1);
      return [...rest, ...duplicated].sort(sortNotes);
    });
    useEditorScore();
  }, [
    measureCount,
    notesRef,
    rememberHistory,
    selectedMeasure,
    setNotes,
    useEditorScore,
  ]);

  // ── Copy / Paste current measure ─────────────────
  const copyCurrentMeasure = React.useCallback(() => {
    const copied = notesRef.current
      .filter((n) => n.measure === selectedMeasure)
      .map((n) => ({ ...n }));
    copiedMeasureRef.current = copied;
    setHasCopiedMeasure(copied.length > 0);
    setAlphaStatus(
      copied.length > 0
        ? `Copied ${copied.length} note(s) from bar ${selectedMeasure + 1}`
        : `Bar ${selectedMeasure + 1} is empty`,
    );
  }, [
    copiedMeasureRef,
    notesRef,
    selectedMeasure,
    setAlphaStatus,
    setHasCopiedMeasure,
  ]);

  const pasteToCurrentMeasure = React.useCallback(() => {
    const copied = copiedMeasureRef.current;
    if (!copied || copied.length === 0) return;
    rememberHistory(notesRef.current);
    setNotes((prev) => {
      const rest = prev.filter((n) => n.measure !== selectedMeasure);
      const pasted = copied.map((n) => ({
        ...n,
        id: `n-${Math.random().toString(36).slice(2, 10)}`,
        measure: selectedMeasure,
      }));
      return [...rest, ...pasted].sort(sortNotes);
    });
    useEditorScore();
    setAlphaStatus(
      `Pasted ${copied.length} note(s) to bar ${selectedMeasure + 1}`,
    );
  }, [
    copiedMeasureRef,
    notesRef,
    rememberHistory,
    selectedMeasure,
    setAlphaStatus,
    setNotes,
    useEditorScore,
  ]);

  // ── Clear / Duplicate / Delete at arbitrary measure ──
  const clearMeasureAt = React.useCallback(
    (measure: number) => {
      rememberHistory(notesRef.current);
      setNotes((prev) => prev.filter((n) => n.measure !== measure));
      setSelectedNoteId(null);
      useEditorScore();
    },
    [notesRef, rememberHistory, setNotes, setSelectedNoteId, useEditorScore],
  );

  const duplicateMeasureAt = React.useCallback(
    (measure: number) => {
      const nextCount = Math.min(128, measureCount + 1);
      if (nextCount === measureCount) return;
      rememberHistory(notesRef.current);
      setMeasureCount(nextCount);
      setNotes((prev) => {
        const shifted = prev.map((n) =>
          n.measure > measure ? { ...n, measure: n.measure + 1 } : n,
        );
        const cloned = prev
          .filter((n) => n.measure === measure)
          .map((n) => ({
            ...n,
            id: `n-${Math.random().toString(36).slice(2, 10)}`,
            measure: measure + 1,
          }));
        return [...shifted, ...cloned].sort(sortNotes);
      });
      setBarNames((prev) => {
        const draft = [...prev];
        draft.splice(
          measure + 1,
          0,
          `${(prev[measure] ?? `Bar ${measure + 1}`).trim()} Copy`,
        );
        return draft.slice(0, nextCount);
      });
      setBarGroups((prev) =>
        prev.map((g) => ({
          ...g,
          bars: g.bars.flatMap((b) => {
            if (b === measure) return [b, b + 1];
            if (b > measure) return [b + 1];
            return [b];
          }),
        })),
      );
      setActiveSidebarBar(Math.min(nextCount - 1, measure + 1));
      setSelectedCell((prev) => {
        if (!prev) return prev;
        return prev.measure > measure
          ? { ...prev, measure: prev.measure + 1 }
          : prev;
      });
      useEditorScore();
    },
    [
      measureCount,
      notesRef,
      rememberHistory,
      setActiveSidebarBar,
      setBarGroups,
      setBarNames,
      setMeasureCount,
      setNotes,
      setSelectedCell,
      useEditorScore,
    ],
  );

  const deleteMeasureAt = React.useCallback(
    (measure: number) => {
      if (measureCount <= 1) return;
      rememberHistory(notesRef.current);
      setMeasureCount((prev) => Math.max(1, prev - 1));
      setNotes((prev) =>
        prev
          .filter((n) => n.measure !== measure)
          .map((n) =>
            n.measure > measure ? { ...n, measure: n.measure - 1 } : n,
          ),
      );
      setBarNames((prev) => {
        const draft = [...prev];
        draft.splice(measure, 1);
        return draft.length > 0 ? draft : ["Bar 1"];
      });
      setBarGroups((prev) =>
        prev.map((g) => ({
          ...g,
          bars: g.bars
            .filter((b) => b !== measure)
            .map((b) => (b > measure ? b - 1 : b)),
        })),
      );
      setActiveSidebarBar((prev) =>
        Math.max(
          0,
          Math.min(measureCount - 2, prev > measure ? prev - 1 : prev),
        ),
      );
      setSelectedCell((prev) => {
        if (!prev) return prev;
        if (prev.measure === measure) return null;
        return prev.measure > measure
          ? { ...prev, measure: prev.measure - 1 }
          : prev;
      });
      setSelectedNoteId(null);
      useEditorScore();
    },
    [
      measureCount,
      notesRef,
      rememberHistory,
      setActiveSidebarBar,
      setBarGroups,
      setBarNames,
      setMeasureCount,
      setNotes,
      setSelectedCell,
      setSelectedNoteId,
      useEditorScore,
    ],
  );

  const addBarBelow = React.useCallback(
    (measure: number) => {
      const nextCount = Math.min(128, measureCount + 1);
      if (nextCount === measureCount) return;
      rememberHistory(notesRef.current);
      setMeasureCount(nextCount);
      setNotes((prev) =>
        prev.map((n) =>
          n.measure > measure ? { ...n, measure: n.measure + 1 } : n,
        ),
      );
      setBarNames((prev) => {
        const draft = [...prev];
        draft.splice(measure + 1, 0, `Bar ${measure + 2}`);
        return draft;
      });
      setBarGroups((prev) =>
        prev.map((g) => ({
          ...g,
          bars: g.bars.map((b) => (b > measure ? b + 1 : b)),
        })),
      );
      setActiveSidebarBar(Math.min(nextCount - 1, measure + 1));
      useEditorScore();
    },
    [
      measureCount,
      notesRef,
      rememberHistory,
      setActiveSidebarBar,
      setBarGroups,
      setBarNames,
      setMeasureCount,
      setNotes,
      useEditorScore,
    ],
  );

  const pasteCopiedBarTo = React.useCallback(
    (targetMeasure: number) => {
      const sourceMeasure = sidebarCopyMeasureRef.current ?? activeSidebarBar;
      if (sourceMeasure < 0 || sourceMeasure >= measureCount) return;
      const nextCount = Math.min(128, measureCount + 1);
      if (nextCount === measureCount) return;

      rememberHistory(notesRef.current);
      setMeasureCount(nextCount);
      setNotes((prev) => {
        const shifted = prev.map((n) =>
          n.measure > targetMeasure ? { ...n, measure: n.measure + 1 } : n,
        );
        const cloned = prev
          .filter((n) => n.measure === sourceMeasure)
          .map((n) => ({
            ...n,
            id: `n-${Math.random().toString(36).slice(2, 10)}`,
            measure: targetMeasure + 1,
          }));
        return [...shifted, ...cloned].sort(sortNotes);
      });
      setBarNames((prev) => {
        const draft = [...prev];
        const name = prev[sourceMeasure] ?? `Bar ${sourceMeasure + 1}`;
        draft.splice(targetMeasure + 1, 0, `${name} Copy`);
        return draft;
      });
      setBarGroups((prev) =>
        prev.map((g) => ({
          ...g,
          bars: g.bars.flatMap((b) => {
            if (b === sourceMeasure) {
              const shifted =
                sourceMeasure > targetMeasure
                  ? sourceMeasure + 1
                  : sourceMeasure;
              return [shifted, targetMeasure + 1];
            }
            return b > targetMeasure ? [b + 1] : [b];
          }),
        })),
      );
      setActiveSidebarBar(Math.min(nextCount - 1, targetMeasure + 1));
      setSelectedCell((prev) => {
        if (!prev) return prev;
        return prev.measure > targetMeasure
          ? { ...prev, measure: prev.measure + 1 }
          : prev;
      });
      useEditorScore();
    },
    [
      activeSidebarBar,
      measureCount,
      notesRef,
      rememberHistory,
      setActiveSidebarBar,
      setBarGroups,
      setBarNames,
      setMeasureCount,
      setNotes,
      setSelectedCell,
      sidebarCopyMeasureRef,
      useEditorScore,
    ],
  );

  // ── Bulk delete measures ─────────────────────────
  const deleteMeasuresBulk = React.useCallback(
    (measures: number[]) => {
      const unique = Array.from(
        new Set(measures.filter(Number.isFinite).map(Math.floor)),
      )
        .filter((m) => m >= 0 && m < measureCount)
        .sort((a, b) => a - b);
      if (unique.length === 0) return;

      const maxDel = Math.max(0, measureCount - 1);
      const deleting = unique.slice(0, maxDel);
      if (deleting.length === 0) return;

      const deleteSet = new Set(deleting);
      const shiftDown = (m: number) =>
        deleting.reduce((c, d) => (d < m ? c + 1 : c), 0);

      rememberHistory(notesRef.current);
      setMeasureCount((prev) => Math.max(1, prev - deleting.length));
      setNotes((prev) =>
        prev
          .filter((n) => !deleteSet.has(n.measure))
          .map((n) => ({ ...n, measure: n.measure - shiftDown(n.measure) })),
      );
      setBarNames((prev) => {
        const next = prev.filter((_, i) => !deleteSet.has(i));
        return next.length === 0 ? ["Bar 1"] : next;
      });
      setBarGroups((prev) =>
        prev.map((g) => ({
          ...g,
          bars: g.bars
            .filter((b) => !deleteSet.has(b))
            .map((b) => b - shiftDown(b)),
        })),
      );
      setSelectedCell((prev) => {
        if (!prev) return prev;
        if (deleteSet.has(prev.measure)) return null;
        return { ...prev, measure: prev.measure - shiftDown(prev.measure) };
      });
      setActiveSidebarBar((prev) => {
        if (deleteSet.has(prev)) return Math.max(0, prev - shiftDown(prev) - 1);
        return Math.max(0, prev - shiftDown(prev));
      });
      setSelectedSidebarBars((prev) =>
        prev.filter((m) => !deleteSet.has(m)).map((m) => m - shiftDown(m)),
      );
      useEditorScore();
    },
    [
      measureCount,
      notesRef,
      rememberHistory,
      setActiveSidebarBar,
      setBarGroups,
      setBarNames,
      setMeasureCount,
      setNotes,
      setSelectedCell,
      setSelectedSidebarBars,
      useEditorScore,
    ],
  );

  // ── Reorder measure (drag bar) ────────────────────

  const reorderMeasure = React.useCallback(
    (fromMeasure: number, toMeasure: number) => {
      if (
        fromMeasure === toMeasure ||
        fromMeasure < 0 ||
        fromMeasure >= measureCount ||
        toMeasure < 0 ||
        toMeasure >= measureCount
      )
        return;

      const order = Array.from({ length: measureCount }, (_, i) => i);
      const newOrder = arrayMove(order, fromMeasure, toMeasure);

      // Build index mapping: old measure index → new measure index
      const indexMap = new Map<number, number>(
        newOrder.map((old, next) => [old, next]),
      );

      rememberHistory(notesRef.current);

      setBarNames((prev) =>
        newOrder.map((old, i) => prev[old] ?? `Bar ${i + 1}`),
      );
      setNotes((prev) =>
        prev.map((n) => ({
          ...n,
          measure: indexMap.get(n.measure) ?? n.measure,
        })),
      );
      setBarGroups((prev) =>
        prev.map((g) => ({
          ...g,
          bars: g.bars
            .map((b) => indexMap.get(b))
            .filter((b): b is number => b != null),
        })),
      );
      setSelectedCell((prev) =>
        prev
          ? { ...prev, measure: indexMap.get(prev.measure) ?? prev.measure }
          : prev,
      );
      setActiveSidebarBar((prev) => indexMap.get(prev) ?? prev);
      setSelectedSidebarBars((prev) =>
        prev.map((b) => indexMap.get(b)).filter((b): b is number => b != null),
      );
      useEditorScore();
    },
    [
      measureCount,
      notesRef,
      rememberHistory,
      setBarGroups,
      setBarNames,
      setNotes,
      setSelectedCell,
      setActiveSidebarBar,
      setSelectedSidebarBars,
      useEditorScore,
    ],
  );

  return {
    handleChangeMeasureCount,
    handleChangeBeatsPerMeasure,
    clearCurrentMeasure,
    duplicateCurrentMeasure,
    copyCurrentMeasure,
    pasteToCurrentMeasure,
    clearMeasureAt,
    duplicateMeasureAt,
    deleteMeasureAt,
    addBarBelow,
    pasteCopiedBarTo,
    deleteMeasuresBulk,
    reorderMeasure,
  } as const;
}
