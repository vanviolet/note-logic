import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  BookText,
  Brain,
  GraduationCap,
  Guitar,
  Headphones,
  Library,
  ListMusic,
  Mic,
  Music,
  Music2,
  PenTool,
  Sparkles,
  Waves,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Navigation – grouped structure for NavigationMenu                 */
/* ------------------------------------------------------------------ */

export type NavLinkItem = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavLinkItem[];
};

/** Top-level standalone links (no dropdown) */
export type NavDirectLink = {
  label: string;
  href: string;
};

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Belajar",
    items: [
      {
        title: "Chord Explorer",
        href: "/chord",
        description:
          "Jelajahi formula chord, voicing, dan kualitas untuk semua root note.",
        icon: Music2,
      },
      {
        title: "Family Explorer",
        href: "/family",
        description:
          "Pelajari harmonic family: tonic, subdominant, dominant di setiap key.",
        icon: Library,
      },
      {
        title: "Interval Explorer",
        href: "/interval",
        description:
          "Pahami jarak nada, konsonansi, dan dengarkan perbandingan interval.",
        icon: Waves,
      },
      {
        title: "Scale Explorer",
        href: "/scale",
        description:
          "Jelajahi 100+ skala dunia dengan fingering piano/gitar, tips latihan, dan ear training.",
        icon: Sparkles,
      },
      {
        title: "Membaca Not Balok",
        href: "/sight-reading",
        description:
          "Pelajari paranada, kunci, accidental, durasi, dinamika, dan artikulasi secara interaktif.",
        icon: Music,
      },
      {
        title: "Music Knowledge",
        href: "/knowledge",
        description:
          "Artikel interaktif tentang matematika musik, sejarah, akustik, psikologi, dan musik dunia.",
        icon: Brain,
      },
    ],
  },
  {
    label: "Referensi",
    items: [
      {
        title: "Nolopedia",
        href: "/nolopedia",
        description:
          "Kamus teori musik lengkap dengan 500+ istilah dan simbol notasi.",
        icon: BookText,
      },
      {
        title: "Songbook",
        href: "/songbook",
        description:
          "Koleksi chord sheet lagu dengan transpose, auto-scroll, dan chord diagram.",
        icon: ListMusic,
      },
    ],
  },
  {
    label: "Tools",
    items: [
      {
        title: "Tuner",
        href: "/tuner",
        description:
          "Guitar tuner presisi dengan live mic, pitch meter, dan auto string detection.",
        icon: Mic,
      },
      {
        title: "Studio",
        href: "/studio",
        description:
          "Tab editor & composer untuk menulis, edit, dan playback tablature gitar.",
        icon: PenTool,
      },
      {
        title: "Fingering Routine",
        href: "/fingering-routine",
        description:
          "Latihan fingering interaktif gitar & piano dengan audio dan deteksi mic.",
        icon: Headphones,
      },
    ],
  },
];

/** In-page anchor links shown as direct items (no dropdown) */
export const NAV_DIRECT_LINKS: NavDirectLink[] = [];

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */

export const HERO_METRICS = [
  { label: "Modul Interaktif", value: "8" },
  { label: "Istilah Musik", value: "500+" },
  { label: "Chord Sheet", value: "25+" },
];

/* ------------------------------------------------------------------ */
/*  Features                                                          */
/* ------------------------------------------------------------------ */

export type HomeFeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

export const CORE_FEATURES: HomeFeatureItem[] = [
  {
    title: "Chord Explorer",
    description:
      "Eksplorasi formula chord lengkap dengan filter root, family, quality, dan audio playback via interactive fretboard.",
    icon: Guitar,
    href: "/chord",
  },
  {
    title: "Harmonic Family",
    description:
      "Pahami fungsi tonal — tonic, subdominant, dominant — beserta progression dan cadential context di setiap key.",
    icon: Library,
    href: "/family",
  },
  {
    title: "Interval Explorer",
    description:
      "Pelajari jarak nada secara visual dengan filter konsonansi, mode enharmonic, dan perbandingan audio langsung.",
    icon: Waves,
    href: "/interval",
  },
  {
    title: "Guitar Tuner",
    description:
      "Tuner presisi dengan live mic pitch detection, confidence meter LED-style, dan auto target string detection.",
    icon: Mic,
    href: "/tuner",
  },
  {
    title: "Songbook & Chord Sheet",
    description:
      "Koleksi lagu dengan chord diagram, transpose, auto-scroll, dan fitur tambah lagu baru via ChordPro format.",
    icon: ListMusic,
    href: "/songbook",
  },
  {
    title: "Nolopedia — Kamus Musik",
    description:
      "500+ istilah teori musik dengan kategori, simbol Bravura, referensi silang, dan fitur tambah entri baru.",
    icon: BookText,
    href: "/nolopedia",
  },
  {
    title: "Tab Studio",
    description:
      "Editor tablature gitar lengkap: compose, edit effects, playback real-time, dan SoundFont audio rendering.",
    icon: PenTool,
    href: "/studio",
  },
  {
    title: "Music Knowledge",
    description:
      "Artikel interaktif tentang matematika musik Pythagoras, sejarah musik, akustik suara, psikologi musik, dan tradisi musik dunia.",
    icon: Brain,
    href: "/knowledge",
  },
  {
    title: "Interactive Fretboard",
    description:
      "Fretboard interaktif dengan tuning per string, live mic pitch mapping, tone labels, dan click-to-play audio.",
    icon: Headphones,
    href: "/chord",
  },
];

