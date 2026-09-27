---
date: 2026-02-25 18:47:44
author: vanviolet
session-chat: ADD TABLE VIEW WITH COLLAPSIBLE ROWS TO CHORD, FAMILY, INTERVAL MODULES
---

## Prompt
Buat module Chord, Family, Interval ada Table Viewnya
 - dan table view ini table collapsible artinya ketika di klik akan membuka detail dan mengirim data ke fretboard panel

## Points of AI Response

### New Files Created

- `app/routes/chord/components/chord-item-table.tsx`
  Collapsible table for all chord data. Each row shows Name, Root, Quality, Family, Notes. Click a row → expands inline detail panel (Formula, Chord Tones, Function Hint) and dispatches `selectChord()` to the fretboard panel store. Selected row gets `bg-primary/5` highlight + "● Viewing" badge. Keyboard accessible (Enter/Space).

- `app/routes/interval/components/interval-item-table.tsx`
  Collapsible table for all interval data. Columns: Name, Symbol, Semitones, Consonance, Root→Note. Expanded detail shows Interval Anatomy (Cents, Ratio, Inversion, Distance Progress bar), How to Use hints, and Description + Aliases. Dispatches `selectInterval()` to fretboard panel store.

### Modified Files

- `app/routes/family/components/family-chord-table.tsx`
  Rewrote from a static read-only table to a fully collapsible interactive table. Now integrates with `useLearnFretboardStore` via `selectFamily()`. Expanded detail shows Role & Description, Common Resolutions, Progressions, and Function Hints. Uses `familyBadgeVariant` for color-coded Family column.

- `app/routes/chord/index.tsx`
  Added `Tabs` (Cards View / Table View) controlled by `view` searchParam. Table tab renders `ChordItemTable` (lazy loaded). Pagination only shown in Cards view. Added `ChordItemTable` lazy import and `ChordItemTableFallback`.

- `app/routes/interval/index.tsx`
  Added `Tabs` (Cards View / Table View) controlled by `view` searchParam. Table tab renders `IntervalItemTable` (lazy loaded). Empty state now unified inside Tabs wrapper. Added `IntervalItemTable` lazy import and `IntervalItemTableFallback`.

- `app/routes/chord/components/chord-fallbacks.tsx`
  Added `ChordItemTableFallback` skeleton component.

- `app/routes/interval/components/interval-fallbacks.tsx`
  Added `IntervalItemTableFallback` skeleton component.

### Architecture Decisions
- All tables use `React.Fragment` with key to render expand rows adjacent to main rows.
- No new state slices were added — collapsible state lives locally in the table component (`useState<string | null>`).
- Fretboard panel integration reuses existing `selectChord` / `selectFamily` / `selectInterval` store actions.
- `view` searchParam defaults to `"cards"` so existing URLs are unaffected.
- Family module already had Tabs, so no changes to `family/index.tsx` were needed.
