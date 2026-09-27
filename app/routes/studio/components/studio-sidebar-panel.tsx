import * as React from "react";
import {
  DndContext,
  closestCenter,
  type DragEndEvent,
  type SensorDescriptor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ChevronsDown,
  ChevronDown,
  ChevronRight,
  ClipboardCopy,
  MousePointerSquareDashed,
  Pencil,
  Plus,
} from "lucide-react";
import { Badge } from "~/templates/components/ui/badge";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/templates/components/ui/context-menu";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/templates/components/ui/resizable";
import { cn } from "~/templates/lib/utils";
import { buildCellId, fretToNoteName, toPitchClass } from "../lib/studio-utils";
import {
  pitchClassDotColor,
  NOTE_DOT_COLOR_CLASS,
} from "../lib/studio-constants";
import { parseSidebarNodeKey } from "../lib/studio-types";
import type { SidebarGroup, BatchEditDraft } from "../lib/studio-types";
import type { StudioNote } from "../types";
import type { ScoreSettings } from "../types";
import { SortableBarRow } from "./sidebar-row";
import { SortableGroupRow } from "./sidebar-row";
import { StudioBatchEditPopover } from "./studio-batch-edit-popover";
import { StudioScoreSettingsPanel } from "./studio-score-settings-panel";

// ── Props ──────────────────────────────────────────────

export type StudioSidebarPanelProps = {
  sidebarRef: React.RefObject<HTMLDivElement | null>;
  measureCount: number;
  beatsPerMeasure: number;
  stringTuning: readonly string[];
  barNames: string[];
  notes: StudioNote[];
  noteByCell: Map<string, StudioNote>;

  // sidebar tree structure
  barGroups: SidebarGroup[];
  groupIdByBar: Map<number, string>;
  groupsByParent: Map<string | null, SidebarGroup[]>;
  topLevelGroups: SidebarGroup[];
  ungroupedBars: number[];
  sidebarSortableItems: string[];
  firstPitchClassByMeasure: Map<number, number>;

  // expanded/collapsed state
  expandedBars: number[];
  collapsedColumns: string[];

  // selection state
  sidebarHasFocus: boolean;
  activeSidebarBar: number;
  activeSidebarGroupId: string | null;
  activeSidebarItemKey: string;
  selectedSidebarItemKeys: string[];
  selectedSidebarBars: number[];

  // editing state
  editingBar: number | null;
  editingGroupId: string | null;
  editingGroupName: string;

  // batch edit state
  batchEditOpen: boolean;
  batchEditDraft: BatchEditDraft;
  batchTargetNoteCount: number;

  // dnd sensors
  sensors: SensorDescriptor<any>[];

  // drag state
  draggingColumnKey: string | null;
  draggingNoteKey: string | null;

  // callbacks — sidebar focus
  onSidebarFocusCapture: () => void;
  onSidebarBlurCapture: (event: React.FocusEvent) => void;

  // callbacks — selection
  selectSidebarItem: (
    key: string,
    withShift?: boolean,
    withCtrl?: boolean,
  ) => void;
  isSidebarItemSelected: (key: string) => boolean;

  // callbacks — bar actions
  onJumpToMeasure: (
    measure: number,
    withShift?: boolean,
    withCtrl?: boolean,
  ) => void;
  onToggleBarCollapsed: (measure: number) => void;
  onJumpToBarColumnString: (
    measure: number,
    beat: number,
    string: number,
  ) => void;
  onSetActiveSidebarBar: (measure: number) => void;
  onSetActiveSidebarGroupId: (id: string | null) => void;
  onSetSidebarHasFocus: (value: boolean) => void;
  onSetSelectedSidebarBars: (
    bars: number[] | ((prev: number[]) => number[]),
  ) => void;
  selectionAnchorRef: React.MutableRefObject<number>;

  // callbacks — bar names
  onSetBarNames: (fn: (prev: string[]) => string[]) => void;
  onCommitRenameBar: (measure: number, name: string) => void;
  onSetEditingBar: (bar: number | null) => void;
  onSetEditingGroupId: (id: string | null) => void;
  onSetEditingGroupName: (name: string) => void;

  // callbacks — bar CRUD
  onAddBarBelow: (measure: number) => void;
  onDuplicateMeasureAt: (measure: number) => void;
  onClearMeasureAt: (measure: number) => void;
  onDeleteMeasureAt: (measure: number) => void;

  // callbacks — group CRUD
  onCreateGroupFromSelection: (parentId?: string) => void;
  onStartRenameGroup: (groupId: string) => void;
  onCommitRenameGroup: (groupId: string, name: string) => void;
  onDuplicateGroup: (groupId: string) => void;
  onRemoveGroup: (groupId: string) => void;
  onToggleGroupCollapsed: (groupId: string) => void;

  // callbacks — sidebar tree
  onDeleteSidebarSelection: (keys: string[]) => void;
  onOpenBatchEditFromKey: (key: string) => void;
  onSetBatchEditOpen: (open: boolean) => void;
  onSetBatchEditDraft: (draft: BatchEditDraft) => void;
  onApplyBatchEdit: () => void;

  // callbacks — actions synced with editor context menu
  onCopySelectedSidebarNotes: () => void;
  onSelectAllInMeasure: (measure: number) => void;

  // callbacks — columns/notes drag
  onSetCollapsedColumns: (fn: (prev: string[]) => string[]) => void;
  onSetExpandedBars: (fn: (prev: number[]) => number[]) => void;
  onSetDraggingColumnKey: (key: string | null) => void;
  onSetDraggingNoteKey: (key: string | null) => void;

  // callbacks — notes mutation for drag
  onRememberHistory: (snapshot: StudioNote[]) => void;
  onSetNotes: (fn: (prev: StudioNote[]) => StudioNote[]) => void;
  notesRef: React.MutableRefObject<StudioNote[]>;
  onUseEditorScore: () => void;

  // callbacks — dnd
  onBarDragEnd: (event: DragEndEvent) => void;

  // refs
  renameInputRef: React.MutableRefObject<HTMLInputElement | null>;
  groupRenameInputRef: React.MutableRefObject<HTMLInputElement | null>;

  // sidebar panel visibility
  showBarPanel: boolean;
  showScorePanel: boolean;

  // score & track settings
  scoreSettings: ScoreSettings;
  onChangeScoreSettings: (patch: Partial<ScoreSettings>) => void;
};

