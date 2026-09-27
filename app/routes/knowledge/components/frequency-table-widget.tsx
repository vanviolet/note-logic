// ════════════════════════════════════════════════════════
// Knowledge – Frequency Table Widget
// ════════════════════════════════════════════════════════

import { useCallback, useRef, useState } from "react";
import { Music, Volume2, Play } from "lucide-react";
import { cn } from "~/templates/lib/utils";

interface FrequencyTableRow {
  note: string;
  octave: number;
  frequency: number;
  midi: number;
}

interface FrequencyTableWidgetProps {
  rows: FrequencyTableRow[];
}

export function FrequencyTableWidget({ rows }: FrequencyTableWidgetProps) {
  const [playingMidi, setPlayingMidi] = useState<number | null>(null);
  const [filterOctave, setFilterOctave] = useState<number | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  const octaves = [...new Set(rows.map((r) => r.octave))].sort((a, b) => a - b);

  const filteredRows =
    filterOctave !== null
      ? rows.filter((r) => r.octave === filterOctave)
      : rows;

  const playTone = useCallback((freq: number, midi: number) => {
    if (typeof window === "undefined") return;
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext();
    }
    const ctx = ctxRef.current;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.8);

    setPlayingMidi(midi);
    setTimeout(() => setPlayingMidi(null), 800);
  }, []);

  return (
    <div className="space-y-3 rounded-xl border border-border/50 bg-card/50 p-5">
      <h4 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
        <Music className="h-4 w-4 text-primary" />
        Tabel Frekuensi
      </h4>

      {/* Octave filter */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-muted-foreground">Oktaf:</span>
        <button
          type="button"
          onClick={() => setFilterOctave(null)}
          className={cn(
            "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
            filterOctave === null
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 hover:bg-muted",
          )}
        >
          Semua
        </button>
        {octaves.map((oct) => (
          <button
            key={oct}
            type="button"
            onClick={() => setFilterOctave(oct)}
            className={cn(
              "rounded-md px-2 py-0.5 text-xs font-medium transition-colors",
              filterOctave === oct
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 hover:bg-muted",
            )}
          >
            {oct}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                Note
              </th>
              <th className="px-3 py-2 text-left font-semibold text-muted-foreground">
                Oktaf
              </th>
              <th className="px-3 py-2 text-right font-semibold text-muted-foreground">
                Frekuensi (Hz)
              </th>
              <th className="px-3 py-2 text-right font-semibold text-muted-foreground">
                MIDI
              </th>
              <th className="px-3 py-2 text-center font-semibold text-muted-foreground">
                <Volume2 className="mx-auto h-4 w-4" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => {
              const isPlaying = playingMidi === row.midi;
              return (
                <tr
                  key={row.midi}
                  className={cn(
                    "transition-colors border-b border-border/20",
                    isPlaying && "bg-primary/10",
                  )}
                >
                  <td className="px-3 py-1.5 font-medium">{row.note}</td>
                  <td className="px-3 py-1.5 text-muted-foreground">
                    {row.octave}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums">
                    {row.frequency.toFixed(2)}
                  </td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                    {row.midi}
                  </td>
                  <td className="px-3 py-1.5 text-center">
                    <button
                      type="button"
                      onClick={() => playTone(row.frequency, row.midi)}
                      disabled={isPlaying}
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium transition-all",
                        isPlaying
                          ? "bg-primary text-primary-foreground animate-pulse"
                          : "bg-muted/50 hover:bg-primary/20 hover:text-primary",
                      )}
                    >
                      {isPlaying ? (
                        <Music className="mx-auto h-3 w-3 animate-pulse" />
                      ) : (
                        <Play className="mx-auto h-3 w-3" />
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="text-muted-foreground/60 text-[11px]">
        Klik ▶ untuk mendengar nada. Filter oktaf untuk fokus pada range
        tertentu.
      </p>
    </div>
  );
}
