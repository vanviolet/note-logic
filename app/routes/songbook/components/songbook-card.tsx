import { Link } from "react-router";
import { Badge } from "~/templates/components/ui/badge";
import { Card, CardContent } from "~/templates/components/ui/card";
import type { SongEntry } from "~/theory-music/songbook/types";
import {
  DIFFICULTY_LABELS,
  DIFFICULTY_COLORS,
  GENRE_LABELS,
} from "../lib/songbook-utils";

export function SongbookCard({ song }: { song: SongEntry }) {
  return (
    <Link
      to={`/songbook/${song.id}`}
      className="group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      prefetch="intent"
    >
      <Card className="h-full transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-md group-hover:shadow-primary/5">
        <CardContent className="flex flex-col gap-2.5 p-5">
          {/* Header: title + difficulty badge */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
              {song.title}
            </h3>
            <Badge
              variant="outline"
              className={`shrink-0 text-[10px] ${DIFFICULTY_COLORS[song.difficulty]}`}
            >
              {DIFFICULTY_LABELS[song.difficulty]}
            </Badge>
          </div>

          {/* Artist */}
          <p className="-mt-1 text-xs text-muted-foreground">{song.artist}</p>

          {/* Key, Capo, BPM row */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 font-mono font-medium">
              🎵 {song.key}
            </span>
            {song.capo ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5">
                Capo {song.capo}
              </span>
            ) : null}
            {song.bpm ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5">
                ♩ {song.bpm} bpm
              </span>
            ) : null}
            {song.timeSignature ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5">
                {song.timeSignature}
              </span>
            ) : null}
          </div>

          {/* Chords used (preview) */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {song.chordsUsed.slice(0, 6).map((chord) => (
              <span
                key={chord}
                className="inline-block rounded bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-primary"
              >
                {chord}
              </span>
            ))}
            {song.chordsUsed.length > 6 && (
              <span className="text-[10px] text-muted-foreground/60">
                +{song.chordsUsed.length - 6}
              </span>
            )}
          </div>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-1 pt-0.5">
            {song.genre.slice(0, 3).map((g) => (
              <span
                key={g}
                className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground"
              >
                {GENRE_LABELS[g] ?? g}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