// ── Component ──────────────────────────────────────────

export function StudioSidebarPanel(props: StudioSidebarPanelProps) {
  const {
    sidebarRef,
    measureCount,
    beatsPerMeasure,
    stringTuning,
    barNames,
    noteByCell,
    barGroups,
    groupIdByBar,
    groupsByParent,
    topLevelGroups,
    ungroupedBars,
    sidebarSortableItems,
    firstPitchClassByMeasure,
    expandedBars,
    collapsedColumns,
    sidebarHasFocus,
    activeSidebarBar: _activeSidebarBar,
    activeSidebarGroupId: _activeSidebarGroupId,
    activeSidebarItemKey,
    selectedSidebarItemKeys,
    selectedSidebarBars,
    editingBar,
    editingGroupId,
    editingGroupName,
    batchEditOpen,
    batchEditDraft,
    batchTargetNoteCount,
    sensors,
    draggingColumnKey,
    draggingNoteKey,
    onSidebarFocusCapture,
    onSidebarBlurCapture,
    selectSidebarItem,
    isSidebarItemSelected,
    onJumpToMeasure,
    onToggleBarCollapsed,
    onJumpToBarColumnString,
    onSetActiveSidebarBar,
    onSetActiveSidebarGroupId,
    onSetSidebarHasFocus,
    onSetSelectedSidebarBars,
    selectionAnchorRef,
    onSetBarNames,
    onCommitRenameBar,
    onSetEditingBar,
    onSetEditingGroupId,
    onSetEditingGroupName,
    onAddBarBelow,
    onDuplicateMeasureAt,
    onClearMeasureAt,
    onDeleteMeasureAt,
    onCreateGroupFromSelection,
    onStartRenameGroup,
    onCommitRenameGroup,
    onDuplicateGroup,
    onRemoveGroup,
    onToggleGroupCollapsed,
    onDeleteSidebarSelection,
    onOpenBatchEditFromKey,
    onSetBatchEditOpen,
    onSetBatchEditDraft,
    onApplyBatchEdit,
    onCopySelectedSidebarNotes,
    onSelectAllInMeasure,
    onSetCollapsedColumns,
    onSetExpandedBars,
    onSetDraggingColumnKey,
    onSetDraggingNoteKey,
    onRememberHistory,
    onSetNotes,
    notesRef,
    onUseEditorScore,
    onBarDragEnd,
    renameInputRef,
    groupRenameInputRef,
    showBarPanel,
    showScorePanel,
    scoreSettings,
    onChangeScoreSettings,
  } = props;

  const handleAddNewBar = React.useCallback(() => {
    const targetMeasure = Math.max(0, measureCount - 1);
    onAddBarBelow(targetMeasure);
  }, [measureCount, onAddBarBelow]);

  const handleExpandAll = React.useCallback(() => {
    onSetExpandedBars(() =>
      Array.from({ length: Math.max(0, measureCount) }, (_, i) => i),
    );
    onSetCollapsedColumns(() => []);
    for (const group of barGroups) {
      if (group.collapsed) {
        onToggleGroupCollapsed(group.id);
      }
    }
  }, [
    barGroups,
    measureCount,
    onSetCollapsedColumns,
    onSetExpandedBars,
    onToggleGroupCollapsed,
  ]);

  // ── Render bar row with tree details ─────────────────

  const renderBarRow = (measure: number, parentGroupId: string | null) => {
    const name = barNames[measure] ?? `Measure ${measure + 1}`;
    const pitchClass = firstPitchClassByMeasure.get(measure);
    const noteDotClass = pitchClassDotColor(pitchClass);
    const isExpanded = expandedBars.includes(measure);

    return (
      <div key={`bar:${measure}`} className="space-y-1">
        <SortableBarRow
          measure={measure}
          name={name}
          noteDotClass={noteDotClass}
          isActive={activeSidebarItemKey === `bar:${measure}`}
          isPaleSelected={
            isSidebarItemSelected(`bar:${measure}`) &&
            activeSidebarItemKey !== `bar:${measure}`
          }
          isFocusedSelection={sidebarHasFocus}
          isEditing={editingBar === measure}
          onActivate={(nextMeasure, withShift = false, withCtrl = false) => {
            if (withShift) {
              onJumpToMeasure(nextMeasure, true, withCtrl);
              return;
            }
            onSetSidebarHasFocus(true);
            onSetActiveSidebarBar(nextMeasure);
            onSetActiveSidebarGroupId(groupIdByBar.get(nextMeasure) ?? null);
            if (!withCtrl) {
              onSetSelectedSidebarBars([nextMeasure]);
              selectionAnchorRef.current = nextMeasure;
            }
            selectSidebarItem(`bar:${nextMeasure}`, false, withCtrl);
            if (withCtrl) return;
            onToggleBarCollapsed(nextMeasure);
          }}
          onStartRename={(nextMeasure) => {
            onSetActiveSidebarBar(nextMeasure);
            onSetActiveSidebarGroupId(groupIdByBar.get(nextMeasure) ?? null);
            onSetEditingBar(nextMeasure);
            onSetEditingGroupId(null);
            onSetSidebarHasFocus(true);
          }}
          onRenameChange={(nextMeasure, nextName) => {
            onSetBarNames((prev) => {
              const draft = [...prev];
              draft[nextMeasure] = nextName;
              return draft;
            });
          }}
          onCommitRename={(nextMeasure) => {
            onCommitRenameBar(nextMeasure, barNames[nextMeasure] ?? "");
          }}
          onCancelRename={() => onSetEditingBar(null)}
          onAddBelow={onAddBarBelow}
          onDuplicate={onDuplicateMeasureAt}
          onClearNotes={onClearMeasureAt}
          onDelete={onDeleteMeasureAt}
          onBatchEdit={(nextMeasure) =>
            onOpenBatchEditFromKey(`bar:${nextMeasure}`)
          }
          canDelete={measureCount > 1}
          selectedCount={selectedSidebarItemKeys.length}
          onDeleteSelected={() =>
            onDeleteSidebarSelection(selectedSidebarItemKeys)
          }
          canGroupSelection={
            selectedSidebarBars.length > 1 &&
            selectedSidebarBars.includes(measure)
          }
          onGroupSelection={() =>
            onCreateGroupFromSelection(parentGroupId ?? undefined)
          }
          showCollapseToggle
          isCollapsed={!isExpanded}
          onToggleCollapse={() => onToggleBarCollapsed(measure)}
          bindRenameRef={(node) => {
            renameInputRef.current = node;
          }}
        />

        {isExpanded ? (
          <div className="space-y-1.5 pl-8">
            {Array.from({ length: beatsPerMeasure }, (_, beat) => {
              const columnId = `col:${measure}:${beat}`;
              const isColumnCollapsed = collapsedColumns.includes(columnId);
              const isColumnActive = activeSidebarItemKey === columnId;
              const isColumnPale =
                isSidebarItemSelected(columnId) && !isColumnActive;

              return (
                <div key={`bar:${measure}:col:${beat}`} className="space-y-1">
                  <ContextMenu>
                    <ContextMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={(event) => {
                          onSetSidebarHasFocus(true);
                          selectSidebarItem(
                            columnId,
                            event.shiftKey,
                            event.ctrlKey || event.metaKey,
                          );
                          if (
                            event.shiftKey ||
                            event.ctrlKey ||
                            event.metaKey
                          ) {
                            return;
                          }
                          onSetCollapsedColumns((prev) =>
                            prev.includes(columnId)
                              ? prev.filter((id) => id !== columnId)
                              : [...prev, columnId],
                          );
                        }}
                        onContextMenu={() => {
                          if (!isColumnActive && !isColumnPale) {
                            selectSidebarItem(columnId, false);
                          }
                        }}
                        draggable
                        onDragStart={() => onSetDraggingColumnKey(columnId)}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={() => {
                          if (
                            !draggingColumnKey ||
                            draggingColumnKey === columnId
                          ) {
                            return;
                          }
                          const from = parseSidebarNodeKey(draggingColumnKey);
                          if (from.kind !== "col") return;
                          if (
                            !Number.isFinite(from.measure) ||
                            !Number.isFinite(from.beat)
                          ) {
                            return;
                          }

                          onRememberHistory(notesRef.current);
                          onSetNotes((prev) => {
                            const moved = prev
                              .filter(
                                (note) =>
                                  note.measure === from.measure &&
                                  note.beat === from.beat,
                              )
                              .map((note) => ({
                                ...note,
                                measure,
                                beat,
                              }));

                            const withoutSource = prev.filter(
                              (note) =>
                                !(
                                  note.measure === from.measure &&
                                  note.beat === from.beat
                                ),
                            );
                            const withoutTarget = withoutSource.filter(
                              (note) =>
                                !(
                                  note.measure === measure && note.beat === beat
                                ),
                            );

                            return [...withoutTarget, ...moved].sort((a, b) => {
                              if (a.measure !== b.measure)
                                return a.measure - b.measure;
                              if (a.beat !== b.beat) return a.beat - b.beat;
                              return a.string - b.string;
                            });
                          });
                          onSetDraggingColumnKey(null);
                          onUseEditorScore();
                        }}
                        className={cn(
                          "flex w-full min-w-0 select-none items-center gap-1.5 rounded-sm px-2 py-1.5 text-left text-xs font-semibold text-muted-foreground hover:bg-accent/40 hover:text-foreground",
                          isColumnActive && "bg-primary/20 text-primary",
                          isColumnPale && "bg-primary/10 text-primary/90",
                        )}
                      >
                        {isColumnCollapsed ? (
                          <ChevronRight className="size-3 shrink-0" />
                        ) : (
                          <ChevronDown className="size-3 shrink-0" />
                        )}
                        <span className="truncate">Beat {beat + 1}</span>
                      </button>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                      <ContextMenuItem
                        onClick={() => {
                          selectSidebarItem(columnId, false);
                          onJumpToBarColumnString(measure, beat, 0);
                        }}
                      >
                        Activate Beat
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() =>
                          onSetCollapsedColumns((prev) =>
                            prev.includes(columnId)
                              ? prev.filter((id) => id !== columnId)
                              : [...prev, columnId],
                          )
                        }
                      >
                        {isColumnCollapsed ? "Expand Beat" : "Collapse Beat"}
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        onClick={() => onSelectAllInMeasure(measure)}
                      >
                        <MousePointerSquareDashed className="mr-2 h-4 w-4" />
                        Select All in Bar {measure + 1}
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={onCopySelectedSidebarNotes}
                        disabled={selectedSidebarItemKeys.length === 0}
                      >
                        <ClipboardCopy className="mr-2 h-4 w-4" />
                        Copy Selected
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        onClick={() => onOpenBatchEditFromKey(columnId)}
                      >
                        <Pencil className="mr-2 h-4 w-4" />
                        Batch Edit Notes...
                      </ContextMenuItem>
                      <ContextMenuSeparator />
                      <ContextMenuItem
                        variant="destructive"
                        onClick={() => onDeleteSidebarSelection([columnId])}
                      >
                        Clear Beat
                      </ContextMenuItem>
                      {selectedSidebarItemKeys.length > 1 ? (
                        <ContextMenuItem
                          variant="destructive"
                          onClick={() =>
                            onDeleteSidebarSelection(selectedSidebarItemKeys)
                          }
                        >
                          Delete Selected ({selectedSidebarItemKeys.length})
                        </ContextMenuItem>
                      ) : null}
                    </ContextMenuContent>
                  </ContextMenu>

                  {isColumnCollapsed ? null : (
                    <div className="space-y-0.5 pl-3">
                      {stringTuning.map((openNote, stringIndex) => {
                        const note = noteByCell.get(
                          buildCellId({ measure, beat, string: stringIndex }),
                        );
                        const dotClass = note
                          ? NOTE_DOT_COLOR_CLASS[
                              ((toPitchClass(note) % 12) + 12) % 12
                            ]
                          : "bg-muted-foreground/40";
                        const valueText = note
                          ? note.isDead
                            ? "x"
                            : `${note.fret} (${fretToNoteName(openNote, note.fret)})`
                          : "none";

                        return (
                          <ContextMenu
                            key={`bar:${measure}:col:${beat}:str:${stringIndex}`}
                          >
                            <ContextMenuTrigger asChild>
                              <button
                                type="button"
                                onClick={(event) => {
                                  onJumpToBarColumnString(
                                    measure,
                                    beat,
                                    stringIndex,
                                  );
                                  selectSidebarItem(
                                    `note:${measure}:${beat}:${stringIndex}`,
                                    event.shiftKey,
                                    event.ctrlKey || event.metaKey,
                                  );
                                }}
                                onContextMenu={() => {
                                  const key = `note:${measure}:${beat}:${stringIndex}`;
                                  if (
                                    !isSidebarItemSelected(key) ||
                                    activeSidebarItemKey !== key
                                  ) {
                                    selectSidebarItem(key, false);
                                  }
                                }}
                                draggable
                                onDragStart={() =>
                                  onSetDraggingNoteKey(
                                    `note:${measure}:${beat}:${stringIndex}`,
                                  )
                                }
                                onDragOver={(event) => event.preventDefault()}
                                onDrop={() => {
                                  if (!draggingNoteKey) return;
                                  const from =
                                    parseSidebarNodeKey(draggingNoteKey);
                                  if (from.kind !== "note") return;
                                  if (
                                    !Number.isFinite(from.measure) ||
                                    !Number.isFinite(from.beat) ||
                                    !Number.isFinite(from.string)
                                  ) {
                                    return;
                                  }
                                  if (
                                    from.measure === measure &&
                                    from.beat === beat &&
                                    from.string === stringIndex
                                  ) {
                                    return;
                                  }

                                  onRememberHistory(notesRef.current);
                                  onSetNotes((prev) => {
                                    const source = prev.find(
                                      (n) =>
                                        n.measure === from.measure &&
                                        n.beat === from.beat &&
                                        n.string === from.string,
                                    );
                                    if (!source) return prev;

                                    const withoutSource = prev.filter(
                                      (n) =>
                                        !(
                                          n.measure === from.measure &&
                                          n.beat === from.beat &&
                                          n.string === from.string
                                        ),
                                    );
                                    const withoutTarget = withoutSource.filter(
                                      (n) =>
                                        !(
                                          n.measure === measure &&
                                          n.beat === beat &&
                                          n.string === stringIndex
                                        ),
                                    );

                                    return [
                                      ...withoutTarget,
                                      {
                                        ...source,
                                        measure,
                                        beat,
                                        string: stringIndex,
                                      },
                                    ].sort((a, b) => {
                                      if (a.measure !== b.measure)
                                        return a.measure - b.measure;
                                      if (a.beat !== b.beat)
                                        return a.beat - b.beat;
                                      return a.string - b.string;
                                    });
                                  });
                                  onSetDraggingNoteKey(null);
                                  onUseEditorScore();
                                }}
                                className={cn(
                                  "flex w-full select-none items-center justify-between rounded-sm px-1 py-0.5 text-[11px] text-muted-foreground hover:bg-accent/30 hover:text-foreground",
                                  activeSidebarItemKey ===
                                    `note:${measure}:${beat}:${stringIndex}` &&
                                    "bg-primary/20 text-primary",
                                  isSidebarItemSelected(
                                    `note:${measure}:${beat}:${stringIndex}`,
                                  ) &&
                                    activeSidebarItemKey !==
                                      `note:${measure}:${beat}:${stringIndex}` &&
                                    "bg-primary/10 text-primary/90",
                                )}
                              >
                                <span className="inline-flex items-center gap-1.5">
                                  <span
                                    className={cn(
                                      "size-2 shrink-0 rounded-full",
                                      dotClass,
                                    )}
                                  />
                                  <span>{openNote}</span>
                                </span>
                                <span>{valueText}</span>
                              </button>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                              <ContextMenuItem
                                onClick={() =>
                                  onJumpToBarColumnString(
                                    measure,
                                    beat,
                                    stringIndex,
                                  )
                                }
                              >
                                Activate Note
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                onClick={() => onSelectAllInMeasure(measure)}
                              >
                                <MousePointerSquareDashed className="mr-2 h-4 w-4" />
                                Select All in Bar {measure + 1}
                              </ContextMenuItem>
                              <ContextMenuItem
                                onClick={onCopySelectedSidebarNotes}
                                disabled={selectedSidebarItemKeys.length === 0}
                              >
                                <ClipboardCopy className="mr-2 h-4 w-4" />
                                Copy Selected
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                onClick={() =>
                                  onOpenBatchEditFromKey(
                                    `note:${measure}:${beat}:${stringIndex}`,
                                  )
                                }
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Batch Edit Notes...
                              </ContextMenuItem>
                              <ContextMenuSeparator />
                              <ContextMenuItem
                                variant="destructive"
                                onClick={() =>
                                  onDeleteSidebarSelection([
                                    `note:${measure}:${beat}:${stringIndex}`,
                                  ])
                                }
                              >
                                Delete Note
                              </ContextMenuItem>
                              {selectedSidebarItemKeys.length > 1 ? (
                                <ContextMenuItem
                                  variant="destructive"
                                  onClick={() =>
                                    onDeleteSidebarSelection(
                                      selectedSidebarItemKeys,
                                    )
                                  }
                                >
                                  Delete Selected (
                                  {selectedSidebarItemKeys.length})
                                </ContextMenuItem>
                              ) : null}
                            </ContextMenuContent>
                          </ContextMenu>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    );
  };

  // ── Render group tree recursively ────────────────────

  const renderGroupTree = (group: SidebarGroup, depth = 0): React.ReactNode => {
    const children = groupsByParent.get(group.id) ?? [];

    return (
      <div key={group.id} className="space-y-0.5">
        <div style={{ paddingLeft: `${depth * 10}px` }}>
          <SortableGroupRow
            group={group}
            isFocusedSelection={sidebarHasFocus}
            isActive={activeSidebarItemKey === `group:${group.id}`}
            isPaleSelected={
              isSidebarItemSelected(`group:${group.id}`) &&
              activeSidebarItemKey !== `group:${group.id}`
            }
            isEditing={editingGroupId === group.id}
            editName={editingGroupName}
            canGroupSelection={selectedSidebarBars.length > 1}
            onActivate={(withShift = false, withCtrl = false) => {
              onSetSidebarHasFocus(true);
              onSetActiveSidebarGroupId(group.id);
              selectSidebarItem(`group:${group.id}`, withShift, withCtrl);
              if (withShift || withCtrl) return;
              onToggleGroupCollapsed(group.id);
            }}
            onStartRename={() => onStartRenameGroup(group.id)}
            onRenameChange={onSetEditingGroupName}
            onCommitRename={() =>
              onCommitRenameGroup(group.id, editingGroupName)
            }
            onCancelRename={() => onSetEditingGroupId(null)}
            onToggleCollapse={() => onToggleGroupCollapsed(group.id)}
            onGroupSelection={() => onCreateGroupFromSelection(group.id)}
            onRename={() => onStartRenameGroup(group.id)}
            onDuplicate={() => onDuplicateGroup(group.id)}
            onRemove={() => onRemoveGroup(group.id)}
            onBatchEdit={() => onOpenBatchEditFromKey(`group:${group.id}`)}
            selectedCount={selectedSidebarItemKeys.length}
            onDeleteSelected={() =>
              onDeleteSidebarSelection(selectedSidebarItemKeys)
            }
            bindRenameRef={(node) => {
              groupRenameInputRef.current = node;
            }}
          />
        </div>

        {group.collapsed ? null : (
          <div className="space-y-0.5 pl-2">
            {group.bars.map((m) => renderBarRow(m, group.id))}
            {children.map((child) => renderGroupTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // ── JSX ──────────────────────────────────────────────

  return (
    <aside
      ref={sidebarRef}
      className="relative h-full border-r bg-card/30 [&_*::selection]:bg-transparent [&_*::selection]:text-inherit"
      onFocusCapture={onSidebarFocusCapture}
      onBlurCapture={onSidebarBlurCapture}
    >
      <StudioBatchEditPopover
        open={batchEditOpen}
        onOpenChange={onSetBatchEditOpen}
        draft={batchEditDraft}
        onDraftChange={onSetBatchEditDraft}
        targetNoteCount={batchTargetNoteCount}
        onApply={onApplyBatchEdit}
      />

      <ResizablePanelGroup direction="vertical" className="h-full">
        {showBarPanel && (
          <ResizablePanel
            id="sidebar-bars"
            order={1}
            defaultSize={showScorePanel ? 55 : 100}
            minSize={15}
          >
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div className="h-full overflow-auto">
                  <div className="space-y-2 p-2.5 pt-0">
                    <div className="sticky top-0 z-10 -mx-2.5 flex items-center justify-between bg-card/80 px-2.5 py-1.5 backdrop-blur">
                      <div className="flex min-w-0 items-center gap-1.5">
                        <p className="truncate text-xs font-semibold text-muted-foreground">
                          Measures
                        </p>
                        <Badge variant="outline" className="h-5 text-[10px]">
                          {measureCount}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={handleAddNewBar}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                          aria-label="Add New Measure"
                          title="Add New Measure"
                        >
                          <Plus className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={handleExpandAll}
                          className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                          aria-label="Expand All"
                          title="Expand All"
                        >
                          <ChevronsDown className="size-3.5" />
                        </button>
                      </div>
                    </div>

                    <DndContext
                      sensors={sensors}
                      collisionDetection={closestCenter}
                      onDragEnd={onBarDragEnd}
                    >
                      <SortableContext
                        items={sidebarSortableItems}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-0.5">
                          {ungroupedBars.map((measure) =>
                            renderBarRow(measure, null),
                          )}
                          {topLevelGroups.map((group) =>
                            renderGroupTree(group),
                          )}
                        </div>
                      </SortableContext>
                    </DndContext>
                  </div>
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={handleAddNewBar}>
                  Add New Measure
                </ContextMenuItem>
                <ContextMenuItem onClick={handleExpandAll}>
                  Expand All
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </ResizablePanel>
        )}

        {showBarPanel && showScorePanel && <ResizableHandle withHandle />}

        {showScorePanel && (
          <ResizablePanel
            id="sidebar-score"
            order={2}
            defaultSize={showBarPanel ? 45 : 100}
            minSize={15}
          >
            <div className="h-full overflow-auto">
              <StudioScoreSettingsPanel
                settings={scoreSettings}
                onChange={onChangeScoreSettings}
              />
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </aside>
  );
}
