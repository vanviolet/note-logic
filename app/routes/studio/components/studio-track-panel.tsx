import * as React from "react";
import {
  Copy,
  Headphones,
  Plus,
  Trash2,
  Volume2,
  VolumeOff,
} from "lucide-react";
import { Button } from "~/templates/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/templates/components/ui/context-menu";
import { Slider } from "~/templates/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/templates/components/ui/tooltip";
import { cn } from "~/templates/lib/utils";
import type { StudioTrack } from "../types";

// ════════════════════════════════════════════════════════
// StudioTrackPanel — left panel for multi-track management
// ════════════════════════════════════════════════════════

export type StudioTrackPanelProps = {
  tracks: StudioTrack[];
  activeTrackId: string;
  onSelectTrack: (id: string) => void;
  onAddTrack: (name?: string) => void;
  onRemoveTrack: (id: string) => void;
  onDuplicateTrack: (id: string) => void;
  onRenameTrack: (id: string, name: string) => void;
  onSetVolume: (id: string, volume: number) => void;
  onToggleMute: (id: string) => void;
  onToggleSolo: (id: string) => void;
};

export const StudioTrackPanel = React.memo(function StudioTrackPanel({
  tracks,
  activeTrackId,
  onSelectTrack,
  onAddTrack,
  onRemoveTrack,
  onDuplicateTrack,
  onRenameTrack,
  onSetVolume,
  onToggleMute,
  onToggleSolo,
}: StudioTrackPanelProps) {
  const [editingTrackId, setEditingTrackId] = React.useState<string | null>(
    null,
  );
  const [editingName, setEditingName] = React.useState("");
  const renameInputRef = React.useRef<HTMLInputElement | null>(null);

  const hasSolo = tracks.some((t) => t.isSolo);

  const startRename = React.useCallback((track: StudioTrack) => {
    setEditingTrackId(track.id);
    setEditingName(track.name);
    requestAnimationFrame(() => renameInputRef.current?.select());
  }, []);

  const commitRename = React.useCallback(
    (id: string) => {
      const trimmed = editingName.trim();
      if (trimmed.length > 0) onRenameTrack(id, trimmed);
      setEditingTrackId(null);
    },
    [editingName, onRenameTrack],
  );

  return (
    <div className="flex h-full flex-col border-r bg-card/30">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-2.5 py-1.5">
        <span className="text-xs font-semibold text-muted-foreground">
          Tracks
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onAddTrack()}
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">Add Track</TooltipContent>
        </Tooltip>
      </div>

      {/* Track list */}
      <div className="flex-1 overflow-y-auto">
        {tracks.map((track) => {
          const isActive = track.id === activeTrackId;
          const isEditing = editingTrackId === track.id;
          const isEffectivelyMuted =
            track.isMuted || (hasSolo && !track.isSolo);

          return (
            <ContextMenu key={track.id}>
              <ContextMenuTrigger asChild>
                <button
                  type="button"
                  onClick={() => onSelectTrack(track.id)}
                  onDoubleClick={() => startRename(track)}
                  className={cn(
                    "group flex w-full flex-col gap-1 border-b border-border/40 px-2.5 py-2 text-left transition-colors",
                    isActive ? "bg-primary/10" : "hover:bg-accent/20",
                    isEffectivelyMuted && "opacity-50",
                  )}
                >
                  {/* Track name + color indicator */}
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: track.color }}
                    />
                    {isEditing ? (
                      <input
                        ref={renameInputRef}
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={() => commitRename(track.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") commitRename(track.id);
                          if (e.key === "Escape") setEditingTrackId(null);
                        }}
                        className="h-5 w-full rounded border border-border bg-background px-1 text-[11px] outline-none focus:ring-1 focus:ring-primary"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span
                        className={cn(
                          "truncate text-[11px] font-medium",
                          isActive ? "text-primary" : "text-foreground",
                        )}
                      >
                        {track.name}
                      </span>
                    )}
                  </div>

                  {/* Instrument label */}
                  <span className="truncate pl-[18px] text-[9px] text-muted-foreground">
                    {track.instrument}
                  </span>

                  {/* Volume + Mute/Solo row */}
                  <div
                    className="flex items-center gap-1.5 pt-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground",
                            track.isMuted && "text-destructive",
                          )}
                          onClick={() => onToggleMute(track.id)}
                        >
                          {track.isMuted ? (
                            <VolumeOff className="h-3 w-3" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {track.isMuted ? "Unmute" : "Mute"}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded text-[9px] font-bold transition-colors",
                            track.isSolo
                              ? "text-amber-400"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                          onClick={() => onToggleSolo(track.id)}
                        >
                          <Headphones className="h-3 w-3" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {track.isSolo ? "Unsolo" : "Solo"}
                      </TooltipContent>
                    </Tooltip>

                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[Math.round(track.volume * 100)]}
                      onValueChange={([v]) => onSetVolume(track.id, v / 100)}
                      className="h-4 flex-1"
                    />
                    <span className="w-7 text-right text-[9px] tabular-nums text-muted-foreground">
                      {Math.round(track.volume * 100)}%
                    </span>
                  </div>
                </button>
              </ContextMenuTrigger>

              <ContextMenuContent>
                <ContextMenuItem onClick={() => startRename(track)}>
                  Rename Track
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onDuplicateTrack(track.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate Track
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => onToggleMute(track.id)}>
                  {track.isMuted ? "Unmute" : "Mute"} Track
                </ContextMenuItem>
                <ContextMenuItem onClick={() => onToggleSolo(track.id)}>
                  {track.isSolo ? "Unsolo" : "Solo"} Track
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  variant="destructive"
                  onClick={() => onRemoveTrack(track.id)}
                  disabled={tracks.length <= 1}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Track
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>
    </div>
  );
});
