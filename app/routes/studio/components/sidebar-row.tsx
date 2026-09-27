import * as React from "react";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { ChevronDown, ChevronRight, Pencil } from "lucide-react";
import { Input } from "~/templates/components/ui/input";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "~/templates/components/ui/context-menu";
import { cn } from "~/templates/lib/utils";
import type { SidebarGroup } from "../lib/studio-types";

// ── SortableBarRow ─────────────────────────────────────

export type SortableBarRowProps = {
  measure: number;
  name: string;
  noteDotClass: string;
  isActive: boolean;
  isPaleSelected: boolean;
  isFocusedSelection: boolean;
  isEditing: boolean;
  onActivate: (
    measure: number,
    withShift?: boolean,
    withCtrl?: boolean,
  ) => void;
  onStartRename: (measure: number) => void;
  onRenameChange: (measure: number, next: string) => void;
  onCommitRename: (measure: number) => void;
  onCancelRename: () => void;
  onAddBelow: (measure: number) => void;
  onDuplicate: (measure: number) => void;
  onClearNotes: (measure: number) => void;
  onDelete: (measure: number) => void;
  onBatchEdit?: (measure: number) => void;
  canDelete: boolean;
  selectedCount?: number;
  onDeleteSelected?: () => void;
  canGroupSelection?: boolean;
  onGroupSelection?: () => void;
  showCollapseToggle?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  bindRenameRef?: (node: HTMLInputElement | null) => void;
};

export function SortableBarRow({
  measure,
  name,
  noteDotClass,
  isActive,
  isPaleSelected,
  isFocusedSelection,
  isEditing,
  onActivate,
  onStartRename,
  onRenameChange,
  onCommitRename,
  onCancelRename,
  onAddBelow,
  onDuplicate,
  onClearNotes,
  onDelete,
  onBatchEdit,
  canDelete,
  selectedCount,
  onDeleteSelected,
  canGroupSelection,
  onGroupSelection,
  showCollapseToggle,
  isCollapsed,
  onToggleCollapse,
  bindRenameRef,
}: SortableBarRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `bar:${measure}` });

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, x: 0 } : null,
    ),
    transition,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          onClick={(event) =>
            onActivate(measure, event.shiftKey, event.ctrlKey || event.metaKey)
          }
          onDoubleClick={() => onStartRename(measure)}
          onContextMenu={() => {
            if (showCollapseToggle) return;
            if (!isActive && !isPaleSelected) {
              onActivate(measure, false);
            }
          }}
          className={cn(
            "flex min-w-0 select-none items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-semibold outline-none transition",
            isDragging && "opacity-70",
            isActive && isFocusedSelection && "bg-primary/20 text-primary",
            isActive && !isFocusedSelection && "bg-muted/60 text-foreground/90",
            isPaleSelected && "bg-primary/10 text-primary/90",
            !isActive && "text-foreground/85 hover:bg-accent/40",
          )}
        >
          {showCollapseToggle ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (event.shiftKey || event.ctrlKey || event.metaKey) return;
                onToggleCollapse?.();
              }}
              className="mr-1 inline-flex size-4 shrink-0 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent/40"
              aria-label={isCollapsed ? "Expand measure" : "Collapse measure"}
            >
              {isCollapsed ? (
                <ChevronRight className="size-3" />
              ) : (
                <ChevronDown className="size-3" />
              )}
            </button>
          ) : (
            <span className="mr-1 size-4 shrink-0" />
          )}

          <span className={cn("size-2 shrink-0 rounded-full", noteDotClass)} />

          {isEditing ? (
            <Input
              ref={bindRenameRef}
              className="h-6 min-w-0 border-none bg-transparent px-0 text-xs font-semibold shadow-none focus-visible:ring-0"
              value={name}
              onChange={(event) => onRenameChange(measure, event.target.value)}
              onBlur={() => onCommitRename(measure)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onCommitRename(measure);
                }
                if (event.key === "Escape") {
                  onCancelRename();
                }
              }}
              aria-label={`Rename measure ${measure + 1}`}
            />
          ) : (
            <span className="min-w-0 flex-1 truncate">{name}</span>
          )}
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={() => onActivate(measure, false)}>
          Activate Measure
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onStartRename(measure)}>
          Rename (F2)
        </ContextMenuItem>
        {canGroupSelection ? (
          <>
            <ContextMenuSeparator />
            <ContextMenuItem onClick={onGroupSelection}>
              Group Selected Measures
            </ContextMenuItem>
          </>
        ) : null}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={() => onAddBelow(measure)}>
          Add Measure Below
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onDuplicate(measure)}>
          Duplicate Measure
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onClearNotes(measure)}>
          Remove All Notes
        </ContextMenuItem>
        <ContextMenuItem onClick={() => onBatchEdit?.(measure)}>
          <Pencil className="mr-2 h-4 w-4" />
          Batch Edit Notes...
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          variant="destructive"
          onClick={() => onDelete(measure)}
          disabled={!canDelete}
        >
          Delete Measure
        </ContextMenuItem>
        {selectedCount && selectedCount > 1 && onDeleteSelected ? (
          <ContextMenuItem variant="destructive" onClick={onDeleteSelected}>
            Delete Selected ({selectedCount})
          </ContextMenuItem>
        ) : null}
      </ContextMenuContent>
    </ContextMenu>
  );
}