/* ------------------------------------------------------------------ */
/*  Learning Paths                                                    */
/* ------------------------------------------------------------------ */

export type LearningPathItem = {
  title: string;
  level: string;
  description: string;
  highlights: string[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
};

export const LEARNING_PATHS: LearningPathItem[] = [
  {
    title: "Starter Pack",
    level: "Pemula",
    description:
      "Bangun pondasi teori musik: kenali interval, baca formula chord, dan pahami fretboard dasar.",
    highlights: [
      "Interval Explorer: jarak nada & konsonansi",
      "Chord Explorer: formula major, minor, 7th",
      "Nolopedia: istilah dasar musik",
      "Guitar Tuner: tune gitar sebelum latihan",
    ],
    cta: "Mulai dari Interval",
    ctaHref: "/interval",
  },
  {
    title: "Creative Harmony",
    level: "Menengah",
    description:
      "Dalami chord progression, family chord, dan voicing. Mulai aransemen lagu sendiri.",
    highlights: [
      "Family Explorer: tonic, subdominant, dominant",
      "Chord Explorer: extension & altered chord",
      "Songbook: analisis chord sheet lagu populer",
      "Fretboard: visualisasi chord position",
    ],
    cta: "Jelajahi Family",
    ctaHref: "/family",
    featured: true,
  },
  {
    title: "Advanced Lab",
    level: "Lanjutan",
    description:
      "Eksplorasi Tab Studio untuk compose, live pitch mapping, dan audio tools untuk praktik lanjutan.",
    highlights: [
      "Tab Studio: tulis & playback tablature gitar",
      "Live Mic: pitch mapping di fretboard real-time",
      "Songbook: tambah chord sheet lagu sendiri",
      "Nolopedia: referensi teknik lanjutan",
    ],
    cta: "Buka Studio",
    ctaHref: "/studio",
  },
];

/* ------------------------------------------------------------------ */
/*  Upcoming Modules                                                  */
/* ------------------------------------------------------------------ */

export type UpcomingModuleItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  status: "Tersedia" | "Segera Hadir" | "Dalam Riset";
};

export const UPCOMING_MODULES: UpcomingModuleItem[] = [
  {
    title: "Scale Explorer",
    description:
      "Mode analysis, modal interchange, dan eksplorasi scale untuk komposisi.",
    icon: Sparkles,
    status: "Segera Hadir",
  },
  {
    title: "Ear Training",
    description:
      "Latihan pendengaran interval, chord, dan progression berbasis audio.",
    icon: Headphones,
    status: "Dalam Riset",
  },
  {
    title: "Progression Builder",
    description:
      "Tool drag-and-drop untuk membuat chord progression dengan playback.",
    icon: GraduationCap,
    status: "Dalam Riset",
  },
  {
    title: "MIDI Integration",
    description:
      "Koneksi MIDI controller untuk input note langsung ke aplikasi.",
    icon: BookOpen,
    status: "Dalam Riset",
  },
];

/* ------------------------------------------------------------------ */
/*  FAQ                                                               */
/* ------------------------------------------------------------------ */

export type FaqItem = {
  question: string;
  answer: string;
};

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Apakah NoteLogic cocok untuk pemula total?",
    answer:
      "Ya! Mulai dari Interval Explorer untuk memahami jarak nada, lalu lanjut ke Chord Explorer. Semua modul punya penjelasan visual dan bisa diakses tanpa pengetahuan awal.",
  },
  {
    question: "Fitur apa saja yang sudah bisa dipakai sekarang?",
    answer:
      "Saat ini tersedia 7 modul: Chord Explorer, Family Explorer, Interval Explorer, Guitar Tuner, Songbook, Nolopedia (kamus musik 500+ istilah), dan Tab Studio. Semua sudah interaktif dengan audio playback.",
  },
  {
    question: "Apakah ada fitur untuk gitar?",
    answer:
      "Banyak! Guitar Tuner dengan live mic, Interactive Fretboard di halaman belajar, audio playback chord & interval, dan Tab Studio untuk menulis tablature. Tuning per string juga bisa diubah.",
  },
  {
    question: "Bisa menambah lagu atau istilah sendiri?",
    answer:
      "Bisa. Di Songbook, kamu bisa menambah chord sheet lagu baru dalam format ChordPro. Di Nolopedia, kamu bisa menambah entri kamus musik sendiri. Semuanya tersimpan di server.",
  },
  {
    question: "Apakah bisa diakses di HP?",
    answer:
      "Ya. Semua halaman didesain responsive dan mobile-friendly. Layout grid, navigasi, dan komponen interaktif nyaman digunakan dari smartphone maupun tablet.",
  },
  {
    question: "Apa rencana fitur selanjutnya?",
    answer:
      "Kami sedang menyiapkan Scale Explorer, Ear Training, Progression Builder, dan integrasi MIDI controller. Lihat bagian Roadmap untuk detail lebih lanjut.",
  },
];

/* ------------------------------------------------------------------ */
/*  Legacy flat NAV_ITEMS (kept for backward compat if needed)        */
/* ------------------------------------------------------------------ */

export type HomeNavItem = {
  label: string;
  href: string;
};

export const NAV_ITEMS: HomeNavItem[] = NAV_GROUPS.flatMap((group) =>
  group.items.map((item) => ({ label: item.title, href: item.href })),
);
