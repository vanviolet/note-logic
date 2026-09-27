import * as React from "react";
import {
  createInitialNotes,
  importAllTracksToStudio,
  importScoreToStudio,
  STRING_TUNING,
} from "../lib/studio-utils";
import { getAllStudioProjects, saveStudioProject } from "../lib/studio-db";
import type { SidebarGroup, StudioProjectSnapshot } from "../lib/studio-types";
import { DEFAULT_SCORE_SETTINGS } from "../types";
import type {
  CellPosition,
  NoteDuration,
  ScoreSettings,
  StudioNote,
  StudioTrack,
} from "../types";
import { createTrack } from "./use-studio-tracks";

// ════════════════════════════════════════════════════════
// useStudioProject
// ════════════════════════════════════════════════════════

export function useStudioProject(opts: {
  notes: StudioNote[];
  title: string;
  measureCount: number;
  beatsPerMeasure: number;
  timeSignatureNumerator: number;
  tempo: number;
  cellWidth: number;
  stringTuning: readonly string[];
  defaultDuration: NoteDuration;
  barNames: string[];
  barGroups: SidebarGroup[];
  alphaTex: string;
  scoreSettings: ScoreSettings;
  tracks: StudioTrack[];
  activeTrackId: string;

  historyRef: React.MutableRefObject<StudioNote[][]>;
  redoRef: React.MutableRefObject<StudioNote[][]>;
  copiedMeasureRef: React.MutableRefObject<StudioNote[] | null>;
  importedScoreRef: React.MutableRefObject<unknown>;

  // setters
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  setMeasureCount: React.Dispatch<React.SetStateAction<number>>;
  setBeatsPerMeasure: React.Dispatch<React.SetStateAction<number>>;
  setTimeSignatureNumerator: React.Dispatch<React.SetStateAction<number>>;
  setTempo: React.Dispatch<React.SetStateAction<number>>;
  setCellWidth: React.Dispatch<React.SetStateAction<number>>;
  setStringTuning: React.Dispatch<React.SetStateAction<readonly string[]>>;
  setDefaultDuration: React.Dispatch<React.SetStateAction<NoteDuration>>;
  setBarNames: React.Dispatch<React.SetStateAction<string[]>>;
  setBarGroups: React.Dispatch<React.SetStateAction<SidebarGroup[]>>;
  setNotes: React.Dispatch<React.SetStateAction<StudioNote[]>>;
  setSelectedCell: React.Dispatch<React.SetStateAction<CellPosition | null>>;
  setSelectedNoteId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsPlaybackRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayheadBeat: React.Dispatch<React.SetStateAction<number>>;
  setCanUndo: React.Dispatch<React.SetStateAction<boolean>>;
  setCanRedo: React.Dispatch<React.SetStateAction<boolean>>;
  setHasCopiedMeasure: React.Dispatch<React.SetStateAction<boolean>>;
  setIsImporting: React.Dispatch<React.SetStateAction<boolean>>;
  setScoreSettings: React.Dispatch<React.SetStateAction<ScoreSettings>>;
  setTracks: React.Dispatch<React.SetStateAction<StudioTrack[]>>;
  setActiveTrackId: (id: string) => void;

  setAlphaStatus: (status: string) => void;
  useEditorScore: () => void;
  renderImportedScore: (score: unknown, tracks: number[]) => void;
  resetSidebarState: (measureCount: number, beatsPerMeasure: number) => void;
}) {
  const {
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
    alphaTex,
    scoreSettings,
    tracks,
    activeTrackId,
    historyRef,
    redoRef,
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
    setTracks,
    setActiveTrackId,
    setAlphaStatus,
    useEditorScore,
    renderImportedScore,
    resetSidebarState,
  } = opts;

  // ── Project persistence ────────────────────────────

  const [projectList, setProjectList] = React.useState<StudioProjectSnapshot[]>(
    [],
  );
  const [currentProjectId, setCurrentProjectId] = React.useState<string>(
    () => `studio-${crypto.randomUUID()}`,
  );
  const autosaveReadyRef = React.useRef(false);

  const projectDisplayName = React.useMemo(() => {
    const trimmed = title.trim();
    return trimmed.length > 0 ? trimmed : "Untitled Studio Project";
  }, [title]);

  // ── Apply project snapshot ─────────────────────────

  const applyProjectSnapshot = React.useCallback(
    (project: StudioProjectSnapshot) => {
      historyRef.current = [];
      redoRef.current = [];
      copiedMeasureRef.current = null;
      setCurrentProjectId(project.id);
      setTitle(project.title);
      setMeasureCount(project.measureCount);
      setBeatsPerMeasure(project.beatsPerMeasure);
      setTimeSignatureNumerator(project.timeSignatureNumerator);
      setTempo(project.tempo);
      setCellWidth(project.cellWidth);
      setStringTuning(project.stringTuning);
      setDefaultDuration(project.defaultDuration);
      setBarNames(
        project.barNames.length === project.measureCount
          ? project.barNames
          : Array.from(
              { length: project.measureCount },
              (_, i) => project.barNames[i] ?? `Bar ${i + 1}`,
            ),
      );

      const rawGroups = Array.isArray(project.barGroups)
        ? project.barGroups
        : [];
      const ids = new Set(
        rawGroups
          .map((g) => g?.id)
          .filter((id): id is string => typeof id === "string"),
      );
      const normalizedGroups: SidebarGroup[] = rawGroups
        .map((g) => ({
          id: String(g.id),
          name:
            typeof g.name === "string" && g.name.trim().length > 0
              ? g.name
              : "Group",
          bars: Array.from(
            new Set(
              (Array.isArray(g.bars) ? g.bars : [])
                .map((b) => Number(b))
                .filter(
                  (b) =>
                    Number.isFinite(b) && b >= 0 && b < project.measureCount,
                ),
            ),
          ),
          parentGroupId:
            typeof g.parentGroupId === "string" && ids.has(g.parentGroupId)
              ? g.parentGroupId
              : null,
          collapsed: Boolean(g.collapsed),
        }))
        .filter((g) => g.id.length > 0);

      setNotes(project.notes);
      setScoreSettings(project.scoreSettings ?? DEFAULT_SCORE_SETTINGS);

      // Restore multi-track data if present
      if (Array.isArray(project.tracks) && project.tracks.length > 0) {
        setTracks(project.tracks);
        if (project.activeTrackId) setActiveTrackId(project.activeTrackId);
      } else {
        // Legacy single-track project → wrap notes into a single track
        setTracks([
          createTrack(
            {
              name:
                project.scoreSettings?.trackName ??
                DEFAULT_SCORE_SETTINGS.trackName,
              instrument:
                project.scoreSettings?.instrument ??
                DEFAULT_SCORE_SETTINGS.instrument,
              tuning: [...project.stringTuning],
              capo: project.scoreSettings?.capo ?? 0,
              notes: project.notes,
            },
            0,
          ),
        ]);
      }

      setSelectedCell(null);
      setSelectedNoteId(null);
      setBarGroups(normalizedGroups);
      setPlayheadBeat(0);
      setHasCopiedMeasure(false);
      setCanUndo(false);
      setCanRedo(false);
      resetSidebarState(project.measureCount, project.beatsPerMeasure);
      useEditorScore();
      setAlphaStatus(`Project loaded: ${project.name}`);
    },
    [
      copiedMeasureRef,
      historyRef,
      redoRef,
      resetSidebarState,
      setActiveTrackId,
      setAlphaStatus,
      setBarGroups,
      setBarNames,
      setBeatsPerMeasure,
      setCanRedo,
      setCanUndo,
      setCellWidth,
      setDefaultDuration,
      setHasCopiedMeasure,
      setMeasureCount,
      setNotes,
      setPlayheadBeat,
      setScoreSettings,
      setSelectedCell,
      setSelectedNoteId,
      setStringTuning,
      setTempo,
      setTimeSignatureNumerator,
      setTitle,
      setTracks,
      useEditorScore,
    ],
  );

  // ── Create new project ─────────────────────────────

  const createNewProject = React.useCallback(() => {
    historyRef.current = [];
    redoRef.current = [];
    copiedMeasureRef.current = null;
    setCurrentProjectId(`studio-${crypto.randomUUID()}`);
    setTitle("Untitled Studio Project");
    setMeasureCount(4);
    setBeatsPerMeasure(4);
    setTimeSignatureNumerator(4);
    setTempo(96);
    setCellWidth(56);
    setStringTuning(STRING_TUNING);
    setDefaultDuration(4);
    setBarNames(Array.from({ length: 4 }, (_, i) => `Bar ${i + 1}`));
    const initialNotes = createInitialNotes();
    setNotes(initialNotes);
    // Reset tracks to single default track
    const defaultTrack = createTrack(
      {
        name: "Guitar",
        notes: initialNotes,
      },
      0,
    );
    setTracks([defaultTrack]);
    setActiveTrackId(defaultTrack.id);
    setSelectedCell(null);
    setSelectedNoteId(null);
    setBarGroups([]);
    setScoreSettings(DEFAULT_SCORE_SETTINGS);
    setPlayheadBeat(0);
    setHasCopiedMeasure(false);
    setCanUndo(false);
    setCanRedo(false);
    resetSidebarState(4, 4);
    useEditorScore();
    setAlphaStatus("New project created");
  }, [
    copiedMeasureRef,
    historyRef,
    redoRef,
    resetSidebarState,
    setActiveTrackId,
    setAlphaStatus,
    setBarGroups,
    setBarNames,
    setBeatsPerMeasure,
    setCanRedo,
    setCanUndo,
    setCellWidth,
    setDefaultDuration,
    setHasCopiedMeasure,
    setMeasureCount,
    setNotes,
    setPlayheadBeat,
    setScoreSettings,
    setSelectedCell,
    setSelectedNoteId,
    setStringTuning,
    setTempo,
    setTimeSignatureNumerator,
    setTitle,
    setTracks,
    useEditorScore,
  ]);

  // ── Import / Export ────────────────────────────────

  const applyImportedTrack = React.useCallback(
    (trackIndex: number) => {
      const score = importedScoreRef.current;
      if (!score) return;
      const imported = importScoreToStudio(
        score as Parameters<typeof importScoreToStudio>[0],
        trackIndex,
      );

      historyRef.current = [];
      redoRef.current = [];
      copiedMeasureRef.current = null;
      setTitle(imported.title);
      setTempo(imported.tempo);
      setMeasureCount(imported.measureCount);
      setTimeSignatureNumerator(imported.timeSignatureNumerator);
      setBeatsPerMeasure(imported.gridStepsPerMeasure);
      setStringTuning(imported.tuning);
      setBarNames(
        Array.from({ length: imported.measureCount }, (_, i) => `Bar ${i + 1}`),
      );
      setNotes(imported.notes);
      setSelectedCell(null);
      setSelectedNoteId(null);
      setBarGroups([]);
      setDefaultDuration(imported.notes[0]?.duration ?? 4);
      setScoreSettings(imported.scoreSettings);
      setPlayheadBeat(0);
      setHasCopiedMeasure(false);
      setCanUndo(false);
      setCanRedo(false);
      resetSidebarState(imported.measureCount, imported.gridStepsPerMeasure);
      renderImportedScore(score, [trackIndex]);
      setAlphaStatus(
        imported.warnings.length > 0
          ? `Track ${trackIndex + 1} loaded (${imported.warnings.join("; ")})`
          : `Track ${trackIndex + 1} loaded`,
      );
    },
    [
      copiedMeasureRef,
      historyRef,
      importedScoreRef,
      redoRef,
      renderImportedScore,
      resetSidebarState,
      setAlphaStatus,
      setBarGroups,
      setBarNames,
      setBeatsPerMeasure,
      setCanRedo,
      setCanUndo,
      setDefaultDuration,
      setHasCopiedMeasure,
      setMeasureCount,
      setNotes,
      setPlayheadBeat,
      setScoreSettings,
      setSelectedCell,
      setSelectedNoteId,
      setStringTuning,
      setTempo,
      setTimeSignatureNumerator,
      setTitle,
    ],
  );

  const exportAlphaTex = React.useCallback(() => {
    const blob = new Blob([alphaTex], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studio-${new Date().toISOString().slice(0, 19).replace(/:/g, "-")}.alphatex`;
    a.click();
    URL.revokeObjectURL(url);
  }, [alphaTex]);

  const importGuitarPro = React.useCallback(
    async (file: File) => {
      setIsImporting(true);
      try {
        const alphaTab = await import("@coderline/alphatab");
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const score = alphaTab.importer.ScoreLoader.loadScoreFromBytes(bytes);
        importedScoreRef.current = score;

        // Import ALL tracks from the GP file
        const result = importAllTracksToStudio(score);

        historyRef.current = [];
        redoRef.current = [];
        copiedMeasureRef.current = null;
        setTitle(result.title);
        setTempo(result.tempo);
        setMeasureCount(result.measureCount);
        setTimeSignatureNumerator(result.timeSignatureNumerator);
        setBeatsPerMeasure(result.gridStepsPerMeasure);

        // Set tracks first, then the active track's tuning/notes
        setTracks(result.tracks);
        const firstTrack = result.tracks[0];
        if (firstTrack) {
          setActiveTrackId(firstTrack.id);
          setStringTuning(firstTrack.tuning);
          setNotes(firstTrack.notes);
          setDefaultDuration(firstTrack.notes[0]?.duration ?? 4);
        }

        setBarNames(
          Array.from({ length: result.measureCount }, (_, i) => `Bar ${i + 1}`),
        );
        setSelectedCell(null);
        setSelectedNoteId(null);
        setBarGroups([]);
        setScoreSettings(result.scoreSettings);
        setPlayheadBeat(0);
        setHasCopiedMeasure(false);
        setCanUndo(false);
        setCanRedo(false);
        setIsPlaybackRunning(false);
        resetSidebarState(result.measureCount, result.gridStepsPerMeasure);

        // Render imported score showing only the active (first) track
        renderImportedScore(score, [0]);

        const trackNames = result.tracks.map((t) => t.name).join(", ");
        setAlphaStatus(
          result.warnings.length > 0
            ? `Loaded ${result.tracks.length} tracks (${trackNames}) — ${result.warnings.join("; ")}`
            : `Loaded ${result.tracks.length} tracks: ${trackNames}`,
        );
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAlphaStatus(`Failed to import ${file.name}: ${message}`);
      } finally {
        setIsImporting(false);
      }
    },
    [
      copiedMeasureRef,
      historyRef,
      importedScoreRef,
      redoRef,
      renderImportedScore,
      resetSidebarState,
      setActiveTrackId,
      setAlphaStatus,
      setBarGroups,
      setBarNames,
      setBeatsPerMeasure,
      setCanRedo,
      setCanUndo,
      setDefaultDuration,
      setHasCopiedMeasure,
      setIsImporting,
      setIsPlaybackRunning,
      setMeasureCount,
      setNotes,
      setPlayheadBeat,
      setScoreSettings,
      setSelectedCell,
      setSelectedNoteId,
      setStringTuning,
      setTempo,
      setTimeSignatureNumerator,
      setTitle,
      setTracks,
    ],
  );

  // ── Open saved project ─────────────────────────────

  const openSavedProjectById = React.useCallback(
    (projectId: string) => {
      const project = projectList.find((p) => p.id === projectId);
      if (project) applyProjectSnapshot(project);
    },
    [applyProjectSnapshot, projectList],
  );

  // ── Persistence: load + autosave ───────────────────

  React.useEffect(() => {
    let canceled = false;
    async function loadProjects() {
      if (typeof window === "undefined") return;
      try {
        const projects = await getAllStudioProjects();
        if (canceled) return;
        setProjectList(projects);
        if (projects.length > 0) applyProjectSnapshot(projects[0]);
      } catch {
        if (!canceled) setAlphaStatus("Unable to load saved projects");
      } finally {
        if (!canceled) autosaveReadyRef.current = true;
      }
    }
    void loadProjects();
    return () => {
      canceled = true;
    };
  }, []); // intentionally run only on mount

  React.useEffect(() => {
    if (!autosaveReadyRef.current || typeof window === "undefined") return;
    const timeout = window.setTimeout(async () => {
      const snapshot: StudioProjectSnapshot = {
        id: currentProjectId,
        name: projectDisplayName,
        updatedAt: Date.now(),
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
        scoreSettings,
        notes,
        tracks,
        activeTrackId,
      };
      try {
        await saveStudioProject(snapshot);
        const projects = await getAllStudioProjects();
        setProjectList(projects);
      } catch {
        setAlphaStatus("Autosave failed");
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [
    activeTrackId,
    barGroups,
    barNames,
    beatsPerMeasure,
    cellWidth,
    currentProjectId,
    defaultDuration,
    measureCount,
    notes,
    projectDisplayName,
    scoreSettings,
    setAlphaStatus,
    stringTuning,
    tempo,
    timeSignatureNumerator,
    title,
    tracks,
  ]);

  return {
    projectList,
    currentProjectId,
    projectDisplayName,
    applyProjectSnapshot,
    createNewProject,
    applyImportedTrack,
    exportAlphaTex,
    importGuitarPro,
    openSavedProjectById,
  } as const;
}
