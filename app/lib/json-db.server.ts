// ════════════════════════════════════════════════════════
// Server-only JSON Database Utility
// ════════════════════════════════════════════════════════
//
// Provides read/write/insert/delete helpers for user-added
// dictionary and songbook entries stored as JSON files.
//
// ⚠️  .server.ts — never included in client bundles.
// ════════════════════════════════════════════════════════

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import type { DictionaryEntry } from "~/theory-music/dictionary/types";
import type { SongEntry } from "~/theory-music/songbook/types";
import type { ChordEntry } from "~/theory-music/chord";

// ── Paths ──────────────────────────────────────────────

const DATA_DIR = join(process.cwd(), "data");
const DICTIONARY_PATH = join(DATA_DIR, "user-dictionary.json");
const SONGBOOK_PATH = join(DATA_DIR, "user-songbook.json");
const CHORDS_PATH = join(DATA_DIR, "user-chords.json");

// ── Low-level helpers ──────────────────────────────────

async function ensureDir(filePath: string): Promise<void> {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }
}

async function readJSON<T>(filePath: string): Promise<T[]> {
  try {
    await ensureDir(filePath);
    const raw = await readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // File doesn't exist or is invalid — return empty array
    return [];
  }
}

async function writeJSON<T>(filePath: string, data: T[]): Promise<void> {
  await ensureDir(filePath);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// ── Slugify ────────────────────────────────────────────

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-word chars (except spaces/hyphens)
    .replace(/[\s_]+/g, "-") // spaces/underscores → hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .replace(/^-|-$/g, ""); // trim leading/trailing hyphens
}

// ════════════════════════════════════════════════════════
// Dictionary CRUD
// ════════════════════════════════════════════════════════

/** Read all user-added dictionary entries. */
export async function getUserDictionaryEntries(): Promise<DictionaryEntry[]> {
  return readJSON<DictionaryEntry>(DICTIONARY_PATH);
}

/** Add a new user dictionary entry. Returns the created entry. */
export async function addUserDictionaryEntry(
  entry: Omit<DictionaryEntry, "id"> & { id?: string },
): Promise<DictionaryEntry> {
  const entries = await getUserDictionaryEntries();

  const id = entry.id || slugify(entry.term);

  // Prevent duplicates
  if (entries.some((e) => e.id === id)) {
    throw new Error(`Entry with id "${id}" already exists`);
  }

  const newEntry: DictionaryEntry = {
    ...entry,
    id,
  };

  entries.push(newEntry);
  await writeJSON(DICTIONARY_PATH, entries);
  return newEntry;
}

/** Delete a user dictionary entry by id. Returns true if found & deleted. */
export async function deleteUserDictionaryEntry(id: string): Promise<boolean> {
  const entries = await getUserDictionaryEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return false;

  entries.splice(index, 1);
  await writeJSON(DICTIONARY_PATH, entries);
  return true;
}

/** Check if a dictionary entry id exists in user entries. */
export async function isUserDictionaryEntry(id: string): Promise<boolean> {
  const entries = await getUserDictionaryEntries();
  return entries.some((e) => e.id === id);
}

// ════════════════════════════════════════════════════════
// Songbook CRUD
// ════════════════════════════════════════════════════════

/** Read all user-added songbook entries. */
export async function getUserSongbookEntries(): Promise<SongEntry[]> {
  return readJSON<SongEntry>(SONGBOOK_PATH);
}

/** Add a new user songbook entry. Returns the created entry. */
export async function addUserSongbookEntry(
  entry: Omit<SongEntry, "id"> & { id?: string },
): Promise<SongEntry> {
  const entries = await getUserSongbookEntries();

  const id = entry.id || slugify(`${entry.artist}-${entry.title}`);

  // Prevent duplicates
  if (entries.some((e) => e.id === id)) {
    throw new Error(`Song with id "${id}" already exists`);
  }

  const newEntry: SongEntry = {
    ...entry,
    id,
    artistSlug: slugify(entry.artist),
  };

  entries.push(newEntry);
  await writeJSON(SONGBOOK_PATH, entries);
  return newEntry;
}

/** Delete a user songbook entry by id. Returns true if found & deleted. */
export async function deleteUserSongbookEntry(id: string): Promise<boolean> {
  const entries = await getUserSongbookEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return false;

  entries.splice(index, 1);
  await writeJSON(SONGBOOK_PATH, entries);
  return true;
}

/** Check if a song id exists in user entries. */
export async function isUserSongbookEntry(id: string): Promise<boolean> {
  const entries = await getUserSongbookEntries();
  return entries.some((e) => e.id === id);
}

// ════════════════════════════════════════════════════════
// Chord CRUD
// ════════════════════════════════════════════════════════

/** Read all user-added chord entries. */
export async function getUserChordEntries(): Promise<ChordEntry[]> {
  return readJSON<ChordEntry>(CHORDS_PATH);
}

/** Add a new user chord entry. Returns the created entry. */
export async function addUserChordEntry(
  entry: ChordEntry,
): Promise<ChordEntry> {
  const entries = await getUserChordEntries();

  if (entries.some((e) => e.id === entry.id)) {
    throw new Error(`Chord with id "${entry.id}" already exists`);
  }

  entries.push(entry);
  await writeJSON(CHORDS_PATH, entries);
  return entry;
}

/** Delete a user chord entry by id. Returns true if found & deleted. */
export async function deleteUserChordEntry(id: string): Promise<boolean> {
  const entries = await getUserChordEntries();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return false;

  entries.splice(index, 1);
  await writeJSON(CHORDS_PATH, entries);
  return true;
}
