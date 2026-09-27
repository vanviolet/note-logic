// ════════════════════════════════════════════════════════
// Add Chord Dialog
// ════════════════════════════════════════════════════════

import { useState } from "react";
import { useFetcher } from "react-router";
import { Plus } from "lucide-react";
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
import { ROOT_FILTER_OPTIONS } from "~/shared/constants/music";

// ── Options ────────────────────────────────────────────

const SYMBOL_OPTIONS = [
  { value: "", label: "Major (no suffix)" },
  { value: "m", label: "m (Minor)" },
  { value: "dim", label: "dim (Diminished)" },
  { value: "aug", label: "aug (Augmented)" },
  { value: "5", label: "5 (Power)" },
  { value: "sus2", label: "sus2" },
  { value: "sus4", label: "sus4" },
  { value: "6", label: "6" },
  { value: "m6", label: "m6" },
  { value: "7", label: "7 (Dominant)" },
  { value: "maj7", label: "maj7" },
  { value: "m7", label: "m7" },
  { value: "mMaj7", label: "mMaj7" },
  { value: "dim7", label: "dim7" },
  { value: "m7b5", label: "m7b5 (Half-dim)" },
  { value: "9", label: "9" },
  { value: "m9", label: "m9" },
  { value: "maj9", label: "maj9" },
  { value: "add9", label: "add9" },
  { value: "custom", label: "Custom (ketik sendiri)" },
];

// ── Component ──────────────────────────────────────────

export function AddChordDialog() {
  const [open, setOpen] = useState(false);
  const [symbolMode, setSymbolMode] = useState("m");
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state !== "idle";

  const actionData = fetcher.data as
    | { ok: true }
    | { ok: false; error: string }
    | undefined;

  if (actionData?.ok && open) {
    queueMicrotask(() => setOpen(false));
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Tambah Chord
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Tambah Chord Baru</DialogTitle>
          <DialogDescription>
            Tambahkan chord kustom ke koleksi. Chord akan disimpan sebagai
            kontribusi pengguna.
          </DialogDescription>
        </DialogHeader>

        <fetcher.Form method="post" className="space-y-4">
          <input type="hidden" name="_action" value="add-chord" />

          {/* Root */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>
                Root Note <span className="text-destructive">*</span>
              </Label>
              <Select name="root" required defaultValue="C">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih root" />
                </SelectTrigger>
                <SelectContent>
                  {ROOT_FILTER_OPTIONS.map((root) => (
                    <SelectItem key={root} value={root}>
                      {root}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Symbol / Type */}
            <div className="space-y-2">
              <Label>
                Type / Symbol <span className="text-destructive">*</span>
              </Label>
              <Select
                name={symbolMode === "custom" ? undefined : "symbol"}
                value={symbolMode}
                onValueChange={setSymbolMode}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih type" />
                </SelectTrigger>
                <SelectContent>
                  {SYMBOL_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value || "__maj"}
                      value={opt.value || "__maj"}
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Custom symbol input */}
          {symbolMode === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="customSymbol">Custom Symbol</Label>
              <Input
                id="customSymbol"
                name="symbol"
                placeholder="contoh: 7#9, add11, maj13..."
                required
              />
            </div>
          )}

          {symbolMode !== "custom" && (
            <input
              type="hidden"
              name="symbol"
              value={symbolMode === "__maj" ? "" : symbolMode}
            />
          )}

          {/* Formula / Degrees */}
          <div className="space-y-2">
            <Label htmlFor="formula">
              Formula / Degrees <span className="text-destructive">*</span>
            </Label>
            <Input
              id="formula"
              name="formula"
              placeholder="contoh: 1 b3 5 b7 (pisah spasi)"
              required
            />
            <p className="text-xs text-muted-foreground">
              Gunakan: 1, b2, 2, b3, 3, 4, #4, b5, 5, #5, b6, 6, b7, 7, b9, 9,
              #9, 11, #11, b13, 13
            </p>
          </div>

          {/* Nickname */}
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname</Label>
            <Input
              id="nickname"
              name="nickname"
              placeholder="contoh: C Minor Seven Flat Five"
            />
          </div>

          {/* Notes (comma separated) */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes (pisah koma) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="notes"
              name="notes"
              placeholder="contoh: C, Eb, G, Bb"
              required
            />
          </div>

          {/* Aliases */}
          <div className="space-y-2">
            <Label htmlFor="aliases">Alias (pisah koma)</Label>
            <Input
              id="aliases"
              name="aliases"
              placeholder="contoh: Cm7, C-7, Cmin7"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Penjelasan singkat tentang chord dan penggunaannya"
              rows={3}
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
