// ════════════════════════════════════════════════════════
// Music Dictionary – Barrel Index
// ════════════════════════════════════════════════════════
//
// Aggregates every data module, exposes IndexedDB helpers for the
// dictionary page (insert once → query from IDB with pagination/search),
// and re-exports backward-compatible symbols for existing consumers.
// ════════════════════════════════════════════════════════

// ── Re-export types ────────────────────────────────────
export type {
  DictionaryCategory,
  DictionarySubCategory,
  InstrumentContext,
  BravuraSymbolRef,
  GuitarTechniqueInfo,
  AlphaTexRef,
  DictionaryEntry,
} from "./types";

export {
  DICTIONARY_DB_NAME,
  DICTIONARY_DB_VERSION,
  DICTIONARY_STORE_NAME,
  DICTIONARY_INDEXES,
} from "./types";

// ── Import every data module ───────────────────────────
import { PITCH_ENTRIES } from "./data/pitch";
import { INTERVAL_ENTRIES } from "./data/intervals";
import { SCALE_ENTRIES } from "./data/scales";
import { CHORD_ENTRIES } from "./data/chords";
import { HARMONY_ENTRIES } from "./data/harmony";
import { RHYTHM_ENTRIES } from "./data/rhythm";
import { NOTATION_ENTRIES } from "./data/notation";
import { DYNAMICS_ENTRIES } from "./data/dynamics";
import { ARTICULATION_ENTRIES } from "./data/articulation";
import { ORNAMENT_ENTRIES } from "./data/ornaments";
import { TECHNIQUE_ENTRIES } from "./data/techniques";
import { ANALYSIS_ENTRIES } from "./data/analysis";
import { AUDIO_ENTRIES } from "./data/audio";
import { FORM_ENTRIES } from "./data/form";
import { EFFECT_ENTRIES } from "./data/effects";

import type { DictionaryEntry, DictionaryCategory } from "./types";
import {
  DICTIONARY_DB_NAME,
  DICTIONARY_DB_VERSION,
  DICTIONARY_STORE_NAME,
  DICTIONARY_INDEXES,
} from "./types";

// ── Flat list of every entry ───────────────────────────

/** All dictionary entries, merged from every data module. */
export const ALL_ENTRIES: DictionaryEntry[] = [
  ...PITCH_ENTRIES,
  ...INTERVAL_ENTRIES,
  ...SCALE_ENTRIES,
  ...CHORD_ENTRIES,
  ...HARMONY_ENTRIES,
  ...RHYTHM_ENTRIES,
  ...NOTATION_ENTRIES,
  ...DYNAMICS_ENTRIES,
  ...ARTICULATION_ENTRIES,
  ...ORNAMENT_ENTRIES,
  ...TECHNIQUE_ENTRIES,
  ...ANALYSIS_ENTRIES,
  ...AUDIO_ENTRIES,
  ...FORM_ENTRIES,
  ...EFFECT_ENTRIES,
];

// ── Per-category export (convenience) ──────────────────

export {
  PITCH_ENTRIES,
  INTERVAL_ENTRIES,
  SCALE_ENTRIES,
  CHORD_ENTRIES,
  HARMONY_ENTRIES,
  RHYTHM_ENTRIES,
  NOTATION_ENTRIES,
  DYNAMICS_ENTRIES,
  ARTICULATION_ENTRIES,
  ORNAMENT_ENTRIES,
  TECHNIQUE_ENTRIES,
  ANALYSIS_ENTRIES,
  AUDIO_ENTRIES,
  FORM_ENTRIES,
  EFFECT_ENTRIES,
};

// ════════════════════════════════════════════════════════
// IndexedDB Helpers
// ════════════════════════════════════════════════════════

/** Open (or create) the dictionary IndexedDB database. */
function openDictionaryDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DICTIONARY_DB_NAME, DICTIONARY_DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(DICTIONARY_STORE_NAME)) {
        const store = db.createObjectStore(DICTIONARY_STORE_NAME, {
          keyPath: "id",
        });
        // Create all defined indexes
        for (const [name, keyPath] of Object.entries(DICTIONARY_INDEXES)) {
          store.createIndex(name, keyPath as string | string[], {
            unique: false,
          });
        }
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Check whether the store already has data. */
async function storeHasData(db: IDBDatabase): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DICTIONARY_STORE_NAME, "readonly");
    const store = tx.objectStore(DICTIONARY_STORE_NAME);
    const countReq = store.count();
    countReq.onsuccess = () => resolve(countReq.result > 0);
    countReq.onerror = () => reject(countReq.error);
  });
}

