import * as React from "react";
import { STRING_TUNING } from "../lib/studio-utils";
import { TRACK_COLORS } from "../types";
import type { StudioNote, StudioTrack } from "../types";

// ════════════════════════════════════════════════════════
// useStudioTracks — multi-track management
// ════════════════════════════════════════════════════════

/**
 * Creates a new blank track with the given parameters.
 */
export function createTrack(
  opts: Partial<StudioTrack> & { name: string },
  colorIndex: number,
): StudioTrack {
  return {
    id: `track-${crypto.randomUUID()}`,
    instrument: "Acoustic Guitar Steel",
    tuning: [...STRING_TUNING],
    capo: 0,
    volume: 0.8,
    isMuted: false,
    isSolo: false,
    color: TRACK_COLORS[colorIndex % TRACK_COLORS.length],
    notes: [],
    ...opts,
  };
}

type UseStudioTracksReturn = {
  tracks: StudioTrack[];
  activeTrackId: string;
  activeTrackIndex: number;
  activeTrack: StudioTrack;

  // Track selection
  setActiveTrackId: (id: string) => void;

  // Track CRUD
  addTrack: (name?: string) => void;
  removeTrack: (id: string) => void;
  duplicateTrack: (id: string) => void;
  renameTrack: (id: string, name: string) => void;

  // Track settings
  setTrackVolume: (id: string, volume: number) => void;
  toggleTrackMute: (id: string) => void;
  toggleTrackSolo: (id: string) => void;
  setTrackInstrument: (id: string, instrument: string) => void;
  setTrackTuning: (id: string, tuning: readonly string[]) => void;
  setTrackCapo: (id: string, capo: number) => void;
  setTrackColor: (id: string, color: string) => void;

  // Notes for the active track (convenience)
  activeNotes: StudioNote[];
  setActiveNotes: React.Dispatch<React.SetStateAction<StudioNote[]>>;

  // Reorder
  moveTrack: (fromIndex: number, toIndex: number) => void;

  // Bulk operations
  setTracks: React.Dispatch<React.SetStateAction<StudioTrack[]>>;

  // State for all track volumes (for alphaTab player)
  trackVolumes: Map<string, number>;
};

export function useStudioTracks(
  initialTrack?: Partial<StudioTrack>,
): UseStudioTracksReturn {
  const defaultTrack = React.useMemo(
    () =>
      createTrack(
        {
          name: initialTrack?.name ?? "Guitar",
          instrument: initialTrack?.instrument ?? "Acoustic Guitar Steel",
          tuning: initialTrack?.tuning ?? [...STRING_TUNING],
          capo: initialTrack?.capo ?? 0,
          notes: initialTrack?.notes ?? [],
          ...initialTrack,
        },
        0,
      ),
    // Run only once on mount
    [],
  );

  const [tracks, setTracks] = React.useState<StudioTrack[]>([defaultTrack]);
  const [activeTrackId, setActiveTrackId] = React.useState(defaultTrack.id);

  // ── Derived ────────────────────────────────────────

  const activeTrackIndex = React.useMemo(
    () =>
      Math.max(
        0,
        tracks.findIndex((t) => t.id === activeTrackId),
      ),
    [tracks, activeTrackId],
  );

  const activeTrack = tracks[activeTrackIndex];

  const activeNotes = activeTrack.notes;

  const trackVolumes = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const t of tracks) {
      map.set(t.id, t.isMuted ? 0 : t.volume);
    }
    return map;
  }, [tracks]);

  // ── Convenience setter for active track notes ──────

  const setActiveNotes: React.Dispatch<React.SetStateAction<StudioNote[]>> =
    React.useCallback(
      (action) => {
        setTracks((prev) =>
          prev.map((t) =>
            t.id === activeTrackId
              ? {
                  ...t,
                  notes:
                    typeof action === "function" ? action(t.notes) : action,
                }
              : t,
          ),
        );
      },
      [activeTrackId],
    );

  // ── CRUD ───────────────────────────────────────────

  const addTrack = React.useCallback((name?: string) => {
    setTracks((prev) => {
      const newTrack = createTrack(
        { name: name ?? `Track ${prev.length + 1}` },
        prev.length,
      );
      setActiveTrackId(newTrack.id);
      return [...prev, newTrack];
    });
  }, []);

  const removeTrack = React.useCallback(
    (id: string) => {
      setTracks((prev) => {
        if (prev.length <= 1) return prev; // must keep at least one track
        const filtered = prev.filter((t) => t.id !== id);
        // If we removed the active track, switch to the first remaining
        if (id === activeTrackId) {
          setActiveTrackId(filtered[0].id);
        }
        return filtered;
      });
    },
    [activeTrackId],
  );

  const duplicateTrack = React.useCallback((id: string) => {
    setTracks((prev) => {
      const source = prev.find((t) => t.id === id);
      if (!source) return prev;
      const newTrack: StudioTrack = {
        ...source,
        id: `track-${crypto.randomUUID()}`,
        name: `${source.name} (copy)`,
        notes: source.notes.map((n) => ({
          ...n,
          id: `n-${crypto.randomUUID()}`,
        })),
      };
      const idx = prev.findIndex((t) => t.id === id);
      const next = [...prev];
      next.splice(idx + 1, 0, newTrack);
      return next;
    });
  }, []);

  const renameTrack = React.useCallback((id: string, name: string) => {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, name } : t)));
  }, []);

  // ── Settings ───────────────────────────────────────

  const setTrackVolume = React.useCallback((id: string, volume: number) => {
    setTracks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, volume: Math.max(0, Math.min(1, volume)) } : t,
      ),
    );
  }, []);

  const toggleTrackMute = React.useCallback((id: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isMuted: !t.isMuted } : t)),
    );
  }, []);

  const toggleTrackSolo = React.useCallback((id: string) => {
    setTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isSolo: !t.isSolo } : t)),
    );
  }, []);

  const setTrackInstrument = React.useCallback(
    (id: string, instrument: string) => {
      setTracks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, instrument } : t)),
      );
    },
    [],
  );

  const setTrackTuning = React.useCallback(
    (id: string, tuning: readonly string[]) => {
      setTracks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, tuning } : t)),
      );
    },
    [],
  );

  const setTrackCapo = React.useCallback((id: string, capo: number) => {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, capo } : t)));
  }, []);

  const setTrackColor = React.useCallback((id: string, color: string) => {
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, color } : t)));
  }, []);

  // ── Reorder ────────────────────────────────────────

  const moveTrack = React.useCallback((fromIndex: number, toIndex: number) => {
    setTracks((prev) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex < 0 ||
        toIndex >= prev.length
      )
        return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  return {
    tracks,
    activeTrackId,
    activeTrackIndex,
    activeTrack,
    setActiveTrackId,
    addTrack,
    removeTrack,
    duplicateTrack,
    renameTrack,
    setTrackVolume,
    toggleTrackMute,
    toggleTrackSolo,
    setTrackInstrument,
    setTrackTuning,
    setTrackCapo,
    setTrackColor,
    activeNotes,
    setActiveNotes,
    moveTrack,
    setTracks,
    trackVolumes,
  };
}
