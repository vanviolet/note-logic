import * as React from "react";
import {
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { buildCellId, toPitchClass } from "../lib/studio-utils";
import { buildAllColumnKeys } from "../lib/studio-constants";
import { parseSidebarNodeKey } from "../lib/studio-types";
import type { SidebarGroup, BatchEditDraft } from "../lib/studio-types";
import type { CellPosition, NoteDuration, StudioNote } from "../types";

// ════════════════════════════════════════════════════════
// useStudioSidebar
// ════════════════════════════════════════════════════════

export function useStudioSidebar(opts: {
  measureCount: number;
  beatsPerMeasure: number;
  stringTuning: readonly string[];
  notes: StudioNote[];
  noteByCell: Map<string, StudioNote>;
  barGroups: SidebarGroup[];
  selectedMeasure: number;

  notesRef: React.RefObject<StudioNote[]>;

  // setters from parent
  setNotes: React.Dispatch<React.SetStateAction<StudioNote[]>>;
  setBarGroups: React.Dispatch<React.SetStateAction<SidebarGroup[]>>;
  setBarNames: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedCell: React.Dispatch<React.SetStateAction<CellPosition | null>>;
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;

  rememberHistory: (snapshot: StudioNote[]) => void;
  useEditorScore: () => void;
  setAlphaStatus: (status: string) => void;

  // shared state (lifted to root to avoid circular deps)
  activeSidebarBar: number;
  setActiveSidebarBar: React.Dispatch<React.SetStateAction<number>>;
  selectedSidebarBars: number[];
  setSelectedSidebarBars: React.Dispatch<React.SetStateAction<number[]>>;
  sidebarCopyMeasureRef: React.MutableRefObject<number | null>;
  gridContainerRef: React.RefObject<HTMLDivElement | null>;

  // measure actions (from useStudioMeasureActions)
  clearMeasureAt: (measure: number) => void;
  deleteMeasureAt: (measure: number) => void;
  deleteMeasuresBulk: (measures: number[]) => void;
  pasteCopiedBarTo: (targetMeasure: number) => void;
}) {
  const {
    measureCount,
    beatsPerMeasure,
    stringTuning,
    notes,
    noteByCell,
    barGroups,
    selectedMeasure,
    notesRef,
    setNotes,
    setBarGroups,
    setBarNames,
    setSelectedCell,
    setSelectedNoteId,
    rememberHistory,
    useEditorScore,
    setAlphaStatus,
    activeSidebarBar,
    setActiveSidebarBar,
    selectedSidebarBars,
    setSelectedSidebarBars,
    sidebarCopyMeasureRef,
    gridContainerRef,
    clearMeasureAt,
    deleteMeasureAt,
    deleteMeasuresBulk,
    pasteCopiedBarTo,
  } = opts;

  // ── Sidebar state ──────────────────────────────────

  const [editingBar, setEditingBar] = React.useState<number | null>(null);
  const [editingGroupId, setEditingGroupId] = React.useState<string | null>(
    null,
  );
  const [editingGroupName, setEditingGroupName] = React.useState("");
  const [activeSidebarGroupId, setActiveSidebarGroupId] = React.useState<
    string | null
  >(null);
  const [sidebarHasFocus, setSidebarHasFocus] = React.useState(false);
  const [activeSidebarItemKey, setActiveSidebarItemKey] =
    React.useState("bar:0");
  const [selectedSidebarItemKeys, setSelectedSidebarItemKeys] = React.useState<
    string[]
  >(["bar:0"]);
  const [expandedBars, setExpandedBars] = React.useState<number[]>([]);
  const [collapsedColumns, setCollapsedColumns] = React.useState<string[]>(() =>
    buildAllColumnKeys(4, 4),
  );
  const [draggingColumnKey, setDraggingColumnKey] = React.useState<
    string | null
  >(null);
  const [draggingNoteKey, setDraggingNoteKey] = React.useState<string | null>(
    null,
  );

  // ── Batch edit state ───────────────────────────────

  const [batchEditOpen, setBatchEditOpen] = React.useState(false);
  const [batchEditTargetKeys, setBatchEditTargetKeys] = React.useState<
    string[]
  >([]);
  const [batchEditDraft, setBatchEditDraft] = React.useState<BatchEditDraft>({
    duration: "keep",
    dynamic: "keep",
    palmMute: "keep",
    deadNote: "keep",
    letRing: "keep",
    staccato: "keep",
    ghost: "keep",
    accent: "keep",
    harmonic: "keep",
  });

  // ── Refs ───────────────────────────────────────────

  const selectionAnchorRef = React.useRef<number>(0);
  const sidebarSelectionAnchorKeyRef = React.useRef<string>("bar:0");
  const renameInputRef = React.useRef<HTMLInputElement | null>(null);
  const groupRenameInputRef = React.useRef<HTMLInputElement | null>(null);
  const sidebarRef = React.useRef<HTMLDivElement | null>(null);
  const knownColumnKeysRef = React.useRef<Set<string>>(
    new Set(buildAllColumnKeys(4, 4)),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  // ── Sidebar sync effects ───────────────────────────

  React.useEffect(() => {
    setActiveSidebarBar((prev) => {
      const next = Math.min(Math.max(0, selectedMeasure), measureCount - 1);
      return prev === next ? prev : next;
    });
    if (!sidebarHasFocus) {
      setSelectedSidebarBars((prev) =>
        prev.includes(selectedMeasure) ? prev : [selectedMeasure],
      );
      selectionAnchorRef.current = selectedMeasure;
    }
  }, [measureCount, selectedMeasure, sidebarHasFocus]);

  React.useEffect(() => {
    if (editingBar === null) return;
    renameInputRef.current?.focus();
    renameInputRef.current?.select();
  }, [editingBar]);

  React.useEffect(() => {
    if (editingGroupId === null) return;
    groupRenameInputRef.current?.focus();
    groupRenameInputRef.current?.select();
  }, [editingGroupId]);

  React.useEffect(() => {
    const barKeys = selectedSidebarItemKeys.filter((k) => k.startsWith("bar:"));
    const bars = Array.from(
      new Set(
        barKeys.map((k) => Number(k.split(":")[1])).filter(Number.isFinite),
      ),
    );
    if (bars.length > 0) setSelectedSidebarBars(bars);
  }, [selectedSidebarItemKeys]);

  React.useEffect(() => {
    setBarGroups((prev) =>
      prev.map((g) => {
        const ids = new Set(prev.map((x) => x.id));
        return {
          ...g,
          bars: Array.from(new Set(g.bars)).filter(
            (b) => b >= 0 && b < measureCount,
          ),
          parentGroupId:
            g.parentGroupId && ids.has(g.parentGroupId)
              ? g.parentGroupId
              : null,
        };
      }),
    );
  }, [measureCount, setBarGroups]);

  React.useEffect(() => {
    setExpandedBars((prev) => prev.filter((m) => m >= 0 && m < measureCount));
  }, [measureCount]);

  React.useEffect(() => {
    const allowed = new Set(buildAllColumnKeys(measureCount, beatsPerMeasure));
    const known = knownColumnKeysRef.current;
    known.forEach((k) => {
      if (!allowed.has(k)) known.delete(k);
    });
    setCollapsedColumns((prev) => {
      const next = prev.filter((id) => allowed.has(id));
      for (const key of allowed) {
        if (!known.has(key)) {
          known.add(key);
          next.push(key);
        }
      }
      return next;
    });
  }, [beatsPerMeasure, measureCount]);

  // ── Tree memos ─────────────────────────────────────

  const firstPitchClassByMeasure = React.useMemo(() => {
    const map = new Map<number, number>();
    const sorted = [...notes].sort((a, b) => {
      if (a.measure !== b.measure) return a.measure - b.measure;
      if (a.beat !== b.beat) return a.beat - b.beat;
      return a.string - b.string;
    });
    for (const note of sorted) {
      if (note.isDead) continue;
      if (!map.has(note.measure)) map.set(note.measure, toPitchClass(note));
    }
    return map;
  }, [notes]);

  const groupIdByBar = React.useMemo(() => {
    const map = new Map<number, string>();
    for (const g of barGroups) {
      for (const b of g.bars) {
        if (!map.has(b)) map.set(b, g.id);
      }
    }
    return map;
  }, [barGroups]);

  const groupsByParent = React.useMemo(() => {
    const byId = new Set(barGroups.map((g) => g.id));
    const map = new Map<string | null, SidebarGroup[]>();
    for (const g of barGroups) {
      const pid =
        g.parentGroupId && byId.has(g.parentGroupId) ? g.parentGroupId : null;
      const list = map.get(pid) ?? [];
      list.push(g);
      map.set(pid, list);
    }
    return map;
  }, [barGroups]);

  const topLevelGroups = React.useMemo(
    () => groupsByParent.get(null) ?? [],
    [groupsByParent],
  );

  const ungroupedBars = React.useMemo(
    () =>
      Array.from({ length: measureCount }, (_, i) => i).filter(
        (b) => !groupIdByBar.has(b),
      ),
    [groupIdByBar, measureCount],
  );

  const sidebarSortableItems = React.useMemo(() => {
    const flatten = (g: SidebarGroup): string[] => {
      const self = [`group:${g.id}`, ...g.bars.map((b) => `bar:${b}`)];
      if (g.collapsed) return self;
      return [...self, ...(groupsByParent.get(g.id) ?? []).flatMap(flatten)];
    };
    return [
      ...ungroupedBars.map((b) => `bar:${b}`),
      ...topLevelGroups.flatMap(flatten),
    ];
  }, [groupsByParent, topLevelGroups, ungroupedBars]);

  const visibleSidebarItemKeys = React.useMemo(() => {
    const list: string[] = [];
    const pushDetails = (measure: number) => {
      if (!expandedBars.includes(measure)) return;
      for (let beat = 0; beat < beatsPerMeasure; beat++) {
        const colKey = `col:${measure}:${beat}`;
        list.push(colKey);
        if (collapsedColumns.includes(colKey)) continue;
        for (let s = 0; s < stringTuning.length; s++) {
          list.push(`note:${measure}:${beat}:${s}`);
        }
      }
    };
    const walkGroup = (g: SidebarGroup) => {
      list.push(`group:${g.id}`);
      if (g.collapsed) return;
      for (const m of g.bars) {
        list.push(`bar:${m}`);
        pushDetails(m);
      }
      for (const child of groupsByParent.get(g.id) ?? []) walkGroup(child);
    };
    for (const m of ungroupedBars) {
      list.push(`bar:${m}`);
      pushDetails(m);
    }
    for (const g of topLevelGroups) walkGroup(g);
    return list;
  }, [
    barGroups,
    beatsPerMeasure,
    collapsedColumns,
    expandedBars,
    groupsByParent,
    stringTuning.length,
    topLevelGroups,
    ungroupedBars,
  ]);

  // ── Sidebar selection ──────────────────────────────

  const selectSidebarItem = React.useCallback(
    (key: string, withShift = false, withCtrl = false) => {
      setActiveSidebarItemKey(key);
      setSelectedSidebarItemKeys((prev) => {
        if (withShift) {
          const anchor = sidebarSelectionAnchorKeyRef.current;
          const start = visibleSidebarItemKeys.indexOf(anchor);
          const end = visibleSidebarItemKeys.indexOf(key);
          if (start >= 0 && end >= 0) {
            const [from, to] = start < end ? [start, end] : [end, start];
            const range = visibleSidebarItemKeys.slice(from, to + 1);
            return withCtrl ? Array.from(new Set([...prev, ...range])) : range;
          }
          return withCtrl
            ? Array.from(new Set([...prev, key]))
            : prev.includes(key)
              ? prev
              : [...prev, key];
        }
        sidebarSelectionAnchorKeyRef.current = key;
        if (!withCtrl) return [key];
        return prev.includes(key)
          ? prev.filter((k) => k !== key)
          : [...prev, key];
      });
    },
    [visibleSidebarItemKeys],
  );

  const isSidebarItemSelected = React.useCallback(
    (key: string) => selectedSidebarItemKeys.includes(key),
    [selectedSidebarItemKeys],
  );

  // ── Batch edit ─────────────────────────────────────

  const openBatchEditFromKey = React.useCallback(
    (key: string) => {
      const targets =
        selectedSidebarItemKeys.length > 1 &&
        selectedSidebarItemKeys.includes(key)
          ? selectedSidebarItemKeys
          : [key];
      setBatchEditTargetKeys(targets);
      setBatchEditDraft({
        duration: "keep",
        dynamic: "keep",
        palmMute: "keep",
        deadNote: "keep",
        letRing: "keep",
        staccato: "keep",
        ghost: "keep",
        accent: "keep",
        harmonic: "keep",
      });
      setBatchEditOpen(true);
    },
    [selectedSidebarItemKeys],
  );

  const resolveBatchTargetNoteIds = React.useCallback(
    (keys: string[]) => {
      const parsed = keys.map(parseSidebarNodeKey);
      const groupIds = new Set<string>();
      const barMeasures = new Set<number>();
      const columnTargets = new Set<string>();
      const noteTargets = new Set<string>();

      for (const item of parsed) {
        if (item.kind === "group") {
          const gid = item.raw.split(":")[1];
          if (gid) groupIds.add(gid);
        } else if (item.kind === "bar" && Number.isFinite(item.measure)) {
          barMeasures.add(item.measure);
        } else if (
          item.kind === "col" &&
          Number.isFinite(item.measure) &&
          Number.isFinite(item.beat)
        ) {
          columnTargets.add(`${item.measure}:${item.beat}`);
        } else if (
          item.kind === "note" &&
          Number.isFinite(item.measure) &&
          Number.isFinite(item.beat) &&
          Number.isFinite(item.string)
        ) {
          noteTargets.add(`${item.measure}:${item.beat}:${item.string}`);
        }
      }

      if (groupIds.size > 0) {
        let changed = true;
        while (changed) {
          changed = false;
          for (const g of barGroups) {
            if (
              g.parentGroupId &&
              groupIds.has(g.parentGroupId) &&
              !groupIds.has(g.id)
            ) {
              groupIds.add(g.id);
              changed = true;
            }
          }
        }
        for (const g of barGroups) {
          if (!groupIds.has(g.id)) continue;
          for (const b of g.bars) barMeasures.add(b);
        }
      }

      return notes
        .filter((n) => {
          if (barMeasures.has(n.measure)) return true;
          if (columnTargets.has(`${n.measure}:${n.beat}`)) return true;
          if (noteTargets.has(`${n.measure}:${n.beat}:${n.string}`))
            return true;
          return false;
        })
        .map((n) => n.id);
    },
    [barGroups, notes],
  );

  const applyBatchEditToTargets = React.useCallback(() => {
    const hasChanges =
      batchEditDraft.duration !== "keep" ||
      batchEditDraft.dynamic !== "keep" ||
      batchEditDraft.palmMute !== "keep" ||
      batchEditDraft.deadNote !== "keep" ||
      batchEditDraft.letRing !== "keep" ||
      batchEditDraft.staccato !== "keep" ||
      batchEditDraft.ghost !== "keep" ||
      batchEditDraft.accent !== "keep" ||
      batchEditDraft.harmonic !== "keep";
    if (!hasChanges) {
      setBatchEditOpen(false);
      return;
    }

    const targetIds = resolveBatchTargetNoteIds(batchEditTargetKeys);
    if (targetIds.length === 0) {
      setAlphaStatus("No notes in selected batch edit scope");
      setBatchEditOpen(false);
      return;
    }

    const durationValue =
      batchEditDraft.duration === "keep"
        ? null
        : (Number(batchEditDraft.duration) as NoteDuration);
    const dynamicValue =
      batchEditDraft.dynamic === "keep" ? null : batchEditDraft.dynamic;
    const palmMuteValue =
      batchEditDraft.palmMute === "keep"
        ? null
        : batchEditDraft.palmMute === "on";
    const deadNoteValue =
      batchEditDraft.deadNote === "keep"
        ? null
        : batchEditDraft.deadNote === "on";
    const letRingValue =
      batchEditDraft.letRing === "keep"
        ? null
        : batchEditDraft.letRing === "on";
    const staccatoValue =
      batchEditDraft.staccato === "keep"
        ? null
        : batchEditDraft.staccato === "on";
    const ghostValue =
      batchEditDraft.ghost === "keep" ? null : batchEditDraft.ghost === "on";
    const accentValue =
      batchEditDraft.accent === "keep" ? null : batchEditDraft.accent;
    const harmonicValue =
      batchEditDraft.harmonic === "keep" ? null : batchEditDraft.harmonic;
    const idSet = new Set(targetIds);

    rememberHistory(notesRef.current);
    setNotes((prev) =>
      prev.map((n) => {
        if (!idSet.has(n.id)) return n;
        return {
          ...n,
          duration: durationValue ?? n.duration,
          dynamic: (dynamicValue as any) ?? n.dynamic,
          isPalmMute: palmMuteValue ?? n.isPalmMute,
          isDead: deadNoteValue ?? n.isDead,
          isLetRing: letRingValue ?? n.isLetRing,
          isStaccato: staccatoValue ?? n.isStaccato,
          isGhost: ghostValue ?? n.isGhost,
          accent: (accentValue as any) ?? n.accent,
          harmonicType: (harmonicValue as any) ?? n.harmonicType,
        };
      }),
    );
    useEditorScore();
    setBatchEditOpen(false);
    setAlphaStatus(`Batch updated ${targetIds.length} note(s)`);
  }, [
    batchEditDraft,
    batchEditTargetKeys,
    notesRef,
    rememberHistory,
    resolveBatchTargetNoteIds,
    setAlphaStatus,
    setNotes,
    useEditorScore,
  ]);

  const batchTargetNoteCount = React.useMemo(
    () => resolveBatchTargetNoteIds(batchEditTargetKeys).length,
    [batchEditTargetKeys, resolveBatchTargetNoteIds],
  );

  // ── Delete sidebar selection ───────────────────────

  const deleteSidebarSelection = React.useCallback(
    (keys?: string[]) => {
      const targets = keys && keys.length > 0 ? keys : selectedSidebarItemKeys;
      if (targets.length === 0) return;

      const parsed = targets.map(parseSidebarNodeKey);
      const groupIds = new Set(
        parsed
          .filter((p) => p.kind === "group")
          .map((p) => p.raw.split(":")[1]),
      );
      const barMeasures = new Set(
        parsed
          .filter((p) => p.kind === "bar" && Number.isFinite(p.measure))
          .map((p) => p.measure),
      );
      const columnTargets = parsed.filter(
        (p) =>
          p.kind === "col" &&
          Number.isFinite(p.measure) &&
          Number.isFinite(p.beat),
      );
      const noteTargets = parsed.filter(
        (p) =>
          p.kind === "note" &&
          Number.isFinite(p.measure) &&
          Number.isFinite(p.beat) &&
          Number.isFinite(p.string),
      );
      const barDeleteMeasures = [...barMeasures].filter(
        (m) => !notesRef.current.some((n) => n.measure === m),
      );

      if (groupIds.size > 0) {
        setBarGroups((prev) => {
          const desc = new Set<string>(
            [...groupIds].filter((id): id is string => Boolean(id)),
          );
          let changed = true;
          while (changed) {
            changed = false;
            for (const g of prev) {
              if (
                g.parentGroupId &&
                desc.has(g.parentGroupId) &&
                !desc.has(g.id)
              ) {
                desc.add(g.id);
                changed = true;
              }
            }
          }
          return prev.filter((g) => !desc.has(g.id));
        });
      }

      if (
        barMeasures.size > 0 ||
        columnTargets.length > 0 ||
        noteTargets.length > 0
      ) {
        rememberHistory(notesRef.current);
        setNotes((prev) =>
          prev.filter((n) => {
            if (barMeasures.has(n.measure)) return false;
            if (
              columnTargets.some(
                (c) => n.measure === c.measure && n.beat === c.beat,
              )
            )
              return false;
            if (
              noteTargets.some(
                (t) =>
                  n.measure === t.measure &&
                  n.beat === t.beat &&
                  n.string === t.string,
              )
            )
              return false;
            return true;
          }),
        );
        setSelectedNoteId(null);
        useEditorScore();
      }

      if (barDeleteMeasures.length > 0) deleteMeasuresBulk(barDeleteMeasures);
      setSelectedSidebarItemKeys([]);
      setActiveSidebarItemKey("");
    },
    [
      deleteMeasuresBulk,
      notesRef,
      rememberHistory,
      selectedSidebarItemKeys,
      setBarGroups,
      setNotes,
      setSelectedNoteId,
      useEditorScore,
    ],
  );

  // ── Sidebar navigation ─────────────────────────────

  const jumpToMeasure = React.useCallback(
    (measure: number, withShift = false, withCtrl = false) => {
      setSidebarHasFocus(true);
      setActiveSidebarGroupId(groupIdByBar.get(measure) ?? null);
      setActiveSidebarBar(measure);
      selectSidebarItem(`bar:${measure}`, withShift, withCtrl);

      if (withShift) {
        const anchor = selectionAnchorRef.current;
        const start = Math.max(0, Math.min(anchor, measure));
        const end = Math.min(measureCount - 1, Math.max(anchor, measure));
        setSelectedSidebarBars(
          Array.from({ length: end - start + 1 }, (_, i) => start + i),
        );
      } else if (!withCtrl) {
        selectionAnchorRef.current = measure;
        setSelectedSidebarBars([measure]);
      }

      setSelectedCell((prev) => ({
        measure,
        beat: prev?.beat ?? 0,
        string: prev?.string ?? 0,
      }));

      const grid = gridContainerRef.current;
      if (!grid) return;
      const target =
        grid.querySelector<HTMLElement>(
          `[data-cell-id="cell:${measure}:0:0"]`,
        ) ??
        grid.querySelector<HTMLElement>(`[data-abs-beat="${measure * 1000}"]`);
      target?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    },
    [groupIdByBar, measureCount, selectSidebarItem, setSelectedCell],
  );

  const toggleBarCollapsed = React.useCallback((measure: number) => {
    setExpandedBars((prev) =>
      prev.includes(measure)
        ? prev.filter((m) => m !== measure)
        : [...prev, measure],
    );
  }, []);

  const jumpToBarColumnString = React.useCallback(
    (measure: number, beat: number, string: number) => {
      setSidebarHasFocus(true);
      setActiveSidebarGroupId(groupIdByBar.get(measure) ?? null);
      setActiveSidebarBar(measure);
      setSelectedSidebarBars([measure]);
      selectSidebarItem(`note:${measure}:${beat}:${string}`);
      selectionAnchorRef.current = measure;

      const position = { measure, beat, string };
      setSelectedCell(position);
      const existing = noteByCell.get(buildCellId(position));
      setSelectedNoteId(existing?.id ?? null);

      const grid = gridContainerRef.current;
      if (!grid) return;
      const target = grid.querySelector<HTMLElement>(
        `[data-cell-id="cell:${measure}:${beat}:${string}"]`,
      );
      target?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    },
    [
      groupIdByBar,
      noteByCell,
      selectSidebarItem,
      setSelectedCell,
      setSelectedNoteId,
    ],
  );

  // ── Group CRUD ─────────────────────────────────────

  const createGroupFromSelection = React.useCallback(
    (parentId?: string) => {
      const bars = [...selectedSidebarBars];
      if (bars.length === 0) return;
      const now = Date.now().toString(36);
      const group: SidebarGroup = {
        id: `g-${now}`,
        name: `Group ${barGroups.length + 1}`,
        bars,
        parentGroupId: parentId ?? activeSidebarGroupId,
        collapsed: false,
      };
      setBarGroups((prev) => {
        const grouped = new Set(bars);
        const cleaned = prev.map((g) => ({
          ...g,
          bars: g.bars.filter((b) => !grouped.has(b)),
        }));
        const hasParent = cleaned.some((g) => g.id === group.parentGroupId);
        return [
          ...cleaned,
          { ...group, parentGroupId: hasParent ? group.parentGroupId : null },
        ];
      });
      setActiveSidebarGroupId(group.id);
    },
    [activeSidebarGroupId, barGroups.length, selectedSidebarBars, setBarGroups],
  );

  const renameGroup = React.useCallback(
    (groupId: string, nextName: string) => {
      const trimmed = nextName.trim();
      if (!trimmed) return;
      setBarGroups((prev) =>
        prev.map((g) => (g.id === groupId ? { ...g, name: trimmed } : g)),
      );
    },
    [setBarGroups],
  );

  const duplicateGroup = React.useCallback(
    (groupId: string) => {
      setBarGroups((prev) => {
        const source = prev.find((g) => g.id === groupId);
        if (!source) return prev;
        const dup: SidebarGroup = {
          id: `g-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
          name: `${source.name} Copy`,
          bars: [...source.bars],
          parentGroupId: source.parentGroupId,
          collapsed: false,
        };
        const idx = prev.findIndex((g) => g.id === groupId);
        if (idx < 0) return [...prev, dup];
        const draft = [...prev];
        draft.splice(idx + 1, 0, dup);
        return draft;
      });
    },
    [setBarGroups],
  );

  const removeGroup = React.useCallback(
    (groupId: string) => {
      setBarGroups((prev) => {
        const desc = new Set<string>([groupId]);
        let changed = true;
        while (changed) {
          changed = false;
          for (const g of prev) {
            if (
              g.parentGroupId &&
              desc.has(g.parentGroupId) &&
              !desc.has(g.id)
            ) {
              desc.add(g.id);
              changed = true;
            }
          }
        }
        return prev.filter((g) => !desc.has(g.id));
      });
      setActiveSidebarGroupId((prev) => (prev === groupId ? null : prev));
      setEditingGroupId((prev) => (prev === groupId ? null : prev));
    },
    [setBarGroups],
  );

  const toggleGroupCollapsed = React.useCallback(
    (groupId: string) => {
      setBarGroups((prev) =>
        prev.map((g) =>
          g.id === groupId ? { ...g, collapsed: !g.collapsed } : g,
        ),
      );
    },
    [setBarGroups],
  );

  const startRenameGroup = React.useCallback(
    (groupId: string) => {
      const current = barGroups.find((g) => g.id === groupId);
      if (!current) return;
      setEditingGroupId(groupId);
      setEditingGroupName(current.name);
      setActiveSidebarGroupId(groupId);
      setSidebarHasFocus(true);
    },
    [barGroups],
  );

  const commitRenameGroup = React.useCallback(
    (groupId: string, nextName: string) => {
      renameGroup(groupId, nextName);
      setEditingGroupId(null);
    },
    [renameGroup],
  );

  const commitRenameBar = React.useCallback(
    (measure: number, next: string) => {
      setBarNames((prev) => {
        const draft = [...prev];
        const trimmed = next.trim();
        draft[measure] = trimmed.length > 0 ? trimmed : `Bar ${measure + 1}`;
        return draft;
      });
      setEditingBar(null);
    },
    [setBarNames],
  );

  // ── DnD measure reorder ────────────────────────────

  const applyMeasureOrder = React.useCallback(
    (order: number[], groups: SidebarGroup[]) => {
      if (order.length !== measureCount) return;
      const identity = order.every((v, i) => v === i);
      const indexMap = new Map<number, number>(
        order.map((old, next) => [old, next]),
      );
      const mappedGroups = groups
        .map((g) => ({
          ...g,
          bars: g.bars
            .map((b) => indexMap.get(b))
            .filter((b): b is number => b != null),
        }))
        .map((g) => ({ ...g, bars: Array.from(new Set(g.bars)) }));

      setBarGroups(mappedGroups);
      setSelectedSidebarBars((prev) =>
        Array.from(
          new Set(
            prev
              .map((b) => indexMap.get(b))
              .filter((b): b is number => b != null),
          ),
        ),
      );
      setActiveSidebarBar((prev) => indexMap.get(prev) ?? prev);
      setSelectedCell((prev) =>
        prev
          ? { ...prev, measure: indexMap.get(prev.measure) ?? prev.measure }
          : prev,
      );
      selectionAnchorRef.current =
        indexMap.get(selectionAnchorRef.current) ?? selectionAnchorRef.current;

      if (activeSidebarGroupId) {
        const still = mappedGroups.some((g) => g.id === activeSidebarGroupId);
        if (!still) setActiveSidebarGroupId(null);
      }

      if (identity) return;
      rememberHistory(notesRef.current);
      setBarNames((prev) => order.map((old, i) => prev[old] ?? `Bar ${i + 1}`));
      setNotes((prev) =>
        prev.map((n) => ({
          ...n,
          measure: indexMap.get(n.measure) ?? n.measure,
        })),
      );
      useEditorScore();
    },
    [
      activeSidebarGroupId,
      measureCount,
      notesRef,
      rememberHistory,
      setBarGroups,
      setBarNames,
      setNotes,
      setSelectedCell,
      useEditorScore,
    ],
  );

  const handleBarDragEnd = React.useCallback(
    (event: DragEndEvent) => {
      const activeId = String(event.active.id);
      const overId = String(event.over?.id ?? "");
      if (!activeId || !overId || activeId === overId) return;

      if (activeId.startsWith("group:") && overId.startsWith("group:")) {
        const aGroup = activeId.replace("group:", "");
        const oGroup = overId.replace("group:", "");
        const from = barGroups.findIndex((g) => g.id === aGroup);
        const to = barGroups.findIndex((g) => g.id === oGroup);
        if (from < 0 || to < 0) return;
        const nextGroups = arrayMove(barGroups, from, to);
        const groupedBars = new Set(nextGroups.flatMap((g) => g.bars));
        const ungrouped = Array.from(
          { length: measureCount },
          (_, i) => i,
        ).filter((b) => !groupedBars.has(b));
        setActiveSidebarGroupId(aGroup);
        applyMeasureOrder(
          [...ungrouped, ...nextGroups.flatMap((g) => g.bars)],
          nextGroups,
        );
        return;
      }

      if (!activeId.startsWith("bar:")) return;
      const activeMeasure = Number(activeId.replace("bar:", ""));
      if (Number.isNaN(activeMeasure)) return;

      let toIndex = activeMeasure;
      let targetGroupId: string | null = null;
      const groupsWithoutActive = barGroups.map((g) => ({
        ...g,
        bars: g.bars.filter((b) => b !== activeMeasure),
      }));

      if (overId.startsWith("bar:")) {
        const overMeasure = Number(overId.replace("bar:", ""));
        if (Number.isNaN(overMeasure)) return;
        toIndex = overMeasure;
        const owner = groupsWithoutActive.find((g) =>
          g.bars.includes(overMeasure),
        );
        targetGroupId = owner?.id ?? null;
      } else if (overId.startsWith("group:")) {
        targetGroupId = overId.replace("group:", "");
        const tg = groupsWithoutActive.find((g) => g.id === targetGroupId);
        if (!tg) return;
        const lastBar = tg.bars[tg.bars.length - 1];
        toIndex = lastBar == null ? activeMeasure : lastBar;
      } else {
        return;
      }

      const nextGroups = groupsWithoutActive.map((g) => {
        if (g.id !== targetGroupId) return g;
        if (overId.startsWith("bar:")) {
          const overMeasure = Number(overId.replace("bar:", ""));
          const insertIdx = g.bars.indexOf(overMeasure);
          const bars = [...g.bars];
          if (insertIdx < 0) bars.push(activeMeasure);
          else bars.splice(insertIdx, 0, activeMeasure);
          return { ...g, bars };
        }
        return { ...g, bars: [...g.bars, activeMeasure] };
      });

      const order = Array.from({ length: measureCount }, (_, i) => i);
      const linearOrder = arrayMove(order, activeMeasure, toIndex);
      setActiveSidebarGroupId(targetGroupId);
      applyMeasureOrder(linearOrder, nextGroups);
    },
    [applyMeasureOrder, barGroups, measureCount],
  );

  // ── Keyboard shortcuts ─────────────────────────────

  React.useEffect(() => {
    function onRenameShortcut(event: KeyboardEvent) {
      if (event.key !== "F2" || !sidebarHasFocus) return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      event.preventDefault();
      if (activeSidebarGroupId) {
        startRenameGroup(activeSidebarGroupId);
        return;
      }
      setEditingBar(activeSidebarBar);
    }
    window.addEventListener("keydown", onRenameShortcut);
    return () => window.removeEventListener("keydown", onRenameShortcut);
  }, [
    activeSidebarBar,
    activeSidebarGroupId,
    sidebarHasFocus,
    startRenameGroup,
  ]);

  React.useEffect(() => {
    function onCopyPaste(event: KeyboardEvent) {
      if (!sidebarHasFocus || !(event.ctrlKey || event.metaKey)) return;
      const key = event.key.toLowerCase();
      if (key === "c") {
        event.preventDefault();
        sidebarCopyMeasureRef.current = activeSidebarBar;
      }
      if (key === "v") {
        event.preventDefault();
        pasteCopiedBarTo(activeSidebarBar);
      }
    }
    window.addEventListener("keydown", onCopyPaste);
    return () => window.removeEventListener("keydown", onCopyPaste);
  }, [activeSidebarBar, pasteCopiedBarTo, sidebarHasFocus]);

  React.useEffect(() => {
    function onDelete(event: KeyboardEvent) {
      if (
        !sidebarHasFocus ||
        !(event.key === "Backspace" || event.key === "Delete")
      )
        return;
      const tag = (event.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      event.preventDefault();

      if (selectedSidebarItemKeys.length > 1) {
        deleteSidebarSelection(selectedSidebarItemKeys);
        return;
      }
      const parts = activeSidebarItemKey.split(":");
      const kind = parts[0] ?? "";
      if (kind === "bar") {
        const m = Number(parts[1]);
        if (!Number.isFinite(m)) return;
        if (notesRef.current.some((n) => n.measure === m)) clearMeasureAt(m);
        else deleteMeasureAt(m);
        return;
      }
      deleteSidebarSelection([activeSidebarItemKey]);
    }
    window.addEventListener("keydown", onDelete);
    return () => window.removeEventListener("keydown", onDelete);
  }, [
    activeSidebarItemKey,
    clearMeasureAt,
    deleteMeasureAt,
    deleteSidebarSelection,
    notesRef,
    selectedSidebarItemKeys,
    sidebarHasFocus,
  ]);

  // ── Open batch edit for arbitrary note IDs (from editor selection) ──

  const openBatchEditForNoteIds = React.useCallback(
    (noteIds: Set<string>) => {
      if (noteIds.size === 0) return;
      // Convert note IDs to fake sidebar keys so the resolver picks them up
      const keys: string[] = [];
      for (const n of notes) {
        if (noteIds.has(n.id)) {
          keys.push(`note:${n.measure}:${n.beat}:${n.string}`);
        }
      }
      setBatchEditTargetKeys(keys);
      setBatchEditDraft({
        duration: "keep",
        dynamic: "keep",
        palmMute: "keep",
        deadNote: "keep",
        letRing: "keep",
        staccato: "keep",
        ghost: "keep",
        accent: "keep",
        harmonic: "keep",
      });
      setBatchEditOpen(true);
    },
    [notes],
  );

  // ── Reset sidebar state (called by project hooks) ──

  const resetSidebarState = React.useCallback(
    (newMeasureCount: number, newBeatsPerMeasure: number) => {
      setSelectedSidebarBars([0]);
      setActiveSidebarItemKey("bar:0");
      setSelectedSidebarItemKeys(["bar:0"]);
      setExpandedBars([]);
      const cols = buildAllColumnKeys(newMeasureCount, newBeatsPerMeasure);
      knownColumnKeysRef.current = new Set(cols);
      setCollapsedColumns(cols);
      setActiveSidebarBar(0);
      setActiveSidebarGroupId(null);
      setEditingGroupId(null);
      setEditingGroupName("");
    },
    [],
  );

  return {
    // state
    activeSidebarBar,
    editingBar,
    editingGroupId,
    editingGroupName,
    activeSidebarGroupId,
    sidebarHasFocus,
    selectedSidebarBars,
    activeSidebarItemKey,
    selectedSidebarItemKeys,
    expandedBars,
    collapsedColumns,
    draggingColumnKey,
    draggingNoteKey,
    batchEditOpen,
    batchEditDraft,
    batchEditTargetKeys,
    batchTargetNoteCount,

    // refs
    selectionAnchorRef,
    renameInputRef,
    groupRenameInputRef,
    sidebarRef,
    sidebarCopyMeasureRef,
    knownColumnKeysRef,
    gridContainerRef,
    sensors,

    // setters
    setActiveSidebarBar,
    setActiveSidebarGroupId,
    setSidebarHasFocus,
    setSelectedSidebarBars,
    setEditingBar,
    setEditingGroupId,
    setEditingGroupName,
    setExpandedBars,
    setCollapsedColumns,
    setDraggingColumnKey,
    setDraggingNoteKey,
    setBatchEditOpen,
    setBatchEditDraft,

    // memos
    firstPitchClassByMeasure,
    groupIdByBar,
    groupsByParent,
    topLevelGroups,
    ungroupedBars,
    sidebarSortableItems,

    // callbacks
    selectSidebarItem,
    isSidebarItemSelected,
    openBatchEditFromKey,
    openBatchEditForNoteIds,
    applyBatchEditToTargets,
    deleteSidebarSelection,
    jumpToMeasure,
    toggleBarCollapsed,
    jumpToBarColumnString,
    createGroupFromSelection,
    renameGroup,
    duplicateGroup,
    removeGroup,
    toggleGroupCollapsed,
    startRenameGroup,
    commitRenameGroup,
    commitRenameBar,
    handleBarDragEnd,
    resetSidebarState,
  } as const;
}
