import * as React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/templates/components/ui/resizable";
import { useIsDarkMode } from "~/routes/home/components/home-theme";
import { StudioHeader } from "./components/studio-header";
import { StudioMainContent } from "./components/studio-main-content";
import { StudioSidebarPanel } from "./components/studio-sidebar-panel";
import { StudioTrackPanel } from "./components/studio-track-panel";
import { useAlphaTab } from "./hooks/use-alpha-tab";
import { useStudioGridInteraction } from "./hooks/use-studio-grid-interaction";
import { useStudioHistory } from "./hooks/use-studio-history";
import { useStudioKeyboard } from "./hooks/use-studio-keyboard";
import { useStudioMeasureActions } from "./hooks/use-studio-measure-actions";
import { useStudioNoteActions } from "./hooks/use-studio-note-actions";
import { useStudioPlayback } from "./hooks/use-studio-playback";
import { useStudioProject } from "./hooks/use-studio-project";
import { useStudioSidebar } from "./hooks/use-studio-sidebar";
import { useStudioEffectDrop } from "./hooks/use-studio-effect-drop";
import { useStudioTracks } from "./hooks/use-studio-tracks";
import { computeBeatEffectFlags } from "./components/studio-grid";
import {
  buildCellId,
  toAlphaTex,
  toMultiTrackAlphaTex,
} from "./lib/studio-utils";
import { DEFAULT_SCORE_SETTINGS } from "./types";
import { newWindow } from "~/templates/components/custom/interactive-window/method";
import { StudioEffectPaletteContent } from "./components/studio-effect-palette";
import type { SidebarGroup } from "./lib/studio-types";
import type {
  CellPosition,
  NoteDuration,
  ScoreSettings,
  StudioNote,
} from "./types";

// ════════════════════════════════════════════════════════
// Studio Route – thin orchestrator
// ════════════════════════════════════════════════════════

