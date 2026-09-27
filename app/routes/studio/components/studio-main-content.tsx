import * as React from "react";
import {
  ChevronRight,
  ClipboardCopy,
  ClipboardPaste,
  Copy,
  CopyPlus,
  Eraser,
  MousePointerSquareDashed,
  PanelLeft,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "~/templates/components/ui/badge";
import { Button } from "~/templates/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "~/templates/components/ui/context-menu";
import { StudioBottomBar } from "./studio-bottom-bar";
import { StudioGrid } from "./studio-grid";
import { StudioPreviewPanel } from "./studio-preview-panel";
import type { CellPosition, NoteDuration, StudioNote } from "../types";
import type { BeatEffectFlags } from "./studio-grid";
import type { MarqueeRect } from "../hooks/use-studio-grid-interaction";

// ════════════════════════════════════════════════════════
// StudioMainContent
// ════════════════════════════════════════════════════════

export type StudioMainContentProps = {
  // data
  stringTuning: readonly string[];
  notes: StudioNote[];
  noteByCell: Map<string, StudioNote>;
  noteByBeat: Map<string, StudioNote>;
  beatEffectFlags: Map<string, BeatEffectFlags>;
  selectedCell: CellPosition | null;
  selectedNote: StudioNote | null;
  measureCount: number;
  beatsPerMeasure: number;
  timeSignatureNumerator: number;
  tempo: number;
  cellWidth: number;
  defaultDuration: NoteDuration;
  projectDisplayName: string;
  hasCopiedMeasure: boolean;
  hasActiveSelection: boolean;
  isPlaybackRunning: boolean;

  // alphaTab
  alphaStatus: string;
  alphaHostRef: React.RefObject<HTMLDivElement | null>;
  isDarkMode: boolean;

  // layout
  showSidebar: boolean;
  showBottomBar: boolean;
  showPreview: boolean;
  onToggleSidebar: (value: React.SetStateAction<boolean>) => void;

  // grid container ref
  gridContainerRef: React.RefObject<HTMLDivElement | null>;

  // callbacks
  onSelectCell: (cell: CellPosition) => void;
  onUpdateNote: (noteId: string, updates: Partial<StudioNote>) => void;
  onRemoveNote: (noteId: string) => void;
  onClickRulerBeat: (measure: number, beat: number) => void;
  // Multi-select & interaction
  selectedNoteIds: Set<string>;
  marqueeRect: MarqueeRect | null;
  onGridPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  onGridPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onGridPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  onDeleteSelected: () => void;
  onCopySelected: () => void;
  onPasteNotes: () => void;
  onSelectAllInMeasure: (measure: number) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  // Bar drag reorder
  dragBarFrom: number | null;
  dragBarOver: number | null;
  onBarDragStart: (e: React.PointerEvent<HTMLElement>, measure: number) => void;
  onBarDragMove: (e: React.PointerEvent<HTMLElement>) => void;
  onBarDragEnd: (e: React.PointerEvent<HTMLElement>) => void;
  onChangeMeasureCount: (next: number) => void;
  onChangeBeatsPerMeasure: (next: number) => void;
  onChangeTempo: (next: number) => void;
  onChangeCellWidth: (next: number) => void;
  copyCurrentMeasure: () => void;
  pasteToCurrentMeasure: () => void;
  clearCurrentMeasure: () => void;
  duplicateCurrentMeasure: () => void;
  removeSelectedNote: () => void;
  scrollToPlayhead: () => void;
  // Effect palette drag‑and‑drop
  onEffectDragOver?: (e: React.DragEvent<HTMLElement>) => void;
  onEffectDragLeave?: (e: React.DragEvent<HTMLElement>) => void;
  onEffectDrop?: (e: React.DragEvent<HTMLElement>) => void;
  // Batch edit from editor context menu
  onBatchEditSelectedNotes: (noteIds: Set<string>) => void;
};

export function StudioMainContent(props: StudioMainContentProps) {
  const BOTTOM_BAR_HEIGHT = 40;
  const PREVIEW_DEFAULT_HEIGHT = 280;

  const sectionRef = React.useRef<HTMLElement | null>(null);
  const [bottomBarFrame, setBottomBarFrame] = React.useState({
    left: 0,
    width: 0,
  });
  const [previewHeight, setPreviewHeight] = React.useState<number>(
    PREVIEW_DEFAULT_HEIGHT,
  );
  const resizeRef = React.useRef<{
    active: boolean;
    startY: number;
    startHeight: number;
  }>({
    active: false,
    startY: 0,
    startHeight: PREVIEW_DEFAULT_HEIGHT,
  });

  const {
    stringTuning,
    notes,
    noteByCell,
    noteByBeat,
    selectedCell,
    selectedNote,
    measureCount,
    beatsPerMeasure,
    timeSignatureNumerator,
    tempo,
    cellWidth,
    projectDisplayName,
    hasCopiedMeasure,
    hasActiveSelection,
    isPlaybackRunning,
    alphaStatus,
    alphaHostRef,
    isDarkMode,
    showSidebar,
    showBottomBar,
    showPreview,
    onToggleSidebar,
    gridContainerRef,
    onSelectCell,
    onUpdateNote,
    onRemoveNote,
    onClickRulerBeat,
    selectedNoteIds,
    marqueeRect,
    onGridPointerDown,
    onGridPointerMove,
    onGridPointerUp,
    onDeleteSelected,
    onCopySelected,
    onPasteNotes,
    onSelectAllInMeasure,
    onSelectAll,
    onClearSelection,
    dragBarFrom,
    dragBarOver,
    onBarDragStart,
    onBarDragMove,
    onBarDragEnd,
    onChangeMeasureCount,
    onChangeBeatsPerMeasure,
    onChangeTempo,
    onChangeCellWidth,
    copyCurrentMeasure,
    pasteToCurrentMeasure,
    clearCurrentMeasure,
    duplicateCurrentMeasure,
    removeSelectedNote,
    scrollToPlayhead,
    onEffectDragOver,
    onEffectDragLeave,
    onEffectDrop,
    onBatchEditSelectedNotes,
  } = props;

  const previewDisplayHeight = showPreview ? Math.max(8, previewHeight) : 0;
  const fixedBottomOffset =
    (showBottomBar ? BOTTOM_BAR_HEIGHT : 0) + previewDisplayHeight;

  const clampPreviewHeight = React.useCallback((next: number) => {
    if (typeof window === "undefined") return Math.max(0, next);
    const maxHeight = Math.max(120, window.innerHeight - 140);
    return Math.max(0, Math.min(maxHeight, next));
  }, []);

  const startPreviewResize = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      resizeRef.current = {
        active: true,
        startY: event.clientY,
        startHeight: previewHeight,
      };
    },
    [previewHeight],
  );

  React.useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const updateFrame = () => {
      const rect = node.getBoundingClientRect();
      setBottomBarFrame({
        left: Math.max(0, Math.round(rect.left)),
        width: Math.max(0, Math.round(rect.width)),
      });
    };

    updateFrame();

    const observer = new ResizeObserver(updateFrame);
    observer.observe(node);
    window.addEventListener("resize", updateFrame);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateFrame);
    };
  }, [showSidebar]);

  React.useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (!resizeRef.current.active) return;
      const delta = resizeRef.current.startY - event.clientY;
      setPreviewHeight(
        clampPreviewHeight(resizeRef.current.startHeight + delta),
      );
    };

    const onPointerUp = () => {
      if (!resizeRef.current.active) return;
      resizeRef.current.active = false;
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [clampPreviewHeight]);

  React.useEffect(() => {
    if (!showPreview || previewDisplayHeight <= 12) return;
    const raf = window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event("resize"));
    });
    return () => window.cancelAnimationFrame(raf);
  }, [showPreview, previewDisplayHeight, bottomBarFrame.width]);

  // Merge sectionRef and gridContainerRef onto the same <section>
  const mergedRef = React.useCallback(
    (node: HTMLElement | null) => {
      (sectionRef as React.MutableRefObject<HTMLElement | null>).current = node;
      (
        gridContainerRef as React.MutableRefObject<HTMLDivElement | null>
      ).current = node as HTMLDivElement | null;
    },
    [gridContainerRef],
  );

  // Context menu — extract measure from right-clicked cell
  const contextMeasureRef = React.useRef(0);
  const onContextMenu = React.useCallback((event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const cellEl = target.closest("[data-cell-id]");
    if (cellEl) {
      const cellId = cellEl.getAttribute("data-cell-id") ?? "";
      const parts = cellId.split(":");
      if (parts.length >= 2) {
        contextMeasureRef.current = Number(parts[1]) || 0;
      }
    }
  }, []);

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <section
          ref={mergedRef}
          className="relative h-full min-w-0 select-none overflow-auto p-4"
          onPointerDown={onGridPointerDown}
          onPointerMove={onGridPointerMove}
          onPointerUp={onGridPointerUp}
          onContextMenu={onContextMenu}
          onDragOver={onEffectDragOver}
          onDragLeave={onEffectDragLeave}
          onDrop={onEffectDrop}
        >
          {/* ── Marquee selection overlay ─────────── */}
          {marqueeRect && (
            <div
              className="pointer-events-none absolute z-30 rounded border-2 border-primary/60 bg-primary/10"
              style={{
                left: marqueeRect.x,
                top: marqueeRect.y,
                width: marqueeRect.width,
                height: marqueeRect.height,
              }}
            />
          )}

          {/* ── Scroll-to-playhead FAB ──────────────── */}
          {isPlaybackRunning && (
            <button
              type="button"
              onClick={scrollToPlayhead}
              className="fixed right-6 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-primary text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl active:scale-95"
              style={{ bottom: `${fixedBottomOffset + 12}px` }}
              aria-label="Scroll to playing position"
              title="Scroll to playhead"
            >
              <ChevronRight className="size-5" />
            </button>
          )}

          {/* ── Quick-action floating bar ───────────── */}
          {hasActiveSelection ? (
            <div
              className="fixed left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-border/70 bg-card/95 p-2 shadow-lg backdrop-blur"
              style={{ bottom: `${fixedBottomOffset + 16}px` }}
            >
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={copyCurrentMeasure}
                title="Copy Bar"
                aria-label="Copy Bar"
              >
                <Copy className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={pasteToCurrentMeasure}
                disabled={!hasCopiedMeasure}
                title="Paste Bar"
                aria-label="Paste Bar"
              >
                <ClipboardPaste className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={clearCurrentMeasure}
                title="Clear Bar"
                aria-label="Clear Bar"
              >
                <Eraser className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={duplicateCurrentMeasure}
                title="Duplicate Bar"
                aria-label="Duplicate Bar"
              >
                <CopyPlus className="size-4" />
              </Button>
              <Button
                type="button"
                size="icon"
                variant="destructive"
                onClick={removeSelectedNote}
                disabled={selectedNote === null}
                title="Remove Note"
                aria-label="Remove Note"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ) : null}

          {/* ── Main content column ─────────────────── */}
          <div
            className="flex min-h-full flex-col gap-3"
            style={{
              paddingBottom:
                showBottomBar || showPreview ? fixedBottomOffset + 20 : 8,
            }}
          >
            {/* Status bar */}
            <div className="flex items-center justify-between rounded-lg border border-border/70 bg-card/60 px-2 py-1">
              <div className="flex items-center gap-2">
                {!showSidebar ? (
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => onToggleSidebar(true)}
                    title="Show Sidebar"
                    aria-label="Show Sidebar"
                  >
                    <PanelLeft className="size-4" />
                  </Button>
                ) : null}
                <Badge variant="outline" className="h-6 text-[11px]">
                  {projectDisplayName}
                </Badge>
                {selectedNoteIds.size > 0 && (
                  <Badge variant="default" className="h-6 text-[10px]">
                    {selectedNoteIds.size} selected
                  </Badge>
                )}
                <Badge variant="secondary" className="h-6 text-[10px]">
                  {notes.length} notes
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground">{alphaStatus}</p>
            </div>

            {/* Grid */}
            <StudioGrid
              stringTuning={stringTuning}
              noteByCell={noteByCell}
              noteByBeat={noteByBeat}
              beatEffectFlags={props.beatEffectFlags}
              selectedCell={selectedCell}
              measureCount={measureCount}
              beatsPerMeasure={beatsPerMeasure}
              cellWidth={cellWidth}
              onSelectCell={onSelectCell}
              onUpdateNote={onUpdateNote}
              onRemoveNote={onRemoveNote}
              onClickRulerBeat={onClickRulerBeat}
              dragBarFrom={dragBarFrom}
              dragBarOver={dragBarOver}
              onBarDragStart={onBarDragStart}
              onBarDragMove={onBarDragMove}
              onBarDragEnd={onBarDragEnd}
            />

            <StudioPreviewPanel
              showPreview={showPreview}
              previewHeight={previewHeight}
              previewDisplayHeight={previewDisplayHeight}
              left={bottomBarFrame.left}
              width={bottomBarFrame.width}
              bottom={showBottomBar ? BOTTOM_BAR_HEIGHT : 0}
              isDarkMode={isDarkMode}
              alphaHostRef={alphaHostRef}
              onStartResize={startPreviewResize}
            />

            {/* Bottom bar */}
            {showBottomBar ? (
              <StudioBottomBar
                left={bottomBarFrame.left}
                width={bottomBarFrame.width}
                measureCount={measureCount}
                timeSignatureNumerator={timeSignatureNumerator}
                tempo={tempo}
                cellWidth={cellWidth}
                onChangeMeasureCount={onChangeMeasureCount}
                onChangeBeatsPerMeasure={onChangeBeatsPerMeasure}
                onChangeTempo={onChangeTempo}
                onChangeCellWidth={onChangeCellWidth}
              />
            ) : null}
          </div>
        </section>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <ContextMenuItem
          onClick={onCopySelected}
          disabled={selectedNoteIds.size === 0}
        >
          <ClipboardCopy className="mr-2 h-4 w-4" />
          Copy Selected
          <ContextMenuShortcut>Ctrl+C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onPasteNotes}>
          <ClipboardPaste className="mr-2 h-4 w-4" />
          Paste Notes
          <ContextMenuShortcut>Ctrl+V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => onSelectAllInMeasure(contextMeasureRef.current)}
        >
          <MousePointerSquareDashed className="mr-2 h-4 w-4" />
          Select All in Bar {contextMeasureRef.current + 1}
        </ContextMenuItem>
        <ContextMenuItem onClick={onSelectAll}>
          <Copy className="mr-2 h-4 w-4" />
          Select All Notes
          <ContextMenuShortcut>Ctrl+A</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onClearSelection}>
          Clear Selection
          <ContextMenuShortcut>Esc</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={() => onBatchEditSelectedNotes(selectedNoteIds)}
          disabled={selectedNoteIds.size === 0}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Batch Edit Selected ({selectedNoteIds.size})
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={onDeleteSelected}
          disabled={selectedNoteIds.size === 0}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Selected ({selectedNoteIds.size})
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
