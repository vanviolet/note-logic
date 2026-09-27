// ════════════════════════════════════════════════════════
// Add Song Sheet (Side Panel)
// ════════════════════════════════════════════════════════

import { useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/templates/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/templates/components/ui/sheet";
import { Input } from "~/templates/components/ui/input";
import { Label } from "~/templates/components/ui/label";
import { Textarea } from "~/templates/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/templates/components/ui/select";
import type { SongDifficulty } from "~/theory-music/songbook/types";

// ── Options ────────────────────────────────────────────

const DIFFICULTY_OPTIONS: { value: SongDifficulty; label: string }[] = [
  { value: "beginner", label: "Pemula" },
  { value: "intermediate", label: "Menengah" },
  { value: "advanced", label: "Lanjutan" },
  { value: "expert", label: "Expert" },
];

const KEY_OPTIONS = [
  "C",
  "C#",
  "Db",
  "D",
  "D#",
  "Eb",
  "E",
  "F",
  "F#",
  "Gb",
  "G",
  "G#",
  "Ab",
  "A",
  "A#",
  "Bb",
  "B",
  "Am",
  "A#m",
  "Bbm",
  "Bm",
  "Cm",
  "C#m",
  "Dbm",
  "Dm",
  "D#m",
  "Ebm",
  "Em",
  "Fm",
  "F#m",
  "Gbm",
  "Gm",
  "G#m",
  "Abm",
];

const TIME_SIG_OPTIONS = ["4/4", "3/4", "6/8", "2/4", "12/8"];

// ── Component ──────────────────────────────────────────

export function AddSongSheet() {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const actionData = fetcher.data as
    | { ok: true }
    | { ok: false; error: string }
    | undefined;

  // Close on success
  if (actionData?.ok && open) {
    queueMicrotask(() => setOpen(false));
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah Lagu
        </Button>
      </SheetTrigger>

      <SheetContent className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Tambah Lagu Baru</SheetTitle>
          <SheetDescription>
            Tambahkan lagu baru ke songbook. Gunakan format ChordPro untuk chord
            sheet.
          </SheetDescription>
        </SheetHeader>

        <fetcher.Form method="post" className="mt-6 space-y-4">
          <input type="hidden" name="_action" value="add-song" />

          {/* Title & Artist */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="title">
                Judul <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Somewhere Only We Know"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="artist">
                Artis <span className="text-destructive">*</span>
              </Label>
              <Input id="artist" name="artist" placeholder="Keane" required />
            </div>
          </div>

          {/* Key & Difficulty */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>
                Kunci <span className="text-destructive">*</span>
              </Label>
              <Select name="key" required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kunci" />
                </SelectTrigger>
                <SelectContent>
                  {KEY_OPTIONS.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>
                Difficulty <span className="text-destructive">*</span>
              </Label>
              <Select name="difficulty" required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih level" />
                </SelectTrigger>
                <SelectContent>
                  {DIFFICULTY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Album & Year */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="album">Album</Label>
              <Input id="album" name="album" placeholder="Hopes and Fears" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Tahun</Label>
              <Input
                id="year"
                name="year"
                type="number"
                placeholder="2004"
                min={1900}
                max={2100}
              />
            </div>
          </div>

          {/* Capo, BPM, Time Sig */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <Label htmlFor="capo">Capo</Label>
              <Input
                id="capo"
                name="capo"
                type="number"
                placeholder="0"
                min={0}
                max={12}
                defaultValue={0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bpm">BPM</Label>
              <Input
                id="bpm"
                name="bpm"
                type="number"
                placeholder="120"
                min={30}
                max={300}
              />
            </div>
            <div className="space-y-2">
              <Label>Time Sig</Label>
              <Select name="timeSignature" defaultValue="4/4">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_SIG_OPTIONS.map((ts) => (
                    <SelectItem key={ts} value={ts}>
                      {ts}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tuning */}
          <div className="space-y-2">
            <Label htmlFor="tuning">Tuning</Label>
            <Input
              id="tuning"
              name="tuning"
              placeholder="E A D G B E"
              defaultValue="E A D G B E"
            />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre">Genre (pisah koma)</Label>
            <Input
              id="genre"
              name="genre"
              placeholder="pop, rock, alternative"
            />
          </div>

          {/* Strumming Pattern */}
          <div className="space-y-2">
            <Label htmlFor="strummingPattern">Pola Strumming</Label>
            <Input
              id="strummingPattern"
              name="strummingPattern"
              placeholder="D DU UDU"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Catatan / Tips</Label>
            <Input
              id="notes"
              name="notes"
              placeholder="Mainkan dengan ringan di bagian verse"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (pisah koma)</Label>
            <Input id="tags" name="tags" placeholder="akustik, sedih, ballad" />
          </div>

          {/* Chord Sheet */}
          <div className="space-y-2">
            <Label htmlFor="chordSheet">
              Chord Sheet <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground">
              Gunakan format ChordPro. Mulai setiap bagian dengan header section
              dalam kurung siku, misal <code>[Intro]</code>,{" "}
              <code>[Verse 1]</code>, <code>[Chorus]</code>, dll.
            </p>
            <Textarea
              id="chordSheet"
              name="chordSheet"
              placeholder={`[Intro]\n[C]  [Am]  [G]  [F]  x2\n\n[Verse 1]\n[C]I walked across an [Am]empty land\n[G]I knew the pathway like the [F]back of my hand\n\n[Chorus]\n[Am]Oh simple [G]thing, [F]where have you [C]gone?`}
              rows={12}
              className="font-mono text-sm"
              required
            />
          </div>

          {/* Error display */}
          {actionData && !actionData.ok && (
            <p className="text-sm text-destructive">{actionData.error}</p>
          )}

          <SheetFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Menyimpan…" : "Simpan"}
            </Button>
          </SheetFooter>
        </fetcher.Form>
      </SheetContent>
    </Sheet>
  );
}
