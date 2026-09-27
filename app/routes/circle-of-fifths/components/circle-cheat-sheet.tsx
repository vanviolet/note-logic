// ════════════════════════════════════════════════════════
// Circle of Fifths — Comprehensive Cheat Sheet & Guide
// ════════════════════════════════════════════════════════

import {
  BookOpen,
  Sparkles,
  KeyRound,
  Guitar,
  Compass,
  Zap,
  Music4,
  Layers,
} from "lucide-react";
import { cn } from "~/templates/lib/utils";

export function CircleCheatSheet({ className }: { className?: string }) {
  const cards = [
    {
      title: "1. Rumus Rahasia 6-Chord Pop (The Magic Cluster)",
      icon: Sparkles,
      color: "border-blue-500/30 bg-blue-500/5 text-blue-400",
      content: (
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            Di setiap key mayor, 6 chord paling krusial selalu berkumpul dalam 1 cluster 3 kolom di lingkaran:
          </p>
          <div className="grid grid-cols-3 gap-1 p-2 rounded-lg bg-background/60 font-mono text-center text-xs">
            <div className="p-1 rounded bg-emerald-500/20 text-emerald-300 font-bold">IV (Subdominant)</div>
            <div className="p-1 rounded bg-blue-500/20 text-blue-300 font-bold">I (Tonic Home)</div>
            <div className="p-1 rounded bg-amber-500/20 text-amber-300 font-bold">V (Dominant Push)</div>
            <div className="p-1 rounded bg-emerald-500/10 text-emerald-400 font-medium">ii (Supertonic)</div>
            <div className="p-1 rounded bg-blue-500/10 text-blue-400 font-medium">vi (Relative Minor)</div>
            <div className="p-1 rounded bg-amber-500/10 text-amber-400 font-medium">iii (Mediant)</div>
          </div>
          <p>
            Hampir 90% lagu pop modern (Coldplay, Ed Sheeran, Taylor Swift, Noah) tersusun hanya dari 6 chord tetangga ini!
          </p>
        </div>
      ),
    },
    {
      title: "2. Mnemonic Urutan Kres (♯) & Mol (♭)",
      icon: KeyRound,
      color: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
      content: (
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <div className="space-y-1">
            <strong className="text-foreground">Urutan Kres (♯) – Searah Jarum Jam:</strong>
            <p className="font-mono text-emerald-400 font-bold">F - C - G - D - A - E - B</p>
            <p className="italic text-[11px]">&ldquo;Father Charles Goes Down And Ends Battle&rdquo;</p>
          </div>
          <div className="space-y-1 pt-1 border-t border-border/40">
            <strong className="text-foreground">Urutan Mol (♭) – Berlawanan Jarum Jam:</strong>
            <p className="font-mono text-sky-400 font-bold">B - E - A - D - G - C - F</p>
            <p className="italic text-[11px]">&ldquo;Battle Ends And Down Goes Charles Father&rdquo;</p>
          </div>
        </div>
      ),
    },
    {
      title: "3. Transpose Kilat 3 Detik",
      icon: Zap,
      color: "border-amber-500/30 bg-amber-500/5 text-amber-400",
      content: (
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            Ingin mengubah key lagu tanpa menghitung interval satu per satu?
          </p>
          <ul className="list-disc list-inside space-y-1 text-[11px]">
            <li>Cari posisi chord lagu lama di lingkaran (misal C → G → Am → F).</li>
            <li>Putar bentuk geometri yang sama ke key baru (misal E → B → C#m → A).</li>
            <li>Jarak dan peran harmonik antar chord akan selalu 100% konsisten!</li>
          </ul>
        </div>
      ),
    },
    {
      title: "4. Capo Cheat Sheet untuk Gitaris",
      icon: Guitar,
      color: "border-purple-500/30 bg-purple-500/5 text-purple-400",
      content: (
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            Gunakan shape chord open (C / G / D / E) dan pasang Capo pada fret yang tepat:
          </p>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
            <div className="p-1 rounded bg-background/50 border border-border/40">Key Eb = Capo 1 (D) / Capo 3 (C)</div>
            <div className="p-1 rounded bg-background/50 border border-border/40">Key Ab = Capo 1 (G) / Capo 4 (E)</div>
            <div className="p-1 rounded bg-background/50 border border-border/40">Key Bb = Capo 3 (G) / Capo 1 (A)</div>
            <div className="p-1 rounded bg-background/50 border border-border/40">Key F = Capo 3 (D) / Capo 1 (E)</div>
          </div>
        </div>
      ),
    },
    {
      title: "5. Jazz ii–V–I Circle Walk",
      icon: Music4,
      color: "border-rose-500/30 bg-rose-500/5 text-rose-400",
      content: (
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            Progresi jazz ii–V–I adalah gerak melingkar kuint berlawanan jarum jam:
          </p>
          <p className="font-mono text-primary font-bold">
            Dm7 (ii) → G7 (V) → Cmaj7 (I)
          </p>
          <p>
            Setiap chord melompat 1 langkah counter-clockwise ke resolusi paling alaminya. Rantai ini bisa diperpanjang menjadi <strong>iii → vi → ii → V → I</strong> (Autumn Leaves).
          </p>
        </div>
      ),
    },
    {
      title: "6. Nashville Number System",
      icon: Compass,
      color: "border-indigo-500/30 bg-indigo-500/5 text-indigo-400",
      content: (
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            Musisi studio profesional menyebut chord dengan angka (1, 2, 3, 4, 5, 6, 7) bukan nama huruf:
          </p>
          <div className="grid grid-cols-4 gap-1 font-mono text-[11px] text-center">
            <div className="p-1 rounded bg-background/50">1 = Major</div>
            <div className="p-1 rounded bg-background/50">2 = Minor</div>
            <div className="p-1 rounded bg-background/50">3 = Minor</div>
            <div className="p-1 rounded bg-background/50">4 = Major</div>
            <div className="p-1 rounded bg-background/50">5 = Major/7</div>
            <div className="p-1 rounded bg-background/50">6 = Minor</div>
            <div className="p-1 rounded bg-background/50">7 = Diminished</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-1">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <BookOpen className="size-4 text-primary" />
          Cheat Sheet & Panduan Praktis Lingkaran Kuint
        </h3>
        <p className="text-xs text-muted-foreground">
          Konsep esensial yang wajib diketahui oleh pencipta lagu, gitaris, pianis, dan produser musik.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {cards.map((c, i) => (
          <div
            key={i}
            className={cn(
              "p-4 rounded-xl border space-y-2.5 transition-all duration-200",
              c.color,
            )}
          >
            <h4 className="font-bold text-xs text-foreground flex items-center gap-1.5">
              <c.icon className="size-3.5" />
              {c.title}
            </h4>
            {c.content}
          </div>
        ))}
      </div>
    </div>
  );
}