export default function StudioRoute() {
  const isDarkMode = useIsDarkMode();

  // ── Core project state ─────────────────────────────

  const [title, setTitle] = React.useState("Tab Studio Draft");
  const [measureCount, setMeasureCount] = React.useState(4);
  const [barNames, setBarNames] = React.useState<string[]>(() =>
    Array.from({ length: 4 }, (_, i) => `Bar ${i + 1}`),
  );
  const [beatsPerMeasure, setBeatsPerMeasure] = React.useState(4);
  const [timeSignatureNumerator, setTimeSignatureNumerator] = React.useState(4);
  const [tempo, setTempo] = React.useState(96);
  const [cellWidth, setCellWidth] = React.useState(56);
  const [defaultDuration, setDefaultDuration] = React.useState<NoteDuration>(4);
  const [selectedCell, setSelectedCell] = React.useState<CellPosition | null>(
    null,
  );
  const [selectedNoteId, setSelectedNoteId] = React.useState<string | null>(
    null,
  );
  const [selectedNoteIds, setSelectedNoteIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [scoreSettings, setScoreSettings] = React.useState<ScoreSettings>(
    DEFAULT_SCORE_SETTINGS,
  );

  // ── Multi-track management ─────────────────────────

  const trackManager = useStudioTracks();
  const [showTrackPanel, _setShowTrackPanel] = React.useState(true);

  // Derive notes / setNotes from active track (backward-compat aliases)
  const notes = trackManager.activeNotes;
  const setNotes = trackManager.setActiveNotes;

  // Derive tuning from active track
  const stringTuning = trackManager.activeTrack.tuning;
  const setStringTuning = React.useCallback(
    (action: React.SetStateAction<readonly string[]>) => {
      const newTuning =
        typeof action === "function"
          ? action(trackManager.activeTrack.tuning)
          : action;
      trackManager.setTrackTuning(trackManager.activeTrackId, newTuning);
    },
    [trackManager],
  );

  // ── Playback state ─────────────────────────────────

  const [isPlaybackRunning, setIsPlaybackRunning] = React.useState(false);

  // playheadBeat & playingNoteIds update on every beat tick during playback.
  // Their values are never consumed in render — only by imperative callbacks.
  // Using refs + stable setters eliminates per-beat React re-renders.
  const playheadBeatRef = React.useRef(0);
  const playingNoteIdsRef = React.useRef<string[]>([]);

  const setPlayheadBeat = React.useCallback(
    (v: React.SetStateAction<number>) => {
      playheadBeatRef.current =
        typeof v === "function" ? v(playheadBeatRef.current) : v;
    },
    [],
  );

  const setPlayingNoteIds = React.useCallback(
    (v: React.SetStateAction<string[]>) => {
      playingNoteIdsRef.current =
        typeof v === "function" ? v(playingNoteIdsRef.current) : v;
    },
    [],
  );

  // ── UI flags ───────────────────────────────────────

  const [canUndo, setCanUndo] = React.useState(false);
  const [canRedo, setCanRedo] = React.useState(false);
  const [hasCopiedMeasure, setHasCopiedMeasure] = React.useState(false);
  const [isImporting, setIsImporting] = React.useState(false);
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showBottomBar, setShowBottomBar] = React.useState(true);
  const [showPreview, setShowPreview] = React.useState(true);
  const [showBarPanel, setShowBarPanel] = React.useState(true);
  const [showScorePanel, setShowScorePanel] = React.useState(true);
  const [barGroups, setBarGroups] = React.useState<SidebarGroup[]>([]);

  // ── Shared sidebar state (lifted to break circular deps) ──

  const [activeSidebarBar, setActiveSidebarBar] = React.useState(0);
  const [selectedSidebarBars, setSelectedSidebarBars] = React.useState<
    number[]
  >([0]);

  // ── Shared refs (used by multiple hooks) ───────────

  const notesRef = React.useRef(notes);
  const alphaHostRef = React.useRef<HTMLDivElement | null>(null);
  const gridContainerRef = React.useRef<HTMLDivElement | null>(null);
  const copiedMeasureRef = React.useRef<StudioNote[] | null>(null);
  const importedScoreRef = React.useRef<unknown>(null);
  const sidebarCopyMeasureRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  // ── Derived values ─────────────────────────────────

  // Defer notes for expensive computations (alphaTex, sidebar) so grid stays snappy
  const deferredNotes = React.useDeferredValue(notes);
  const deferredTracks = React.useDeferredValue(trackManager.tracks);

  // previewScoreSettings: merge score-level settings with active track's metadata
  // so the preview shows the correct track name / instrument / capo.
  const previewScoreSettings = React.useMemo<ScoreSettings>(
    () => ({
      ...scoreSettings,
      trackName: trackManager.activeTrack.name,
      instrument: trackManager.activeTrack.instrument,
      capo: trackManager.activeTrack.capo,
    }),
    [scoreSettings, trackManager.activeTrack],
  );

  // previewTex: always single-track (active track only) for alphaTab display.
  // Switching tracks changes deferredNotes → previewTex → alphaTab re-renders.
  const previewTex = React.useMemo(
    () =>
      toAlphaTex(
        deferredNotes,
        tempo,
        measureCount,
        beatsPerMeasure,
        title,
        stringTuning,
        timeSignatureNumerator,
        previewScoreSettings,
      ),
    [
      beatsPerMeasure,
      deferredNotes,
      measureCount,
      previewScoreSettings,
      stringTuning,
      tempo,
      timeSignatureNumerator,
      title,
    ],
  );

  // exportTex: multi-track when applicable (used by project export & autosave).
  const exportTex = React.useMemo(
    () =>
      deferredTracks.length > 1
        ? toMultiTrackAlphaTex(
            deferredTracks,
            tempo,
            measureCount,
            beatsPerMeasure,
            title,
            timeSignatureNumerator,
            scoreSettings,
          )
        : previewTex,
    [
      beatsPerMeasure,
      deferredTracks,
      measureCount,
      previewTex,
      scoreSettings,
      tempo,
      timeSignatureNumerator,
      title,
    ],
  );

  const noteByCell = React.useMemo(() => {
    const map = new Map<string, StudioNote>();
    for (const note of notes) {
      map.set(
        buildCellId({
          measure: note.measure,
          beat: note.beat,
          string: note.string,
        }),
        note,
      );
    }
    return map;
  }, [notes]);

  // Map "measure:beat" → first StudioNote (for BeatColumnPopover in grid ruler)
  const noteByBeat = React.useMemo(() => {
    const map = new Map<string, StudioNote>();
    for (const n of notes) {
      const key = `${n.measure}:${n.beat}`;
      if (!map.has(key)) map.set(key, n);
    }
    return map;
  }, [notes]);

  // Pre-computed beat-level effect flags for timeline indicator dots
  const beatEffectFlags = React.useMemo(
    () => computeBeatEffectFlags(notes),
    [notes],
  );

  // Pre-indexed note IDs by "measure:beat" — O(1) lookup for playback highlighting
  const noteIdsByBeatRef = React.useRef(new Map<string, string[]>());
  React.useEffect(() => {
    const map = new Map<string, string[]>();
    for (const note of notes) {
      const key = `${note.measure}:${note.beat}`;
      const arr = map.get(key);
      if (arr) arr.push(note.id);
      else map.set(key, [note.id]);
    }
    noteIdsByBeatRef.current = map;
  }, [notes]);

  const selectedNote = React.useMemo(
    () => notes.find((n) => n.id === selectedNoteId) ?? null,
    [notes, selectedNoteId],
  );

  const selectedMeasure = selectedCell?.measure ?? selectedNote?.measure ?? 0;
  const hasActiveSelection = selectedCell !== null || selectedNote !== null;

  // ══════════════════════════════════════════════════
  // Hooks
  // ══════════════════════════════════════════════════

  // 1. AlphaTab
  const trackIds = React.useMemo(
    () => trackManager.tracks.map((t) => t.id),
    [trackManager.tracks],
  );
  const {
    alphaReady,
    alphaStatus,
    scoreSource,
    setAlphaStatus,
    playPause,
    stop,
    seekToBeat,
    renderImportedScore,
    useEditorScore,
  } = useAlphaTab({
    hostRef: alphaHostRef,
    gridContainerRef,
    alphaTex: previewTex,
    beatsPerMeasure,
    noteIdsByBeatRef,
    isDarkMode,
    isPlaybackRunning,
    activeTrackIndex: trackManager.activeTrackIndex,
    trackVolumes: trackManager.trackVolumes,
    trackIds,
    onPlayheadBeatChange: setPlayheadBeat,
    onPlayingNoteIdsChange: setPlayingNoteIds,
    onPlaybackStateChange: setIsPlaybackRunning,
  });

  // ── Sync alphaTab preview with active track for imported scores ──
  // When the user switches tracks and we have an imported GP score,
  // re-render showing only the selected track.
  const prevActiveTrackIdxRef = React.useRef(trackManager.activeTrackIndex);
  React.useEffect(() => {
    if (prevActiveTrackIdxRef.current === trackManager.activeTrackIndex) return;
    prevActiveTrackIdxRef.current = trackManager.activeTrackIndex;
    if (scoreSource !== "imported") return;
    const score = importedScoreRef.current;
    if (!score) return;
    renderImportedScore(score, [trackManager.activeTrackIndex]);
  }, [trackManager.activeTrackIndex, scoreSource, renderImportedScore]);

  // 2. History
  const history = useStudioHistory(
    notesRef,
    setNotes,
    setSelectedNoteId,
    useEditorScore,
  );

  // Defer history flag refresh — not critical for immediate UI response
  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      history.refreshFlags();
      setCanUndo(history.historyRef.current.length > 0);
      setCanRedo(history.redoRef.current.length > 0);
    });
    return () => cancelAnimationFrame(id);
  }, [notes, history]);

  // 3. Note actions
  const noteActions = useStudioNoteActions(
    notesRef,
    noteByCell,
    defaultDuration,
    selectedNoteId,
    setNotes,
    setSelectedCell,
    setSelectedNoteId,
    setDefaultDuration,
    history.rememberHistory,
    useEditorScore,
  );

  // 4. Measure actions
  const measureActions = useStudioMeasureActions({
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
    rememberHistory: history.rememberHistory,
    useEditorScore,
    setAlphaStatus,
  });

  // 5. Sidebar — uses deferred notes so sidebar tree doesn't block grid interaction
  const deferredNoteByCell = React.useDeferredValue(noteByCell);
  const sidebar = useStudioSidebar({
    measureCount,
    beatsPerMeasure,
    stringTuning,
    notes: deferredNotes,
    noteByCell: deferredNoteByCell,
    barGroups,
    selectedMeasure,
    notesRef,
    setNotes,
    setBarGroups,
    setBarNames,
    setSelectedCell,
    setSelectedNoteId,
    rememberHistory: history.rememberHistory,
    useEditorScore,
    setAlphaStatus,
    activeSidebarBar,
    setActiveSidebarBar,
    selectedSidebarBars,
    setSelectedSidebarBars,
    sidebarCopyMeasureRef,
    gridContainerRef,
    clearMeasureAt: measureActions.clearMeasureAt,
    deleteMeasureAt: measureActions.deleteMeasureAt,
    deleteMeasuresBulk: measureActions.deleteMeasuresBulk,
    pasteCopiedBarTo: measureActions.pasteCopiedBarTo,
  });

  // 6. Project (persistence, import/export)
  const project = useStudioProject({
    notes,
    title,
    measureCount,
    beatsPerMeasure,
    timeSignatureNumerator,
    tempo,
    cellWidth,
    stringTuning,
    defaultDuration,
    barNames,
    barGroups,
    alphaTex: exportTex,
    scoreSettings,
    tracks: trackManager.tracks,
    activeTrackId: trackManager.activeTrackId,
    historyRef: history.historyRef,
    redoRef: history.redoRef,
    copiedMeasureRef,
    importedScoreRef,
    setTitle,
    setMeasureCount,
    setBeatsPerMeasure,
    setTimeSignatureNumerator,
    setTempo,
    setCellWidth,
    setStringTuning,
    setDefaultDuration,
    setBarNames,
    setBarGroups,
    setNotes,
    setSelectedCell,
    setSelectedNoteId,
    setIsPlaybackRunning,
    setPlayheadBeat,
    setCanUndo,
    setCanRedo,
    setHasCopiedMeasure,
    setIsImporting,
    setScoreSettings,
    setTracks: trackManager.setTracks,
    setActiveTrackId: trackManager.setActiveTrackId,
    setAlphaStatus,
    useEditorScore,
    renderImportedScore,
    resetSidebarState: sidebar.resetSidebarState,
  });

  // 7. Playback
  const playback = useStudioPlayback({
    beatsPerMeasure,
    gridContainerRef,
    stop,
    playPause,
    seekToBeat,
    setIsPlaybackRunning,
    setPlayingNoteIds,
    setPlayheadBeat,
  });

  // 8. Keyboard (effect-only)
  useStudioKeyboard({
    selectedCell,
    selectedNoteId,
    selectedNoteIds,
    defaultDuration,
    noteByCell,
    notesRef,
    sidebarHasFocus: sidebar.sidebarHasFocus,
    activeSidebarItemKey: sidebar.activeSidebarItemKey,
    setNotes,
    setSelectedNoteId,
    setSelectedNoteIds,
    rememberHistory: history.rememberHistory,
    useEditorScore,
    undo: history.undo,
    redo: history.redo,
  });

  // 9. Grid interaction (marquee multi-select, arrow nav, context menu, bar drag)
  const gridInteraction = useStudioGridInteraction({
    gridContainerRef,
    notesRef,
    noteByCell,
    measureCount,
    beatsPerMeasure,
    stringCount: stringTuning.length,
    defaultDuration,
    selectedNoteIds,
    selectedCell,
    setSelectedNoteIds,
    setSelectedCell,
    setSelectedNoteId,
    setNotes,
    rememberHistory: history.rememberHistory,
    useEditorScore,
    onReorderMeasure: measureActions.reorderMeasure,
  });

  // 10. Effect palette drag-and-drop
  const effectDrop = useStudioEffectDrop({
    gridContainerRef,
    notesRef,
    setNotes,
    rememberHistory: history.rememberHistory,
    useEditorScore,
  });

  // ── Open Effect Palette window ─────────────────
  const onOpenEffectPalette = React.useCallback(() => {
    newWindow({
      id: "studio-effect-palette",
      title: "Effect Palette",
      content: <StudioEffectPaletteContent />,
      description: "Drag effects from this palette onto notes in the grid",
      initialWidth: 480,
      initialHeight: 560,
      minWidth: 340,
      minHeight: 300,
    });
  }, []);

  // ══════════════════════════════════════════════════
  // JSX
  // ══════════════════════════════════════════════════
  return (
    <main className="relative flex h-dvh min-h-0 w-full flex-col bg-background ">
      <>
        {/* {Neon} */}
        {/* <RetroGrid
          className="pointer-events-none z-0 bg-transparent opacity-35"
          angle={68}
          cellSize={64}
          lineColor="#6d28d9"
          opacity={0.7}
        />
        <Particles
          className="pointer-events-none z-1 bg-transparent opacity-55"
          color="#e9d5ff"
          quantity={58}
          staticity={65}
          ease={75}
          size={0.9}
        /> */}
      </>
      {/* Importing overlay */}
      {isImporting && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-8 shadow-lg">
            <svg
              className="h-8 w-8 animate-spin text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm font-medium text-foreground">
              Importing Guitar Pro file…
            </p>
            <p className="text-xs text-muted-foreground">
              Parsing notes, effects & tuning
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <StudioHeader
        title={title}
        onChangeTitle={setTitle}
        notesCount={notes.length}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={history.undo}
        onRedo={history.redo}
        onNewProject={project.createNewProject}
        showSidebar={showSidebar}
        showBottomBar={showBottomBar}
        showPreview={showPreview}
        onToggleSidebar={setShowSidebar}
        onToggleBottomBar={setShowBottomBar}
        onTogglePreview={setShowPreview}
        showBarPanel={showBarPanel}
        showScorePanel={showScorePanel}
        onToggleBarPanel={setShowBarPanel}
        onToggleScorePanel={setShowScorePanel}
        alphaReady={alphaReady}
        isPlaybackRunning={isPlaybackRunning}
        onPlayPause={playback.togglePlayback}
        onStop={playback.stopPlayback}
        onExportAlphaTex={project.exportAlphaTex}
        onImportFile={(file) => void project.importGuitarPro(file)}
        savedProjects={project.projectList.map((p) => ({
          id: p.id,
          name: p.name,
          updatedAt: p.updatedAt,
        }))}
        onOpenProject={project.openSavedProjectById}
        onOpenEffectPalette={onOpenEffectPalette}
      />

      {/* Main layout */}
      <ResizablePanelGroup direction="horizontal" className="min-h-0 flex-1">
        {/* Track panel (left) */}
        {showTrackPanel && trackManager.tracks.length > 0 ? (
          <>
            <ResizablePanel
              defaultSize={12}
              minSize={0}
              maxSize={18}
              collapsible
              collapsedSize={0}
            >
              <StudioTrackPanel
                tracks={trackManager.tracks}
                activeTrackId={trackManager.activeTrackId}
                onSelectTrack={trackManager.setActiveTrackId}
                onAddTrack={trackManager.addTrack}
                onRemoveTrack={trackManager.removeTrack}
                onDuplicateTrack={trackManager.duplicateTrack}
                onRenameTrack={trackManager.renameTrack}
                onSetVolume={trackManager.setTrackVolume}
                onToggleMute={trackManager.toggleTrackMute}
                onToggleSolo={trackManager.toggleTrackSolo}
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        ) : null}

        {/* Sidebar (right of track panel, left of main) */}
        {showSidebar ? (
          <>
            <ResizablePanel
              defaultSize={20}
              minSize={0}
              maxSize={32}
              collapsible
              collapsedSize={0}
            >
              <StudioSidebarPanel
                sidebarRef={sidebar.sidebarRef}
                measureCount={measureCount}
                beatsPerMeasure={beatsPerMeasure}
                stringTuning={stringTuning}
                barNames={barNames}
                notes={deferredNotes}
                noteByCell={deferredNoteByCell}
                barGroups={barGroups}
                groupIdByBar={sidebar.groupIdByBar}
                groupsByParent={sidebar.groupsByParent}
                topLevelGroups={sidebar.topLevelGroups}
                ungroupedBars={sidebar.ungroupedBars}
                sidebarSortableItems={sidebar.sidebarSortableItems}
                firstPitchClassByMeasure={sidebar.firstPitchClassByMeasure}
                expandedBars={sidebar.expandedBars}
                collapsedColumns={sidebar.collapsedColumns}
                sidebarHasFocus={sidebar.sidebarHasFocus}
                activeSidebarBar={activeSidebarBar}
                activeSidebarGroupId={sidebar.activeSidebarGroupId}
                activeSidebarItemKey={sidebar.activeSidebarItemKey}
                selectedSidebarItemKeys={sidebar.selectedSidebarItemKeys}
                selectedSidebarBars={selectedSidebarBars}
                editingBar={sidebar.editingBar}
                editingGroupId={sidebar.editingGroupId}
                editingGroupName={sidebar.editingGroupName}
                batchEditOpen={sidebar.batchEditOpen}
                batchEditDraft={sidebar.batchEditDraft}
                batchTargetNoteCount={sidebar.batchTargetNoteCount}
                sensors={sidebar.sensors}
                draggingColumnKey={sidebar.draggingColumnKey}
                draggingNoteKey={sidebar.draggingNoteKey}
                onSidebarFocusCapture={() => sidebar.setSidebarHasFocus(true)}
                onSidebarBlurCapture={(event) => {
                  const next = event.relatedTarget as Node | null;
                  if (!event.currentTarget.contains(next))
                    sidebar.setSidebarHasFocus(false);
                }}
                selectSidebarItem={sidebar.selectSidebarItem}
                isSidebarItemSelected={sidebar.isSidebarItemSelected}
                onJumpToMeasure={sidebar.jumpToMeasure}
                onToggleBarCollapsed={sidebar.toggleBarCollapsed}
                onJumpToBarColumnString={sidebar.jumpToBarColumnString}
                onSetActiveSidebarBar={setActiveSidebarBar}
                onSetActiveSidebarGroupId={sidebar.setActiveSidebarGroupId}
                onSetSidebarHasFocus={sidebar.setSidebarHasFocus}
                onSetSelectedSidebarBars={setSelectedSidebarBars}
                selectionAnchorRef={sidebar.selectionAnchorRef}
                onSetBarNames={setBarNames}
                onCommitRenameBar={sidebar.commitRenameBar}
                onSetEditingBar={sidebar.setEditingBar}
                onSetEditingGroupId={sidebar.setEditingGroupId}
                onSetEditingGroupName={sidebar.setEditingGroupName}
                onAddBarBelow={measureActions.addBarBelow}
                onDuplicateMeasureAt={measureActions.duplicateMeasureAt}
                onClearMeasureAt={measureActions.clearMeasureAt}
                onDeleteMeasureAt={measureActions.deleteMeasureAt}
                onCreateGroupFromSelection={sidebar.createGroupFromSelection}
                onStartRenameGroup={sidebar.startRenameGroup}
                onCommitRenameGroup={sidebar.commitRenameGroup}
                onDuplicateGroup={sidebar.duplicateGroup}
                onRemoveGroup={sidebar.removeGroup}
                onToggleGroupCollapsed={sidebar.toggleGroupCollapsed}
                onDeleteSidebarSelection={sidebar.deleteSidebarSelection}
                onOpenBatchEditFromKey={sidebar.openBatchEditFromKey}
                onSetBatchEditOpen={sidebar.setBatchEditOpen}
                onSetBatchEditDraft={sidebar.setBatchEditDraft}
                onApplyBatchEdit={sidebar.applyBatchEditToTargets}
                onCopySelectedSidebarNotes={gridInteraction.copySelectedNotes}
                onSelectAllInMeasure={gridInteraction.selectAllInMeasure}
                onSetCollapsedColumns={sidebar.setCollapsedColumns}
                onSetExpandedBars={sidebar.setExpandedBars}
                onSetDraggingColumnKey={sidebar.setDraggingColumnKey}
                onSetDraggingNoteKey={sidebar.setDraggingNoteKey}
                onRememberHistory={history.rememberHistory}
                onSetNotes={setNotes}
                notesRef={notesRef}
                onUseEditorScore={useEditorScore}
                onBarDragEnd={sidebar.handleBarDragEnd}
                renameInputRef={sidebar.renameInputRef}
                groupRenameInputRef={sidebar.groupRenameInputRef}
                showBarPanel={showBarPanel}
                showScorePanel={showScorePanel}
                scoreSettings={scoreSettings}
                onChangeScoreSettings={(patch) =>
                  setScoreSettings((prev) => ({ ...prev, ...patch }))
                }
              />
            </ResizablePanel>
            <ResizableHandle withHandle />
          </>
        ) : null}

        <ResizablePanel
          defaultSize={
            showSidebar && showTrackPanel
              ? 68
              : showSidebar
                ? 80
                : showTrackPanel
                  ? 88
                  : 100
          }
          minSize={50}
        >
          <StudioMainContent
            stringTuning={stringTuning}
            notes={notes}
            noteByCell={noteByCell}
            noteByBeat={noteByBeat}
            beatEffectFlags={beatEffectFlags}
            selectedCell={selectedCell}
            selectedNote={selectedNote}
            measureCount={measureCount}
            beatsPerMeasure={beatsPerMeasure}
            timeSignatureNumerator={timeSignatureNumerator}
            tempo={tempo}
            cellWidth={cellWidth}
            defaultDuration={defaultDuration}
            projectDisplayName={project.projectDisplayName}
            hasCopiedMeasure={hasCopiedMeasure}
            hasActiveSelection={hasActiveSelection}
            isPlaybackRunning={isPlaybackRunning}
            alphaStatus={alphaStatus}
            alphaHostRef={alphaHostRef}
            isDarkMode={isDarkMode}
            showSidebar={showSidebar}
            showBottomBar={showBottomBar}
            showPreview={showPreview}
            onToggleSidebar={setShowSidebar}
            gridContainerRef={gridContainerRef}
            onSelectCell={noteActions.addOrSelectCell}
            onUpdateNote={noteActions.updateNoteById}
            onRemoveNote={noteActions.removeNoteById}
            onClickRulerBeat={playback.handleClickRulerBeat}
            selectedNoteIds={selectedNoteIds}
            marqueeRect={gridInteraction.marqueeRect}
            onGridPointerDown={gridInteraction.onGridPointerDown}
            onGridPointerMove={gridInteraction.onGridPointerMove}
            onGridPointerUp={gridInteraction.onGridPointerUp}
            onDeleteSelected={gridInteraction.deleteSelectedNotes}
            onCopySelected={gridInteraction.copySelectedNotes}
            onPasteNotes={gridInteraction.pasteNotes}
            onSelectAllInMeasure={gridInteraction.selectAllInMeasure}
            onSelectAll={gridInteraction.selectAll}
            onClearSelection={gridInteraction.clearSelection}
            dragBarFrom={gridInteraction.dragBarFrom}
            dragBarOver={gridInteraction.dragBarOver}
            onBarDragStart={gridInteraction.onBarDragStart}
            onBarDragMove={gridInteraction.onBarDragMove}
            onBarDragEnd={gridInteraction.onBarDragEnd}
            onChangeMeasureCount={measureActions.handleChangeMeasureCount}
            onChangeBeatsPerMeasure={measureActions.handleChangeBeatsPerMeasure}
            onChangeTempo={setTempo}
            onChangeCellWidth={setCellWidth}
            copyCurrentMeasure={measureActions.copyCurrentMeasure}
            pasteToCurrentMeasure={measureActions.pasteToCurrentMeasure}
            clearCurrentMeasure={measureActions.clearCurrentMeasure}
            duplicateCurrentMeasure={measureActions.duplicateCurrentMeasure}
            removeSelectedNote={noteActions.removeSelectedNote}
            scrollToPlayhead={playback.scrollToPlayhead}
            onEffectDragOver={effectDrop.onDragOver}
            onEffectDragLeave={effectDrop.onDragLeave}
            onEffectDrop={effectDrop.onDrop}
            onBatchEditSelectedNotes={sidebar.openBatchEditForNoteIds}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
