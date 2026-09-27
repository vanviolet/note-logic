import * as React from "react";
import type { AlphaTabApiLike, ScoreSource } from "../types";

type UseAlphaTabParams = {
  hostRef: React.RefObject<HTMLDivElement | null>;
  gridContainerRef: React.RefObject<HTMLDivElement | null>;
  alphaTex: string;
  beatsPerMeasure: number;
  noteIdsByBeatRef: React.RefObject<Map<string, string[]>>;
  isDarkMode?: boolean;
  isPlaybackRunning?: boolean;
  /** Active track index for seekToBeat */
  activeTrackIndex?: number;
  /** Per-track effective volumes (respecting mute/solo) */
  trackVolumes?: Map<string, number>;
  /** Ordered track IDs — used to map volume by index */
  trackIds?: string[];
  onPlayheadBeatChange: (beatIndex: number) => void;
  onPlayingNoteIdsChange: (noteIds: string[]) => void;
  onPlaybackStateChange?: (isPlaying: boolean) => void;
};

export function useAlphaTab({
  hostRef,
  gridContainerRef,
  alphaTex,
  beatsPerMeasure,
  noteIdsByBeatRef,
  isDarkMode = false,
  isPlaybackRunning = false,
  activeTrackIndex = 0,
  trackVolumes,
  trackIds,
  onPlayheadBeatChange,
  onPlayingNoteIdsChange,
  onPlaybackStateChange,
}: UseAlphaTabParams) {
  const apiRef = React.useRef<AlphaTabApiLike | null>(null);
  const beatsRef = React.useRef(beatsPerMeasure);
  const attributionObserverRef = React.useRef<MutationObserver | null>(null);

  const [alphaReady, setAlphaReady] = React.useState(false);
  const [alphaStatus, setAlphaStatus] = React.useState("Preparing renderer...");
  const [scoreSource, setScoreSource] = React.useState<ScoreSource>("editor");
  const scoreSourceRef = React.useRef<ScoreSource>(scoreSource);

  // ── Debug: track scoreSource transitions ──
  const prevScoreSourceRef = React.useRef(scoreSource);
  React.useEffect(() => {
    scoreSourceRef.current = scoreSource;
    if (prevScoreSourceRef.current !== scoreSource) {
      console.log(
        `[Studio Debug] scoreSource transition: ${prevScoreSourceRef.current} → ${scoreSource}`,
      );
      prevScoreSourceRef.current = scoreSource;
    }
  }, [scoreSource]);

  // Stable callback refs — avoids re-init when callbacks change
  const cbRef = React.useRef({
    onPlayheadBeatChange,
    onPlayingNoteIdsChange,
    onPlaybackStateChange,
  });
  cbRef.current = {
    onPlayheadBeatChange,
    onPlayingNoteIdsChange,
    onPlaybackStateChange,
  };

  // Track previously highlighted DOM elements for efficient clear
  const prevHighlightRef = React.useRef<{
    cells: Element[];
    notes: Element[];
  }>({ cells: [], notes: [] });

  React.useEffect(() => {
    beatsRef.current = beatsPerMeasure;
  }, [beatsPerMeasure]);

  const hideAlphaTabAttribution = React.useCallback(() => {
    const host = hostRef.current;
    if (!host) return;

    const surfaces = host.querySelectorAll("svg.at-surface-svg");
    surfaces.forEach((surface) => {
      const text = (surface.textContent ?? "").toLowerCase();
      if (text.includes("rendered by alphatab")) {
        (surface as SVGElement).style.display = "none";
      }
    });
  }, [hostRef]);

  React.useEffect(() => {
    let canceled = false;

    async function init() {
      if (typeof window === "undefined" || !hostRef.current) return;

      try {
        const alphaTab = await import("@coderline/alphatab");
        if (canceled || !hostRef.current) return;
        hostRef.current.innerHTML = "";

        const mainColor = isDarkMode
          ? "rgba(241, 245, 249, 1)"
          : "rgba(0, 0, 0, 1)";
        const secondaryColor = isDarkMode
          ? "rgba(148, 163, 184, 1)"
          : "rgba(50, 50, 50, 1)";

        const settings: any = {
          core: { fontDirectory: "/font/" },
          player: {
            enablePlayer: true,
            soundFont: "/soundfont/sonivox.sf3",
            enableCursor: true,
            enableAnimatedBeatCursor: true,
            enableElementHighlighting: true,
          },
          display: {
            resources: {
              mainGlyphColor: mainColor,
              secondaryGlyphColor: secondaryColor,
              staffLineColor: isDarkMode
                ? "rgba(140, 140, 140, 0.9)"
                : "rgba(0, 0, 0, 0.85)",
              barSeparatorColor: isDarkMode
                ? "rgba(140, 140, 140, 0.9)"
                : "rgba(0, 0, 0, 0.85)",
              scoreInfoColor: mainColor,
              barNumberColor: secondaryColor,
            },
          },
        };

        const api = new alphaTab.AlphaTabApi(
          hostRef.current,
          settings,
        ) as AlphaTabApiLike;

        api.playerReady.on(() => {
          (api as any).metronomeVolume = 0;
          (api as any).countInVolume = 0;
          (api as any).masterVolume = 0.9;
          setAlphaReady(true);
          setAlphaStatus("Renderer is ready");

          // Ensure attribution text is hidden after initial render.
          requestAnimationFrame(() => {
            hideAlphaTabAttribution();
          });
        });

        (api as any).playerStateChanged?.on((args: any) => {
          cbRef.current.onPlaybackStateChange?.(Boolean(args?.state === 1));
        });

        (api as any).playerFinished?.on(() => {
          cbRef.current.onPlaybackStateChange?.(false);
          // Clear any remaining highlights via tracked elements
          const prev = prevHighlightRef.current;
          for (const el of prev.cells)
            el.classList.remove("studio-cell-playing");
          for (const el of prev.notes)
            el.classList.remove("studio-note-playing");
          prevHighlightRef.current = { cells: [], notes: [] };
        });

        api.error.on((error: unknown) => {
          const message =
            error instanceof Error ? error.message : String(error);
          setAlphaStatus(`alphaTab error: ${message}`);
        });

        api.activeBeatsChanged.on((args: any) => {
          const activeBeat = args?.activeBeats?.[0];
          if (!activeBeat) return;

          const beatIndex = Number(activeBeat.index ?? 0);
          const measureIndex = Number(activeBeat.voice?.bar?.index ?? 0);

          // Update refs via stable setters (no React re-render)
          cbRef.current.onPlayheadBeatChange(
            measureIndex * beatsRef.current + beatIndex,
          );

          // O(1) lookup via pre-indexed Map (was O(n) filter over all notes)
          const matched =
            noteIdsByBeatRef.current.get(`${measureIndex}:${beatIndex}`) ?? [];
          cbRef.current.onPlayingNoteIdsChange(matched);

          // ── Direct DOM highlighting on the grid (bypasses React) ──
          const grid = gridContainerRef.current;
          if (!grid) return;

          // Clear previous highlights via tracked elements (not querySelectorAll)
          const prev = prevHighlightRef.current;
          for (const el of prev.cells)
            el.classList.remove("studio-cell-playing");
          for (const el of prev.notes)
            el.classList.remove("studio-note-playing");

          // Highlight current beat column (ruler + all string cells)
          const absBeat = measureIndex * 1000 + beatIndex;
          const newCells = grid.querySelectorAll(
            `[data-abs-beat="${absBeat}"]`,
          );
          newCells.forEach((el) => el.classList.add("studio-cell-playing"));

          // Highlight matched note buttons
          const newNotes: Element[] = [];
          for (const noteId of matched) {
            const el = grid.querySelector(`[data-note-btn="${noteId}"]`);
            if (el) {
              el.classList.add("studio-note-playing");
              newNotes.push(el);
            }
          }

          prevHighlightRef.current = {
            cells: Array.from(newCells),
            notes: newNotes,
          };
        });

        apiRef.current = api;
        api.tex(alphaTex);

        hideAlphaTabAttribution();

        // Keep attribution removed across any future DOM updates by alphaTab.
        attributionObserverRef.current?.disconnect();
        attributionObserverRef.current = new MutationObserver(() => {
          hideAlphaTabAttribution();
        });
        attributionObserverRef.current.observe(hostRef.current, {
          childList: true,
          subtree: true,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setAlphaStatus(`Failed to initialize alphaTab: ${message}`);
      }
    }

    void init();

    return () => {
      canceled = true;
      try {
        apiRef.current?.destroy();
      } catch {
        // noop
      }
      if (hostRef.current) {
        hostRef.current.innerHTML = "";
      }
      attributionObserverRef.current?.disconnect();
      attributionObserverRef.current = null;
      apiRef.current = null;
    };
  }, [hideAlphaTabAttribution, hostRef, isDarkMode, noteIdsByBeatRef]);

  React.useEffect(() => {
    if (scoreSource !== "editor" || isPlaybackRunning) return;
    const timeout = setTimeout(() => {
      console.group("[Studio Debug] api.tex() called");
      console.log("scoreSource:", scoreSource);
      console.log("alphaTex (first 500 chars):", alphaTex.slice(0, 500));
      console.log("alphaTex length:", alphaTex.length);
      console.groupEnd();
      apiRef.current?.tex(alphaTex);
      hideAlphaTabAttribution();
    }, 300);
    return () => clearTimeout(timeout);
  }, [alphaTex, hideAlphaTabAttribution, isPlaybackRunning, scoreSource]);

  const playPause = React.useCallback(() => {
    apiRef.current?.playPause();
  }, []);

  const stop = React.useCallback(() => {
    apiRef.current?.stop();
  }, []);

  const activeTrackIndexRef = React.useRef(activeTrackIndex);
  React.useEffect(() => {
    activeTrackIndexRef.current = activeTrackIndex;
  }, [activeTrackIndex]);

  const seekToBeat = React.useCallback((measure: number, beat: number) => {
    const api = apiRef.current as any;
    if (!api?.score?.tracks?.length) return;

    const trackIdx = Math.min(
      activeTrackIndexRef.current,
      api.score.tracks.length - 1,
    );
    const track = api.score.tracks[trackIdx];
    const staves = track?.staves;
    if (!staves?.length) return;

    const bars = staves[0]?.bars;
    if (!bars?.length || measure >= bars.length) return;

    const bar = bars[measure];
    const voices = bar?.voices;
    if (!voices?.length) return;

    const beats = voices[0]?.beats;
    if (!beats?.length) return;

    const targetBeat = beat < beats.length ? beats[beat] : beats[0];
    if (targetBeat?.absolutePlaybackStart != null) {
      api.tickPosition = targetBeat.absolutePlaybackStart;
    }
  }, []);

  const renderImportedScore = React.useCallback(
    (score: unknown, trackIndexes?: number[]) => {
      console.log(
        "[Studio Debug] renderImportedScore called, trackIndexes:",
        trackIndexes,
        "score tracks:",
        (score as any)?.tracks?.length ?? "unknown",
      );
      apiRef.current?.renderScore(score, trackIndexes);
      setScoreSource("imported");
    },
    [],
  );

  /** Switch back to editor-generated AlphaTex mode. */
  const useEditorScore = React.useCallback(() => {
    if (scoreSourceRef.current === "editor") return; // already in editor mode
    console.log(
      "[Studio Debug] useEditorScore() — switching from imported → editor mode",
    );
    setScoreSource("editor");
  }, []);

  // ── Apply per-track volume to alphaTab player ──────
  React.useEffect(() => {
    const api = apiRef.current as any;
    if (!api?.score?.tracks?.length || !trackVolumes || !trackIds) return;

    const volumeLog: string[] = [];
    for (let i = 0; i < api.score.tracks.length; i++) {
      const trackId = trackIds[i];
      if (!trackId) continue;
      const vol = trackVolumes.get(trackId) ?? 0.8;
      const alphaTrack = api.score.tracks[i];
      if (alphaTrack && typeof api.changeTrackVolume === "function") {
        api.changeTrackVolume([alphaTrack], vol);
        volumeLog.push(`track[${i}] "${alphaTrack.name}" vol=${vol}`);
      }
    }
    if (volumeLog.length > 0) {
      console.log(
        "[Studio Debug] Applied track volumes:",
        volumeLog.join(", "),
      );
    }
  }, [trackVolumes, trackIds]);

  return {
    alphaReady,
    alphaStatus,
    scoreSource,
    setAlphaStatus,
    playPause,
    stop,
    seekToBeat,
    renderImportedScore,
    useEditorScore,
  };
}
