---
date: 2026-02-25 19:10:00
author: vanviolet
session-chat: FIX COLLAPSIBLE TABLE LAYOUT + CREATE NOTIFICATION INSTRUCTIONS
---

## Prompt
- Data detail di setiap collapsible berantakan
- kemudian tolong buatkan copilot-instructions bernama notification.instructions.md ini menyuruh AI untuk menjalankan script .github/notification/run.sh di akhir setelah selesai prompt

## Points of AI Response

### Bug Fix: Collapsible Table Detail Layout (all 3 tables)

Root cause was two issues:
1. `overflow-hidden` on outer wrapper `div` was clipping/conflicting with the expanded row content in some browsers.
2. Grid cells inside `TableCell[colSpan]` lacked `min-w-0 overflow-hidden`, allowing long text to bleed into adjacent grid columns — causing visual overlap especially in Family table's "Role & Description" vs "Progressions".

**Changes applied to all three table files:**
- Removed `overflow-hidden` from outer `div.rounded-xl` wrapper (border-radius still intact via `rounded-xl border`).
- Added `min-w-0 overflow-hidden` to every detail panel `div` inside the expanded row grid.
- Added `wrap-break-word` (Tailwind v4 equivalent of `break-words`) on all long text `<p>` elements.
- Added `w-full` to the detail grid container to ensure it fills the `colSpan` cell properly.
- Family table: spacing between "Common Resolutions" and "Progressions" labels improved (`mt-3` instead of `mt-2`).

**Files modified:**
- `app/routes/chord/components/chord-item-table.tsx`
- `app/routes/family/components/family-chord-table.tsx`
- `app/routes/interval/components/interval-item-table.tsx`

### New File: Notification Instructions

Created `.github/instructions/notification.instructions.md` — a Copilot instruction file that directs the AI to run `.github/notification/run.sh` at the end of every completed prompt using `run_in_terminal` with `isBackground: true`.
