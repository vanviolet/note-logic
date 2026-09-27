// ════════════════════════════════════════════════════════
// Sight Reading – Explorer Route
// ════════════════════════════════════════════════════════
//
// /sight-reading/explorer — Interactive note explorer
// with audio playback and staff visualization.
// ════════════════════════════════════════════════════════

import { lazy, Suspense } from "react";
import { Link } from "react-router";
import type { Route } from "./+types";
import { Button } from "~/templates/components/ui/button";

const NoteExplorer = lazy(() =>
  import("./components/note-explorer").then((m) => ({
    default: m.NoteExplorer,
  })),
);

export function meta(_: Route.MetaArgs) {
  return [
    { title: "NoteLogic | Explorer Not Interaktif" },
    {
      name: "description",
      content:
        "Jelajahi semua not pada treble dan bass clef secara interaktif. Klik, lihat posisi pada staff, dan dengarkan bunyinya.",
    },
  ];
}

export default function ExplorerPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/sight-reading">← Kembali</Link>
      </Button>
      <Suspense
        fallback={
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="h-4 w-72 rounded bg-muted" />
            <div className="h-48 w-full rounded-xl bg-muted" />
          </div>
        }
      >
        <NoteExplorer />
      </Suspense>
    </div>
  );
}
