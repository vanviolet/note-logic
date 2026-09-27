import * as React from "react";

// ════════════════════════════════════════════════════════
// useStudioPlayback
// ════════════════════════════════════════════════════════

export function useStudioPlayback(opts: {
  beatsPerMeasure: number;
  gridContainerRef: React.RefObject<HTMLDivElement | null>;
  stop: () => void;
  playPause: () => void;
  seekToBeat: (measure: number, beat: number) => void;
  setIsPlaybackRunning: React.Dispatch<React.SetStateAction<boolean>>;
  setPlayingNoteIds: React.Dispatch<React.SetStateAction<string[]>>;
  setPlayheadBeat: React.Dispatch<React.SetStateAction<number>>;
}) {
  const {
    beatsPerMeasure,
    gridContainerRef,
    stop,
    playPause,
    seekToBeat,
    setIsPlaybackRunning,
    setPlayingNoteIds,
    setPlayheadBeat,
  } = opts;

  const stopPlayback = React.useCallback(() => {
    stop();
    setIsPlaybackRunning(false);
    setPlayingNoteIds([]);
    const grid = gridContainerRef.current;
    if (grid) {
      grid
        .querySelectorAll(".studio-cell-playing")
        .forEach((el) => el.classList.remove("studio-cell-playing"));
      grid
        .querySelectorAll(".studio-note-playing")
        .forEach((el) => el.classList.remove("studio-note-playing"));
    }
  }, [gridContainerRef, setIsPlaybackRunning, setPlayingNoteIds, stop]);

  const togglePlayback = React.useCallback(() => {
    playPause();
  }, [playPause]);

  const scrollToPlayhead = React.useCallback(() => {
    const grid = gridContainerRef.current;
    if (!grid) return;
    const playing = grid.querySelector(".studio-cell-playing");
    playing?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  }, [gridContainerRef]);

  const handleClickRulerBeat = React.useCallback(
    (measure: number, beat: number) => {
      setPlayheadBeat(measure * beatsPerMeasure + beat);
      seekToBeat(measure, beat);
    },
    [beatsPerMeasure, seekToBeat, setPlayheadBeat],
  );

  return {
    stopPlayback,
    togglePlayback,
    scrollToPlayhead,
    handleClickRulerBeat,
  } as const;
}