/** Bulk-insert all entries into the store. Skips if data already present. */
async function seedStore(db: IDBDatabase): Promise<void> {
  const hasData = await storeHasData(db);
  if (hasData) return; // already seeded

  return new Promise((resolve, reject) => {
    const tx = db.transaction(DICTIONARY_STORE_NAME, "readwrite");
    const store = tx.objectStore(DICTIONARY_STORE_NAME);

    for (const entry of ALL_ENTRIES) {
      store.put(entry);
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

/**
 * Initialise the dictionary IndexedDB.
 * Call this once on page mount — it opens the DB, creates the store
 * (if first visit), and bulk-inserts all entries.
 *
 * Returns the open database handle for subsequent queries.
 */
export async function initDictionaryDB(): Promise<IDBDatabase> {
  const db = await openDictionaryDB();
  await seedStore(db);
  return db;
}

/**
 * Force re-seed: clears all existing entries and re-inserts from the
 * latest in-memory data. Useful after an app update that adds entries.
 */
export async function reseedDictionaryDB(): Promise<void> {
  const db = await openDictionaryDB();

  // clear
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DICTIONARY_STORE_NAME, "readwrite");
    const store = tx.objectStore(DICTIONARY_STORE_NAME);
    const req = store.clear();
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });

  // re-seed
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(DICTIONARY_STORE_NAME, "readwrite");
    const store = tx.objectStore(DICTIONARY_STORE_NAME);
    for (const entry of ALL_ENTRIES) {
      store.put(entry);
    }
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// ── IDB Query Helpers ──────────────────────────────────

export interface DictionaryQueryOptions {
  category?: DictionaryCategory;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface DictionaryQueryResult {
  entries: DictionaryEntry[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Query entries from IndexedDB with optional category filter,
 * full-text search (term + aliases + tags), and pagination.
 */
export async function queryDictionary(
  db: IDBDatabase,
  options: DictionaryQueryOptions = {},
): Promise<DictionaryQueryResult> {
  const { category, search, page = 1, pageSize = 24 } = options;

  const entries = await new Promise<DictionaryEntry[]>((resolve, reject) => {
    const tx = db.transaction(DICTIONARY_STORE_NAME, "readonly");
    const store = tx.objectStore(DICTIONARY_STORE_NAME);

    let req: IDBRequest<DictionaryEntry[]>;

    if (category) {
      const index = store.index("byCategory");
      req = index.getAll(category);
    } else {
      req = store.getAll();
    }

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  // Client-side full-text filter (term, aliases, tags, shortDefinition)
  let filtered = entries;
  if (search) {
    const lc = search.toLowerCase();
    filtered = entries.filter((e) => {
      if (e.term.toLowerCase().includes(lc)) return true;
      if (e.termId?.toLowerCase().includes(lc)) return true;
      if (e.aliases?.some((a) => a.toLowerCase().includes(lc))) return true;
      if (e.tags?.some((t) => t.toLowerCase().includes(lc))) return true;
      if (e.shortDefinition.toLowerCase().includes(lc)) return true;
      return false;
    });
  }

  // Sort: by category → subCategory → sortOrder → term
  filtered.sort((a, b) => {
    if (a.category !== b.category) return a.category.localeCompare(b.category);
    if (a.subCategory !== b.subCategory) {
      return a.subCategory.localeCompare(b.subCategory);
    }
    const sa = a.sortOrder ?? 0;
    const sb = b.sortOrder ?? 0;
    if (sa !== sb) return sa - sb;
    return a.term.localeCompare(b.term);
  });

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return {
    entries: paged,
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

/**
 * Get a single entry by its `id` (slug) from IndexedDB.
 */
export async function getDictionaryEntry(
  db: IDBDatabase,
  id: string,
): Promise<DictionaryEntry | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(DICTIONARY_STORE_NAME, "readonly");
    const store = tx.objectStore(DICTIONARY_STORE_NAME);
    const req = store.get(id);
    req.onsuccess = () => resolve(req.result ?? undefined);
    req.onerror = () => reject(req.error);
  });
}

// ════════════════════════════════════════════════════════
// In-Memory Helpers (no IDB needed – for simple use-cases)
// ════════════════════════════════════════════════════════

/** Lookup map by id for O(1) access without IDB. */
export const DICTIONARY_MAP: ReadonlyMap<string, DictionaryEntry> = new Map(
  ALL_ENTRIES.map((e) => [e.id, e]),
);

/** Get a single entry by id from the in-memory map. */
export function getEntryById(id: string): DictionaryEntry | undefined {
  return DICTIONARY_MAP.get(id);
}

/** Find entries whose term/aliases/tags match a keyword (in-memory). */
export function findEntries(keyword: string): DictionaryEntry[] {
  const lc = keyword.toLowerCase();
  return ALL_ENTRIES.filter((e) => {
    if (e.term.toLowerCase().includes(lc)) return true;
    if (e.termId?.toLowerCase().includes(lc)) return true;
    if (e.aliases?.some((a) => a.toLowerCase().includes(lc))) return true;
    if (e.tags?.some((t) => t.toLowerCase().includes(lc))) return true;
    return false;
  });
}

/** Group entries by category (in-memory). */
export function groupByCategory(): Record<
  DictionaryCategory,
  DictionaryEntry[]
> {
  const groups = {} as Record<DictionaryCategory, DictionaryEntry[]>;
  for (const entry of ALL_ENTRIES) {
    if (!groups[entry.category]) groups[entry.category] = [];
    groups[entry.category].push(entry);
  }
  return groups;
}

// ════════════════════════════════════════════════════════
// Backward-compatible exports for legacy consumers
// ════════════════════════════════════════════════════════

/**
 * @deprecated Use `ALL_ENTRIES` or `DICTIONARY_MAP` instead.
 * Record<term, entry> for the old `MUSIC_DICTIONARY` shape.
 */
export const MUSIC_DICTIONARY: Record<string, DictionaryEntry> =
  Object.fromEntries(ALL_ENTRIES.map((e) => [e.term, e]));

/**
 * @deprecated Use `ALL_ENTRIES` instead.
 */
export const MUSIC_DICTIONARY_LIST: DictionaryEntry[] = ALL_ENTRIES;

/**
 * @deprecated Use `getEntryById` instead.
 */
export function getMusicTerm(term: string): DictionaryEntry | undefined {
  return ALL_ENTRIES.find((e) => e.term.toLowerCase() === term.toLowerCase());
}

/**
 * @deprecated Use `findEntries` instead.
 */
export function findMusicTerms(keyword: string): DictionaryEntry[] {
  return findEntries(keyword);
}
