// ════════════════════════════════════════════════════════
// Add Dictionary Entry Dialog
// ════════════════════════════════════════════════════════

import { useState } from "react";
import { useFetcher } from "react-router";
import { Button } from "~/templates/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/templates/components/ui/dialog";
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
import type {
  DictionaryCategory,
  InstrumentContext,
} from "~/theory-music/dictionary/types";

// ── Category & sub-category options ────────────────────

const CATEGORY_OPTIONS: { value: DictionaryCategory; label: string }[] = [
  { value: "notation", label: "Notasi" },
  { value: "rhythm", label: "Ritme" },
  { value: "pitch", label: "Pitch" },
  { value: "interval", label: "Interval" },
  { value: "scale", label: "Skala" },
  { value: "chord", label: "Chord" },
  { value: "harmony", label: "Harmoni" },
  { value: "form", label: "Bentuk" },
  { value: "analysis", label: "Analisis" },
  { value: "audio", label: "Audio & Akustik" },
  { value: "dynamics", label: "Dinamika" },
  { value: "articulation", label: "Artikulasi" },
  { value: "ornament", label: "Ornamen & Efek" },
  { value: "technique", label: "Teknik Gitar" },
  { value: "effect", label: "Efek Produksi" },
];

const INSTRUMENT_OPTIONS: { value: InstrumentContext; label: string }[] = [
  { value: "general", label: "Umum" },
  { value: "guitar", label: "Gitar" },
  { value: "bass", label: "Bass" },
  { value: "piano", label: "Piano" },
  { value: "strings", label: "Strings" },
  { value: "brass", label: "Brass" },
  { value: "woodwind", label: "Woodwind" },
  { value: "percussion", label: "Perkusi" },
  { value: "voice", label: "Vokal" },
];

// ── Component ──────────────────────────────────────────

export function AddEntryDialog() {
  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  // Close dialog on successful submission
  const actionData = fetcher.data as
    | { ok: true }
    | { ok: false; error: string }
    | undefined;

  // Reset & close when successful
  if (actionData?.ok && open) {
    // Use a microtask to avoid updating state during render
    queueMicrotask(() => setOpen(false));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
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
          Tambah Istilah
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Istilah Baru</DialogTitle>
          <DialogDescription>
            Tambahkan istilah musik baru ke kamus. Entri yang ditambahkan akan
            ditandai sebagai kontribusi pengguna.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="_action" value="add-entry" />

          {/* Term */}
          <div className="space-y-2">
            <Label htmlFor="term">
              Istilah <span className="text-destructive">*</span>
            </Label>
            <Input
              id="term"
              name="term"
              placeholder="contoh: Arpeggio"
              required
            />
          </div>

          {/* Indonesian translation */}
          <div className="space-y-2">
            <Label htmlFor="termId">Terjemahan Indonesia</Label>
            <Input
              id="termId"
              name="termId"
              placeholder="contoh: Arpegio / Petikan Terurai"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>
                Kategori <span className="text-destructive">*</span>
              </Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Instrument context */}
            <div className="space-y-2">
              <Label>Instrumen</Label>
              <Select name="instrumentContext" defaultValue="general">
                <SelectTrigger>
                  <SelectValue placeholder="Instrumen" />
                </SelectTrigger>
                <SelectContent>
                  {INSTRUMENT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Short definition */}
          <div className="space-y-2">
            <Label htmlFor="shortDefinition">
              Definisi Singkat <span className="text-destructive">*</span>
            </Label>
            <Input
              id="shortDefinition"
              name="shortDefinition"
              placeholder="Satu baris penjelasan ringkas"
              required
            />
          </div>

          {/* Detailed definition */}
          <div className="space-y-2">
            <Label htmlFor="detailedDefinition">Definisi Lengkap</Label>
            <Textarea
              id="detailedDefinition"
              name="detailedDefinition"
              placeholder="Penjelasan mendalam (mendukung teks multi-baris)…"
              rows={4}
            />
          </div>

          {/* Examples */}
          <div className="space-y-2">
            <Label htmlFor="examples">Contoh (satu per baris)</Label>
            <Textarea
              id="examples"
              name="examples"
              placeholder={"A4 = 440 Hz\nC4 disebut middle C"}
              rows={3}
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (pisah koma)</Label>
            <Input
              id="tags"
              name="tags"
              placeholder="contoh: arpeggio, petikan, teknik gitar"
            />
          </div>

          {/* Aliases */}
          <div className="space-y-2">
            <Label htmlFor="aliases">Alias / Nama Lain (pisah koma)</Label>
            <Input
              id="aliases"
              name="aliases"
              placeholder="contoh: broken chord, chord pecah"
            />
          </div>

          {/* Error display */}
          {actionData && !actionData.ok && (
            <p className="text-sm text-destructive">{actionData.error}</p>
          )}

          <DialogFooter>
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
          </DialogFooter>
        </fetcher.Form>
      </DialogContent>
    </Dialog>
  );
}