// ── SortableGroupRow ───────────────────────────────────

export type SortableGroupRowProps = {
  group: SidebarGroup;
  isFocusedSelection: boolean;
  isActive: boolean;
  isPaleSelected: boolean;
  isEditing: boolean;
  canGroupSelection: boolean;
  editName: string;
  onActivate: (withShift?: boolean, withCtrl?: boolean) => void;
  onStartRename: () => void;
  onRenameChange: (next: string) => void;
  onCommitRename: () => void;
  onCancelRename: () => void;
  onToggleCollapse: () => void;
  onGroupSelection: () => void;
  onRename: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onBatchEdit?: () => void;
  selectedCount?: number;
  onDeleteSelected?: () => void;
  bindRenameRef?: (node: HTMLInputElement | null) => void;
};

export function SortableGroupRow({
  group,
  isFocusedSelection,
  isActive,
  isPaleSelected,
  isEditing,
  canGroupSelection,
  editName,
  onActivate,
  onStartRename,
  onRenameChange,
  onCommitRename,
  onCancelRename,
  onToggleCollapse,
  onGroupSelection,
  onRename,
  onDuplicate,
  onRemove,
  onBatchEdit,
  selectedCount,
  onDeleteSelected,
  bindRenameRef,
}: SortableGroupRowProps) {
  const {
    setNodeRef,
    transform,
    transition,
    attributes,
    listeners,
    isDragging,
  } = useSortable({ id: `group:${group.id}` });

  const style = {
    transform: CSS.Transform.toString(
      transform ? { ...transform, x: 0 } : null,
    ),
    transition,
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          onClick={(event) =>
            onActivate(event.shiftKey, event.ctrlKey || event.metaKey)
          }
          onDoubleClick={onStartRename}
          className={cn(
            "mt-2 flex min-w-0 items-center gap-1.5 select-none rounded-sm px-2 py-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground",
            isDragging && "opacity-70",
            isActive && isFocusedSelection && "bg-primary/20 text-primary",
            isActive && !isFocusedSelection && "bg-muted/50",
            isPaleSelected && "bg-primary/10 text-primary/90",
          )}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              if (event.shiftKey || event.ctrlKey || event.metaKey) return;
              onToggleCollapse();
            }}
            className="mr-1 inline-flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:bg-accent/40"
            aria-label={group.collapsed ? "Expand group" : "Collapse group"}
          >
            {group.collapsed ? (
              <ChevronRight className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </button>

          {isEditing ? (
            <Input
              ref={bindRenameRef}
              className="h-6 min-w-0 border-none bg-transparent px-0 text-xs font-semibold uppercase shadow-none focus-visible:ring-0"
              value={editName}
              onChange={(event) => onRenameChange(event.target.value)}
              onBlur={onCommitRename}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  onCommitRename();
                }
                if (event.key === "Escape") {
                  onCancelRename();
                }
              }}
              aria-label="Rename group"
            />
          ) : (
            <span className="flex-1 truncate">{group.name}</span>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        {canGroupSelection ? (
          <>
            <ContextMenuItem onClick={onGroupSelection}>
              Group Selected Measures Here
            </ContextMenuItem>
            <ContextMenuSeparator />
          </>
        ) : null}
        <ContextMenuItem onClick={onToggleCollapse}>
          {group.collapsed ? "Expand Group" : "Collapse Group"}
        </ContextMenuItem>
        <ContextMenuItem onClick={onRename}>Rename Group</ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate}>Duplicate Group</ContextMenuItem>
        <ContextMenuItem onClick={onBatchEdit}>
          Batch Edit Notes...
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive" onClick={onRemove}>
          Remove Group
        </ContextMenuItem>
        {selectedCount && selectedCount > 1 && onDeleteSelected ? (
          <ContextMenuItem variant="destructive" onClick={onDeleteSelected}>
            Delete Selected ({selectedCount})
          </ContextMenuItem>
        ) : null}
      </ContextMenuContent>
    </ContextMenu>
  );
}
